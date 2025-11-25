import { useState } from 'react';
import { AdminTransaksiList } from './AdminTransaksiList';
import { AdminTransaksiForm } from './AdminTransaksiForm';
import { AdminLaporan } from './AdminLaporan';
import { LogOut, Receipt, Plus, FileText, Home } from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

type View = 'home' | 'transaksi-list' | 'transaksi-tambah' | 'laporan';

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransaksiAdded = () => {
    setRefreshKey(prev => prev + 1);
    setCurrentView('transaksi-list');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const menuItems = [
    {
      id: 'transaksi-list' as View,
      title: 'Daftar Transaksi',
      description: 'Lihat semua transaksi',
      icon: Receipt,
      color: 'blue',
    },
    {
      id: 'transaksi-tambah' as View,
      title: 'Tambah Transaksi',
      description: 'Input data pembayaran obat',
      icon: Plus,
      color: 'green',
    },
    {
      id: 'laporan' as View,
      title: 'Laporan',
      description: 'Lihat ringkasan laporan',
      icon: FileText,
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white">💊</span>
              </div>
              <div>
                <h1 className="text-gray-900">Dashboard Admin</h1>
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
            <button onClick={handleBackToHome} className="hover:text-purple-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            <span>/</span>
            <span className="text-gray-900">
              {menuItems.find(item => item.id === currentView)?.title}
            </span>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">Selamat Datang</h2>
              <p className="text-gray-600">Kelola transaksi obat dan lihat laporan keuangan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
                  green: 'bg-green-100 text-green-600 group-hover:bg-green-200',
                  purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
                };
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'transaksi-list' && (
          <AdminTransaksiList key={refreshKey} />
        )}

        {currentView === 'transaksi-tambah' && (
          <AdminTransaksiForm onSuccess={handleTransaksiAdded} />
        )}

        {currentView === 'laporan' && (
          <AdminLaporan />
        )}
      </main>
    </div>
  );
}
