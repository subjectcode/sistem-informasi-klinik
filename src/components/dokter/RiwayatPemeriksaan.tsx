import { useState, useEffect } from 'react';
import { getRekamMedisByDokterId, getPasienById, type RekamMedis } from '../../utils/seedData';
import { FileText, Calendar, User, Eye } from 'lucide-react';

interface RiwayatPemeriksaanProps {
  dokterId: number;
}

export function RiwayatPemeriksaan({ dokterId }: RiwayatPemeriksaanProps) {
  const [rekamMedisList, setRekamMedisList] = useState<RekamMedis[]>([]);
  const [selectedRekam, setSelectedRekam] = useState<RekamMedis | null>(null);

  useEffect(() => {
    loadData();
  }, [dokterId]);

  const loadData = () => {
    const data = getRekamMedisByDokterId(dokterId);
    setRekamMedisList(data.sort((a, b) => 
      new Date(b.tanggal_kunjungan).getTime() - new Date(a.tanggal_kunjungan).getTime()
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedRekam) {
    const pasien = getPasienById(selectedRekam.pasien_id);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-[#1F2937] mb-2">Detail Rekam Medis</h1>
            <p className="text-gray-600">Informasi lengkap pemeriksaan</p>
          </div>
          <button
            onClick={() => setSelectedRekam(null)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Kembali
          </button>
        </div>

        {pasien && (
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg text-[#1F2937] font-semibold mb-4">Informasi Pasien</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Nama</p>
                <p className="text-[#1F2937] font-medium">{pasien.nama}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Umur</p>
                <p className="text-[#1F2937] font-medium">{pasien.umur} tahun</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Asuransi</p>
                <p className="text-[#1F2937] font-medium">{pasien.asuransi}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Tanggal Kunjungan</p>
                <p className="text-[#1F2937] font-medium">{formatDate(selectedRekam.tanggal_kunjungan)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-[#1F2937] font-semibold mb-2">Keluhan</h4>
              <p className="text-gray-700">{selectedRekam.keluhan}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-[#1F2937] font-semibold mb-2">Hasil Pemeriksaan & Diagnosis</h4>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#1F2937] mb-2">Riwayat Pemeriksaan</h1>
        <p className="text-gray-600">Rekam medis yang pernah Anda buat</p>
      </div>

      {rekamMedisList.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg text-[#1F2937] mb-2">Belum Ada Riwayat</h3>
          <p className="text-gray-600">Belum ada pemeriksaan yang dilakukan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rekamMedisList.map((rekam, index) => {
            const pasien = getPasienById(rekam.pasien_id);
            
            return (
              <div key={rekam.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#34A853]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-[#1F2937] font-semibold mb-1">
                        {pasien?.nama || 'Pasien'}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(rekam.tanggal_kunjungan)}</span>
                        </div>
                        {pasien && (
                          <span>{pasien.umur} tahun</span>
                        )}
                      </div>
                      <p className="text-gray-700">
                        <strong>Keluhan:</strong> {rekam.keluhan.substring(0, 100)}
                        {rekam.keluhan.length > 100 && '...'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRekam(rekam)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#34A853] text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Detail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
