import { useNavigate, useParams } from 'react-router-dom';
import { Home, RotateCcw, CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/helpers';

export default function ResultsPage() {
  const { resultId } = useParams<{ resultId: string }>();
  const { results, tests } = useApp();
  const navigate = useNavigate();

  const result = results.find(r => r.id === resultId);
  const test = result ? tests.find(t => t.id === result.testId) : null;

  if (!result || !test) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Resultado no encontrado
      </div>
    );
  }

  const passed = result.score >= 50;
  const scoreColor = result.score >= 70 ? 'text-green-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = result.score >= 70
    ? 'from-green-600/20 to-green-800/20 border-green-500/30'
    : result.score >= 50
    ? 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/30'
    : 'from-red-600/20 to-red-800/20 border-red-500/30';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Score card */}
        <div className={`bg-gradient-to-br ${scoreBg} border rounded-2xl p-8 text-center mb-6`}>
          <Trophy className={`w-12 h-12 mx-auto mb-4 ${scoreColor}`} />
          <div className={`text-7xl font-bold mb-2 ${scoreColor}`}>{result.score}%</div>
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${
            passed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {passed ? '✓ Aprobado' : '✗ Suspenso'}
          </div>
          <h2 className="text-white font-bold text-xl mb-1">{test.title}</h2>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="text-slate-400">
              <span className="text-white font-bold text-lg">{result.correctAnswers}</span>
              <span>/{result.totalQuestions}</span>
              <div className="text-xs">correctas</div>
            </div>
            <div className="w-px h-10 bg-slate-600" />
            <div className="text-slate-400 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <div>
                <div className="text-white font-bold text-lg">{formatTime(result.timeSpent)}</div>
                <div className="text-xs">tiempo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition font-semibold"
          >
            <Home className="w-4 h-4" />
            Inicio
          </button>
          <button
            onClick={() => navigate(`/test/${test.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Repetir test
          </button>
        </div>

        {/* Question review */}
        <h3 className="text-white font-bold text-xl mb-4">Revisión de preguntas</h3>
        <div className="space-y-4">
          {test.questions.map((question, idx) => {
            const userAnswer = result.answers.find(a => a.questionId === question.id);
            const isCorrect = userAnswer?.isCorrect ?? false;
            const userSelected = userAnswer?.selectedAnswer ?? -1;

            return (
              <div
                key={question.id}
                className={`border rounded-2xl p-5 ${
                  isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="text-slate-400 text-sm">Pregunta {idx + 1}</span>
                    <p className="text-white font-medium mt-0.5">{question.text}</p>
                  </div>
                </div>

                <div className="space-y-2 ml-8">
                  {question.options.map((option, optIdx) => {
                    const isUserAnswer = userSelected === optIdx;
                    const isCorrectAnswer = question.correctAnswer === optIdx;
                    let style = 'text-slate-500 bg-slate-800/30';
                    if (isCorrectAnswer) style = 'text-green-400 bg-green-500/10 border border-green-500/20';
                    else if (isUserAnswer && !isCorrectAnswer) style = 'text-red-400 bg-red-500/10 border border-red-500/20';

                    return (
                      <div key={optIdx} className={`text-sm px-3 py-2 rounded-lg ${style}`}>
                        <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {option}
                        {isCorrectAnswer && <span className="ml-2 text-xs">(✓ Correcta)</span>}
                        {isUserAnswer && !isCorrectAnswer && <span className="ml-2 text-xs">(Tu respuesta)</span>}
                      </div>
                    );
                  })}
                </div>

                {question.explanation && (
                  <div className="mt-3 ml-8 text-sm text-slate-400 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
                    <span className="font-semibold text-slate-300">Explicación: </span>
                    {question.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
