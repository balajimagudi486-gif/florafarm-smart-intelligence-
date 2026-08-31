// FloraFarm — AI Agri-Advisor Chat Widget
// Floating bottom-right chatbot with markdown rendering, quick prompts, and context injection.
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AlertTriangle,
  Bot,
  ChevronDown,
  Leaf,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { sendChatMessage } from '../services/chatApi';
import type { ChatHistoryEntry, ChatContext } from '../services/chatApi';
import { useChatContext } from '../context/ChatContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Quick-prompt chips
// ---------------------------------------------------------------------------
const QUICK_PROMPTS = [
  'How to treat leaf blight?',
  'Best NPK ratio for wheat?',
  'Organic pest control tips',
  'Watering schedule for tomatoes',
  'Signs of nitrogen deficiency?',
  'How to improve soil pH?',
];

// ---------------------------------------------------------------------------
// Typing dots indicator
// ---------------------------------------------------------------------------
const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    <span className="w-2 h-2 rounded-full bg-flora-emerald chat-dot" style={{ animationDelay: '0ms' }} />
    <span className="w-2 h-2 rounded-full bg-flora-emerald chat-dot" style={{ animationDelay: '160ms' }} />
    <span className="w-2 h-2 rounded-full bg-flora-emerald chat-dot" style={{ animationDelay: '320ms' }} />
  </div>
);

// ---------------------------------------------------------------------------
// Individual message bubble
// ---------------------------------------------------------------------------
const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-flora-emerald to-flora-green flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
          <Leaf size={13} className="text-flora-dark" />
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-flora-forest text-white rounded-br-sm'
            : 'bg-white border border-emerald-100 text-flora-text rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <div className="prose prose-sm prose-emerald max-w-none chat-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        )}
        <p className={`text-[10px] mt-1 ${isUser ? 'text-white/50 text-right' : 'text-flora-text/30'}`}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main ChatWidget component
// ---------------------------------------------------------------------------
const ChatWidget: React.FC = () => {
  // Pull scan results from the global chat context (set by CropAI / FertilizerAI pages)
  const { diseaseResult, fertilizerResult } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasContext, setHasContext] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Detect when context changes (new scan result)
  useEffect(() => {
    const newContext = !!(diseaseResult || fertilizerResult);
    if (newContext && !hasContext && messages.length > 0) {
      // Inject a system note into the chat
      const contextName = diseaseResult
        ? `${diseaseResult.crop} — ${diseaseResult.disease}`
        : fertilizerResult
        ? `${fertilizerResult.fertilizer} recommendation`
        : '';
      const note: Message = {
        id: `context-${Date.now()}`,
        role: 'assistant',
        content: `📊 **Context updated:** I can now see your latest scan result (*${contextName}*). Feel free to ask me anything about it!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, note]);
    }
    setHasContext(newContext);
  }, [diseaseResult, fertilizerResult]);

  // Welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: Message = {
        id: 'welcome',
        role: 'assistant',
        content:
          "👋 Hi! I'm your **FloraFarm Agri-Advisor** — your AI agronomist.\n\nI can help you with crop disease management, fertilizer guidance, soil health, and more. What's on your mind today?",
        timestamp: new Date(),
      };
      setMessages([welcome]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus textarea when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const buildContext = useCallback((): ChatContext | null => {
    if (!diseaseResult && !fertilizerResult) return null;
    return {
      disease_result: diseaseResult ? (diseaseResult as unknown as Record<string, unknown>) : null,
      fertilizer_result: fertilizerResult ? (fertilizerResult as unknown as Record<string, unknown>) : null,
    };
  }, [diseaseResult, fertilizerResult]);

  const buildHistory = useCallback((): ChatHistoryEntry[] => {
    return messages
      .filter((m) => m.id !== 'welcome' && !m.id.startsWith('context-'))
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content,
      }));
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const history = buildHistory();
        const context = buildContext();
        const response = await sendChatMessage(trimmed, history, context);

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: response.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);

        if (response.error) {
          setError('The AI service returned an error. Please try again.');
        }
      } catch (err: any) {
        const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.includes('timeout');
        const errText = isTimeout
          ? 'The AI model is taking longer than usual to respond. Please try asking a shorter question.'
          : 'Could not reach the FloraFarm backend. Ensure it is running on port 8000.';
        setError(errText);
        const errMsg: Message = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${errText}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, buildHistory, buildContext]
  );

  const handleResetChat = () => {
    setError(null);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "👋 Hi! I'm your **FloraFarm Agri-Advisor** — your AI agronomist.\n\nI can help you with crop disease management, fertilizer guidance, soil health, and more. What's on your mind today?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Floating trigger button                                             */}
      {/* ------------------------------------------------------------------ */}
      <button
        id="chat-widget-toggle"
        aria-label="Open Agri-Advisor chat"
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-flora-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-flora-forest scale-90'
            : 'bg-gradient-to-br from-flora-emerald to-flora-green animate-pulse-green hover:scale-110'
        }`}
      >
        {isOpen ? (
          <ChevronDown size={22} className="text-white" />
        ) : (
          <div className="relative">
            <MessageSquare size={22} className="text-flora-dark" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-flora-green rounded-full border-2 border-white animate-ping" />
          </div>
        )}
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* Chat panel                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        id="chat-widget-panel"
        className={`fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-24px)] rounded-2xl shadow-flora-lg border border-emerald-100 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ height: '560px', background: '#F8FFFB' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-flora-forest to-flora-deep border-b border-emerald-800/30 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-flora-green to-flora-emerald flex items-center justify-center shadow">
            <Bot size={18} className="text-flora-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">Agri-Advisor</p>
            <p className="text-flora-green/80 text-xs flex items-center gap-1">
              <Sparkles size={10} />
              Powered by FloraFarm AI
            </p>
          </div>
          {hasContext && (
            <span className="text-[10px] bg-flora-green/20 text-flora-green border border-flora-green/30 px-2 py-0.5 rounded-full font-medium">
              Context active
            </span>
          )}
          <button
            aria-label="Clear chat history"
            title="Clear chat history"
            onClick={handleResetChat}
            className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <RefreshCw size={14} />
          </button>
          <button
            aria-label="Close chat"
            onClick={() => setIsOpen(false)}
            className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2 px-4 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-700 text-xs flex-shrink-0">
            <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-amber-500 hover:text-amber-700 font-bold">✕</button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chat-scroll">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isLoading && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-flora-emerald to-flora-green flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
                <Leaf size={13} className="text-flora-dark" />
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl rounded-bl-sm shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts — shown only when few messages */}
        {messages.length <= 1 && !isLoading && (
          <div className="px-4 pb-3 flex-shrink-0">
            <p className="text-xs text-flora-text/40 mb-2 font-medium">Quick questions</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 bg-white text-flora-forest hover:bg-flora-soft hover:border-flora-emerald transition-all duration-150 hover:shadow-sm active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="px-3 pb-3 pt-2 border-t border-emerald-100 bg-white flex-shrink-0">
          <div className="flex items-end gap-2 bg-flora-soft rounded-xl border border-emerald-200 focus-within:border-flora-emerald focus-within:ring-1 focus-within:ring-flora-green/30 transition-all px-3 py-2">
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize up to 4 rows
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your crops…"
              disabled={isLoading}
              className="flex-1 bg-transparent resize-none text-sm text-flora-text placeholder-emerald-300 focus:outline-none min-h-[24px] max-h-24 leading-6 disabled:opacity-60"
              style={{ height: '24px' }}
            />
            <button
              id="chat-send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="w-8 h-8 rounded-lg bg-flora-emerald hover:bg-flora-deep disabled:bg-emerald-200 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150 active:scale-90 flex-shrink-0 mb-0.5"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
          <p className="text-center text-[10px] text-flora-text/30 mt-1.5">
            Shift+Enter for new line · AI advice supplements field expertise
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
