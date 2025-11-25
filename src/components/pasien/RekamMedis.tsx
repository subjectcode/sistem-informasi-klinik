import { useState, useEffect } from 'react';
import { getRekamMedisByPasienId, getDokterById, type RekamMedis as RekamMedisType } from '../../utils/seedData';
import { FileText, User, Calendar, Pill, FileCheck } from 'lucide-react';

interface RekamMedisProps {
  pasienId: number;
}

export function RekamMedis({ pasienId }: RekamMedisProps) {
  const [rekamMedisList, setRekamMedisList] = useState<RekamMedisType[]>([]);

  useEffect(() => {
    loadData();
  }, [pasienId]);

  const loadData = () => {
    const data = getRekamMedisByPasienId(pasienId);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#1F2937] mb-2">Rekam Medis</h1>
        <p className="text-gray-600">Riwayat pemeriksaan dan hasil diagnosis Anda</p>
      </div>

      {/* List */}
      {rekamMedisList.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg text-[#1F2937] mb-2">Belum Ada Rekam Medis</h3>
          <p className="text-gray-600">Rekam medis Anda akan muncul setelah pemeriksaan oleh dokter</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rekamMedisList.map((rekam, index) => {
            const dokter = getDokterById(rekam.dokter_id);
            
            return (
              <div key={rekam.id} className="card hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-7 h-7 text-[#34A853]" />
                    </div>
                    <div>
                      <h3 className="text-xl text-[#1F2937] font-semibold mb-1">
                        Rekam Medis #{rekamMedisList.length - index}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(rekam.tanggal_kunjungan)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{dokter?.nama || 'Dokter'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Keluhan */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="flex items-center gap-2 text-[#1F2937] font-semibold mb-2">
                      <FileCheck className="w-4 h-4" />
                      Keluhan
                    </h4>
                    <p className="text-gray-700">{rekam.keluhan}</p>
                  </div>

                  {/* Hasil Pemeriksaan */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="flex items-center gap-2 text-[#1F2937] font-semibold mb-2">
                      <FileText className="w-4 h-4" />
                      Hasil Pemeriksaan & Diagnosis
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{rekam.hasil_pemeriksaan}</p>
                  </div>

                  {/* Resep Obat */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="flex items-center gap-2 text-[#1F2937] font-semibold mb-2">
                      <Pill className="w-4 h-4" />
                      Resep Obat
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{rekam.resep_obat}</p>
                  </div>

                  {/* Catatan Tambahan */}
                  {rekam.catatan_tambahan && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="flex items-center gap-2 text-[#1F2937] font-semibold mb-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Catatan Tambahan
                      </h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{rekam.catatan_tambahan}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
