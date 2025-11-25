import { useState, useEffect } from 'react';
import { getPasienById, getTransaksiByPasienId, type Pasien, type Transaksi } from '../utils/dataInitializer';
import { LogOut, User, FileText, Receipt, Home } from 'lucide-react';

interface PasienDashboardProps {
  user: any;
  onLogout: () => void;
}

type View = 'home' | 'profil' | 'catatan' | 'transaksi';

export function PasienDashboard({ user, onLogout }: PasienDashboardProps) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [pasienData, setPasienData] = useState<Pasien | null>(null);
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);

  useEffect(() => {
    if (user.pasien_id) {
      const data = getPasienById(user.pasien_id);
      setPasienData(data || null);
      
      const transaksi = getTransaksiByPasienId(user.pasien_id);
      setTransaksiList(transaksi);
    }
  }, [user.pasien_id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const menuItems = [
    {
      id: 'profil' as View,
      title: 'Data Pribadi',
      description: 'Lihat informasi data diri',
      icon: User,
      color: 'blue',
    },
    {
      id: 'catatan' as View,
      title: 'Catatan Dokter',
      description: 'Lihat diagnosis dan resep',
      icon: FileText,
      color: 'green',
    },
    {
      id: 'transaksi' as View,
      title: 'Riwayat Pembayaran',
      description: 'Lihat riwayat transaksi obat',
      icon: Receipt,
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
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white">🧑‍💻</span>
              </div>
              <div>
                <h1 className="text-gray-900">Dashboard Pasien</h1>
                <p className="text-gray-600">
                  {pasienData ? `Halo, ${pasienData.nama}` : `Selamat datang, ${user.username}`}
                </p>
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
            <button onClick={() => setCurrentView('home')} className="hover:text-green-600 flex items-center gap-1">
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
              <p className="text-gray-600">Pilih menu di bawah untuk melihat informasi kesehatan Anda</p>
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

        {/* Data Pribadi */}
        {currentView === 'profil' && pasienData && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">Data Pribadi</h2>
              <p className="text-gray-600">Informasi data diri Anda</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-600 mb-1">Nama Lengkap</label>
                    <p className="text-gray-900">{pasienData.nama}</p>
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Umur</label>
                    <p className="text-gray-900">{pasienData.umur} tahun</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 mb-1">Keluhan</label>
                    <p className="text-gray-900">{pasienData.keluhan}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Catatan Dokter */}
        {currentView === 'catatan' && pasienData && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">Catatan Dokter</h2>
              <p className="text-gray-600">Diagnosis dan resep dari dokter</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              {pasienData.catatan_dokter ? (
                <div className="prose max-w-none">
                  <p className="text-gray-900 whitespace-pre-wrap">{pasienData.catatan_dokter}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Belum ada catatan dari dokter</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Riwayat Transaksi */}
        {currentView === 'transaksi' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">Riwayat Pembayaran</h2>
              <p className="text-gray-600">Riwayat transaksi obat dan pembayaran</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {transaksiList.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Belum ada riwayat transaksi</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700">No</th>
                        <th className="px-6 py-3 text-left text-gray-700">Tanggal</th>
                        <th className="px-6 py-3 text-left text-gray-700">Obat</th>
                        <th className="px-6 py-3 text-left text-gray-700">Harga</th>
                        <th className="px-6 py-3 text-left text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transaksiList.map((transaksi, index) => (
                        <tr key={transaksi.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(transaksi.tanggal).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 text-gray-900">{transaksi.obat}</td>
                          <td className="px-6 py-4 text-gray-900">{formatCurrency(transaksi.harga)}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full ${
                                transaksi.status_pembayaran === 'Lunas'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {transaksi.status_pembayaran}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Summary */}
            {transaksiList.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">Total Transaksi</p>
                    <p className="text-gray-900">{transaksiList.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Total Biaya</p>
                    <p className="text-gray-900">
                      {formatCurrency(transaksiList.reduce((sum, t) => sum + t.harga, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Status Lunas</p>
                    <p className="text-gray-900">
                      {transaksiList.filter(t => t.status_pembayaran === 'Lunas').length} dari {transaksiList.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
