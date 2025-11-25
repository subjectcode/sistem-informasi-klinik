import { useState, useEffect } from 'react';
import { getTransaksi, getPendaftaran, getRekamMedis, getPasien } from '../../utils/seedData';
import { BarChart, DollarSign, Users, FileText, Printer } from 'lucide-react';

export function Laporan() {
  const [stats, setStats] = useState({
    totalTransaksi: 0,
    totalPemasukan: 0,
    totalPasien: 0,
    totalPemeriksaan: 0,
    totalPendaftaran: 0,
    pendaftaranMenunggu: 0,
    pendaftaranDisetujui: 0,
    transaksiLunas: 0,
    transaksiBelumLunas: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const transaksi = getTransaksi();
    const pendaftaran = getPendaftaran();
    const rekamMedis = getRekamMedis();
    const pasien = getPasien();

    const totalPemasukan = transaksi
      .filter(t => t.status_pembayaran === 'Lunas')
      .reduce((sum, t) => sum + t.total_biaya, 0);

    setStats({
      totalTransaksi: transaksi.length,
      totalPemasukan,
      totalPasien: pasien.length,
      totalPemeriksaan: rekamMedis.length,
      totalPendaftaran: pendaftaran.length,
      pendaftaranMenunggu: pendaftaran.filter(p => p.status_pendaftaran === 'Menunggu Verifikasi').length,
      pendaftaranDisetujui: pendaftaran.filter(p => p.status_pendaftaran === 'Disetujui').length,
      transaksiLunas: transaksi.filter(t => t.status_pembayaran === 'Lunas').length,
      transaksiBelumLunas: transaksi.filter(t => t.status_pembayaran !== 'Lunas').length
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
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-3xl text-[#1F2937] mb-2">Laporan</h1>
          <p className="text-gray-600">Ringkasan dan statistik rumah sakit</p>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 btn-primary">
          <Printer className="w-5 h-5" />
          Cetak Laporan
        </button>
      </div>

      {/* Header for Print */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1F2937] mb-2">LAPORAN RUMAH SAKIT SEHAT SENTOSA</h1>
        <p className="text-gray-600">Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#1A73E8] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Pasien</p>
          <p className="text-3xl text-[#1F2937] font-bold">{stats.totalPasien}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#34A853] rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Pemasukan</p>
          <p className="text-2xl text-[#1F2937] font-bold">{formatCurrency(stats.totalPemasukan)}</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Pemeriksaan</p>
          <p className="text-3xl text-[#1F2937] font-bold">{stats.totalPemeriksaan}</p>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
              <BarChart className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Transaksi</p>
          <p className="text-3xl text-[#1F2937] font-bold">{stats.totalTransaksi}</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pendaftaran */}
        <div className="card">
          <h3 className="text-xl text-[#1F2937] mb-4">Status Pendaftaran</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Total Pendaftaran</span>
              <span className="text-[#1F2937] font-bold">{stats.totalPendaftaran}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Menunggu Verifikasi</span>
              <span className="text-yellow-700 font-bold">{stats.pendaftaranMenunggu}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Disetujui</span>
              <span className="text-green-700 font-bold">{stats.pendaftaranDisetujui}</span>
            </div>
          </div>
        </div>

        {/* Transaksi */}
        <div className="card">
          <h3 className="text-xl text-[#1F2937] mb-4">Status Pembayaran</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Total Transaksi</span>
              <span className="text-[#1F2937] font-bold">{stats.totalTransaksi}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Transaksi Lunas</span>
              <span className="text-green-700 font-bold">{stats.transaksiLunas}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Belum Lunas</span>
              <span className="text-yellow-700 font-bold">{stats.transaksiBelumLunas}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card">
        <h3 className="text-xl text-[#1F2937] mb-4">Ringkasan Keuangan</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Total Pemasukan (Lunas)</span>
            <span className="text-[#1F2937] font-bold text-xl">{formatCurrency(stats.totalPemasukan)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Jumlah Transaksi Lunas</span>
            <span className="text-green-600 font-bold">{stats.transaksiLunas} transaksi</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Jumlah Transaksi Belum Lunas</span>
            <span className="text-yellow-600 font-bold">{stats.transaksiBelumLunas} transaksi</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-700">Rata-rata per Transaksi</span>
            <span className="text-[#1F2937] font-bold">
              {stats.totalTransaksi > 0 ? formatCurrency(stats.totalPemasukan / stats.transaksiLunas) : 'Rp 0'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer for Print */}
      <div className="hidden print:block mt-12 pt-8 border-t border-gray-300 text-center">
        <p className="text-gray-600">Rumah Sakit Sehat Sentosa</p>
        <p className="text-gray-600">Sistem Informasi Manajemen Rumah Sakit</p>
      </div>
    </div>
  );
}
