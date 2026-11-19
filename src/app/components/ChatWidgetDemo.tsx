'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { RotateCcw, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Здравствуйте! Я консультант Slotly. Задайте вопрос о возможностях, установке или работе с заявками.',
    sender: 'bot',
    time: '12:00',
  },
];

const QUICK_QUESTIONS = [
  'Что уже работает?',
  'Как установить виджет?',
  'Где хранятся заявки?',
];

export default function ChatWidgetDemo() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(2);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages, isTyping]);

  const getCurrentTime = () =>
    new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: String(messageIdRef.current++),
      text,
      sender: 'user',
      time: getCurrentTime(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.slice(-10) }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const data: { reply?: string } = await response.json();
      const reply =
        data.reply?.trim() ||
        'В базе знаний пока нет этого ответа. Оставьте контакт, и представитель компании уточнит информацию.';

      setMessages((current) => [
        ...current,
        {
          id: String(messageIdRef.current++),
          text: reply,
          sender: 'bot',
          time: getCurrentTime(),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: String(messageIdRef.current++),
          text: 'Не удалось получить ответ. Проверьте соединение и попробуйте ещё раз.',
          sender: 'bot',
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setInput('');
    setIsTyping(false);
  };

  return (
    <section
      aria-label="Рабочее демо ИИ-консультанта Slotly"
      className="mx-auto min-w-0 w-full max-w-[430px] overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_18px_50px_rgba(24,32,28,0.12)]"
    >
      <header className="flex min-h-16 items-center justify-between bg-[#1d2722] px-4 text-white sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt=""
            width={38}
            height={38}
            className="shrink-0 rounded-lg bg-white"
          />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">Консультант Slotly</h2>
            <p className="truncate text-xs text-[#c5cec9]">Демо работает прямо на этой странице</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Очистить диалог"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-[#dbe2de] transition-colors hover:bg-white/10 hover:text-white"
        >
          <RotateCcw aria-hidden="true" className="size-4" strokeWidth={2} />
        </button>
      </header>

      <div
        ref={messageListRef}
        className="h-[310px] space-y-4 overflow-y-auto overscroll-contain bg-[#f5f3ee] p-4 sm:p-5"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => (
          <article
            key={message.id}
            className={message.sender === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}
          >
            <p
              className={
                'max-w-[88%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 ' +
                (message.sender === 'user'
                  ? 'bg-[#b9430f] text-white'
                  : 'border border-black/10 bg-white text-[#28332d]')
              }
            >
              {message.text}
            </p>
            <time className="mt-1.5 px-1 text-xs text-[#66716b]">{message.time}</time>
          </article>
        ))}

        <div className="min-h-6 text-sm text-[#68736d]" role="status">
          {isTyping ? 'Slotly готовит ответ…' : ''}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-black/10 bg-white px-4 py-3 sm:px-5">
        {QUICK_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => void sendMessage(question)}
            disabled={isTyping}
            className="min-h-10 rounded-lg border border-black/15 bg-white px-3 text-xs font-medium text-[#47524c] transition-colors hover:border-[#b9430f] hover:text-[#94380f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {question}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-black/10 bg-white p-3 sm:p-4">
        <label htmlFor="demo-question" className="sr-only">
          Вопрос консультанту
        </label>
        <input
          id="demo-question"
          name="question"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isTyping}
          autoComplete="off"
          placeholder="Например, как установить виджет?"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-black/20 bg-white px-3 text-base text-[#28332d] placeholder:text-[#66716b] focus:border-[#b9430f] focus:outline-none disabled:bg-[#f5f3ee] sm:text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          aria-label="Отправить вопрос"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#b9430f] text-white transition-colors hover:bg-[#96360c] disabled:cursor-not-allowed disabled:bg-[#aeb6b1]"
        >
          <Send aria-hidden="true" className="size-4" strokeWidth={2.3} />
        </button>
      </form>
    </section>
  );
}
