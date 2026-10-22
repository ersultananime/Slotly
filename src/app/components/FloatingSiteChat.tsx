'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, RotateCcw } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Здравствуйте! 👋 Я живой ИИ-консультант Slotly. Чем могу помочь? Могу рассказать о тарифах, подключении или помочь настроить виджет под ваш сайт!',
    sender: 'bot',
    time: '12:00',
  },
];

const SUGGESTIONS = [
  'Сколько стоит виджет? 💎',
  'Как установить на сайт? 🔌',
  'Как обучить на моём прайсе? 📚',
  'Хочу подключить 14 дней бесплатно 🚀',
];

export default function FloatingSiteChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Слушаем глобальное событие открытия чата (например, по клику на кнопку «Протестировать чат»)
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    };

    window.addEventListener('open-slotly-chat', handleOpenChat);
    return () => window.removeEventListener('open-slotly-chat', handleOpenChat);
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages }),
      });

      const data = await res.json();
      const botReply = data.reply || 'Готов ответить на любые вопросы по виджету Slotly!';

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: botReply,
            sender: 'bot',
            time: getCurrentTime(),
          },
        ]);
      }, 700);
    } catch {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: 'Я на связи! Напишите мне любой вопрос по виджету Slotly 😊',
            sender: 'bot',
            time: getCurrentTime(),
          },
        ]);
      }, 500);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setInput('');
    setIsTyping(false);
  };

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Chat Window */}
      <div
        aria-hidden={!isOpen}
        className={`absolute bottom-18 right-0 w-[360px] max-w-[calc(100vw-2rem)] transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
            : 'opacity-0 scale-95 pointer-events-none translate-y-4'
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col shadow-slate-900/15">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  src="/logo.jpeg" 
                  alt="Slotly Logo" 
                  className="w-9 h-9 rounded-full object-contain bg-white p-0.5 shadow-sm" 
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-600" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Slotly Консультант</span>
                  <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-mono">
                    Онлайн
                  </span>
                </div>
                <div className="text-blue-100 text-[10px]">
                  Мгновенные ответы 24/7
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Очистить диалог"
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleToggle}
                aria-label="Закрыть чат"
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div 
            className="h-[280px] overflow-y-auto overscroll-contain p-4 space-y-3 bg-slate-50"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[270px] px-3.5 py-2.5 text-[12px] leading-relaxed rounded-2xl whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-xs w-fit shadow-xs">
                <span className="text-[10px] text-slate-500 font-medium">Slotly печатает</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[typing-dots_1.2s_infinite_0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[typing-dots_1.2s_infinite_200ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[typing-dots_1.2s_infinite_400ms]" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 pt-2 pb-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {SUGGESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(q)}
                disabled={isTyping}
                className="text-[10px] text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder="Напишите ваш вопрос консультанту..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-[12px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              aria-label="Отправить сообщение"
              className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Bottom-Right Launcher Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? "Закрыть онлайн-чат" : "Открыть онлайн-чат Slotly"}
        className="w-14 h-14 rounded-full bg-white shadow-xl shadow-slate-400/50 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-slate-200 overflow-hidden p-1.5"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-700" />
        ) : (
          <img 
            src="/logo.jpeg" 
            alt="Slotly Чат" 
            className="w-full h-full object-contain rounded-full" 
          />
        )}

        {/* Pulse unread beacon */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}
