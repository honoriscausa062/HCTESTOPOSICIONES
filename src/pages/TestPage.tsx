import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateId, formatTime } from '../utils/helpers';
import { UserAnswer } from '../types';

export default function TestPage() {
  const { testId } = useParams<{ testId: string }>();
  const { tests, user, addResult } = useApp();
  const navigate = useNavigate();

  const test = tests.find(t => t.id === testId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFinish = useCallback(() => {
    if (!test || !user) return;

    const answers: UserAnswer[] = test.questions.map(q => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[q.id] ?? -1,
      isCorrect: selectedAnswers[q.id] === q.correctAnswer,
    }));

    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / test.questions.length) * 100);

    const result = {
      id: generateId(),
      testId: test.id,
      userId: user.id,
      score,
      totalQuestions: test.questions.length,
      correctAnswers,
      timeSpent: timeElapsed,
      answers,
      completedAt: new Date().toISOString(),
    };

    addResult(result);
    navigate(`/results/${result.id}`);
  }, [test, user, selectedAnswers, timeElapsed, addResult, navigate]);

  if (!test) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Test no encontrado
      </div>
    );
  }

  const question = test.questions[currentQuestion];
  const isLast = currentQuestion === test.questions.length - 1;
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-700">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-white font-bold text-lg">{test.title}</h1>
              <p className="text-slate-400 text-sm">
                Pregunta {currentQuestion + 1} de {test.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-white font-mono text-sm">{formatTime(timeElapsed)}</span>
              </div>
              <button
                onClick={() => setShowExitConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
          <p className="text-white text-xl font-medium leading-relaxed">{question.text}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswers[question.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedAnswers(prev => ({ ...prev, [question.id]: idx }))}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-sm font-bold ${
                    isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>

          <span className="text-slate-500 text-sm">{answeredCount}/{test.questions.length} respondidas</span>

          {isLast ? (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl transition font-semibold shadow-lg shadow-green-600/20"
            >
              <CheckCircle className="w-4 h-4" />
              Finalizar Test
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(q => Math.min(test.questions.length - 1, q + 1))}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-medium"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      {/* Exit confirmation dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-bold text-lg mb-2">¿Abandonar el test?</h3>
            <p className="text-slate-400 text-sm mb-6">Tu progreso se perderá si abandonas ahora.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition font-medium"
              >
                Continuar
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl transition font-medium"
              >
                Abandonar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
