import { GoogleGenAI, Modality } from '@google/genai';
import { API_BASE_URL } from './api.js';

/**
 * Fetches backend AI configuration status (configured, call duration limit, models).
 */
export async function fetchAiStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/status`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Streams a text-only chat response from POST /api/ai/chat (SSE).
 */
export async function streamPortfolioChat({
  message,
  history = [],
  previousInteractionId = null,
  onDelta,
  signal,
}) {
  const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      message,
      history,
      previousInteractionId,
    }),
    signal,
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson?.error || `Request failed (${res.status})`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('Streaming is not supported by this browser.');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let interactionId = previousInteractionId;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split('\n\n');
    buffer = events.pop() || '';

    for (const rawEvent of events) {
      const line = rawEvent
        .split('\n')
        .find((l) => l.startsWith('data: '));
      if (!line) continue;

      let parsed;
      try {
        parsed = JSON.parse(line.slice(6));
      } catch {
        continue;
      }

      if (parsed.type === 'delta' && parsed.text) {
        fullText += parsed.text;
        onDelta?.(parsed.text, fullText);
      } else if (parsed.type === 'done') {
        if (parsed.interactionId) interactionId = parsed.interactionId;
      } else if (parsed.type === 'error') {
        throw new Error(parsed.error || 'AI response error.');
      }
    }
  }

  return { fullText, interactionId };
}

/**
 * Determines the caller's local time of day for a natural greeting.
 */
export function getLocalTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * Synthesizes a soft, authentic phone ringback tone (440Hz + 480Hz) via Web Audio API
 * while the call is connecting/ringing. Stops instantaneously when answered or cancelled.
 */
export class CallRingbackTone {
  constructor() {
    this.ctx = null;
    this.intervalId = null;
    this.activeOscs = [];
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.isRunning = true;
    try {
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this._playPulse();
      this.intervalId = setInterval(() => {
        if (this.isRunning) this._playPulse();
      }, 3100);
    } catch {
      this.stop();
    }
  }

  _playPulse() {
    if (!this.ctx || !this.isRunning) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 1.15;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.03);
      gain.gain.setValueAtTime(0.045, now + duration - 0.04);
      gain.gain.linearRampToValueAtTime(0.0001, now + duration);
      gain.connect(this.ctx.destination);

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(480, now);

      osc1.connect(gain);
      osc2.connect(gain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.02);
      osc2.stop(now + duration + 0.02);

      this.activeOscs = [osc1, osc2];
    } catch {
      // Ignore if AudioContext closed mid-pulse
    }
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeOscs.forEach((osc) => {
      try {
        osc.stop();
      } catch {}
    });
    this.activeOscs = [];
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

/**
 * Requests a short-lived single-use ephemeral token for Gemini Live from pro-back.
 */
export async function requestLiveCallToken(language = 'english', timeOfDay = getLocalTimeOfDay()) {
  const res = await fetch(`${API_BASE_URL}/api/ai/live-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ language, timeOfDay }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    throw new Error(data?.error || 'Could not initialize Live Call session.');
  }
  return data;
}

// --- PCM Audio Conversion Helpers ---

function downsampleTo16k(float32Array, inputSampleRate) {
  const targetRate = 16000;
  if (inputSampleRate === targetRate) {
    return float32Array;
  }
  const ratio = inputSampleRate / targetRate;
  const newLength = Math.max(1, Math.round(float32Array.length / ratio));
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.min(
      float32Array.length,
      Math.round((offsetResult + 1) * ratio)
    );
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer; i++) {
      accum += float32Array[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function floatTo16BitPcmBase64(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64Pcm24kToFloat32(base64) {
  const binary = atob(base64);
  const byteLength = binary.length;
  const bytes = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const sampleCount = Math.floor(byteLength / 2);
  const float32 = new Float32Array(sampleCount);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < sampleCount; i++) {
    float32[i] = view.getInt16(i * 2, true) / 32768;
  }
  return float32;
}

const WORKLET_PROCESSOR_CODE = `
class PcmMicProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._chunkSize = 2048;
  }
  process(inputs) {
    const input = inputs[0];
    if (input && input[0] && input[0].length > 0) {
      const channel = input[0];
      for (let i = 0; i < channel.length; i++) {
        this._buffer.push(channel[i]);
      }
      while (this._buffer.length >= this._chunkSize) {
        const chunk = new Float32Array(this._buffer.splice(0, this._chunkSize));
        this.port.postMessage(chunk, [chunk.buffer]);
      }
    }
    return true;
  }
}
registerProcessor('pcm-mic-processor', PcmMicProcessor);
`;

/**
 * Browser-side Gemini Live real-time bidirectional audio client.
 * Authenticates directly with Google using a backend-minted single-use ephemeral token.
 */
export class GeminiLiveCallClient {
  constructor({
    onStatusChange,
    onTranscript,
    onAudioLevel,
    onFirstAudio,
    onError,
    onClose,
  } = {}) {
    this.onStatusChange = onStatusChange;
    this.onTranscript = onTranscript;
    this.onAudioLevel = onAudioLevel;
    this.onFirstAudio = onFirstAudio;
    this.onError = onError;
    this.onClose = onClose;
    this.hasReceivedFirstAudio = false;

    this.session = null;
    this.micStream = null;
    this.inputAudioCtx = null;
    this.outputAudioCtx = null;
    this.workletNode = null;
    this.scriptNode = null;
    this.sourceNode = null;
    this.workletUrl = null;

    this.isMuted = false;
    this.isConnected = false;
    this.isClosing = false;
    this.nextPlayTime = 0;
    this.activeSources = new Set();
  }

  async connect({ token, model, timeOfDay = getLocalTimeOfDay() }) {
    this.isClosing = false;
    this.hasReceivedFirstAudio = false;
    this.onStatusChange?.('connecting');

    // 1. Request microphone access first with voice cleanup enabled
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
    } catch (micErr) {
      const denied =
        micErr?.name === 'NotAllowedError' || micErr?.name === 'PermissionDeniedError';
      throw new Error(
        denied
          ? 'Microphone permission was denied. Allow mic access or switch to Text Chat.'
          : 'Could not access your microphone. Please check your audio device.'
      );
    }

    // 2. Prepare playback AudioContext (24kHz Gemini Live output)
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.outputAudioCtx = new AudioCtx({ sampleRate: 24000 });
    if (this.outputAudioCtx.state === 'suspended') {
      await this.outputAudioCtx.resume();
    }
    this.nextPlayTime = this.outputAudioCtx.currentTime;

    // 3. Open Gemini Live WebSocket session using short-lived ephemeral token
    const ai = new GoogleGenAI({
      apiKey: token,
      httpOptions: { apiVersion: 'v1beta' },
    });

    this.session = await ai.live.connect({
      model: model || 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
      },
      callbacks: {
        onopen: () => {
          this.isConnected = true;
        },
        onmessage: (response) => {
          this._handleServerMessage(response);
        },
        onerror: (err) => {
          if (!this.isClosing) {
            console.error('[Gemini Live Error]', err);
            this.onError?.('Live Call encountered a connection issue.');
          }
        },
        onclose: () => {
          this.isConnected = false;
          if (!this.isClosing) {
            this.cleanup();
            this.onClose?.();
          }
        },
      },
    });

    this.isConnected = true;

    // 4. Trigger natural time-of-day welcome greeting right when the call connects
    try {
      this.session.sendRealtimeInput({
        text: `A caller just connected (their local time of day is ${timeOfDay}). Immediately answer the call warmly as CaleByte Support with "Hello", a ${timeOfDay} greeting, welcome them, and ask how you can help — strictly in the selected call language.`,
      });
    } catch {
      // Ignore if session closed immediately
    }

    // 5. Start microphone PCM capture (16kHz mono) with brief initial settle delay so click sounds don't interrupt the greeting
    await this._startMicCapture(650);
  }

  async _startMicCapture(initialIgnoreMs = 0) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.inputAudioCtx = new AudioCtx();
    if (this.inputAudioCtx.state === 'suspended') {
      await this.inputAudioCtx.resume();
    }

    this.sourceNode = this.inputAudioCtx.createMediaStreamSource(this.micStream);
    const inputRate = this.inputAudioCtx.sampleRate;

    const NOISE_GATE_THRESHOLD = 0.018; // Balanced threshold: blocks ambient room/fan noise while keeping speech crisp
    const NOISE_GATE_HANGOVER_MS = 420; // Smoothly holds open across brief word pauses so endings aren't clipped
    const micReadyAt = Date.now() + initialIgnoreMs;
    let lastVoiceActivityAt = 0;
    let wasStreamingSpeech = false;

    const handleSamples = (float32Samples) => {
      if (!this.isConnected || !this.session || this.isMuted || Date.now() < micReadyAt) {
        this.onAudioLevel?.(0);
        return;
      }

      // Compute raw RMS for both orb animation and lightweight noise gate
      let sum = 0;
      for (let i = 0; i < float32Samples.length; i++) {
        sum += float32Samples[i] * float32Samples[i];
      }
      const rawRms = Math.sqrt(sum / float32Samples.length);
      const visualLevel = rawRms >= NOISE_GATE_THRESHOLD ? Math.min(1, rawRms * 5) : 0;
      this.onAudioLevel?.(visualLevel);

      const now = Date.now();
      if (rawRms >= NOISE_GATE_THRESHOLD) {
        lastVoiceActivityAt = now;
      }

      const gateOpen = now - lastVoiceActivityAt <= NOISE_GATE_HANGOVER_MS;
      if (!gateOpen) {
        if (wasStreamingSpeech) {
          wasStreamingSpeech = false;
          try {
            this.session.sendRealtimeInput({ audioStreamEnd: true });
          } catch {}
        }
        return;
      }

      wasStreamingSpeech = true;
      const pcm16k = downsampleTo16k(float32Samples, inputRate);
      const base64Audio = floatTo16BitPcmBase64(pcm16k);

      try {
        this.session.sendRealtimeInput({
          audio: {
            data: base64Audio,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
      } catch {
        // Ignore transient send errors while closing
      }
    };

    if (this.inputAudioCtx.audioWorklet) {
      const blob = new Blob([WORKLET_PROCESSOR_CODE], {
        type: 'application/javascript',
      });
      this.workletUrl = URL.createObjectURL(blob);
      await this.inputAudioCtx.audioWorklet.addModule(this.workletUrl);

      this.workletNode = new AudioWorkletNode(
        this.inputAudioCtx,
        'pcm-mic-processor'
      );
      this.workletNode.port.onmessage = (event) => {
        if (event.data instanceof Float32Array) {
          handleSamples(event.data);
        }
      };
      this.sourceNode.connect(this.workletNode);
      // Connect through a silent gain node so the worklet stays active without echoing mic to speakers
      const silentGain = this.inputAudioCtx.createGain();
      silentGain.gain.value = 0;
      this.workletNode.connect(silentGain);
      silentGain.connect(this.inputAudioCtx.destination);
    } else {
      // Fallback for older browsers without AudioWorklet
      this.scriptNode = this.inputAudioCtx.createScriptProcessor(2048, 1, 1);
      this.scriptNode.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        handleSamples(new Float32Array(input));
      };
      const silentGain = this.inputAudioCtx.createGain();
      silentGain.gain.value = 0;
      this.sourceNode.connect(this.scriptNode);
      this.scriptNode.connect(silentGain);
      silentGain.connect(this.inputAudioCtx.destination);
    }
  }

  _handleServerMessage(response) {
    const content = response?.serverContent;
    if (!content) return;

    // Immediate barge-in interruption: clear queued speaker playback
    if (content.interrupted) {
      this._stopAllPlayback();
      this.onStatusChange?.(this.isMuted ? 'muted' : 'listening');
    }

    // Process ALL parts in modelTurn (per Live API best practices)
    if (content.modelTurn?.parts) {
      for (const part of content.modelTurn.parts) {
        if (part?.inlineData?.data) {
          this._enqueueAudioChunk(part.inlineData.data);
        }
      }
    }

    // Live transcriptions (user & AI)
    if (content.inputTranscription?.text) {
      this.onTranscript?.('user', content.inputTranscription.text);
    }
    if (content.outputTranscription?.text) {
      this.onTranscript?.('assistant', content.outputTranscription.text);
    }
  }

  _enqueueAudioChunk(base64Pcm) {
    if (!this.outputAudioCtx || this.isClosing) return;
    if (this.outputAudioCtx.state === 'suspended') {
      this.outputAudioCtx.resume().catch(() => {});
    }

    const float32 = base64Pcm24kToFloat32(base64Pcm);
    if (float32.length === 0) return;

    if (!this.hasReceivedFirstAudio) {
      this.hasReceivedFirstAudio = true;
      this.onFirstAudio?.();
    }

    const audioBuffer = this.outputAudioCtx.createBuffer(1, float32.length, 24000);
    audioBuffer.copyToChannel(float32, 0);

    const source = this.outputAudioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.outputAudioCtx.destination);

    const now = this.outputAudioCtx.currentTime;
    const startAt = Math.max(now + 0.01, this.nextPlayTime);
    this.nextPlayTime = startAt + audioBuffer.duration;

    this.activeSources.add(source);
    this.onStatusChange?.('speaking');

    source.onended = () => {
      this.activeSources.delete(source);
      if (this.activeSources.size === 0 && this.isConnected && !this.isClosing) {
        this.onStatusChange?.(this.isMuted ? 'muted' : 'listening');
      }
    };

    source.start(startAt);
  }

  _stopAllPlayback() {
    this.activeSources.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    this.activeSources.clear();
    if (this.outputAudioCtx) {
      this.nextPlayTime = this.outputAudioCtx.currentTime;
    }
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    if (this.isMuted && this.isConnected && this.session) {
      try {
        this.session.sendRealtimeInput({ audioStreamEnd: true });
      } catch {}
    }
    if (this.activeSources.size === 0 && this.isConnected) {
      this.onStatusChange?.(this.isMuted ? 'muted' : 'listening');
    }
  }

  disconnect() {
    this.isClosing = true;
    this.isConnected = false;
    try {
      this.session?.close?.();
    } catch {}
    this.session = null;
    this.cleanup();
    this.onStatusChange?.('idle');
  }

  cleanup() {
    this._stopAllPlayback();

    try {
      this.workletNode?.disconnect();
    } catch {}
    this.workletNode = null;

    try {
      this.scriptNode?.disconnect();
    } catch {}
    this.scriptNode = null;

    try {
      this.sourceNode?.disconnect();
    } catch {}
    this.sourceNode = null;

    if (this.workletUrl) {
      URL.revokeObjectURL(this.workletUrl);
      this.workletUrl = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }

    if (this.inputAudioCtx) {
      this.inputAudioCtx.close().catch(() => {});
      this.inputAudioCtx = null;
    }

    if (this.outputAudioCtx) {
      this.outputAudioCtx.close().catch(() => {});
      this.outputAudioCtx = null;
    }
  }
}
