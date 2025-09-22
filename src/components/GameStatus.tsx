'use client';

import { GameState, District } from '@/types';
import { formatDateTime, getDistrictName, cn } from '@/lib/utils';
import { Play, Pause, Trophy, Clock, AlertCircle } from 'lucide-react';

interface GameStatusProps {
  gameState: GameState | null;
  winner?: District;
  className?: string;
}

export default function GameStatus({ gameState, winner, className }: GameStatusProps) {
  if (!gameState) {
    return (
      <div className={cn('card text-center', className)}>
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">
          Estado del Juego No Disponible
        </h2>
        <p className="text-gray-400">
          No se pudo cargar el estado actual del juego
        </p>
      </div>
    );
  }

  const getPhaseDisplay = (phase: string) => {
    const phases = {
      preparation: { name: 'Preparación', color: 'text-blue-400', icon: Pause },
      bloodbath: { name: 'Baño de Sangre', color: 'text-red-400', icon: Play },
      games: { name: 'Los Juegos', color: 'text-orange-400', icon: Play },
      finale: { name: 'Gran Final', color: 'text-purple-400', icon: Trophy },
      ended: { name: 'Juegos Terminados', color: 'text-green-400', icon: Trophy },
    };
    return phases[phase as keyof typeof phases] || { name: phase, color: 'text-gray-400', icon: AlertCircle };
  };

  const phaseInfo = getPhaseDisplay(gameState.current_phase);
  const PhaseIcon = phaseInfo.icon;

  return (
    <div className={cn('card text-center', className)}>
      <div className="flex items-center justify-center gap-4 mb-6">
        <PhaseIcon className={cn('w-8 h-8', phaseInfo.color)} />
        <h2 className={cn('text-3xl font-bold', phaseInfo.color)}>
          {phaseInfo.name}
        </h2>
        <PhaseIcon className={cn('w-8 h-8', phaseInfo.color)} />
      </div>
      
      {gameState.emergency_mode && (
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-3 mb-4">
          <AlertCircle className="w-5 h-5 inline mr-2 text-red-400" />
          <span className="text-red-300 font-semibold">MODO EMERGENCIA ACTIVADO</span>
        </div>
      )}
      
      {winner && (
        <div className="bg-gold-500/20 border border-gold-500 rounded-lg p-4 mb-4">
          <Trophy className="w-8 h-8 text-gold-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gold-300">
            🏆 GANADOR: {getDistrictName(winner.id)} 🏆
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-capitol-700/30 rounded-lg p-3">
          <Clock className="w-5 h-5 text-gold-400 mx-auto mb-2" />
          <p className="text-gray-400">Última Actualización</p>
          <p className="text-white font-semibold">
            {formatDateTime(gameState.last_update)}
          </p>
        </div>
        
        <div className="bg-capitol-700/30 rounded-lg p-3">
          <Play className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <p className="text-gray-400">Fase Actual</p>
          <p className={cn('font-semibold', phaseInfo.color)}>
            {phaseInfo.name}
          </p>
        </div>
        
        <div className="bg-capitol-700/30 rounded-lg p-3">
          <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <p className="text-gray-400">Estado</p>
          <p className="text-white font-semibold">
            {gameState.current_phase === 'ended' ? 'Terminado' : 'En Progreso'}
          </p>
        </div>
      </div>
      
      {gameState.current_phase === 'preparation' && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300">
            Los juegos están en fase de preparación. Los tributos se preparan para entrar a la arena.
          </p>
        </div>
      )}
      
      {gameState.current_phase === 'bloodbath' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-300">
            ¡El baño de sangre ha comenzado! Los tributos luchan por los suministros iniciales.
          </p>
        </div>
      )}
      
      {gameState.current_phase === 'games' && (
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <p className="text-orange-300">
            Los Hunger Games están en pleno desarrollo. Solo los más fuertes sobrevivirán.
          </p>
        </div>
      )}
      
      {gameState.current_phase === 'finale' && (
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-purple-300">
            ¡Estamos en la gran final! Los últimos tributos se enfrentan por la victoria.
          </p>
        </div>
      )}
    </div>
  );
}