import { useState } from 'react';
import { addPendaftaran } from '../../utils/seedData';
import { ClipboardList, Calendar, MapPin, CheckCircle } from 'lucide-react';

interface DaftarBerobatProps {
  pasienId: number;
}

export function DaftarBerobat({ pasienId }: DaftarBerobatProps) {
  const [formData, setFormData] = useState({
    jadwal_kunjungan: '',
    tujuan_poli: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const poliOptions = [
    'Poli Umum',
    'Poli Penyakit Dalam',
    'Poli Anak',
    'Poli Gigi',
    'Poli Mata',
    'Poli THT',
    'Poli Jantung',
    'Poli Bedah'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      addPendaftaran({
        pasien_id: pasienId,
        tanggal_daftar: new Date().toISOString(),
        jadwal_kunjungan: new Date(formData.jadwal_kunjungan).toISOString(),
        tujuan_poli: formData.tujuan_poli,
        status_pendaftaran: 'Menunggu Verifikasi'
      });

      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ jadwal_kunjungan: '', tujuan_poli: '' });

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 500);
  };

  // Get min date (today) and max date (30 days from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#1F2937] mb-2">Daftar Berobat</h1>
        <p className="text-gray-600">Daftarkan diri Anda untuk berobat di RS Sehat Sentosa</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg text-green-900 font-semibold mb-1">Pendaftaran Berhasil!</h3>
              <p className="text-green-700 mb-2">
                Pendaftaran Anda telah diterima dan menunggu verifikasi admin.
              </p>
              <p className="text-green-600">
                Silakan cek status di halaman <strong>Riwayat Berobat</strong> atau <strong>Status Pembayaran</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#1A73E8]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-[#1F2937] font-semibold mb-1">Informasi Pendaftaran</h3>
            <ul className="text-gray-700 space-y-1 list-disc list-inside">
              <li>Pilih poli sesuai keluhan Anda</li>
              <li>Jadwal kunjungan maksimal 30 hari ke depan</li>
              <li>Pendaftaran akan diverifikasi oleh admin</li>
              <li>Setelah disetujui, Anda dapat datang sesuai jadwal</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#1A73E8] rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl text-[#1F2937]">Form Pendaftaran</h3>
            <p className="text-gray-600">Isi data di bawah untuk mendaftar berobat</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tujuan Poli */}
          <div>
            <label htmlFor="tujuan_poli" className="flex items-center gap-2 text-[#1F2937] mb-2 font-medium">
              <MapPin className="w-4 h-4" />
              Tujuan Poli <span className="text-red-500">*</span>
            </label>
            <select
              id="tujuan_poli"
              value={formData.tujuan_poli}
              onChange={(e) => setFormData({ ...formData, tujuan_poli: e.target.value })}
              className="input-field"
              required
            >
              <option value="">-- Pilih Poli --</option>
              {poliOptions.map((poli) => (
                <option key={poli} value={poli}>{poli}</option>
              ))}
            </select>
          </div>

          {/* Jadwal Kunjungan */}
          <div>
            <label htmlFor="jadwal_kunjungan" className="flex items-center gap-2 text-[#1F2937] mb-2 font-medium">
              <Calendar className="w-4 h-4" />
              Jadwal Kunjungan <span className="text-red-500">*</span>
            </label>
            <input
              id="jadwal_kunjungan"
              type="datetime-local"
              value={formData.jadwal_kunjungan}
              onChange={(e) => setFormData({ ...formData, jadwal_kunjungan: e.target.value })}
              min={`${today}T08:00`}
              max={`${maxDateStr}T17:00`}
              className="input-field"
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              Jam operasional: Senin-Jumat 08:00-17:00, Sabtu 08:00-12:00
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
