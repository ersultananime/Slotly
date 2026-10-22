'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, RotateCcw, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Здравствуйте! 👋 Я виртуальный консультант Slotly. Отвечу на любые вопросы по услугам, ценам или помогу подключить виджет на ваш сайт. Напишите мне или выберите вопрос ниже! 💡',
    sender: 'bot',
    time: '12:00',
  },
];

const QUICK_QUESTIONS = [
  'Сколько стоит виджет? 💎',
  'Как установить на сайт? 🔌',
  'Как ИИ собирает лиды? 🎯',
  'Как обучить на моём прайсе? 📚',
];

export default function ChatWidgetDemo() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

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
      const botReply = data.reply || 'Извините, сейчас не могу ответить. Попробуйте еще раз!';

      // Небольшая задержка для естественного эффекта печати
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
    } catch (err) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: 'Готов ответить на любые вопросы по виджету Slotly! Напишите, о чём хотите узнать 😊',
            sender: 'bot',
            time: getCurrentTime(),
          },
        ]);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setInput('');
    setIsTyping(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  return (
    <div className="relative w-full max-w-[440px] h-[540px] mx-auto select-none">
      {/* Background Soft Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-3xl blur-xl opacity-70 pointer-events-none" />

      {/* Browser Mockup Window */}
      <div className="relative h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl flex flex-col">
        {/* Browser Top Bar */}
        <div className="h-10 bg-slate-100 px-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-md border border-slate-200 text-[11px] font-mono text-slate-500 shadow-xs">
            <span className="text-emerald-600 font-semibold">🔒</span>
            <span className="text-slate-700">yoursite.kz</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Сбросить диалог"
              className="text-slate-400 hover:text-slate-600 text-xs p-1 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mockup Page Content */}
        <div className="flex-1 p-5 space-y-4 bg-slate-50/70 overflow-hidden relative">
          {/* Mock Nav */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <img src="/logo.jpeg" alt="Logo" className="w-6 h-6 rounded-md object-contain" />
              <div className="h-3 w-20 bg-slate-300 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-10 bg-slate-200 rounded" />
              <div className="h-2 w-10 bg-slate-200 rounded" />
            </div>
          </div>

          {/* Product / Service Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="h-3.5 w-32 bg-slate-700 rounded mb-1.5" />
                <div className="h-2 w-44 bg-slate-300 rounded" />
              </div>
              <span className="text-xs font-bold text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                15 000 ₸
              </span>
            </div>
            <div className="h-20 rounded-lg bg-gradient-to-tr from-blue-50/50 to-indigo-50/50 border border-slate-100 flex items-center justify-center text-slate-400 text-xs gap-1.5">
              <span>🛒</span>
              <span>[Каталог товаров и услуг вашего сайта]</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="h-2 w-16 bg-slate-200 rounded" />
              <div className="h-6 w-24 bg-blue-600 rounded-md flex items-center justify-center text-[10px] text-white font-semibold">
                Заказать
              </div>
            </div>
          </div>

          {/* Mock Text Paragraphs */}
          <div className="space-y-2 pt-1 opacity-60">
            <div className="h-2.5 w-full bg-slate-200 rounded" />
            <div className="h-2.5 w-5/6 bg-slate-200 rounded" />
          </div>

          {/* Reopen Hint */}
          {!isOpen && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-none animate-bounce">
              <span>💬</span>
              <span>Нажмите, чтобы протестировать чат</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Widget Window */}
      <section
        aria-label="Рабочий ИИ-виджет чата Slotly"
        aria-hidden={!isOpen}
        className={`absolute bottom-20 right-4 w-[345px] transition-all duration-300 ease-out z-20 ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          {/* Widget Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  src="/logo.jpeg" 
                  alt="Slotly Logo" 
                  className="w-8 h-8 rounded-full object-contain bg-white p-0.5 shadow-sm" 
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-600" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Slotly Ассистент</span>
                  <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-mono">
                    Онлайн
                  </span>
                </div>
                <div className="text-blue-100 text-[10px]">
                  Отвечает на любые вопросы 24/7
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Очистить диалог"
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleToggle}
                aria-label="Закрыть окно чата"
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div 
            className="h-[250px] overflow-y-auto overscroll-contain p-3.5 space-y-3 bg-slate-50"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[260px] px-3.5 py-2.5 text-[12px] leading-relaxed rounded-2xl whitespace-pre-wrap ${
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

          {/* Quick Suggestions Chips */}
          <div className="px-3 pt-2 pb-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_QUESTIONS.map((q, idx) => (
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

          {/* Chat Active Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Напишите ваш вопрос..."
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
      </section>

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? "Свернуть чат-виджет" : "Развернуть рабочий демо чат"}
        aria-expanded={isOpen}
        className={`absolute bottom-4 right-4 z-30 w-13 h-13 rounded-full bg-white shadow-xl shadow-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-slate-200 overflow-hidden p-1`}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-slate-700" />
        ) : (
          <img 
            src="/logo.jpeg" 
            alt="Slotly" 
            className="w-full h-full object-contain rounded-full" 
          />
        )}

        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}
