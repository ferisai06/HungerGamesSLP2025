'use client';

import { District } from '@/types';
import { getDistrictName, getDistrictColor, cn } from '@/lib/utils';
import { Users, Heart } from 'lucide-react';

interface DistrictCardProps {
  district: District;
  className?: string;
}

export default function DistrictCard({ district, className }: DistrictCardProps) {
  const isActive = district.status === 'active';
  const isWinner = district.status === 'winner';
  const isEliminated = district.status === 'eliminated';

  return (
    <div 
      className={cn(
        'district-card relative overflow-hidden',
        isEliminated && 'opacity-50 grayscale',
        isWinner && 'ring-4 ring-gold-500 shadow-gold-500/25',
        className
      )}
    >
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-10',
        getDistrictColor(district.id)
      )} />
      
      {/* Status indicator */}
      <div className="absolute top-2 right-2">
        {isActive && <Heart className="w-5 h-5 text-green-400 fill-current animate-pulse" />}
        {isWinner && <span className="text-2xl">👑</span>}
        {isEliminated && <span className="text-xl">💀</span>}
      </div>

      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-2 glow-text">
          {getDistrictName(district.id)}
        </h3>
        
        <div className="space-y-2">
          {district.tribute_male && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{district.tribute_male}</span>
            </div>
          )}
          
          {district.tribute_female && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-400" />
              <span className="text-sm">{district.tribute_female}</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gold-500/20">
          <span className={cn(
            'text-xs font-semibold px-2 py-1 rounded-full',
            isActive && 'bg-green-500/20 text-green-300',
            isWinner && 'bg-gold-500/20 text-gold-300',
            isEliminated && 'bg-red-500/20 text-red-300'
          )}>
            {isActive && 'EN JUEGO'}
            {isWinner && 'GANADOR'}
            {isEliminated && 'ELIMINADO'}
          </span>
        </div>
      </div>
    </div>
  );
}