import { useState, useEffect } from 'react';
import { getPasien, type Pasien } from '../utils/dataInitializer';
import { Eye, Search } from 'lucide-react';

interface DokterPasienListProps {
  onViewDetail: (pasienId: number) => void;
}

export function DokterPasienList({ onViewDetail }: DokterPasienListProps) {
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPasien();
  }, []);

  const loadPasien = () => {
    const data = getPasien();
    setPasienList(data);
  };

  const filteredPasien = pasienList.filter(pasien =>
    pasien.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pasien.keluhan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Daftar Pasien</h2>
        <p className="text-gray-600">Kelola data dan catatan kesehatan pasien</p>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari pasien berdasarkan nama atau keluhan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">No</th>
                <th className="px-6 py-3 text-left text-gray-700">Nama Pasien</th>
                <th className="px-6 py-3 text-left text-gray-700">Umur</th>
                <th className="px-6 py-3 text-left text-gray-700">Keluhan</th>
                <th className="px-6 py-3 text-left text-gray-700">Catatan Dokter</th>
                <th className="px-6 py-3 text-left text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPasien.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada pasien yang sesuai dengan pencarian' : 'Belum ada data pasien'}
                  </td>
                </tr>
              ) : (
                filteredPasien.map((pasien, index) => (
                  <tr key={pasien.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-900">{pasien.nama}</td>
                    <td className="px-6 py-4 text-gray-600">{pasien.umur} tahun</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="max-w-xs truncate">{pasien.keluhan}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="max-w-xs truncate">
                        {pasien.catatan_dokter || <span className="text-gray-400 italic">Belum ada catatan</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewDetail(pasien.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-gray-700">
          Total Pasien: <span className="text-blue-600">{filteredPasien.length}</span>
          {searchQuery && ` (dari ${pasienList.length} total pasien)`}
        </p>
      </div>
    </div>
  );
}
