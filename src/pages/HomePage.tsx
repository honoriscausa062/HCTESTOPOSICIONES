import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, LogOut, Settings, Trophy, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { user, categories, tests, setUser } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const getTestCount = (categoryId: string) =>
    tests.filter(t => t.categoryId === categoryId).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">HC Test Oposiciones</h1>
              <p className="text-slate-400 text-xs">Preparación para Oposiciones</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-600/30 transition text-sm font-medium"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Panel Admin</span>
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-300 text-sm hidden sm:inline">{user?.username}</span>
            </div>
            <button
              onClick={() => setUser(null)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">
            Bienvenido, <span className="text-blue-400">{user?.username}</span>
          </h2>
          <p className="text-slate-400 mt-1">Selecciona una categoría para comenzar a practicar</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Categorías', value: categories.length, icon: '📚' },
            { label: 'Tests disponibles', value: tests.length, icon: '📝' },
            { label: 'Preguntas totales', value: tests.reduce((acc, t) => acc + t.questions.length, 0), icon: '❓' },
            { label: 'Tus resultados', value: 0, icon: '🏆' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar categoría..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Categories grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron categorías</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(category => {
              const count = getTestCount(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => navigate(`/category/${category.id}`)}
                  className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-left hover:scale-105 hover:shadow-xl transition-all duration-200 group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <div className="relative">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{category.name}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm font-medium">
                        {count} {count === 1 ? 'test' : 'tests'}
                      </span>
                      <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
