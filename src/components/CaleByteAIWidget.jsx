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
  Globe,
  ChevronDown,
  Check,
} from 'lucide-react';
import calebyteLogo from './ima-and/calebytelogo.png';
import {
  fetchAiStatus,
  streamPortfolioChat,
  requestLiveCallToken,
  getLocalTimeOfDay,
  CallRingbackTone,
  GeminiLiveCallClient,
} from '../services/aiClient.js';

const LIVE_LANGUAGES = [
  { id: 'english', label: 'English' },
  { id: 'pidgin', label: 'Nigerian Pidgin' },
  { id: 'igbo', label: 'Igbo' },
  { id: 'yoruba', label: 'Yoruba' },
  { id: 'hausa', label: 'Hausa' },
];

const STARTER_QUESTIONS = [
  "Tell me about Caleb's top projects",
  'What skills & tech stack does he use?',
  'How can I support CaleByte?',
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! Welcome to CaleByte Support. Ask anything about Caleb's projects, skills, or services.",
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
  const [callLanguage, setCallLanguage] = useState('english');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [callElapsed, setCallElapsed] = useState(0);
  const [maxCallSeconds, setMaxCallSeconds] = useState(180);
  const [callError, setCallError] = useState('');
  const liveClientRef = useRef(null);
  const ringbackRef = useRef(null);
  const ringbackTimeoutRef = useRef(null);
  const callCancelledRef = useRef(false);
  const timerRef = useRef(null);
  const langDropdownRef = useRef(null);

  const isCallActive = callStatus !== 'idle';
  const activeLanguageObj =
    LIVE_LANGUAGES.find((l) => l.id === callLanguage) || LIVE_LANGUAGES[0];

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

  // Close language dropdown when clicking outside
  useEffect(() => {
    if (!langMenuOpen) return;
    const handleOutsideClick = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [langMenuOpen]);

  // Auto-scroll chat messages
  useEffect(() => {
    if (isOpen && mode === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, mode]);

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
      if (ringbackTimeoutRef.current) clearTimeout(ringbackTimeoutRef.current);
      ringbackRef.current?.stop?.();
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
        const msg = err?.message || 'Could not reach CaleByte Support right now.';
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

  const stopRingback = () => {
    if (ringbackTimeoutRef.current) {
      clearTimeout(ringbackTimeoutRef.current);
      ringbackTimeoutRef.current = null;
    }
    if (ringbackRef.current) {
      ringbackRef.current.stop();
      ringbackRef.current = null;
    }
  };

  // --- Live Call Handlers ---
  const startLiveCall = async () => {
    if (isCallActive) return;
    callCancelledRef.current = false;
    setCallError('');
    setLangMenuOpen(false);
    setCallElapsed(0);
    setIsMuted(false);
    setCallStatus('connecting');

    // Automatically pause background music so it doesn't interfere with voice input
    window.dispatchEvent(new Event('ai_live_call_start'));

    // Start authentic phone ringback tone immediately while dialing & waiting for pickup
    stopRingback();
    const ringback = new CallRingbackTone();
    ringbackRef.current = ringback;
    ringback.start();

    try {
      const timeOfDay = getLocalTimeOfDay();
      const tokenData = await requestLiveCallToken(callLanguage, timeOfDay);
      if (callCancelledRef.current) return;
      if (tokenData.maxCallSeconds) {
        setMaxCallSeconds(tokenData.maxCallSeconds);
      }

      const client = new GeminiLiveCallClient({
        onStatusChange: (status) => {
          if (!callCancelledRef.current) setCallStatus(status);
        },
        onAudioLevel: (lvl) => {
          setAudioLevel(lvl);
        },
        onFirstAudio: () => {
          // Stop ringing the exact millisecond Support picks up and starts speaking
          stopRingback();
        },
        onError: (msg) => {
          stopRingback();
          setCallError(msg);
        },
        onClose: () => {
          stopRingback();
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
        timeOfDay,
      });

      if (callCancelledRef.current) {
        client.disconnect();
        liveClientRef.current = null;
        return;
      }

      // Safety fallback: stop ringing if connected and greeting hasn't started within 5s
      ringbackTimeoutRef.current = setTimeout(() => {
        stopRingback();
        setCallStatus((prev) => (prev === 'connecting' ? 'listening' : prev));
      }, 5000);
    } catch (err) {
      if (callCancelledRef.current) return;
      console.error('[Live Call Start Error]', err);
      stopRingback();
      if (liveClientRef.current) {
        liveClientRef.current.disconnect();
        liveClientRef.current = null;
      }
      setCallStatus('idle');
      setAudioLevel(0);
      setCallError(
        err?.message || 'Could not start the call. Try again or switch to Chat.'
      );
      window.dispatchEvent(new Event('ai_live_call_end'));
    }
  };

  const endLiveCall = (noticeMessage = '') => {
    callCancelledRef.current = true;
    stopRingback();
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
                aria-label={menuOpen ? 'Close CaleByte Support options' : 'Open CaleByte Support Live Call or Chat'}
                title="CaleByte Support • Live Call & Chat"
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
                    Cale<span className="text-accent-teal">Byte</span> Support
                  </h3>
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
                          callStatus === 'connecting'
                            ? [1, 1.06, 1]
                            : callStatus === 'speaking'
                              ? [1, 1.07, 0.98, 1.05, 1]
                              : isCallActive && !isMuted
                                ? 1 + audioLevel * 0.18
                                : 1,
                        rotate:
                          callStatus === 'connecting'
                            ? [0, -8, 8, -6, 6, 0]
                            : 0,
                      }}
                      transition={{
                        duration: callStatus === 'connecting' ? 1.15 : callStatus === 'speaking' ? 0.9 : 0.1,
                        repeat: callStatus === 'connecting' || callStatus === 'speaking' ? Infinity : 0,
                        repeatDelay: callStatus === 'connecting' ? 1.9 : 0,
                      }}
                      className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center border shadow-2xl transition-colors ${
                        callStatus === 'speaking'
                          ? 'bg-gradient-to-br from-accent-teal to-accent-purple border-cyan-300/60 shadow-accent-teal/40'
                          : callStatus === 'listening'
                            ? 'bg-gradient-to-br from-emerald-500/90 to-accent-teal border-emerald-300/60 shadow-emerald-500/35'
                            : callStatus === 'connecting'
                              ? 'bg-gradient-to-br from-accent-teal/80 to-cyan-500/80 border-cyan-300/60 shadow-accent-teal/35'
                              : 'bg-white/[0.06] border-white/15'
                      }`}
                    >
                      {callStatus === 'connecting' ? (
                        <Phone className="w-8 h-8 text-white" />
                      ) : isMuted ? (
                        <MicOff className="w-8 h-8 text-slate-300" />
                      ) : callStatus === 'speaking' ? (
                        <Volume2 className="w-8 h-8 text-white" />
                      ) : isCallActive ? (
                        <Mic className="w-8 h-8 text-white" />
                      ) : (
                        <Phone className="w-8 h-8 text-white" />
                      )}
                    </motion.div>
                  </div>

                  {/* Minimal Phone-Call Info: Idle = Title + Duration; Ringing = Calling...; Active = Language + Timer ONLY */}
                  <div className="text-center space-y-1.5 max-w-xs">
                    {!isCallActive ? (
                      <>
                        <p className="text-base font-bold font-display text-white">
                          Cale<span className="text-accent-teal">Byte</span> Support
                        </p>
                        <p className="text-[11px] font-medium text-accent-teal/90">
                          Calls last up to {Math.max(1, Math.round(maxCallSeconds / 60))} minutes.
                        </p>
                      </>
                    ) : callStatus === 'connecting' ? (
                      <>
                        <p className="text-sm font-bold text-white tracking-wide">Calling...</p>
                        <p className="text-xs text-slate-400">{activeLanguageObj.label}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-white tracking-wide">
                          {activeLanguageObj.label}
                        </p>
                        <p className="text-xs font-mono text-slate-300">
                          {formatSeconds(callElapsed)} / {formatSeconds(maxCallSeconds)}
                        </p>
                        {isMuted && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                            Muted
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

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

                {/* Language Selector & Call Action Controls */}
                <div className="pt-2 space-y-3 flex-shrink-0">
                  {!isCallActive ? (
                    <>
                      {/* Custom Dark Glass Language Dropdown (opens smoothly upward) */}
                      <div className="relative" ref={langDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setLangMenuOpen((prev) => !prev)}
                          aria-haspopup="listbox"
                          aria-expanded={langMenuOpen}
                          className={`w-full px-4 py-3 rounded-2xl bg-black/45 border text-xs font-semibold text-white flex items-center justify-between transition-all cursor-pointer ${
                            langMenuOpen
                              ? 'border-accent-teal shadow-[0_0_0_3px_rgba(23,162,184,0.2)]'
                              : 'border-white/10 hover:border-accent-teal/50'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Globe className="w-4 h-4 text-accent-teal" />
                            <span className="text-slate-400 font-medium">Language:</span>
                            <span className="text-white font-bold">{activeLanguageObj.label}</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              langMenuOpen ? 'rotate-180 text-accent-teal' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {langMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.97 }}
                              transition={{ duration: 0.16, ease: 'easeOut' }}
                              role="listbox"
                              className="absolute left-0 right-0 bottom-full mb-2 z-30 rounded-2xl bg-[#111622]/95 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/85 p-1.5 space-y-1 max-h-56 overflow-y-auto no-scrollbar"
                            >
                              {LIVE_LANGUAGES.map((lang) => {
                                const selected = lang.id === callLanguage;
                                return (
                                  <button
                                    key={lang.id}
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    onClick={() => {
                                      setCallLanguage(lang.id);
                                      setLangMenuOpen(false);
                                    }}
                                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                                      selected
                                        ? 'bg-accent-teal/15 text-accent-teal border border-accent-teal/30 font-bold'
                                        : 'text-slate-200 hover:bg-white/[0.06] hover:text-white border border-transparent font-medium'
                                    }`}
                                  >
                                    <span>{lang.label}</span>
                                    {selected && <Check className="w-4 h-4 text-accent-teal" />}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        type="button"
                        onClick={startLiveCall}
                        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-accent-teal to-cyan-500 hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-accent-teal/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Now</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
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
                    </div>
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
