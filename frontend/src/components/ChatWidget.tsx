// FloraFarm — AI Agri-Advisor Chat Widget
// Floating bottom-right chatbot with rich agronomic advice, crisp UI, quick prompts, and bilingual support.
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
import { useLanguage } from '../context/LanguageContext';

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
const QUICK_PROMPTS_EN = [
  'How to treat leaf blight?',
  'Best NPK ratio for wheat?',
  'Organic pest control tips',
  'Watering schedule for tomatoes',
  'Signs of nitrogen deficiency?',
  'How to improve soil pH?',
];

const QUICK_PROMPTS_TA = [
  'இலை கருகல் நோயை குணப்படுத்துவது எப்படி?',
  'கோதுமைக்கான சிறந்த NPK விகிதம் என்ன?',
  'இயற்கை பூச்சி கட்டுப்பாடு குறிப்புகள்',
  'தக்காளிக்கான நீர்ப்பாசன அட்டவணை',
  'தழைச்சத்து குறைபாட்டின் அறிகுறிகள்?',
  'மண் pH அளவை சீராக்குவது எப்படி?',
];

// ---------------------------------------------------------------------------
// Typing dots indicator
// ---------------------------------------------------------------------------
const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1.5 px-4 py-3 bg-white rounded-2xl rounded-bl-sm border border-emerald-100 shadow-sm">
    <span className="w-2 h-2 rounded-full bg-emerald-600 chat-dot" style={{ animationDelay: '0ms' }} />
    <span className="w-2 h-2 rounded-full bg-emerald-600 chat-dot" style={{ animationDelay: '160ms' }} />
    <span className="w-2 h-2 rounded-full bg-emerald-600 chat-dot" style={{ animationDelay: '320ms' }} />
  </div>
);

// ---------------------------------------------------------------------------
// Individual message bubble
// ---------------------------------------------------------------------------
const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
          <Leaf size={14} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-[#064E3B] text-white rounded-br-xs font-normal'
            : 'bg-white border border-emerald-200 text-emerald-950 rounded-bl-xs'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none chat-markdown text-emerald-950">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        )}
        <p className={`text-[10px] mt-1.5 ${isUser ? 'text-emerald-200 text-right' : 'text-emerald-800/50'}`}>
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
  const { diseaseResult, fertilizerResult } = useChatContext();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasContext, setHasContext] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isTa = language === 'ta';
  const quickPrompts = isTa ? QUICK_PROMPTS_TA : QUICK_PROMPTS_EN;

  const getWelcomeMessage = useCallback((): string => {
    return isTa
      ? "👋 வணக்கம்! நான் உங்கள் **FloraFarm AI வேளாண் ஆலோசகர்**.\n\nபயிர் நோய் மேலாண்மை, உர வழிகாட்டுதல், மண் ஆரோக்கியம் மற்றும் பலவற்றில் உங்களுக்கு உதவ முடியும். உங்களுக்கு என்ன ஆலோசனை வேண்டும்?"
      : "👋 Hi! I'm your **FloraFarm Agri-Advisor** — your AI agronomist.\n\nI can help you with crop disease management, fertilizer guidance, soil health, and more. What's on your mind today?";
  }, [isTa]);

  // Detect when context changes (new scan result)
  useEffect(() => {
    const newContext = !!(diseaseResult || fertilizerResult);
    if (newContext && !hasContext && messages.length > 0) {
      const contextName = diseaseResult
        ? `${diseaseResult.crop} — ${diseaseResult.disease}`
        : fertilizerResult
        ? `${fertilizerResult.fertilizer} recommendation`
        : '';
      
      const content = isTa
        ? `📊 **சூழல் புதுப்பிக்கப்பட்டது:** உங்கள் சமீபத்திய ஸ்கேன் முடிவை (*${contextName}*) என்னால் பார்க்க முடிகிறது. இதைப் பற்றி என்னிடம் கேளுங்கள்!`
        : `📊 **Context updated:** I can now see your latest scan result (*${contextName}*). Feel free to ask me anything about it!`;

      const note: Message = {
        id: `context-${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, note]);
    }
    setHasContext(newContext);
  }, [diseaseResult, fertilizerResult, isTa, hasContext, messages.length]);

  // Welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: Message = {
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date(),
      };
      setMessages([welcome]);
    }
  }, [isOpen, messages.length, getWelcomeMessage]);

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
        const response = await sendChatMessage(trimmed, history, context, language);

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: response.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);

        if (response.error) {
          setError(
            isTa
              ? 'AI சேவை பிழையைத் தந்தது. மீண்டும் முயற்சிக்கவும்.'
              : 'The AI service returned an error. Please try again.'
          );
        }
      } catch (err: any) {
        const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.includes('timeout');
        const errText = isTimeout
          ? isTa
            ? 'AI மாதிரி பதிலளிக்க அதிக நேரம் எடுக்கிறது. சுருக்கமான கேள்வியைக் கேளுங்கள்.'
            : 'The AI model is taking longer than usual to respond. Please try asking a shorter question.'
          : isTa
          ? 'FloraFarm பின்தளத்தை இணைக்க முடியவில்லை. அது போர்ட் 8000 இல் இயங்குவதை உறுதிசெய்யவும்.'
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
    [isLoading, buildHistory, buildContext, language, isTa]
  );

  const handleResetChat = () => {
    setError(null);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(),
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
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-[#064E3B] scale-90'
            : 'bg-gradient-to-br from-emerald-500 to-[#047857] shadow-emerald-900/30 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <ChevronDown size={22} className="text-white" />
        ) : (
          <div className="relative">
            <MessageSquare size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#064E3B] animate-pulse" />
          </div>
        )}
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* Chat panel                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        id="chat-widget-panel"
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl border-2 border-emerald-700/20 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right bg-[#FAFCF8] ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ height: '580px' }}
      >
        {/* Solid Deep Rich Green Header without any washed-out white gradient */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-[#064E3B] border-b border-emerald-900 text-white flex-shrink-0 shadow-md">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-inner flex-shrink-0">
            <Bot size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-white font-bold text-sm tracking-wide truncate">
                {isTa ? 'வேளாண் AI ஆலோசகர்' : 'Agri-Advisor'}
              </p>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            </div>
            <p className="text-emerald-200 text-xs flex items-center gap-1 font-medium">
              <Sparkles size={11} className="text-emerald-300" />
              FloraFarm AI
            </p>
          </div>
          {hasContext && (
            <span className="text-[10px] bg-emerald-700 text-emerald-100 border border-emerald-500 px-2 py-0.5 rounded-full font-semibold">
              {isTa ? 'சூழல் தயார்' : 'Context active'}
            </span>
          )}
          <button
            aria-label="Clear chat history"
            title={isTa ? "வரலாற்றை அழிக்கவும்" : "Clear chat history"}
            onClick={handleResetChat}
            className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/15"
          >
            <RefreshCw size={15} />
          </button>
          <button
            aria-label="Close chat"
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/15"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2 px-4 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex-shrink-0 font-medium">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-amber-700 hover:text-amber-950 font-bold ml-1">✕</button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 chat-scroll bg-gradient-to-b from-[#F2FBF6] to-[#FAFCF8]">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isLoading && (
            <div className="flex items-end gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
                <Leaf size={14} className="text-white" />
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt questions */}
        {messages.length <= 1 && !isLoading && (
          <div className="px-4 py-2.5 bg-emerald-50/80 border-t border-emerald-100 flex-shrink-0">
            <p className="text-[11px] text-emerald-900 font-bold uppercase tracking-wider mb-2">
              {isTa ? 'விரைவு கேள்விகள்' : 'Quick Questions'}
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-950 font-medium hover:bg-emerald-100 hover:border-emerald-600 transition-all duration-150 shadow-xs active:scale-95 text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-3 border-t border-emerald-200 bg-white flex-shrink-0 shadow-sm">
          <div className="flex items-end gap-2 bg-[#F7FCF9] rounded-xl border-2 border-emerald-300 focus-within:border-emerald-600 focus-within:bg-white transition-all px-3 py-2">
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={isTa ? 'பயிர் ஆலோசனைகளை கேளுங்கள்…' : 'Ask me anything about your crops…'}
              disabled={isLoading}
              className="flex-1 bg-transparent resize-none text-sm text-emerald-950 placeholder-emerald-700/50 font-medium focus:outline-none min-h-[24px] max-h-24 leading-6 disabled:opacity-60"
              style={{ height: '24px' }}
            />
            <button
              id="chat-send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150 active:scale-90 flex-shrink-0 mb-0.5 shadow-sm"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
          <p className="text-center text-[10px] text-emerald-800/60 font-medium mt-1.5">
            {isTa
              ? 'Shift+Enter புதிய வரிக்கு · உடனடி வேளாண் AI ஆலோசனை'
              : 'Shift+Enter for new line · Instant Agronomic AI Advice'}
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
