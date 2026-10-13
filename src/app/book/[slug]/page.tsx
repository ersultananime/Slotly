'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: number;
}

const SERVICES: ServiceItem[] = [
  { id: '1', name: 'Маникюр с покрытием гель-лак', duration: '1 ч 30 мин', price: 8000 },
  { id: '2', name: 'Педикюр классический', duration: '1 ч', price: 7000 },
  { id: '3', name: 'Наращивание ногтей', duration: '2 ч 30 мин', price: 14000 },
  { id: '4', name: 'Снятие + маникюр', duration: '1 ч 15 мин', price: 5000 },
];

const DATES = [
  { day: 'Пн', num: '14' },
  { day: 'Вт', num: '15' },
  { day: 'Ср', num: '16' },
  { day: 'Чт', num: '17' },
  { day: 'Пт', num: '18' },
];

const SLOTS = ['10:00', '12:00', '14:30', '16:00', '18:30'];

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<ServiceItem>(SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState('14');
  const [selectedSlot, setSelectedSlot] = useState<string | null>('14:30');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !name || !phone) return;
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF4EF] text-[#211B1C] flex justify-center py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E7DBD0] shadow-sm overflow-hidden flex flex-col">
        {/* Шапка с кнопкой назад */}
        <div className="p-4 border-b border-[#E7DBD0] flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-[#5B5254] hover:text-[#211B1C]">
            ← На главную
          </Link>
          <span className="font-serif font-semibold text-sm">slotly</span>
        </div>

        {/* Профиль мастера */}
        <div className="p-6 text-center border-b border-[#E7DBD0] bg-[#FBF4EF]/40">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E2704F] to-[#D9BD93] mx-auto flex items-center justify-center font-serif text-2xl text-white font-medium shadow-inner mb-3">
            АН
          </div>
          <h1 className="font-serif text-xl font-medium">Айгерим Нурланова</h1>
          <p className="text-xs text-[#5B5254] mt-1">Маникюр · педикюр · наращивание (Алматы)</p>
          <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#2E5546] bg-[#E8F0EA] px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E5546]" />
            Принимает сегодня
          </div>
        </div>

        {isBooked ? (
          <div className="p-8 text-center my-auto">
            <div className="w-14 h-14 bg-[#E8F0EA] text-[#2E5546] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="font-serif text-2xl font-medium">Запись подтверждена!</h2>
            <p className="text-sm text-[#5B5254] mt-2">
              {name}, ждём вас {selectedDate} октября в {selectedSlot}.
            </p>
            <div className="mt-6 p-4 rounded-2xl bg-[#FBF4EF] border border-[#E7DBD0] text-left text-xs space-y-1.5">
              <div><strong className="font-medium text-[#5B5254]">Услуга:</strong> {selectedService.name}</div>
              <div><strong className="font-medium text-[#5B5254]">Стоимость:</strong> {selectedService.price.toLocaleString()} ₸</div>
              <div><strong className="font-medium text-[#5B5254]">Телефон:</strong> {phone}</div>
            </div>
            <button
              onClick={() => setIsBooked(false)}
              className="mt-6 w-full py-3 rounded-full bg-[#211B1C] text-white text-sm font-semibold hover:bg-black"
            >
              Записаться снова
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 flex flex-col">
            {/* 1. Выбор услуги */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254] mb-3">
                1. Выберите услугу
              </label>
              <div className="space-y-2">
                {SERVICES.map((s) => {
                  const isSelected = selectedService.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                        isSelected
                          ? 'border-[#E2704F] bg-[#FFF6F2]'
                          : 'border-[#E7DBD0] hover:border-[#D9BD93]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-[#5B5254] mt-0.5">{s.duration}</div>
                      </div>
                      <div className="font-serif text-sm font-semibold text-[#211B1C]">
                        {s.price.toLocaleString()} ₸
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Выбор даты */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254] mb-3">
                2. Дата визита
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {DATES.map((d) => {
                  const isSelected = selectedDate === d.num;
                  return (
                    <button
                      type="button"
                      key={d.num}
                      onClick={() => setSelectedDate(d.num)}
                      className={`flex-1 min-w-[52px] py-2.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#211B1C] text-white border-[#211B1C]'
                          : 'border-[#E7DBD0] bg-white text-[#5B5254] hover:border-[#211B1C]'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-medium">{d.day}</div>
                      <div className="font-serif text-base font-semibold mt-0.5">{d.num}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Выбор времени */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254] mb-3">
                3. Свободное время
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-[#E2704F] text-white border-[#E2704F] shadow-sm'
                          : 'border-[#E7DBD0] bg-white text-[#211B1C] hover:border-[#E2704F]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Контактные данные */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B5254]">
                4. Ваши контакты
              </label>
              <input
                required
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7DBD0] text-sm focus:outline-none focus:border-[#E2704F]"
              />
              <input
                required
                type="tel"
                placeholder="+7 (7XX) XXX-XX-XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7DBD0] text-sm focus:outline-none focus:border-[#E2704F]"
              />
            </div>

            {/* Кнопка записи */}
            <button
              type="submit"
              className="w-full mt-auto py-3.5 rounded-full bg-[#E2704F] hover:bg-[#C4552F] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              Записаться за {selectedService.price.toLocaleString()} ₸
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
