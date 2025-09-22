import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeStyle: 'short',
  }).format(new Date(date));
}

export function getDistrictName(id: number): string {
  const districts: Record<number, string> = {
    1: 'Distrito 1 - Lujo',
    2: 'Distrito 2 - Albañilería',
    3: 'Distrito 3 - Tecnología',
    4: 'Distrito 4 - Pesca',
    5: 'Distrito 5 - Energía',
    6: 'Distrito 6 - Transporte',
    7: 'Distrito 7 - Madera',
    8: 'Distrito 8 - Textiles',
    9: 'Distrito 9 - Granos',
    10: 'Distrito 10 - Ganadería',
    11: 'Distrito 11 - Agricultura',
    12: 'Distrito 12 - Minería',
  };
  return districts[id] || `Distrito ${id}`;
}

export function getDistrictColor(id: number): string {
  const colors: Record<number, string> = {
    1: 'from-yellow-400 to-yellow-600',
    2: 'from-gray-400 to-gray-600',
    3: 'from-blue-400 to-blue-600',
    4: 'from-cyan-400 to-cyan-600',
    5: 'from-orange-400 to-orange-600',
    6: 'from-purple-400 to-purple-600',
    7: 'from-green-400 to-green-600',
    8: 'from-pink-400 to-pink-600',
    9: 'from-amber-400 to-amber-600',
    10: 'from-red-400 to-red-600',
    11: 'from-lime-400 to-lime-600',
    12: 'from-slate-400 to-slate-600',
  };
  return colors[id] || 'from-gray-400 to-gray-600';
}

export function generateAccessCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function validateAccessCode(code: string, level: 'gamemaker' | 'capitol_admin'): boolean {
  // In a real app, these would be environment variables or database entries
  const codes = {
    gamemaker: ['GM2025', 'MAKER1', 'ARENA7'],
    capitol_admin: ['SNOW25', 'CAPI01', 'ADMIN9'],
  };
  
  return codes[level].includes(code.toUpperCase());
}

export function getEmergencyData() {
  // Fake data for emergency mode
  return {
    districts: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: getDistrictName(i + 1),
      tribute_male: `Tributo M${i + 1}`,
      tribute_female: `Tributo F${i + 1}`,
      status: (Math.random() > 0.7 ? 'eliminated' : 'active') as 'active' | 'eliminated' | 'winner',
      eliminated_at: Math.random() > 0.5 ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    battles: Array.from({ length: 8 }, (_, i) => ({
      id: `emergency-${i}`,
      district1_id: Math.floor(Math.random() * 12) + 1,
      district2_id: Math.floor(Math.random() * 12) + 1,
      winner_district_id: Math.floor(Math.random() * 12) + 1,
      loser_district_id: null,
      description: `Batalla de emergencia ${i + 1}`,
      battle_type: 'individual' as const,
      occurred_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    gameState: {
      id: 'emergency',
      current_phase: 'games' as const,
      winner_district_id: null,
      emergency_mode: true,
      last_update: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
}