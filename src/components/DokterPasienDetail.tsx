import { useState, useEffect } from 'react';
import { getPasienById, updatePasien, type Pasien } from '../utils/dataInitializer';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

interface DokterPasienDetailProps {
  pasienId: number;
  onBack: () => void;
}

export function DokterPasienDetail({ pasienId, onBack }: DokterPasienDetailProps) {
  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [catatanDokter, setCatatanDokter] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadPasien();
  }, [pasienId]);

  const loadPasien = () => {
    const data = getPasienById(pasienId);
    if (data) {
      setPasien(data);
      setCatatanDokter(data.catatan_dokter || '');
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      updatePasien(pasienId, { catatan_dokter: catatanDokter });
      setIsSaving(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      // Reload pasien data
      loadPasien();
    }, 500);
  };

  if (!pasien) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Data pasien tidak ditemukan</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Kembali ke daftar pasien
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <h2 className="text-gray-900">Detail Pasien</h2>
        </div>
        
        {showSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700">Catatan berhasil disimpan</span>
          </div>
        )}
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4">Informasi Pasien</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 mb-1">Nama Lengkap</label>
            <p className="text-gray-900">{pasien.nama}</p>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Umur</label>
            <p className="text-gray-900">{pasien.umur} tahun</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-600 mb-1">Keluhan</label>
            <p className="text-gray-900">{pasien.keluhan}</p>
          </div>
        </div>
      </div>

      {/* Medical Notes Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-4">Catatan Dokter</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="catatan" className="block text-gray-700 mb-2">
              Diagnosis dan Tindakan
            </label>
            <textarea
              id="catatan"
              value={catatanDokter}
              onChange={(e) => setCatatanDokter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={8}
              placeholder="Masukkan diagnosis, resep obat, dan saran untuk pasien..."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Menyimpan...' : 'Simpan Catatan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
