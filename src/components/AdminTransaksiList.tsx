import { useState, useEffect } from 'react';
import { getTransaksi, getPasien, type Transaksi, type Pasien } from '../utils/dataInitializer';
import { Search } from 'lucide-react';

export function AdminTransaksiList() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const transaksi = getTransaksi();
    const pasien = getPasien();
    setTransaksiList(transaksi);
    setPasienList(pasien);
  };

  const getPasienName = (pasienId: number) => {
    const pasien = pasienList.find(p => p.id === pasienId);
    return pasien ? pasien.nama : 'Unknown';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTransaksi = transaksiList.filter(transaksi => {
    const pasienName = getPasienName(transaksi.pasien_id).toLowerCase();
    const obat = transaksi.obat.toLowerCase();
    const query = searchQuery.toLowerCase();
    return pasienName.includes(query) || obat.includes(query);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Daftar Transaksi</h2>
        <p className="text-gray-600">Kelola semua transaksi pembayaran obat</p>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari transaksi berdasarkan nama pasien atau obat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">No</th>
                <th className="px-6 py-3 text-left text-gray-700">Tanggal</th>
                <th className="px-6 py-3 text-left text-gray-700">Nama Pasien</th>
                <th className="px-6 py-3 text-left text-gray-700">Obat</th>
                <th className="px-6 py-3 text-left text-gray-700">Harga</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransaksi.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada transaksi yang sesuai dengan pencarian' : 'Belum ada data transaksi'}
                  </td>
                </tr>
              ) : (
                filteredTransaksi.map((transaksi, index) => (
                  <tr key={transaksi.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(transaksi.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{getPasienName(transaksi.pasien_id)}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-600 mb-1">Total Transaksi</p>
          <p className="text-blue-600">{filteredTransaksi.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-gray-600 mb-1">Lunas</p>
          <p className="text-green-600">
            {filteredTransaksi.filter(t => t.status_pembayaran === 'Lunas').length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-gray-600 mb-1">Belum Lunas</p>
          <p className="text-yellow-600">
            {filteredTransaksi.filter(t => t.status_pembayaran === 'Belum Lunas').length}
          </p>
        </div>
      </div>
    </div>
  );
}
