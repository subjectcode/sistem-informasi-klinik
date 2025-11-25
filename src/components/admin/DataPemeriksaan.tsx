import { useState, useEffect } from 'react';
import { getRekamMedis, getPasienById, getDokterById, type RekamMedis } from '../../utils/seedData';
import { FileText, Eye, X } from 'lucide-react';

export function DataPemeriksaan() {
  const [rekamMedisList, setRekamMedisList] = useState<RekamMedis[]>([]);
  const [selectedRekam, setSelectedRekam] = useState<RekamMedis | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getRekamMedis();
    setRekamMedisList(data.sort((a, b) => 
      new Date(b.tanggal_kunjungan).getTime() - new Date(a.tanggal_kunjungan).getTime()
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  if (selectedRekam) {
    const pasien = getPasienById(selectedRekam.pasien_id);
    const dokter = getDokterById(selectedRekam.dokter_id);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-[#1F2937]">Detail Pemeriksaan</h1>
          <button onClick={() => setSelectedRekam(null)} className="btn-secondary">
            <X className="w-4 h-4 mr-2 inline" />
            Tutup
          </button>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Pasien</p>
              <p className="text-[#1F2937] font-medium">{pasien?.nama}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Dokter</p>
              <p className="text-[#1F2937] font-medium">{dokter?.nama}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Tanggal</p>
              <p className="text-[#1F2937] font-medium">{formatDate(selectedRekam.tanggal_kunjungan)}</p>
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-[#1F2937] font-semibold mb-2">Keluhan</h4>
            <p className="text-gray-700">{selectedRekam.keluhan}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-[#1F2937] font-semibold mb-2">Hasil Pemeriksaan</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{selectedRekam.hasil_pemeriksaan}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-[#1F2937] font-semibold mb-2">Resep Obat</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{selectedRekam.resep_obat}</p>
          </div>
          {selectedRekam.catatan_tambahan && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="text-[#1F2937] font-semibold mb-2">Catatan Tambahan</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedRekam.catatan_tambahan}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#1F2937] mb-2">Data Pemeriksaan</h1>
        <p className="text-gray-600">Semua rekam medis dari dokter</p>
      </div>

      <div className="table-container">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-[#1F2937]">Tanggal</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Pasien</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Dokter</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Keluhan</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rekamMedisList.map((rekam) => {
              const pasien = getPasienById(rekam.pasien_id);
              const dokter = getDokterById(rekam.dokter_id);
              
              return (
                <tr key={rekam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{formatDate(rekam.tanggal_kunjungan)}</td>
                  <td className="px-6 py-4 text-[#1F2937]">{pasien?.nama}</td>
                  <td className="px-6 py-4 text-gray-600">{dokter?.nama}</td>
                  <td className="px-6 py-4 text-gray-600">{rekam.keluhan.substring(0, 50)}...</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedRekam(rekam)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                      Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
