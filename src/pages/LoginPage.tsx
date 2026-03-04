import React, { useState } from 'react';
import { BookOpen, User, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/helpers';

export default function LoginPage() {
  const { setUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Por favor, introduce tu nombre de usuario.');
      return;
    }
    if (isAdminMode) {
      if (username === 'admin' && password === 'admin123') {
        setUser({
          id: 'admin',
          username: 'admin',
          email: 'admin@hctestoposiciones.es',
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
      } else {
        setError('Credenciales de administrador incorrectas.');
      }
    } else {
      setUser({
        id: generateId(),
        username: username.trim(),
        email: `${username.trim()}@usuario.es`,
        role: 'user',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleGuestLogin = () => {
    setUser({
      id: 'guest-' + generateId(),
      username: 'Invitado',
      email: 'invitado@hctestoposiciones.es',
      role: 'guest',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">HC Test Oposiciones</h1>
          <p className="text-slate-400 mt-2">Preparación para Oposiciones</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-slate-900/50 p-1 mb-6">
            <button
              onClick={() => { setIsAdminMode(false); setError(''); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                !isAdminMode ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Usuario
            </button>
            <button
              onClick={() => { setIsAdminMode(true); setError(''); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isAdminMode ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Administrador
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                {isAdminMode ? 'Usuario administrador' : 'Nombre de usuario'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={isAdminMode ? 'admin' : 'Tu nombre'}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            {isAdminMode && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Login button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all shadow-lg ${
                isAdminMode
                  ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
              }`}
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-700" />
            <span className="px-3 text-slate-500 text-sm">o</span>
            <div className="flex-1 border-t border-slate-700" />
          </div>

          {/* Guest button */}
          <button
            onClick={handleGuestLogin}
            className="w-full py-3 px-4 rounded-xl font-semibold text-slate-300 border border-slate-600 hover:border-slate-500 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            Acceso como Invitado
          </button>
        </div>
      </div>
    </div>
  );
}
