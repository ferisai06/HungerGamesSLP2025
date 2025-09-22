'use client';

import { useState, useEffect } from 'react';
import { Crown, Shield, Swords, AlertTriangle, Trophy } from 'lucide-react';
import { District, Battle, GameState } from '@/types';
import { getDistrictName, getDistrictColor, formatDateTime, getEmergencyData } from '@/lib/utils';
import supabase from '@/lib/supabase';
import DistrictCard from '@/components/DistrictCard';
import BattleHistory from '@/components/BattleHistory';
import GameStatus from '@/components/GameStatus';
import AdminPanel from '@/components/AdminPanel';

export default function Home() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
    
    // Set up real-time subscriptions
    const districtsSubscription = supabase
      .channel('districts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'districts' }, () => {
        loadDistricts();
      })
      .subscribe();

    const battlesSubscription = supabase
      .channel('battles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'battles' }, () => {
        loadBattles();
      })
      .subscribe();

    const gameStateSubscription = supabase
      .channel('game_state')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state' }, () => {
        loadGameState();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(districtsSubscription);
      supabase.removeChannel(battlesSubscription);
      supabase.removeChannel(gameStateSubscription);
    };
  }, []);

  // Toggle emergency mode
  useEffect(() => {
    if (emergencyMode) {
      const emergencyData = getEmergencyData();
      setDistricts(emergencyData.districts);
      setBattles(emergencyData.battles);
      setGameState(emergencyData.gameState);
      setLoading(false);
    } else {
      loadData();
    }
  }, [emergencyMode]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadDistricts(),
      loadBattles(),
      loadGameState(),
    ]);
    setLoading(false);
  };

  const loadDistricts = async () => {
    try {
      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setDistricts(data || []);
    } catch (error) {
      console.error('Error loading districts:', error);
      // If database fails, use emergency mode
      setEmergencyMode(true);
    }
  };

  const loadBattles = async () => {
    try {
      const { data, error } = await supabase
        .from('battles')
        .select(`
          *,
          district1:districts!battles_district1_id_fkey(*),
          district2:districts!battles_district2_id_fkey(*),
          winner_district:districts!battles_winner_district_id_fkey(*),
          loser_district:districts!battles_loser_district_id_fkey(*)
        `)
        .order('occurred_at', { ascending: false });
      
      if (error) throw error;
      setBattles(data || []);
    } catch (error) {
      console.error('Error loading battles:', error);
    }
  };

  const loadGameState = async () => {
    try {
      const { data, error } = await supabase
        .from('game_state')
        .select(`
          *,
          winner_district:districts!game_state_winner_district_id_fkey(*)
        `)
        .single();
      
      if (error) {
        // If no game state exists, create one
        if (error.code === 'PGRST116') {
          const { data: newGameState, error: createError } = await supabase
            .from('game_state')
            .insert({
              current_phase: 'preparation',
              winner_district_id: null,
              emergency_mode: false,
              last_update: new Date().toISOString(),
            })
            .select()
            .single();
          
          if (createError) throw createError;
          setGameState(newGameState);
        } else {
          throw error;
        }
      } else {
        setGameState(data);
        setEmergencyMode(data.emergency_mode);
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };

  const activeDistricts = districts.filter(d => d.status === 'active');
  const eliminatedDistricts = districts.filter(d => d.status === 'eliminated');
  const winner = districts.find(d => d.status === 'winner');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-gold-500 animate-pulse mx-auto mb-4" />
          <p className="text-xl glow-text">Cargando Panel del Capitolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Crown className="w-12 h-12 text-gold-500" />
          <h1 className="text-4xl md:text-6xl font-bold glow-text text-shadow">
            HUNGER GAMES SLP 2025
          </h1>
          <Crown className="w-12 h-12 text-gold-500" />
        </div>
        <p className="text-xl text-gold-300 mb-4">Panel Oficial del Capitolio</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setShowAdmin(!showAdmin)}
            className="btn-secondary"
          >
            <Shield className="w-5 h-5 inline mr-2" />
            {showAdmin ? 'Ocultar' : 'Mostrar'} Panel Admin
          </button>
          
          <button 
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`btn-secondary ${emergencyMode ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            <AlertTriangle className="w-5 h-5 inline mr-2" />
            Modo {emergencyMode ? 'Normal' : 'Emergencia'}
          </button>
        </div>
      </header>

      {emergencyMode && (
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 mb-6 text-center">
          <AlertTriangle className="w-6 h-6 inline mr-2" />
          <strong>MODO EMERGENCIA ACTIVADO</strong> - Usando datos de prueba
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Status */}
        <div className="lg:col-span-3">
          <GameStatus gameState={gameState} winner={winner} />
        </div>

        {/* Admin Panel */}
        {showAdmin && (
          <div className="lg:col-span-3">
            <AdminPanel 
              districts={districts} 
              onDataUpdate={loadData}
              emergencyMode={emergencyMode}
            />
          </div>
        )}

        {/* Winner Display */}
        {winner && (
          <div className="lg:col-span-3">
            <div className="card text-center py-8">
              <Trophy className="w-16 h-16 text-gold-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold glow-text mb-2">
                🏆 GANADOR DE LOS HUNGER GAMES 2025 🏆
              </h2>
              <p className="text-2xl text-gold-300">
                {getDistrictName(winner.id)}
              </p>
            </div>
          </div>
        )}

        {/* Active Districts */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Swords className="w-6 h-6 mr-2 text-gold-500" />
              Tributos Activos ({activeDistricts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDistricts.map((district) => (
                <DistrictCard key={district.id} district={district} />
              ))}
            </div>
          </div>
        </div>

        {/* Battle History */}
        <div>
          <BattleHistory battles={battles.slice(0, 10)} />
        </div>

        {/* Eliminated Districts */}
        {eliminatedDistricts.length > 0 && (
          <div className="lg:col-span-3">
            <div className="card-dark">
              <h2 className="text-2xl font-bold mb-6 text-red-400">
                💀 Tributos Eliminados ({eliminatedDistricts.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {eliminatedDistricts.map((district) => (
                  <div 
                    key={district.id}
                    className="bg-gray-800 rounded-lg p-3 text-center opacity-60"
                  >
                    <p className="font-semibold text-sm">{getDistrictName(district.id)}</p>
                    {district.eliminated_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(district.eliminated_at)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center mt-12 py-6 border-t border-gold-500/20">
        <p className="text-gold-300">
          Hunger Games SLP 2025 - Panel del Capitolio
        </p>
        <p className="text-sm text-gray-400 mt-2">
          "Que los juegos... comiencen" - Actualizado {formatDateTime(new Date())}
        </p>
      </footer>
    </div>
  );
}