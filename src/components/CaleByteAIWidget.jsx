import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  MessageSquare,
  Send,
  X,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import calebyteLogo from './ima-and/calebytelogo.png';
import {
  fetchAiStatus,
  streamPortfolioChat,
  requestLiveCallToken,
  GeminiLiveCallClient,
} from '../services/aiClient.js';

const STARTER_QUESTIONS = [
  "Tell me about Caleb's top projects",
  'What skills & tech stack does he use?',
  'How can I support CaleByte?',
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm CaleByte AI. Ask me anything about Caleb's projects, skills, or services.",
};

function formatSeconds(sec) {
  const safe = Math.max(0, Math.floor(sec));
  const m = String(Math.floor(safe / 60)).padStart(2, '0');
  const s = String(safe % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Lightweight safe inline formatter for AI chat bubbles:
 * renders **bold**, *italic*, and clickable https:// links cleanly without raw markdown asterisks.
 */
function renderFormattedMessage(text) {
  if (!text) return null;
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*\n]+\*|https?:\/\/[^\s)<>]+)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (/^https?:\/\//.test(part)) {
      const cleanUrl = part.replace(/[.,;:!?]+$/, '');
      const trailing = part.slice(cleanUrl.length);
      return (
        <React.Fragment key={idx}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-teal hover:underline font-medium break-all"
          >
            {cleanUrl}
          </a>
          {trailing}
        </React.Fragment>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function CaleByteAIWidget() {
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat' | 'call'
  const launcherRef = useRef(null);

  // Chat state (text-only — no image uploads)
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [interactionId, setInteractionId] = useState(null);
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);

  // Live Call state
  const [callStatus, setCallStatus] = useState('idle'); // 'idle' | 'connecting' | 'listening' | 'speaking' | 'muted'
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [callElapsed, setCallElapsed] = useState(0);
  const [maxCallSeconds, setMaxCallSeconds] = useState(180);
  const [callError, setCallError] = useState('');
  const [transcripts, setTranscripts] = useState([]);
  const liveClientRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptEndRef = useRef(null);

  const isCallActive = callStatus !== 'idle';

  // Fetch initial AI visibility from backend & stay synced in real time via SSE
  useEffect(() => {
    let active = true;
    async function syncAiVisibility() {
      const status = await fetchAiStatus();
      if (!active || !status) return;
      if (typeof status.enabled === 'boolean') {
        setIsAiEnabled(status.enabled);
      }
      if (status.maxCallSeconds) {
        setMaxCallSeconds(status.maxCallSeconds);
      }
    }
    syncAiVisibility();

    const handleVisibilityRefresh = (e) => {
      if (typeof e?.detail?.aiEnabled === 'boolean') {
        setIsAiEnabled(e.detail.aiEnabled);
      } else {
        syncAiVisibility();
      }
    };
    window.addEventListener('ai_visibility_refresh', handleVisibilityRefresh);
    return () => {
      active = false;
      window.removeEventListener('ai_visibility_refresh', handleVisibilityRefresh);
    };
  }, []);

  // Close everything cleanly if Admin switches AI OFF while open or on a call
  useEffect(() => {
    if (!isAiEnabled) {
      setMenuOpen(false);
      setIsOpen(false);
      if (liveClientRef.current) {
        endLiveCall();
      }
    }
  }, [isAiEnabled]);

  // Close pop-out Call/Chat menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e) => {
      if (launcherRef.current && !launcherRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  // Auto-expand chat textarea height as text wraps onto new lines
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [input, isOpen, mode]);

  // Auto-scroll chat messages
  useEffect(() => {
    if (isOpen && mode === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, mode]);

  // Auto-scroll live captions
  useEffect(() => {
    if (isOpen && mode === 'call') {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts, isOpen, mode]);

  // Call duration timer & graceful auto-end at safety cap
  useEffect(() => {
    if (callStatus === 'listening' || callStatus === 'speaking' || callStatus === 'muted') {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setCallElapsed((prev) => {
            const next = prev + 1;
            if (next >= maxCallSeconds) {
              endLiveCall('Call time limit reached. Feel free to continue in Text Chat or reach out via Contact!');
              return maxCallSeconds;
            }
            return next;
          });
        }, 1000);
      }
    } else if (callStatus === 'idle') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [callStatus, maxCallSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort?.();
      if (timerRef.current) clearInterval(timerRef.current);
      if (liveClientRef.current) {
        liveClientRef.current.disconnect();
        liveClientRef.current = null;
        window.dispatchEvent(new Event('ai_live_call_end'));
      }
    };
  }, []);

  // --- Chat Handlers ---
  const handleSendMessage = async (textOverride) => {
    const trimmed = (typeof textOverride === 'string' ? textOverride : input).trim();
    if (!trimmed || isStreaming) return;

    setChatError('');
    setInput('');

    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    const assistantMsgId = `a-${Date.now() + 1}`;
    const historySnapshot = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantMsgId, role: 'assistant', content: '' },
    ]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await streamPortfolioChat({
        message: trimmed,
        history: historySnapshot,
        previousInteractionId: interactionId,
        signal: controller.signal,
        onDelta: (_chunk, full) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, content: full } : m))
          );
        },
      });
      if (result.interactionId) {
        setInteractionId(result.interactionId);
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        const msg = err?.message || 'Could not reach CaleByte AI right now.';
        setChatError(msg);
        setMessages((prev) =>
          prev.filter((m) => !(m.id === assistantMsgId && !m.content))
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const handleResetChat = () => {
    if (isStreaming) {
      abortRef.current?.abort?.();
      setIsStreaming(false);
    }
    setMessages([WELCOME_MESSAGE]);
    setInteractionId(null);
    setChatError('');
  };

  // --- Live Call Handlers ---
  const startLiveCall = async () => {
    if (isCallActive) return;
    setCallError('');
    setTranscripts([]);
    setCallElapsed(0);
    setIsMuted(false);
    setCallStatus('connecting');

    // Automatically pause background music so it doesn't interfere with voice input
    window.dispatchEvent(new Event('ai_live_call_start'));

    try {
      const tokenData = await requestLiveCallToken();
      if (tokenData.maxCallSeconds) {
        setMaxCallSeconds(tokenData.maxCallSeconds);
      }

      const client = new GeminiLiveCallClient({
        onStatusChange: (status) => {
          setCallStatus(status);
        },
        onAudioLevel: (lvl) => {
          setAudioLevel(lvl);
        },
        onTranscript: (speaker, text) => {
          if (!text || !text.trim()) return;
          setTranscripts((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.speaker === speaker) {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...last,
                text: `${last.text}${text}`,
              };
              return updated;
            }
            return [...prev.slice(-15), { id: `${Date.now()}-${Math.random()}`, speaker, text }];
          });
        },
        onError: (msg) => {
          setCallError(msg);
        },
        onClose: () => {
          liveClientRef.current = null;
          setCallStatus('idle');
          setAudioLevel(0);
          window.dispatchEvent(new Event('ai_live_call_end'));
        },
      });

      liveClientRef.current = client;
      await client.connect({
        token: tokenData.token,
        model: tokenData.model,
      });
    } catch (err) {
      console.error('[Live Call Start Error]', err);
      if (liveClientRef.current) {
        liveClientRef.current.disconnect();
        liveClientRef.current = null;
      }
      setCallStatus('idle');
      setAudioLevel(0);
      setCallError(
        err?.message || 'Could not start Live Call. Try again or use Text Chat.'
      );
      window.dispatchEvent(new Event('ai_live_call_end'));
    }
  };

  const endLiveCall = (noticeMessage = '') => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (liveClientRef.current) {
      liveClientRef.current.disconnect();
      liveClientRef.current = null;
    }
    setCallStatus('idle');
    setIsMuted(false);
    setAudioLevel(0);
    if (noticeMessage) setCallError(noticeMessage);
    window.dispatchEvent(new Event('ai_live_call_end'));
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    liveClientRef.current?.setMuted(nextMuted);
  };

  const statusLabel = {
    idle: 'Ready for a live voice call',
    connecting: 'Connecting to CaleByte AI...',
    listening: 'Listening — speak naturally',
    speaking: 'CaleByte AI is speaking...',
    muted: 'Microphone muted',
  }[callStatus];

  const handleLauncherClick = () => {
    if (isOpen) {
      setIsOpen(false);
      setMenuOpen(false);
      return;
    }
    if (isCallActive) {
      setMode('call');
      setMenuOpen(false);
      setIsOpen(true);
      return;
    }
    setMenuOpen((prev) => !prev);
  };

  const handleOpenMode = (selectedMode) => {
    setMode(selectedMode);
    setMenuOpen(false);
    setIsOpen(true);
  };

  if (!isAiEnabled) {
    return null;
  }

  return (
    <>
      {/* Floating AI Assistant Launcher — Hidden while modal is open so the tall modal sits cleanly at the bottom */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            ref={launcherRef}
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 left-5 z-50 flex items-center"
          >
            <div className="relative flex items-center justify-center">
              {isCallActive && (
                <>
                  <motion.div
                    className="absolute -inset-2.5 rounded-full bg-emerald-400/25 pointer-events-none"
                    animate={{ scale: [1, 1.4, 1.7], opacity: [0.65, 0.25, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute -inset-1.5 rounded-full border border-emerald-400/50 border-dashed pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                </>
              )}

              <motion.button
                type="button"
                onClick={handleLauncherClick}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.94 }}
                data-playing={isCallActive || menuOpen ? 'true' : 'false'}
                className={`shiny-cta shiny-cta-circle relative group shadow-2xl transition-all duration-300 ${
                  isCallActive
                    ? 'is-playing shadow-emerald-500/40 ring-1 ring-emerald-400/60'
                    : 'hover:shadow-cyan-500/30'
                }`}
                aria-label={menuOpen ? 'Close CaleByte AI options' : 'Open CaleByte AI Live Call or Chat'}
                title="CaleByte AI • Live Call & Chat"
              >
                <span className="shiny-content flex items-center justify-center relative z-10 w-full h-full text-white">
                  {menuOpen ? (
                    <X className="w-5 h-5 text-white drop-shadow" />
                  ) : isCallActive ? (
                    <Volume2 className="w-5 h-5 text-emerald-300 animate-pulse drop-shadow" />
                  ) : (
                    <Phone className="w-5 h-5 text-white drop-shadow group-hover:scale-110 transition-transform" />
                  )}
                </span>
              </motion.button>
            </div>

            {/* Slide-Out Card to the RIGHT of the Call Button: Chat & Live Call */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -18, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -18, scale: 0.92 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="ml-3 p-1.5 rounded-2xl border border-white/15 shadow-2xl shadow-black/80 backdrop-blur-2xl flex items-center gap-1.5"
                  style={{
                    background:
                      'radial-gradient(ellipse 95% 80% at 50% 0%, #242c3d 0%, #121722 60%, #090c14 100%)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenMode('chat')}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-accent-teal/20 border border-white/10 hover:border-accent-teal/50 text-white text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-teal to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </span>
                    <span>Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenMode('call')}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-accent-purple/25 border border-white/10 hover:border-accent-teal/50 text-white text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-teal to-accent-purple flex items-center justify-center text-white flex-shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </span>
                    <span>Live Call</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live call status pill when drawer is minimized */}
            {!menuOpen && isCallActive && (
              <motion.button
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => {
                  setMode('call');
                  setIsOpen(true);
                }}
                className="ml-3 px-3 py-1.5 rounded-full bg-[#0d121d]/90 border border-emerald-400/40 text-[11px] font-bold text-emerald-300 shadow-xl backdrop-blur-xl flex items-center gap-2 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live • {formatSeconds(callElapsed)}</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dedicated Tall & Wide Modal (Chat Modal or Live Call Modal — No inner tab bar, hidden scrollbar) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-50 w-[calc(100vw-2rem)] sm:w-[445px] md:w-[465px] h-[min(680px,calc(100vh-2.25rem))] flex flex-col rounded-3xl border border-white/15 text-white overflow-hidden shadow-2xl shadow-black/90 backdrop-blur-2xl"
            style={{
              background:
                'radial-gradient(ellipse 95% 65% at 50% 0%, #242c3d 0%, #121722 50%, #090c14 100%)',
              boxShadow:
                '0 25px 70px -15px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.14)',
            }}
          >
            {/* Compact Header with CaleByte Brand Logo */}
            <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between gap-2 bg-black/20 flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={calebyteLogo}
                  alt="CaleByte Logo"
                  className="w-7 h-7 object-contain flex-shrink-0"
                />
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-sm font-bold font-display text-white leading-tight truncate">
                    Cale<span className="text-accent-teal">Byte</span> AI
                  </h3>
                  {mode === 'call' && isCallActive && (
                    <span className="text-[11px] font-mono font-bold text-emerald-300">
                      {formatSeconds(callElapsed)} / {formatSeconds(maxCallSeconds)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {mode === 'chat' && messages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleResetChat}
                    title="Reset chat"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close AI modal"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BODY: CHAT MODAL (Text-only, smoothly scrollable with hidden scrollbar) */}
            {mode === 'chat' ? (
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 py-4 space-y-3.5">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-accent-teal to-cyan-600 text-white rounded-br-md shadow-md shadow-accent-teal/20'
                            : 'bg-white/[0.06] border border-white/10 text-slate-100 rounded-bl-md'
                        }`}
                      >
                        {msg.content ? (
                          msg.role === 'assistant'
                            ? renderFormattedMessage(msg.content)
                            : msg.content
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-bounce [animation-delay:120ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-bounce [animation-delay:240ms]" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Starter question chips on fresh chat */}
                  {messages.length === 1 && !isStreaming && (
                    <div className="pt-2 space-y-2">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-0.5">
                        Quick Questions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {STARTER_QUESTIONS.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleSendMessage(q)}
                            className="text-left px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-accent-teal/15 border border-white/10 hover:border-accent-teal/40 text-xs text-slate-200 hover:text-white transition-all cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chatError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300">
                      {chatError}
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Auto-Expanding Multiline Text Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 border-t border-white/10 bg-black/30 flex items-end gap-2.5 flex-shrink-0"
                >
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    maxLength={1500}
                    disabled={isStreaming}
                    placeholder="Ask anything about Caleb's work..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-accent-teal text-xs sm:text-[13px] leading-relaxed text-white placeholder:text-slate-500 outline-none transition-all disabled:opacity-60 resize-none overflow-y-auto no-scrollbar max-h-32 break-words"
                  />
                  <button
                    type="submit"
                    disabled={isStreaming || !input.trim()}
                    aria-label="Send message"
                    className="p-2.5 rounded-xl bg-gradient-to-r from-accent-teal to-cyan-500 text-white shadow-md shadow-accent-teal/25 hover:brightness-110 disabled:opacity-45 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* BODY: GEMINI LIVE VOICE CALL MODAL */
              <div className="flex flex-col flex-1 min-h-0 px-5 py-6 space-y-5 overflow-y-auto no-scrollbar">
                {/* Voice Orb Stage */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative flex items-center justify-center w-36 h-36">
                    {isCallActive && (
                      <>
                        <motion.div
                          className={`absolute inset-0 rounded-full blur-2xl pointer-events-none ${
                            callStatus === 'speaking'
                              ? 'bg-accent-teal/40'
                              : callStatus === 'muted'
                                ? 'bg-slate-500/20'
                                : 'bg-emerald-400/30'
                          }`}
                          animate={{
                            scale:
                              callStatus === 'speaking'
                                ? [1, 1.28, 1.08, 1.22, 1]
                                : 1 + audioLevel * 0.45,
                          }}
                          transition={{
                            duration: callStatus === 'speaking' ? 1.4 : 0.12,
                            repeat: callStatus === 'speaking' ? Infinity : 0,
                          }}
                        />
                        <motion.div
                          className="absolute -inset-2.5 rounded-full border border-accent-teal/35 pointer-events-none"
                          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.15, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </>
                    )}

                    <motion.div
                      animate={{
                        scale:
                          callStatus === 'speaking'
                            ? [1, 1.07, 0.98, 1.05, 1]
                            : isCallActive && !isMuted
                              ? 1 + audioLevel * 0.18
                              : 1,
                      }}
                      transition={{
                        duration: callStatus === 'speaking' ? 0.9 : 0.1,
                        repeat: callStatus === 'speaking' ? Infinity : 0,
                      }}
                      className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center border shadow-2xl transition-colors ${
                        callStatus === 'speaking'
                          ? 'bg-gradient-to-br from-accent-teal to-accent-purple border-cyan-300/60 shadow-accent-teal/40'
                          : callStatus === 'listening'
                            ? 'bg-gradient-to-br from-emerald-500/90 to-accent-teal border-emerald-300/60 shadow-emerald-500/35'
                            : callStatus === 'connecting'
                              ? 'bg-white/10 border-accent-teal/50'
                              : 'bg-white/[0.06] border-white/15'
                      }`}
                    >
                      {callStatus === 'connecting' ? (
                        <svg
                          className="animate-spin w-8 h-8 text-accent-teal"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : isMuted ? (
                        <MicOff className="w-8 h-8 text-slate-300" />
                      ) : callStatus === 'speaking' ? (
                        <Volume2 className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </motion.div>
                  </div>

                  <div className="text-center space-y-1.5 max-w-xs">
                    <p className="text-sm font-bold text-white">{statusLabel}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isCallActive
                        ? `${formatSeconds(callElapsed)} / ${formatSeconds(maxCallSeconds)}`
                        : 'Talk directly with CaleByte AI about projects, skills, store, or support.'}
                    </p>
                    {!isCallActive && (
                      <p className="text-[11px] font-medium text-accent-teal/90">
                        Each call lasts up to {Math.max(1, Math.round(maxCallSeconds / 60))} minutes.
                      </p>
                    )}
                  </div>
                </div>

                {/* Live Transcript Box */}
                {transcripts.length > 0 && (
                  <div className="overflow-y-auto no-scrollbar max-h-[180px] p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 flex-shrink-0">
                    {transcripts.map((item) => (
                      <div key={item.id} className="text-xs leading-relaxed">
                        <span
                          className={`font-bold mr-1.5 ${
                            item.speaker === 'user' ? 'text-cyan-300' : 'text-emerald-300'
                          }`}
                        >
                          {item.speaker === 'user' ? 'You:' : 'CaleByte AI:'}
                        </span>
                        <span className="text-slate-200">{item.text}</span>
                      </div>
                    ))}
                    <div ref={transcriptEndRef} />
                  </div>
                )}

                {callError && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-200 space-y-2 flex-shrink-0">
                    <p>{callError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCallError('');
                        setMode('chat');
                      }}
                      className="text-accent-teal hover:underline font-bold cursor-pointer"
                    >
                      Switch to Text Chat →
                    </button>
                  </div>
                )}

                {/* Call Action Controls */}
                <div className="pt-2 flex items-center justify-center gap-3 flex-shrink-0">
                  {!isCallActive ? (
                    <button
                      type="button"
                      onClick={startLiveCall}
                      className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-accent-teal to-cyan-500 hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-accent-teal/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Start Live Voice Call</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={toggleMute}
                        disabled={callStatus === 'connecting'}
                        className={`flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                          isMuted
                            ? 'bg-amber-500/20 border-amber-400/40 text-amber-200'
                            : 'bg-white/[0.06] hover:bg-white/10 border-white/15 text-white'
                        }`}
                      >
                        {isMuted ? (
                          <>
                            <MicOff className="w-4 h-4" />
                            <span>Unmute</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            <span>Mute</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => endLiveCall()}
                        className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <PhoneOff className="w-4 h-4" />
                        <span>End Call</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
