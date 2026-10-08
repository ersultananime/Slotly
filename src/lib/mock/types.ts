/* ============================================================
   Mock data types — mirrors future DB schema
   ============================================================ */

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;        // lucide icon name
  masterCount: number;
  gradient: string;    // tailwind gradient classes
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number; // KZT integer
}

export interface Review {
  id: string;
  clientName: string;
  rating: number; // 1-5
  text: string;
  date: string; // ISO date
}

export interface TimeSlot {
  time: string;   // "HH:mm"
  taken: boolean;
}

export interface Master {
  id: string;
  slug: string;
  name: string;
  specialization: string;
  categorySlug: string;
  district: string;
  rating: number;
  reviewCount: number;
  minPrice: number;
  avatar: {
    initials: string;
    gradient: string;
  };
  services: Service[];
  reviews: Review[];
  nearestSlot: string | null; // "Сегодня, 15:00" or null
  bio: string;
}
