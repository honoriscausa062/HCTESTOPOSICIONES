import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, X, Save, BarChart3, BookOpen, FileText, HelpCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/helpers';
import { Category, Test, Question } from '../types';

type Tab = 'categories' | 'tests' | 'questions' | 'stats';

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl text-white font-medium shadow-lg z-50 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}>
      {message}
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-yellow-400 flex-shrink-0" size={24} />
          <p className="text-white">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { categories, tests, results, addCategory, updateCategory, deleteCategory, addTest, updateTest, deleteTest } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

  // Category state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '📚', color: 'from-blue-600 to-blue-800' });

  // Test state
  const [showTestModal, setShowTestModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [testForm, setTestForm] = useState({ title: '', description: '', categoryId: '', difficulty: 'easy' as Test['difficulty'], duration: 15 });
  const [testCategoryFilter, setTestCategoryFilter] = useState('');

  // Question state
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Category CRUD
  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) { showToast('El nombre es obligatorio', 'error'); return; }
    if (editingCategory) {
      updateCategory({ ...editingCategory, ...categoryForm });
      showToast('Categoría actualizada', 'success');
    } else {
      addCategory({ id: generateId(), ...categoryForm, createdAt: new Date().toISOString() });
      showToast('Categoría creada', 'success');
    }
    setShowCategoryModal(false);
    setCategoryForm({ name: '', description: '', icon: '📚', color: 'from-blue-600 to-blue-800' });
    setEditingCategory(null);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, description: cat.description, icon: cat.icon, color: cat.color });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    setConfirmDialog({
      message: '¿Eliminar esta categoría y todos sus tests?',
      onConfirm: () => {
        deleteCategory(id);
        showToast('Categoría eliminada', 'success');
        setConfirmDialog(null);
      },
    });
  };

  // Test CRUD
  const handleSaveTest = () => {
    if (!testForm.title.trim()) { showToast('El título es obligatorio', 'error'); return; }
    if (!testForm.categoryId) { showToast('Selecciona una categoría', 'error'); return; }
    if (editingTest) {
      updateTest({ ...editingTest, ...testForm });
      showToast('Test actualizado', 'success');
    } else {
      addTest({ id: generateId(), ...testForm, questions: [], createdAt: new Date().toISOString() });
      showToast('Test creado', 'success');
    }
    setShowTestModal(false);
    setTestForm({ title: '', description: '', categoryId: '', difficulty: 'easy', duration: 15 });
    setEditingTest(null);
  };

  const handleEditTest = (test: Test) => {
    setEditingTest(test);
    setTestForm({ title: test.title, description: test.description, categoryId: test.categoryId, difficulty: test.difficulty, duration: test.duration });
    setShowTestModal(true);
  };

  const handleDeleteTest = (id: string) => {
    setConfirmDialog({
      message: '¿Eliminar este test?',
      onConfirm: () => {
        deleteTest(id);
        showToast('Test eliminado', 'success');
        setConfirmDialog(null);
      },
    });
  };

  // Question CRUD
  const selectedTest = tests.find(t => t.id === selectedTestId);

  const handleSaveQuestion = () => {
    if (!questionForm.text.trim()) { showToast('La pregunta es obligatoria', 'error'); return; }
    if (questionForm.options.some(o => !o.trim())) { showToast('Todas las opciones son obligatorias', 'error'); return; }
    if (!selectedTest) return;

    const newQuestion: Question = {
      id: generateId(),
      text: questionForm.text,
      options: questionForm.options,
      correctAnswer: questionForm.correctAnswer,
      explanation: questionForm.explanation,
    };

    let updatedQuestions: Question[];
    if (editingQuestion) {
      updatedQuestions = selectedTest.questions.map(q => q.id === editingQuestion.id ? { ...newQuestion, id: editingQuestion.id } : q);
      showToast('Pregunta actualizada', 'success');
    } else {
      updatedQuestions = [...selectedTest.questions, newQuestion];
      showToast('Pregunta añadida', 'success');
    }

    updateTest({ ...selectedTest, questions: updatedQuestions });
    setShowQuestionModal(false);
    setEditingQuestion(null);
    setQuestionForm({ text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' });
  };

  const handleEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQuestionForm({ text: q.text, options: [...q.options], correctAnswer: q.correctAnswer, explanation: q.explanation || '' });
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedTest) return;
    setConfirmDialog({
      message: '¿Eliminar esta pregunta?',
      onConfirm: () => {
        updateTest({ ...selectedTest, questions: selectedTest.questions.filter(q => q.id !== questionId) });
        showToast('Pregunta eliminada', 'success');
        setConfirmDialog(null);
      },
    });
  };

  const filteredTests = testCategoryFilter
    ? tests.filter(t => t.categoryId === testCategoryFilter)
    : tests;

  const totalQuestions = tests.reduce((acc, t) => acc + t.questions.length, 0);
  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0;

  const colorOptions = [
    'from-blue-600 to-blue-800',
    'from-purple-600 to-purple-800',
    'from-green-600 to-green-800',
    'from-cyan-600 to-cyan-800',
    'from-orange-600 to-orange-800',
    'from-red-600 to-red-800',
    'from-pink-600 to-pink-800',
    'from-indigo-600 to-indigo-800',
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Fácil' },
    { value: 'medium', label: 'Medio' },
    { value: 'hard', label: 'Difícil' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-bold text-xl">Panel de Administración</h1>
            <p className="text-slate-400 text-sm">Gestión de contenidos</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-800/50 border border-slate-700 rounded-xl p-1 flex-wrap">
          {([
            { id: 'categories', label: 'Categorías', icon: BookOpen },
            { id: 'tests', label: 'Tests', icon: FileText },
            { id: 'questions', label: 'Preguntas', icon: HelpCircle },
            { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-xl">Categorías ({categories.length})</h2>
              <button
                onClick={() => { setCategoryForm({ name: '', description: '', icon: '📚', color: 'from-blue-600 to-blue-800' }); setEditingCategory(null); setShowCategoryModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Nueva Categoría
              </button>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Categoría</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium hidden md:table-cell">Descripción</th>
                    <th className="text-center px-4 py-3 text-slate-400 text-sm font-medium">Tests</th>
                    <th className="text-right px-4 py-3 text-slate-400 text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl`}>
                            {cat.icon}
                          </div>
                          <span className="text-white font-medium">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm hidden md:table-cell">{cat.description}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-white text-sm">{tests.filter(t => t.categoryId === cat.id).length}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditCategory(cat)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TESTS TAB */}
        {activeTab === 'tests' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-xl">Tests ({filteredTests.length})</h2>
              <button
                onClick={() => { setTestForm({ title: '', description: '', categoryId: '', difficulty: 'easy', duration: 15 }); setEditingTest(null); setShowTestModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Nuevo Test
              </button>
            </div>

            <div className="mb-4">
              <select
                value={testCategoryFilter}
                onChange={e => setTestCategoryFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium">Título</th>
                    <th className="text-left px-4 py-3 text-slate-400 text-sm font-medium hidden md:table-cell">Categoría</th>
                    <th className="text-center px-4 py-3 text-slate-400 text-sm font-medium">Dificultad</th>
                    <th className="text-center px-4 py-3 text-slate-400 text-sm font-medium hidden sm:table-cell">Preguntas</th>
                    <th className="text-right px-4 py-3 text-slate-400 text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map(test => {
                    const cat = categories.find(c => c.id === test.categoryId);
                    const diffColors: Record<string, string> = { easy: 'text-green-400', medium: 'text-yellow-400', hard: 'text-red-400' };
                    const diffLabels: Record<string, string> = { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' };
                    return (
                      <tr key={test.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                        <td className="px-4 py-3 text-white font-medium">{test.title}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {cat && (
                            <span className="flex items-center gap-1 text-slate-400 text-sm">
                              <span>{cat.icon}</span> {cat.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-sm font-medium ${diffColors[test.difficulty]}`}>
                            {diffLabels[test.difficulty]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-400 text-sm hidden sm:table-cell">{test.questions.length}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditTest(test)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteTest(test.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-xl">Preguntas</h2>
              {selectedTest && (
                <button
                  onClick={() => { setQuestionForm({ text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }); setEditingQuestion(null); setShowQuestionModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Pregunta
                </button>
              )}
            </div>

            <div className="mb-6">
              <select
                value={selectedTestId}
                onChange={e => setSelectedTestId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              >
                <option value="">Selecciona un test...</option>
                {tests.map(t => {
                  const cat = categories.find(c => c.id === t.categoryId);
                  return <option key={t.id} value={t.id}>{cat ? `${cat.icon} ` : ''}{t.title}</option>;
                })}
              </select>
            </div>

            {selectedTest ? (
              selectedTest.questions.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay preguntas en este test. Añade la primera.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedTest.questions.map((q, idx) => (
                    <div key={q.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="text-slate-500 text-sm">#{idx + 1}</span>
                          <p className="text-white font-medium mt-0.5">{q.text}</p>
                          <div className="mt-2 grid grid-cols-2 gap-1">
                            {q.options.map((opt, oi) => (
                              <span key={oi} className={`text-xs px-2 py-1 rounded ${oi === q.correctAnswer ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                {String.fromCharCode(65 + oi)}. {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleEditQuestion(q)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteQuestion(q.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Selecciona un test para ver sus preguntas</p>
              </div>
            )}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-white font-bold text-xl mb-6">Estadísticas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Categorías', value: categories.length, icon: '📚', color: 'from-blue-600/20 to-blue-800/20 border-blue-500/30' },
                { label: 'Tests', value: tests.length, icon: '📝', color: 'from-purple-600/20 to-purple-800/20 border-purple-500/30' },
                { label: 'Preguntas totales', value: totalQuestions, icon: '❓', color: 'from-green-600/20 to-green-800/20 border-green-500/30' },
                { label: 'Resultados', value: results.length, icon: '🏆', color: 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/30' },
                { label: 'Nota media', value: `${avgScore}%`, icon: '📊', color: 'from-cyan-600/20 to-cyan-800/20 border-cyan-500/30' },
                { label: 'Tests con preguntas', value: tests.filter(t => t.questions.length > 0).length, icon: '✅', color: 'from-orange-600/20 to-orange-800/20 border-orange-500/30' },
              ].map(stat => (
                <div key={stat.label} className={`bg-gradient-to-br ${stat.color} border rounded-2xl p-6`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Nombre de la categoría"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
                <textarea
                  value={categoryForm.description}
                  onChange={e => setCategoryForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
                  placeholder="Descripción breve"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Icono (emoji)</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={e => setCategoryForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
                  placeholder="📚"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setCategoryForm(f => ({ ...f, color }))}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} transition ${
                        categoryForm.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCategoryModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition font-medium">
                  Cancelar
                </button>
                <button onClick={handleSaveCategory} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-medium">
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEST MODAL */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editingTest ? 'Editar Test' : 'Nuevo Test'}</h3>
              <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Título *</label>
                <input
                  type="text"
                  value={testForm.title}
                  onChange={e => setTestForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Título del test"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
                <textarea
                  value={testForm.description}
                  onChange={e => setTestForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
                  placeholder="Descripción breve"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Categoría *</label>
                <select
                  value={testForm.categoryId}
                  onChange={e => setTestForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="">Selecciona categoría...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Dificultad</label>
                  <select
                    value={testForm.difficulty}
                    onChange={e => setTestForm(f => ({ ...f, difficulty: e.target.value as Test['difficulty'] }))}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    {difficultyOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Duración (min)</label>
                  <input
                    type="number"
                    min={1}
                    value={testForm.duration}
                    onChange={e => setTestForm(f => ({ ...f, duration: parseInt(e.target.value) || 15 }))}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowTestModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition font-medium">
                  Cancelar
                </button>
                <button onClick={handleSaveTest} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-medium">
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION MODAL */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full my-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'}</h3>
              <button onClick={() => setShowQuestionModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Pregunta *</label>
                <textarea
                  value={questionForm.text}
                  onChange={e => setQuestionForm(f => ({ ...f, text: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
                  placeholder="Texto de la pregunta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Opciones *</label>
                <div className="space-y-2">
                  {questionForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        onClick={() => setQuestionForm(f => ({ ...f, correctAnswer: idx }))}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition ${
                          questionForm.correctAnswer === idx
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-slate-600 text-slate-500 hover:border-green-500'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const newOpts = [...questionForm.options];
                          newOpts[idx] = e.target.value;
                          setQuestionForm(f => ({ ...f, options: newOpts }));
                        }}
                        className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-sm"
                        placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                      />
                    </div>
                  ))}
                  <p className="text-slate-500 text-xs">Haz clic en la letra para marcar la respuesta correcta</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Explicación (opcional)</label>
                <textarea
                  value={questionForm.explanation}
                  onChange={e => setQuestionForm(f => ({ ...f, explanation: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none text-sm"
                  placeholder="Explicación de la respuesta correcta"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowQuestionModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition font-medium">
                  Cancelar
                </button>
                <button onClick={handleSaveQuestion} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-medium">
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
