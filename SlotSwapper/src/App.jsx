import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Marketplace from './pages/Marketplace/Marketplace';
import Notifications from './pages/Notifications/Notifications';


export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 font-sans">
        <AppContent />
      </div>
    </AuthProvider>
  );
}


const AppContent = () => {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');


  if (!token) return <AuthPage />;


  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'marketplace' && <Marketplace />}
        {currentPage === 'notifications' && <Notifications />}
      </main>
    </>
  );
};