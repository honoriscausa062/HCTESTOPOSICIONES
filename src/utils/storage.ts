import { AppState, Category, Test, User } from '../types';

const STORAGE_KEY = 'hc_test_oposiciones';

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Constitución Española',
    description: 'Tests sobre la Constitución Española de 1978',
    icon: '⚖️',
    color: 'from-blue-600 to-blue-800',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Administración Pública',
    description: 'Organización y funcionamiento de la Administración',
    icon: '🏛️',
    color: 'from-purple-600 to-purple-800',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Derecho Administrativo',
    description: 'Procedimiento administrativo y actos administrativos',
    icon: '📋',
    color: 'from-green-600 to-green-800',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Informática',
    description: 'Sistemas informáticos y ofimática',
    icon: '💻',
    color: 'from-cyan-600 to-cyan-800',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Inglés',
    description: 'Idioma inglés nivel B2',
    icon: '🌍',
    color: 'from-orange-600 to-orange-800',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Matemáticas',
    description: 'Aritmética, álgebra y estadística',
    icon: '🔢',
    color: 'from-red-600 to-red-800',
    createdAt: new Date().toISOString(),
  },
];

const defaultTests: Test[] = [
  {
    id: '1',
    categoryId: '1',
    title: 'Constitución Española - Título Preliminar',
    description: 'Test sobre los artículos del Título Preliminar de la CE',
    difficulty: 'easy',
    duration: 15,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        text: '¿En qué año fue aprobada la Constitución Española?',
        options: ['1975', '1977', '1978', '1980'],
        correctAnswer: 2,
        explanation: 'La Constitución Española fue aprobada el 6 de diciembre de 1978.',
      },
      {
        id: 'q2',
        text: '¿Cuál es la forma política del Estado Español según la Constitución?',
        options: ['República parlamentaria', 'Monarquía parlamentaria', 'República presidencialista', 'Monarquía constitucional'],
        correctAnswer: 1,
        explanation: 'El artículo 1.3 de la CE establece que la forma política del Estado español es la Monarquía parlamentaria.',
      },
      {
        id: 'q3',
        text: '¿Cuál es el idioma oficial del Estado español según la Constitución?',
        options: ['El castellano', 'El español', 'Todos los idiomas de las CC.AA.', 'El castellano y los cooficiales'],
        correctAnswer: 0,
        explanation: 'El artículo 3.1 establece que el castellano es la lengua española oficial del Estado.',
      },
      {
        id: 'q4',
        text: '¿Qué artículo de la CE establece los valores superiores del ordenamiento jurídico?',
        options: ['Artículo 1', 'Artículo 2', 'Artículo 3', 'Artículo 9'],
        correctAnswer: 0,
        explanation: 'El artículo 1.1 de la CE proclama como valores superiores la libertad, la justicia, la igualdad y el pluralismo político.',
      },
      {
        id: 'q5',
        text: '¿Cuántos títulos tiene la Constitución Española?',
        options: ['8', '9', '10', '11'],
        correctAnswer: 2,
        explanation: 'La Constitución Española consta de 10 títulos, además del Título Preliminar.',
      },
    ],
  },
  {
    id: '2',
    categoryId: '1',
    title: 'Derechos Fundamentales',
    description: 'Test sobre los derechos y libertades fundamentales',
    difficulty: 'medium',
    duration: 20,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        text: '¿En qué título de la CE se regulan los derechos fundamentales?',
        options: ['Título I', 'Título II', 'Título III', 'Título IV'],
        correctAnswer: 0,
        explanation: 'El Título I "De los derechos y deberes fundamentales" regula los derechos fundamentales.',
      },
      {
        id: 'q2',
        text: '¿Qué recurso protege los derechos fundamentales ante el Tribunal Constitucional?',
        options: ['Recurso de inconstitucionalidad', 'Recurso de amparo', 'Cuestión de inconstitucionalidad', 'Recurso contencioso'],
        correctAnswer: 1,
        explanation: 'El recurso de amparo es el mecanismo de protección de los derechos fundamentales ante el TC.',
      },
      {
        id: 'q3',
        text: '¿Cuál es la mayoría requerida para suspender los derechos fundamentales en estado de excepción?',
        options: ['Mayoría simple', 'Mayoría absoluta', 'Mayoría de 3/5', 'Mayoría de 2/3'],
        correctAnswer: 1,
        explanation: 'El estado de excepción requiere la autorización del Congreso por mayoría absoluta.',
      },
      {
        id: 'q4',
        text: '¿Qué institución es el comisionado de las Cortes Generales para la defensa de los derechos?',
        options: ['Tribunal Constitucional', 'Tribunal Supremo', 'Defensor del Pueblo', 'Consejo de Estado'],
        correctAnswer: 2,
        explanation: 'El Defensor del Pueblo es el alto comisionado de las Cortes Generales (art. 54 CE).',
      },
      {
        id: 'q5',
        text: '¿Con qué mayoría deben aprobarse las leyes orgánicas?',
        options: ['Mayoría simple', 'Mayoría absoluta del Congreso', 'Mayoría de 3/5', 'Mayoría de 2/3'],
        correctAnswer: 1,
        explanation: 'Las leyes orgánicas requieren mayoría absoluta del Congreso en votación final sobre el conjunto del proyecto.',
      },
    ],
  },
  {
    id: '3',
    categoryId: '2',
    title: 'Organización del Estado',
    description: 'Test sobre la organización de la Administración General del Estado',
    difficulty: 'medium',
    duration: 20,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        text: '¿Qué ley regula el Régimen Jurídico del Sector Público?',
        options: ['Ley 39/2015', 'Ley 40/2015', 'Ley 38/2014', 'Ley 41/2015'],
        correctAnswer: 1,
        explanation: 'La Ley 40/2015, de 1 de octubre, de Régimen Jurídico del Sector Público.',
      },
      {
        id: 'q2',
        text: '¿Cuántos ministerios integran como máximo el Consejo de Ministros?',
        options: ['No hay límite establecido', 'Máximo 15', 'Máximo 20', 'Máximo 25'],
        correctAnswer: 0,
        explanation: 'La Constitución no establece un número máximo de ministerios; es el Presidente quien lo determina.',
      },
      {
        id: 'q3',
        text: '¿Quién preside el Consejo de Ministros?',
        options: ['El Rey', 'El Presidente del Gobierno', 'El Presidente del Senado', 'El Presidente del Congreso'],
        correctAnswer: 1,
        explanation: 'El Presidente del Gobierno preside el Consejo de Ministros según el artículo 98.2 CE.',
      },
      {
        id: 'q4',
        text: '¿Cuál es el órgano consultivo supremo del Gobierno?',
        options: ['Tribunal Supremo', 'Consejo de Estado', 'Consejo General del Poder Judicial', 'Tribunal de Cuentas'],
        correctAnswer: 1,
        explanation: 'El Consejo de Estado es el supremo órgano consultivo del Gobierno (art. 107 CE).',
      },
      {
        id: 'q5',
        text: '¿Cuántos años dura el mandato de los miembros del Tribunal Constitucional?',
        options: ['6 años', '8 años', '9 años', '12 años'],
        correctAnswer: 2,
        explanation: 'Los miembros del TC son designados por un período de nueve años (art. 159.3 CE).',
      },
    ],
  },
  {
    id: '4',
    categoryId: '3',
    title: 'Procedimiento Administrativo',
    description: 'Test sobre la Ley 39/2015 del Procedimiento Administrativo Común',
    difficulty: 'hard',
    duration: 25,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        text: '¿Cuál es el plazo máximo para resolver un procedimiento administrativo según la Ley 39/2015?',
        options: ['1 mes', '3 meses', 'El que fije la norma reguladora (máximo 6 meses)', 'El que fije la norma reguladora'],
        correctAnswer: 3,
        explanation: 'El plazo máximo para resolver es el que fije la normativa reguladora (art. 21 Ley 39/2015).',
      },
      {
        id: 'q2',
        text: '¿Qué efectos produce el silencio administrativo en procedimientos iniciados a solicitud del interesado?',
        options: ['Siempre negativo', 'Siempre positivo', 'Positivo salvo que la norma establezca lo contrario', 'Negativo salvo que la norma establezca lo contrario'],
        correctAnswer: 2,
        explanation: 'El silencio es positivo salvo excepciones (art. 24 Ley 39/2015).',
      },
      {
        id: 'q3',
        text: '¿En qué plazo pueden interponerse recursos administrativos ordinarios?',
        options: ['1 mes para actos expresos; 3 meses para silencio', '2 meses para actos expresos; 6 meses para silencio', '1 mes para actos expresos; 6 meses para silencio', '2 meses para actos expresos; 3 meses para silencio'],
        correctAnswer: 0,
        explanation: 'El plazo para recurso de alzada es 1 mes para actos expresos y 3 meses para silencio administrativo.',
      },
      {
        id: 'q4',
        text: '¿Cuándo se entiende producida la notificación por medios electrónicos?',
        options: ['Al enviar la notificación', 'A los 10 días del envío', 'Cuando acceda al contenido o transcurran 10 días', 'A los 20 días del envío'],
        correctAnswer: 2,
        explanation: 'La notificación se entiende practicada cuando el interesado acceda al contenido del acto, o transcurridos 10 días desde su puesta a disposición (art. 43 Ley 39/2015).',
      },
      {
        id: 'q5',
        text: '¿Cuál es el plazo de caducidad para el recurso contencioso-administrativo contra actos expresos?',
        options: ['1 mes', '2 meses', '3 meses', '6 meses'],
        correctAnswer: 1,
        explanation: 'El plazo es de dos meses desde la notificación del acto o publicación de la disposición impugnada.',
      },
    ],
  },
];

export const getStoredState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AppState;
    }
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
  }
  return {
    user: null,
    categories: defaultCategories,
    tests: defaultTests,
    results: [],
  };
};

export const saveState = (state: Partial<AppState>): void => {
  try {
    const current = getStoredState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...state }));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};

export const getDefaultAdminUser = (): User => ({
  id: 'admin',
  username: 'admin',
  email: 'admin@hctestoposiciones.es',
  role: 'admin',
  createdAt: new Date().toISOString(),
});

export const getDefaultCategories = () => defaultCategories;
export const getDefaultTests = () => defaultTests;
