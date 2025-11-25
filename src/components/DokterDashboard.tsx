import { useState } from 'react';
import { DokterPasienList } from './DokterPasienList';
import { DokterPasienDetail } from './DokterPasienDetail';
import { LogOut, Users, Home } from 'lucide-react';

interface DokterDashboardProps {
  user: any;
  onLogout: () => void;
}

type View = 'home' | 'pasien-list' | 'pasien-detail';

export function DokterDashboard({ user, onLogout }: DokterDashboardProps) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPasienId, setSelectedPasienId] = useState<number | null>(null);

  const handleViewPasienList = () => {
    setCurrentView('pasien-list');
  };

  const handleViewPasienDetail = (pasienId: number) => {
    setSelectedPasienId(pasienId);
    setCurrentView('pasien-detail');
  };

  const handleBackToPasienList = () => {
    setSelectedPasienId(null);
    setCurrentView('pasien-list');
  };

  const handleBackToHome = () => {
    setSelectedPasienId(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white">👨‍⚕️</span>
              </div>
              <div>
                <h1 className="text-gray-900">Dashboard Dokter</h1>
                <p className="text-gray-600">Selamat datang, {user.username}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      {currentView !== 'home' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-gray-600">
            <button onClick={handleBackToHome} className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            {currentView === 'pasien-list' && (
              <>
                <span>/</span>
                <span className="text-gray-900">Daftar Pasien</span>
              </>
            )}
            {currentView === 'pasien-detail' && (
              <>
                <span>/</span>
                <button onClick={handleBackToPasienList} className="hover:text-blue-600">
                  Daftar Pasien
                </button>
                <span>/</span>
                <span className="text-gray-900">Detail Pasien</span>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">Selamat Datang</h2>
              <p className="text-gray-600">Pilih menu di bawah untuk mulai mengelola data pasien</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={handleViewPasienList}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">Daftar Pasien</h3>
                    <p className="text-gray-600">Lihat dan kelola data pasien</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {currentView === 'pasien-list' && (
          <DokterPasienList onViewDetail={handleViewPasienDetail} />
        )}

        {currentView === 'pasien-detail' && selectedPasienId && (
          <DokterPasienDetail
            pasienId={selectedPasienId}
            onBack={handleBackToPasienList}
          />
        )}
      </main>
    </div>
  );
}
