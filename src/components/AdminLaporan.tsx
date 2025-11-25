import { useState, useEffect } from 'react';
import { getTransaksi, getPasien, type Transaksi } from '../utils/dataInitializer';
import { Printer, TrendingUp, DollarSign, Receipt, CheckCircle } from 'lucide-react';

export function AdminLaporan() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [stats, setStats] = useState({
    totalTransaksi: 0,
    totalPemasukan: 0,
    totalLunas: 0,
    totalBelumLunas: 0,
    persentaseLunas: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const transaksi = getTransaksi();
    setTransaksiList(transaksi);

    // Calculate stats
    const totalTransaksi = transaksi.length;
    const totalPemasukan = transaksi
      .filter(t => t.status_pembayaran === 'Lunas')
      .reduce((sum, t) => sum + t.harga, 0);
    const totalLunas = transaksi.filter(t => t.status_pembayaran === 'Lunas').length;
    const totalBelumLunas = transaksi.filter(t => t.status_pembayaran === 'Belum Lunas').length;
    const persentaseLunas = totalTransaksi > 0 ? (totalLunas / totalTransaksi) * 100 : 0;

    setStats({
      totalTransaksi,
      totalPemasukan,
      totalLunas,
      totalBelumLunas,
      persentaseLunas,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Laporan Keuangan</h2>
          <p className="text-gray-600">Ringkasan transaksi dan pemasukan klinik</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors print:hidden"
        >
          <Printer className="w-5 h-5" />
          Cetak Laporan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Transaksi</p>
          <p className="text-gray-900">{stats.totalTransaksi}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Pemasukan</p>
          <p className="text-gray-900">{formatCurrency(stats.totalPemasukan)}</p>
          <p className="text-gray-500 mt-1">(Status Lunas)</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Pembayaran Lunas</p>
          <p className="text-gray-900">{stats.totalLunas} transaksi</p>
          <p className="text-green-600 mt-1">
            {stats.persentaseLunas.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Belum Lunas</p>
          <p className="text-gray-900">{stats.totalBelumLunas} transaksi</p>
          <p className="text-yellow-600 mt-1">
            {formatCurrency(
              transaksiList
                .filter(t => t.status_pembayaran === 'Belum Lunas')
                .reduce((sum, t) => sum + t.harga, 0)
            )}
          </p>
        </div>
      </div>

      {/* Detailed Report */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4">Ringkasan Detail</h3>
        
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Total Transaksi</span>
              <span className="text-gray-900">{stats.totalTransaksi}</span>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Transaksi Lunas</span>
              <span className="text-green-600">{stats.totalLunas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 ml-4">Jumlah Pemasukan</span>
              <span className="text-green-600">{formatCurrency(stats.totalPemasukan)}</span>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Transaksi Belum Lunas</span>
              <span className="text-yellow-600">{stats.totalBelumLunas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 ml-4">Jumlah Piutang</span>
              <span className="text-yellow-600">
                {formatCurrency(
                  transaksiList
                    .filter(t => t.status_pembayaran === 'Belum Lunas')
                    .reduce((sum, t) => sum + t.harga, 0)
                )}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Potensi Pendapatan</span>
              <span className="text-gray-900">
                {formatCurrency(transaksiList.reduce((sum, t) => sum + t.harga, 0))}
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              (Termasuk transaksi yang belum lunas)
            </p>
          </div>
        </div>
      </div>

      {/* Chart Visual */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4">Status Pembayaran</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Lunas</span>
              <span className="text-green-600">{stats.persentaseLunas.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.persentaseLunas}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Belum Lunas</span>
              <span className="text-yellow-600">{(100 - stats.persentaseLunas).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${100 - stats.persentaseLunas}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 print:hidden">
        <p className="text-gray-600">
          📊 Laporan ini menampilkan ringkasan dari semua transaksi yang tercatat di sistem. Klik tombol "Cetak Laporan" untuk mencetak atau menyimpan sebagai PDF.
        </p>
      </div>

      {/* Print Timestamp */}
      <div className="hidden print:block text-center text-gray-600 mt-8">
        <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        <p className="mt-2">Sistem Informasi Klinik</p>
      </div>
    </div>
  );
}
