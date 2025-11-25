import { useState, useEffect } from 'react';
import {
  getTransaksiByPasienId,
  getDetailObatByTransaksiId,
  type Transaksi,
  type DetailTransaksiObat,
} from '../../utils/seedData';
import {
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Pill,
} from 'lucide-react';

interface StatusPembayaranProps {
  pasienId: number;
}

export function StatusPembayaran({ pasienId }: StatusPembayaranProps) {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [detailObat, setDetailObat] = useState<
    Record<number, DetailTransaksiObat[]>
  >({});
  const [selectedTransaksiId, setSelectedTransaksiId] = useState<number | null>(
    null,
  );
  const [selectedMetode, setSelectedMetode] = useState<
    'Cash' | 'QRIS' | 'Transfer' | ''
  >('');

  useEffect(() => {
    loadData();
  }, [pasienId]);

  const loadData = () => {
    const data = getTransaksiByPasienId(pasienId);
    // urutkan dari terbaru
    const sorted = data.sort(
      (a, b) =>
        new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime(),
    );
    setTransaksiList(sorted);

    const details: Record<number, DetailTransaksiObat[]> = {};
    sorted.forEach((transaksi) => {
      details[transaksi.id] = getDetailObatByTransaksiId(transaksi.id);
    });
    setDetailObat(details);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      'Siap Dibayar': {
        badge: 'badge-process',
        icon: Clock,
        color: 'yellow',
      },
      'Menunggu Verifikasi': {
        badge: 'badge-waiting',
        icon: Clock,
        color: 'blue',
      },
      Lunas: {
        badge: 'badge-success',
        icon: CheckCircle,
        color: 'green',
      },
    };
    return configs[status as keyof typeof configs] || configs['Siap Dibayar'];
  };

  const totalBiaya = transaksiList.reduce(
    (sum, t) => sum + t.total_biaya,
    0,
  );
  const totalLunas = transaksiList
    .filter((t) => t.status_pembayaran === 'Lunas')
    .reduce((sum, t) => sum + t.total_biaya, 0);
  const totalBelumLunas = totalBiaya - totalLunas;

  const handlePilihTransaksi = (id: number) => {
    // kalau klik transaksi yang sama → tutup panel
    setSelectedTransaksiId((prev) => (prev === id ? null : id));
    setSelectedMetode('Cash'); // default
  };

  const handleKonfirmasiPembayaran = (id: number) => {
    if (!selectedMetode) return;

    // Di sisi pasien: setelah bayar → status jadi "Menunggu Verifikasi"
    setTransaksiList((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status_pembayaran: 'Menunggu Verifikasi',
              // pastikan tipe Transaksi punya field ini, atau jadikan optional
              metode_pembayaran: selectedMetode,
            }
          : t,
      ),
    );

    setSelectedTransaksiId(null);
    setSelectedMetode('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#1F2937] mb-2">Status Pembayaran</h1>
        <p className="text-gray-600">
          Kelola pembayaran dan lihat riwayat transaksi Anda
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#1A73E8] rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total Biaya</p>
          <p className="text-2xl text-[#1F2937] font-bold">
            {formatCurrency(totalBiaya)}
          </p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#34A853] rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Sudah Dibayar (Lunas)</p>
          <p className="text-2xl text-[#1F2937] font-bold">
            {formatCurrency(totalLunas)}
          </p>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Belum Lunas</p>
          <p className="text-2xl text-[#1F2937] font-bold">
            {formatCurrency(totalBelumLunas)}
          </p>
        </div>
      </div>

      {/* Transactions List */}
      {transaksiList.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg text-[#1F2937] mb-2">
            Belum Ada Transaksi
          </h3>
          <p className="text-gray-600">
            Transaksi Anda akan muncul di sini setelah pemeriksaan atau
            pembelian obat.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transaksiList.map((transaksi) => {
            const statusConfig = getStatusConfig(transaksi.status_pembayaran);
            const StatusIcon = statusConfig.icon;
            const obatList = detailObat[transaksi.id] || [];
            const isSelected = selectedTransaksiId === transaksi.id;

            return (
              <div
                key={transaksi.id}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-${statusConfig.color}-100 rounded-xl flex items-center justify-center`}
                    >
                      <CreditCard
                        className={`w-6 h-6 text-${statusConfig.color}-600`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg text-[#1F2937] font-semibold">
                        Transaksi #{transaksi.id}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(transaksi.tanggal)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={statusConfig.badge}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {transaksi.status_pembayaran}
                  </span>
                </div>

                {/* Detail Obat */}
                {obatList.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="flex items-center gap-2 text-[#1F2937] font-medium mb-2">
                      <Pill className="w-4 h-4" />
                      Detail Obat
                    </h4>
                    <div className="space-y-1">
                      {obatList.map((obat) => (
                        <div
                          key={obat.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {obat.nama_obat} x{obat.jumlah}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {formatCurrency(obat.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total + Metode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-gray-600 mb-1">Metode Pembayaran</p>
                    <p className="text-[#1F2937] font-medium">
                      {transaksi.metode_pembayaran || '-'}
                    </p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-gray-600 mb-1">Total Biaya</p>
                    <p className="text-2xl text-[#1F2937] font-bold">
                      {formatCurrency(transaksi.total_biaya)}
                    </p>
                  </div>
                </div>

                {/* Panel Pilih Metode & Bayar */}
                {transaksi.status_pembayaran === 'Siap Dibayar' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {!isSelected ? (
                      <button
                        onClick={() => handlePilihTransaksi(transaksi.id)}
                        className="w-full btn-primary"
                      >
                        Pilih Metode &amp; Bayar
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                          Pilih metode pembayaran untuk transaksi ini:
                        </p>

                        <div className="space-y-2 text-sm text-gray-800">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`metode-${transaksi.id}`}
                              value="Cash"
                              checked={selectedMetode === 'Cash'}
                              onChange={() => setSelectedMetode('Cash')}
                            />
                            <span>Cash (bayar di kasir RS)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`metode-${transaksi.id}`}
                              value="QRIS"
                              checked={selectedMetode === 'QRIS'}
                              onChange={() => setSelectedMetode('QRIS')}
                            />
                            <span>QRIS</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`metode-${transaksi.id}`}
                              value="Transfer"
                              checked={selectedMetode === 'Transfer'}
                              onChange={() => setSelectedMetode('Transfer')}
                            />
                            <span>Transfer Bank</span>
                          </label>
                        </div>

                        {/* Info tambahan per metode */}
                        {selectedMetode === 'QRIS' && (
                          <div>
                            <p className="text-sm text-gray-700 mb-2">
                              Scan QR berikut untuk melakukan pembayaran:
                            </p>
                            <div className="w-40 h-40 bg-white border border-dashed border-gray-400 rounded-lg flex items-center justify-center text-[11px] text-gray-500">
                              QRIS CODE
                            </div>
                          </div>
                        )}

                        {selectedMetode === 'Transfer' && (
                          <div>
                            <p className="text-sm text-gray-700 mb-1">
                              Nomor rekening Rumah Sakit:
                            </p>
                            <p className="font-mono text-gray-900 text-sm">
                              1234 5678 9012 (Bank Sehat Sentosa)
                            </p>
                          </div>
                        )}

                        {selectedMetode === 'Cash' && (
                          <p className="text-sm text-gray-700">
                            Silakan melakukan pembayaran di kasir RS Sehat
                            Sentosa dengan menyebutkan nama dan nomor rekam
                            medis Anda.
                          </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() =>
                              handleKonfirmasiPembayaran(transaksi.id)
                            }
                            className="sm:flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Konfirmasi Pembayaran
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTransaksiId(null);
                              setSelectedMetode('');
                            }}
                            className="sm:w-auto px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
