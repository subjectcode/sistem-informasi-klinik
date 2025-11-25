import { useState, useEffect } from 'react';
import { getPendaftaran, getPasienById, updatePendaftaran, type Pendaftaran } from '../../utils/seedData';
import { CheckSquare, CheckCircle, XCircle, Calendar, User } from 'lucide-react';

export function VerifikasiPendaftaran() {
  const [pendaftaranList, setPendaftaranList] = useState<Pendaftaran[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const all = getPendaftaran();
    const menunggu = all.filter(p => p.status_pendaftaran === 'Menunggu Verifikasi');
    setPendaftaranList(menunggu);
  };

  const handleVerifikasi = (id: number, status: 'Disetujui' | 'Ditolak') => {
    updatePendaftaran(id, { status_pendaftaran: status });
    loadData();
  };

  const formatDateTime = (dateString: string) => {
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
      <div>
        <h1 className="text-3xl text-[#1F2937] mb-2">Verifikasi Pendaftaran</h1>
        <p className="text-gray-600">Setujui atau tolak pendaftaran pasien</p>
      </div>

      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-yellow-700" />
          </div>
          <div>
            <p className="text-yellow-900 font-semibold">Pendaftaran Menunggu Verifikasi</p>
            <p className="text-yellow-700">{pendaftaranList.length} pendaftaran perlu diproses</p>
          </div>
        </div>
      </div>

      {pendaftaranList.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg text-[#1F2937] mb-2">Semua Pendaftaran Terverifikasi</h3>
          <p className="text-gray-600">Tidak ada pendaftaran yang perlu diverifikasi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendaftaranList.map((pendaftaran) => {
            const pasien = getPasienById(pendaftaran.pasien_id);
            
            return (
              <div key={pendaftaran.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-[#1A73E8]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-[#1F2937] font-semibold mb-1">
                        {pasien?.nama || 'Pasien'}
                      </h3>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Jadwal: {formatDateTime(pendaftaran.jadwal_kunjungan)}</span>
                        </div>
                        <p>Tujuan: {pendaftaran.tujuan_poli}</p>
                        {pasien && (
                          <>
                            <p>Umur: {pasien.umur} tahun | Asuransi: {pasien.asuransi}</p>
                            <p>No. HP: {pasien.no_hp}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerifikasi(pendaftaran.id, 'Disetujui')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#34A853] text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Setujui
                    </button>
                    <button
                      onClick={() => handleVerifikasi(pendaftaran.id, 'Ditolak')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Tolak
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
