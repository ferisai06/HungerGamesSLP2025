'use client';

import { Battle } from '@/types';
import { getDistrictName, formatDateTime, formatTime, cn } from '@/lib/utils';
import { Sword, Clock, Trophy, Skull } from 'lucide-react';

interface BattleHistoryProps {
  battles: Battle[];
  className?: string;
}

export default function BattleHistory({ battles, className }: BattleHistoryProps) {
  if (!battles.length) {
    return (
      <div className={cn('card', className)}>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Sword className="w-6 h-6 mr-2 text-gold-500" />
          Historial de Enfrentamientos
        </h2>
        <div className="text-center py-8 text-gray-400">
          <Sword className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay enfrentamientos registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('card', className)}>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Sword className="w-6 h-6 mr-2 text-gold-500" />
        Historial de Enfrentamientos
      </h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {battles.map((battle) => (
          <div key={battle.id} className="bg-capitol-700/50 rounded-lg p-4 border border-gold-500/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" />
                <span className="text-sm text-gold-300">
                  {formatTime(battle.occurred_at)}
                </span>
              </div>
              <span className={cn(
                'text-xs px-2 py-1 rounded-full font-semibold',
                battle.battle_type === 'final' && 'bg-gold-500/20 text-gold-300',
                battle.battle_type === 'group' && 'bg-purple-500/20 text-purple-300',
                battle.battle_type === 'individual' && 'bg-blue-500/20 text-blue-300'
              )}>
                {battle.battle_type === 'final' && 'FINAL'}
                {battle.battle_type === 'group' && 'GRUPO'}
                {battle.battle_type === 'individual' && 'INDIVIDUAL'}
              </span>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="text-white font-semibold">
                  {battle.district1?.name || getDistrictName(battle.district1_id)}
                </span>
                <Sword className="w-4 h-4 text-red-400" />
                <span className="text-white font-semibold">
                  {battle.district2?.name || getDistrictName(battle.district2_id)}
                </span>
              </div>
            </div>
            
            {battle.winner_district_id && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-gold-400" />
                <span className="text-gold-300 font-semibold text-sm">
                  Ganador: {battle.winner_district?.name || getDistrictName(battle.winner_district_id)}
                </span>
              </div>
            )}
            
            {battle.loser_district_id && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <Skull className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-sm">
                  Eliminado: {battle.loser_district?.name || getDistrictName(battle.loser_district_id)}
                </span>
              </div>
            )}
            
            {battle.description && (
              <p className="text-xs text-gray-400 italic mt-2 text-center">
                "{battle.description}"
              </p>
            )}
          </div>
        ))}
      </div>
      
      {battles.length > 10 && (
        <div className="text-center mt-4 pt-4 border-t border-gold-500/20">
          <p className="text-sm text-gray-400">
            Mostrando los 10 enfrentamientos más recientes
          </p>
        </div>
      )}
    </div>
  );
}