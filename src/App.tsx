import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TestListPage from './pages/TestListPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/category/:categoryId" element={user ? <TestListPage /> : <Navigate to="/login" />} />
      <Route path="/test/:testId" element={user ? <TestPage /> : <Navigate to="/login" />} />
      <Route path="/results/:resultId" element={user ? <ResultsPage /> : <Navigate to="/login" />} />
      <Route path="/admin" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
