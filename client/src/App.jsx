import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Scholarships from './pages/Scholarships';

import Applications from './pages/Applications';
import Feedback from './pages/Feedback';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Simple placeholder page for routes not yet implemented
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
    <h1 className="text-3xl font-bold text-white">{title}</h1>
    <p className="text-gray-400">This feature is coming soon.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="scholarships" element={<Scholarships />} />
        <Route path="applications" element={<Applications />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
