import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Category, Test, TestResult, User } from '../types';
import { getStoredState, saveState } from '../utils/storage';

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addTest: (test: Test) => void;
  updateTest: (test: Test) => void;
  deleteTest: (id: string) => void;
  addResult: (result: TestResult) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(getStoredState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setUser = (user: User | null) => setState(s => ({ ...s, user }));

  const addCategory = (category: Category) =>
    setState(s => ({ ...s, categories: [...s.categories, category] }));

  const updateCategory = (category: Category) =>
    setState(s => ({
      ...s,
      categories: s.categories.map(c => c.id === category.id ? category : c),
    }));

  const deleteCategory = (id: string) =>
    setState(s => ({
      ...s,
      categories: s.categories.filter(c => c.id !== id),
      tests: s.tests.filter(t => t.categoryId !== id),
    }));

  const addTest = (test: Test) =>
    setState(s => ({ ...s, tests: [...s.tests, test] }));

  const updateTest = (test: Test) =>
    setState(s => ({
      ...s,
      tests: s.tests.map(t => t.id === test.id ? test : t),
    }));

  const deleteTest = (id: string) =>
    setState(s => ({ ...s, tests: s.tests.filter(t => t.id !== id) }));

  const addResult = (result: TestResult) =>
    setState(s => ({ ...s, results: [...s.results, result] }));

  return (
    <AppContext.Provider value={{
      ...state,
      setUser,
      addCategory,
      updateCategory,
      deleteCategory,
      addTest,
      updateTest,
      deleteTest,
      addResult,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
