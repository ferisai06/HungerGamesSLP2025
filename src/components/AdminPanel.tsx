'use client';

import { useState, useEffect } from 'react';
import { District, BattleFormData, AuthSession } from '@/types';
import { validateAccessCode, getDistrictName, generateAccessCode } from '@/lib/utils';
import { Shield, Lock, Eye, EyeOff, Swords, Crown, Users, Settings, LogOut, Plus, Save } from 'lucide-react';
import supabase from '@/lib/supabase';

interface AdminPanelProps {
  districts: District[];
  onDataUpdate: () => void;
  emergencyMode: boolean;
}

export default function AdminPanel({ districts, onDataUpdate, emergencyMode }: AdminPanelProps) {
  const [session, setSession] = useState<AuthSession>({ user: null, isAuthenticated: false });
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ code: '', level: 'gamemaker' as const });
  const [showBattleForm, setShowBattleForm] = useState(false);
  const [battleForm, setBattleForm] = useState<BattleFormData>({
    district1_id: 0,
    district2_id: 0,
    winner_district_id: 0,
    description: '',
    battle_type: 'individual',
  });
  const [gamePhase, setGamePhase] = useState('preparation');
  const [loading, setLoading] = useState(false);

  const activeDistricts = districts.filter(d => d.status === 'active');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (validateAccessCode(loginForm.code, loginForm.level)) {
        // In a real app, this would create a proper session
        const user = {
          id: generateAccessCode(),
          username: `${loginForm.level}_user`,
          access_level: loginForm.level,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setSession({ user, isAuthenticated: true });
        setShowLogin(false);
        setLoginForm({ code: '', level: 'gamemaker' });
      } else {
        alert('Código de acceso inválido');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSession({ user: null, isAuthenticated: false });
    setShowLogin(false);
    setShowBattleForm(false);
  };

  const handleBattleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session.isAuthenticated || emergencyMode) return;

    setLoading(true);
    try {
      // Create battle record
      const { error: battleError } = await supabase
        .from('battles')
        .insert({
          district1_id: battleForm.district1_id,
          district2_id: battleForm.district2_id,
          winner_district_id: battleForm.winner_district_id,
          loser_district_id: battleForm.winner_district_id === battleForm.district1_id 
            ? battleForm.district2_id 
            : battleForm.district1_id,
          description: battleForm.description,
          battle_type: battleForm.battle_type,
          occurred_at: new Date().toISOString(),
        });

      if (battleError) throw battleError;

      // Update loser district status
      const loserId = battleForm.winner_district_id === battleForm.district1_id 
        ? battleForm.district2_id 
        : battleForm.district1_id;

      const { error: districtError } = await supabase
        .from('districts')
        .update({ 
          status: 'eliminated',
          eliminated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', loserId);

      if (districtError) throw districtError;

      // Update game state
      const { error: gameStateError } = await supabase
        .from('game_state')
        .update({ last_update: new Date().toISOString() })
        .eq('id', 1);

      if (gameStateError) throw gameStateError;

      // Reset form
      setBattleForm({
        district1_id: 0,
        district2_id: 0,
        winner_district_id: 0,
        description: '',
        battle_type: 'individual',
      });
      
      setShowBattleForm(false);
      onDataUpdate();
      alert('Enfrentamiento registrado exitosamente');
    } catch (error) {
      console.error('Error registering battle:', error);
      alert('Error al registrar enfrentamiento');
    } finally {
      setLoading(false);
    }
  };

  const handlePhaseChange = async (newPhase: string) => {
    if (!session.isAuthenticated || emergencyMode) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('game_state')
        .update({ 
          current_phase: newPhase,
          last_update: new Date().toISOString(),
        })
        .eq('id', 1);

      if (error) throw error;
      
      setGamePhase(newPhase);
      onDataUpdate();
      alert('Fase del juego actualizada');
    } catch (error) {
      console.error('Error updating game phase:', error);
      alert('Error al actualizar fase del juego');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclareWinner = async (districtId: number) => {
    if (!session.isAuthenticated || emergencyMode) return;
    
    if (!confirm(`¿Estás seguro de declarar ganador al ${getDistrictName(districtId)}?`)) {
      return;
    }

    setLoading(true);
    try {
      // Update winner district
      const { error: districtError } = await supabase
        .from('districts')
        .update({ 
          status: 'winner',
          updated_at: new Date().toISOString(),
        })
        .eq('id', districtId);

      if (districtError) throw districtError;

      // Update game state
      const { error: gameStateError } = await supabase
        .from('game_state')
        .update({ 
          current_phase: 'ended',
          winner_district_id: districtId,
          last_update: new Date().toISOString(),
        })
        .eq('id', 1);

      if (gameStateError) throw gameStateError;

      onDataUpdate();
      alert(`¡${getDistrictName(districtId)} ha sido declarado ganador!`);
    } catch (error) {
      console.error('Error declaring winner:', error);
      alert('Error al declarar ganador');
    } finally {
      setLoading(false);
    }
  };

  if (!session.isAuthenticated) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Shield className="w-6 h-6 mr-2 text-gold-500" />
            Panel de Administración
          </h2>
          <button 
            onClick={() => setShowLogin(!showLogin)}
            className="btn-secondary"
          >
            <Lock className="w-5 h-5 inline mr-2" />
            {showLogin ? 'Ocultar' : 'Iniciar Sesión'}
          </button>
        </div>

        {showLogin && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nivel de Acceso</label>
              <select 
                value={loginForm.level}
                onChange={(e) => setLoginForm({ ...loginForm, level: e.target.value as any })}
                className="input-field w-full"
              >
                <option value="gamemaker">Gamemaker</option>
                <option value="capitol_admin">Administrador del Capitolio</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Código de Acceso</label>
              <input
                type="password"
                value={loginForm.code}
                onChange={(e) => setLoginForm({ ...loginForm, code: e.target.value })}
                className="input-field w-full"
                placeholder="Ingresa tu código de acceso"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
            
            <div className="text-xs text-gray-400 mt-4">
              <p><strong>Códigos de Gamemaker:</strong> GM2025, MAKER1, ARENA7</p>
              <p><strong>Códigos de Admin:</strong> SNOW25, CAPI01, ADMIN9</p>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Crown className="w-6 h-6 mr-2 text-gold-500" />
          Panel de Control - {session.user?.access_level === 'gamemaker' ? 'Gamemaker' : 'Admin del Capitolio'}
        </h2>
        <button onClick={handleLogout} className="btn-secondary">
          <LogOut className="w-5 h-5 inline mr-2" />
          Cerrar Sesión
        </button>
      </div>

      {emergencyMode && (
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-300 font-semibold">
            MODO EMERGENCIA: Las funciones de administración están deshabilitadas
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Battle Registration */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center">
            <Swords className="w-5 h-5 mr-2 text-red-400" />
            Registrar Enfrentamiento
          </h3>
          
          <button 
            onClick={() => setShowBattleForm(!showBattleForm)}
            disabled={emergencyMode || activeDistricts.length < 2}
            className="btn-primary w-full"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            {showBattleForm ? 'Ocultar Formulario' : 'Nuevo Enfrentamiento'}
          </button>

          {showBattleForm && !emergencyMode && (
            <form onSubmit={handleBattleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Distrito 1</label>
                  <select 
                    value={battleForm.district1_id}
                    onChange={(e) => setBattleForm({ ...battleForm, district1_id: parseInt(e.target.value) })}
                    className="input-field w-full"
                    required
                  >
                    <option value={0}>Seleccionar distrito</option>
                    {activeDistricts.map(district => (
                      <option key={district.id} value={district.id}>
                        {getDistrictName(district.id)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Distrito 2</label>
                  <select 
                    value={battleForm.district2_id}
                    onChange={(e) => setBattleForm({ ...battleForm, district2_id: parseInt(e.target.value) })}
                    className="input-field w-full"
                    required
                  >
                    <option value={0}>Seleccionar distrito</option>
                    {activeDistricts.filter(d => d.id !== battleForm.district1_id).map(district => (
                      <option key={district.id} value={district.id}>
                        {getDistrictName(district.id)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Ganador</label>
                <select 
                  value={battleForm.winner_district_id}
                  onChange={(e) => setBattleForm({ ...battleForm, winner_district_id: parseInt(e.target.value) })}
                  className="input-field w-full"
                  required
                >
                  <option value={0}>Seleccionar ganador</option>
                  {battleForm.district1_id > 0 && (
                    <option value={battleForm.district1_id}>
                      {getDistrictName(battleForm.district1_id)}
                    </option>
                  )}
                  {battleForm.district2_id > 0 && (
                    <option value={battleForm.district2_id}>
                      {getDistrictName(battleForm.district2_id)}
                    </option>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Tipo de Batalla</label>
                <select 
                  value={battleForm.battle_type}
                  onChange={(e) => setBattleForm({ ...battleForm, battle_type: e.target.value as any })}
                  className="input-field w-full"
                >
                  <option value="individual">Individual</option>
                  <option value="group">Grupal</option>
                  <option value="final">Final</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Descripción</label>
                <textarea 
                  value={battleForm.description}
                  onChange={(e) => setBattleForm({ ...battleForm, description: e.target.value })}
                  className="input-field w-full h-20 resize-none"
                  placeholder="Describe el enfrentamiento..."
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full"
              >
                <Save className="w-5 h-5 inline mr-2" />
                {loading ? 'Guardando...' : 'Registrar Enfrentamiento'}
              </button>
            </form>
          )}
        </div>

        {/* Game Control */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center">
            <Settings className="w-5 h-5 mr-2 text-purple-400" />
            Control del Juego
          </h3>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Cambiar Fase</label>
            <div className="grid grid-cols-2 gap-2">
              {['preparation', 'bloodbath', 'games', 'finale', 'ended'].map(phase => (
                <button
                  key={phase}
                  onClick={() => handlePhaseChange(phase)}
                  disabled={emergencyMode}
                  className="btn-secondary text-xs"
                >
                  {phase === 'preparation' && 'Preparación'}
                  {phase === 'bloodbath' && 'Baño de Sangre'}
                  {phase === 'games' && 'Los Juegos'}
                  {phase === 'finale' && 'Final'}
                  {phase === 'ended' && 'Terminado'}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Declarar Ganador</label>
            <div className="space-y-2">
              {activeDistricts.map(district => (
                <button
                  key={district.id}
                  onClick={() => handleDeclareWinner(district.id)}
                  disabled={emergencyMode}
                  className="btn-secondary w-full text-sm"
                >
                  <Crown className="w-4 h-4 inline mr-2" />
                  {getDistrictName(district.id)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}