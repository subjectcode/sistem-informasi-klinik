import { useState, useEffect } from 'react';
import {
  getTransaksi,
  getPendaftaran,
  getRekamMedis,
  getPasien,
  type Transaksi,
  type Pendaftaran,
  type RekamMedis,
  type Pasien,
} from '../../utils/seedData';
import {
  BarChart,
  DollarSign,
  Users,
  FileText,
  Printer,
  FileDown,
  Table2,
} from 'lucide-react';

// PDF & Excel
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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
    transaksiBelumLunas: 0,
  });

  // raw data buat export PDF/Excel
  const [transaksiData, setTransaksiData] = useState<Transaksi[]>([]);
  const [pendaftaranData, setPendaftaranData] = useState<Pendaftaran[]>([]);
  const [rekamMedisData, setRekamMedisData] = useState<RekamMedis[]>([]);
  const [pasienData, setPasienData] = useState<Pasien[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const transaksi = getTransaksi();
    const pendaftaran = getPendaftaran();
    const rekamMedis = getRekamMedis();
    const pasien = getPasien();

    const totalPemasukan = transaksi
      .filter((t) => t.status_pembayaran === 'Lunas')
      .reduce((sum, t) => sum + t.total_biaya, 0);

    setStats({
      totalTransaksi: transaksi.length,
      totalPemasukan,
      totalPasien: pasien.length,
      totalPemeriksaan: rekamMedis.length,
      totalPendaftaran: pendaftaran.length,
      pendaftaranMenunggu: pendaftaran.filter(
        (p) => p.status_pendaftaran === 'Menunggu Verifikasi',
      ).length,
      pendaftaranDisetujui: pendaftaran.filter(
        (p) => p.status_pendaftaran === 'Disetujui',
      ).length,
      transaksiLunas: transaksi.filter((t) => t.status_pembayaran === 'Lunas')
        .length,
      transaksiBelumLunas: transaksi.filter(
        (t) => t.status_pembayaran !== 'Lunas',
      ).length,
    });

    // simpan raw data
    setTransaksiData(transaksi);
    setPendaftaranData(pendaftaran);
    setRekamMedisData(rekamMedis);
    setPasienData(pasien);
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

  // ===== EXPORT PDF =====
  const handleExportPdf = () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Header
    doc.setFontSize(14);
    doc.text('LAPORAN RUMAH SAKIT SEHAT SENTOSA', 105, 15, {
      align: 'center',
    });
    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${tanggalCetak}`, 105, 22, { align: 'center' });

    // Ringkasan di atas tabel
    doc.setFontSize(11);
    doc.text('Ringkasan:', 14, 32);
    doc.setFontSize(10);
    doc.text(`Total Pasien        : ${stats.totalPasien}`, 14, 38);
    doc.text(`Total Pemeriksaan   : ${stats.totalPemeriksaan}`, 14, 44);
    doc.text(`Total Transaksi     : ${stats.totalTransaksi}`, 14, 50);
    doc.text(
      `Total Pemasukan     : ${formatCurrency(stats.totalPemasukan)}`,
      14,
      56,
    );

    // Mapping id pasien -> nama
    const pasienMap = new Map<number, string>();
    pasienData.forEach((p) => {
      pasienMap.set(p.id, p.nama);
    });

    // Tabel transaksi
    const tableBody = transaksiData.map((t) => [
      t.id,
      pasienMap.get(t.pasien_id) || '-',
      new Date(t.tanggal).toLocaleDateString('id-ID'),
      formatCurrency(t.total_biaya),
      t.metode_pembayaran,
      t.status_pembayaran,
    ]);

    autoTable(doc, {
      startY: 64,
      head: [
        [
          'ID',
          'Nama Pasien',
          'Tanggal',
          'Total Biaya',
          'Metode',
          'Status Pembayaran',
        ],
      ],
      body: tableBody,
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [26, 115, 232], // biru
        textColor: 255,
      },
    });

    doc.save('laporan-rs-sehat-sentosa.pdf');
  };

  // ===== EXPORT EXCEL =====
  const handleExportExcel = () => {
    // Mapping id pasien -> nama
    const pasienMap = new Map<number, string>();
    pasienData.forEach((p) => {
      pasienMap.set(p.id, p.nama);
    });

    // Sheet 1: Transaksi
    const transaksiSheetData = transaksiData.map((t) => ({
      ID: t.id,
      'Nama Pasien': pasienMap.get(t.pasien_id) || '-',
      Tanggal: new Date(t.tanggal).toLocaleDateString('id-ID'),
      'Total Biaya': t.total_biaya,
      'Metode Pembayaran': t.metode_pembayaran,
      'Status Pembayaran': t.status_pembayaran,
    }));

    const wsTransaksi = XLSX.utils.json_to_sheet(transaksiSheetData);

    // Sheet 2: Ringkasan
    const summarySheetData = [
      ['Item', 'Nilai'],
      ['Total Pasien', stats.totalPasien],
      ['Total Pemeriksaan', stats.totalPemeriksaan],
      ['Total Pendaftaran', stats.totalPendaftaran],
      ['Total Transaksi', stats.totalTransaksi],
      ['Transaksi Lunas', stats.transaksiLunas],
      ['Transaksi Belum Lunas', stats.transaksiBelumLunas],
      ['Total Pemasukan (Lunas)', stats.totalPemasukan],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);

    // Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTransaksi, 'Transaksi');
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

    XLSX.writeFile(wb, 'laporan-rs-sehat-sentosa.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* TOP BAR (tidak ikut tercetak) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div>
          <h1 className="text-3xl text-[#1F2937] mb-2">Laporan</h1>
          <p className="text-gray-600">
            Ringkasan dan statistik Rumah Sakit Sehat Sentosa
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 btn-secondary"
          >
            <Printer className="w-5 h-5" />
            Cetak (Print)
          </button>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 btn-primary"
          >
            <FileDown className="w-5 h-5" />
            Export PDF
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 btn-success"
          >
            <Table2 className="w-5 h-5" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Header untuk mode Print saja */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
          LAPORAN RUMAH SAKIT SEHAT SENTOSA
        </h1>
        <p className="text-gray-600">
          Tanggal Cetak:{' '}
          {new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
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
          <p className="text-3xl text-[#1F2937] font-bold">
            {stats.totalPasien}
          </p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#34A853] rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Pemasukan</p>
          <p className="text-2xl text-[#1F2937] font-bold">
            {formatCurrency(stats.totalPemasukan)}
          </p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Pemeriksaan</p>
          <p className="text-3xl text-[#1F2937] font-bold">
            {stats.totalPemeriksaan}
          </p>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
              <BarChart className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Transaksi</p>
          <p className="text-3xl text-[#1F2937] font-bold">
            {stats.totalTransaksi}
          </p>
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
              <span className="text-[#1F2937] font-bold">
                {stats.totalPendaftaran}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Menunggu Verifikasi</span>
              <span className="text-yellow-700 font-bold">
                {stats.pendaftaranMenunggu}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Disetujui</span>
              <span className="text-green-700 font-bold">
                {stats.pendaftaranDisetujui}
              </span>
            </div>
          </div>
        </div>

        {/* Transaksi */}
        <div className="card">
          <h3 className="text-xl text-[#1F2937] mb-4">Status Pembayaran</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Total Transaksi</span>
              <span className="text-[#1F2937] font-bold">
                {stats.totalTransaksi}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Transaksi Lunas</span>
              <span className="text-green-700 font-bold">
                {stats.transaksiLunas}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Belum Lunas</span>
              <span className="text-yellow-700 font-bold">
                {stats.transaksiBelumLunas}
              </span>
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
            <span className="text-[#1F2937] font-bold text-xl">
              {formatCurrency(stats.totalPemasukan)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Jumlah Transaksi Lunas</span>
            <span className="text-green-600 font-bold">
              {stats.transaksiLunas} transaksi
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">
              Jumlah Transaksi Belum Lunas
            </span>
            <span className="text-yellow-600 font-bold">
              {stats.transaksiBelumLunas} transaksi
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-700">Rata-rata per Transaksi</span>
            <span className="text-[#1F2937] font-bold">
              {stats.transaksiLunas > 0
                ? formatCurrency(stats.totalPemasukan / stats.transaksiLunas)
                : 'Rp 0'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer untuk Print */}
      <div className="hidden print:block mt-12 pt-8 border-t border-gray-300 text-center">
        <p className="text-gray-600">Rumah Sakit Sehat Sentosa</p>
        <p className="text-gray-600">
          Sistem Informasi Manajemen Rumah Sakit
        </p>
      </div>
    </div>
  );
}
