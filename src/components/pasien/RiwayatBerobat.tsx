import { useState, useEffect } from 'react';
import { getPendaftaranByPasienId, getDokter, type Pendaftaran } from '../../utils/seedData';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface RiwayatBerobatProps {
  pasienId: number;
}

export function RiwayatBerobat({ pasienId }: RiwayatBerobatProps) {
  const [pendaftaranList, setPendaftaranList] = useState<Pendaftaran[]>([]);

  useEffect(() => {
    loadData();
  }, [pasienId]);

  const loadData = () => {
    const data = getPendaftaranByPasienId(pasienId);
    setPendaftaranList(data.sort((a, b) => 
      new Date(b.tanggal_daftar).getTime() - new Date(a.tanggal_daftar).getTime()
    ));
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      'Menunggu Verifikasi': 'badge-waiting',
      'Disetujui': 'badge-success',
      'Ditolak': 'badge-danger',
      'Selesai Diperiksa': 'badge-success'
    };
    return classes[status as keyof typeof classes] || 'badge-waiting';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#1F2937] mb-2">Riwayat Berobat</h1>
        <p className="text-gray-600">Riwayat pendaftaran dan kunjungan Anda</p>
      </div>

      {/* List */}
      {pendaftaranList.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg text-[#1F2937] mb-2">Belum Ada Riwayat</h3>
          <p className="text-gray-600">Anda belum pernah melakukan pendaftaran berobat</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendaftaranList.map((pendaftaran) => {
            const jadwal = formatDateTime(pendaftaran.jadwal_kunjungan);
            const daftar = formatDateTime(pendaftaran.tanggal_daftar);
            
            return (
              <div key={pendaftaran.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#1A73E8]" />
                    </div>
                    <div>
                      <h3 className="text-lg text-[#1F2937] font-semibold">{pendaftaran.tujuan_poli}</h3>
                      <p className="text-gray-600">ID Pendaftaran: #{pendaftaran.id}</p>
                    </div>
                  </div>
                  <span className={getStatusBadge(pendaftaran.status_pendaftaran)}>
                    {pendaftaran.status_pendaftaran}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Daftar</p>
                      <p className="text-[#1F2937] font-medium">{daftar.date}</p>
                      <p className="text-gray-600">{daftar.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Jadwal Kunjungan</p>
                      <p className="text-[#1F2937] font-medium">{jadwal.date}</p>
                      <p className="text-gray-600">{jadwal.time}</p>
                    </div>
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
