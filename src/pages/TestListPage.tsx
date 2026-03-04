import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, HelpCircle, Clock, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDifficultyColor, getDifficultyLabel } from '../utils/helpers';

export default function TestListPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categories, tests } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const category = categories.find(c => c.id === categoryId);
  const categoryTests = tests.filter(t => t.categoryId === categoryId);
  const filtered = categoryTests.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Categoría no encontrada
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.icon}</span>
            <div>
              <h1 className="text-white font-bold text-xl">{category.name}</h1>
              <p className="text-slate-400 text-sm">{category.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar test..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay tests disponibles en esta categoría</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map(test => (
              <div
                key={test.id}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-500 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-bold text-lg leading-tight flex-1 pr-3">{test.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${getDifficultyColor(test.difficulty)}`}>
                    {getDifficultyLabel(test.difficulty)}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{test.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" />
                    {test.questions.length} preguntas
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ~{test.duration} min
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/test/${test.id}`)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Comenzar Test
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
