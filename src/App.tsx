import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { PasienDashboard } from './components/pasien/PasienDashboard';
import { DokterDashboard } from './components/dokter/DokterDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { initializeData } from './utils/seedData';

type Page = 'landing' | 'login-pasien' | 'login-dokter' | 'login-admin' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [loginRole, setLoginRole] = useState<'pasien' | 'dokter' | 'admin' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Initialize seed data
    initializeData();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleRoleSelect = (role: 'pasien' | 'dokter' | 'admin') => {
    setLoginRole(role);
    setCurrentPage(`login-${role}` as Page);
  };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginRole(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('landing');
  };

  const handleBackToLanding = () => {
    setLoginRole(null);
    setCurrentPage('landing');
  };

  if (currentPage === 'landing') {
    return <LandingPage onRoleSelect={handleRoleSelect} />;
  }

  if (currentPage.startsWith('login-') && loginRole) {
    return (
      <LoginPage
        role={loginRole}
        onLogin={handleLogin}
        onBack={handleBackToLanding}
      />
    );
  }

  if (currentPage === 'dashboard' && currentUser) {
    switch (currentUser.role) {
      case 'pasien':
        return <PasienDashboard user={currentUser} onLogout={handleLogout} />;
      case 'dokter':
        return <DokterDashboard user={currentUser} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    }
  }

  return null;
}
