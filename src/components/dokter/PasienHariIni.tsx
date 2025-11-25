import { useState, useEffect } from 'react';
import { getPendaftaran, getPasienById, updatePendaftaran, addRekamMedis, type Pendaftaran, type Pasien } from '../../utils/seedData';
import { Users, Calendar, User, FileText, Save, CheckCircle, X } from 'lucide-react';

interface PasienHariIniProps {
  dokterId: number;
}

export function PasienHariIni({ dokterId }: PasienHariIniProps) {
  const [pasienHariIni, setPasienHariIni] = useState<Array<{ pendaftaran: Pendaftaran; pasien: Pasien }>>([]);
  const [selectedPasien, setSelectedPasien] = useState<{ pendaftaran: Pendaftaran; pasien: Pasien } | null>(null);
  const [formData, setFormData] = useState({
    keluhan: '',
    hasil_pemeriksaan: '',
    resep_obat: '',
    catatan_tambahan: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allPendaftaran = getPendaftaran();
    const todayPendaftaran = allPendaftaran.filter(p => {
      const jadwal = new Date(p.jadwal_kunjungan);
      return jadwal >= today && jadwal < tomorrow && p.status_pendaftaran === 'Disetujui';
    });

    const pasienData = todayPendaftaran.map(pendaftaran => ({
      pendaftaran,
      pasien: getPasienById(pendaftaran.pasien_id)!
    })).filter(item => item.pasien);

    setPasienHariIni(pasienData);
  };

  const handlePeriksaClick = (item: { pendaftaran: Pendaftaran; pasien: Pasien }) => {
    setSelectedPasien(item);
    setFormData({
      keluhan: item.pasien.keluhan_terakhir || '',
      hasil_pemeriksaan: '',
      resep_obat: '',
      catatan_tambahan: ''
    });
  };

  const handleSave = () => {
    if (!selectedPasien) return;

    setIsSaving(true);

    setTimeout(() => {
      // Add rekam medis
      addRekamMedis({
        pasien_id: selectedPasien.pasien.id,
        dokter_id: dokterId,
        tanggal_kunjungan: new Date().toISOString(),
        keluhan: formData.keluhan,
        hasil_pemeriksaan: formData.hasil_pemeriksaan,
        resep_obat: formData.resep_obat,
        catatan_tambahan: formData.catatan_tambahan
      });

      // Update status pendaftaran
      updatePendaftaran(selectedPasien.pendaftaran.id, {
        status_pendaftaran: 'Selesai Diperiksa'
      });

      setIsSaving(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedPasien(null);
        loadData();
      }, 2000);
    }, 500);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  if (selectedPasien) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-[#1F2937] mb-2">Pemeriksaan Pasien</h1>
            <p className="text-gray-600">Input hasil pemeriksaan dan resep obat</p>
          </div>
          <button
            onClick={() => setSelectedPasien(null)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            <X className="w-4 h-4" />
            Batal
          </button>
        </div>

        {showSuccess && (
          <div className="card bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-700 font-medium">Pemeriksaan berhasil disimpan!</p>
            </div>
          </div>
        )}

        {/* Patient Info */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg text-[#1F2937] font-semibold mb-4">Informasi Pasien</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Nama Lengkap</p>
              <p className="text-[#1F2937] font-medium">{selectedPasien.pasien.nama}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Umur</p>
              <p className="text-[#1F2937] font-medium">{selectedPasien.pasien.umur} tahun</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Asuransi</p>
              <p className="text-[#1F2937] font-medium">{selectedPasien.pasien.asuransi}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <h3 className="text-lg text-[#1F2937] font-semibold mb-4">Form Pemeriksaan</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[#1F2937] mb-2 font-medium">
                Keluhan Pasien <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.keluhan}
                onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Deskripsikan keluhan pasien..."
                required
              />
            </div>

            <div>
              <label className="block text-[#1F2937] mb-2 font-medium">
                Hasil Pemeriksaan & Diagnosis <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.hasil_pemeriksaan}
                onChange={(e) => setFormData({ ...formData, hasil_pemeriksaan: e.target.value })}
                className="input-field"
                rows={4}
                placeholder="Hasil pemeriksaan fisik, diagnosis, dan interpretasi..."
                required
              />
            </div>

            <div>
              <label className="block text-[#1F2937] mb-2 font-medium">
                Resep Obat <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.resep_obat}
                onChange={(e) => setFormData({ ...formData, resep_obat: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Contoh: Paracetamol 500mg 3x1, Amoxicillin 500mg 3x1"
                required
              />
            </div>

            <div>
              <label className="block text-[#1F2937] mb-2 font-medium">
                Catatan Tambahan
              </label>
              <textarea
                value={formData.catatan_tambahan}
                onChange={(e) => setFormData({ ...formData, catatan_tambahan: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Saran, anjuran kontrol, dll..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving || !formData.keluhan || !formData.hasil_pemeriksaan || !formData.resep_obat}
                className="flex items-center gap-2 btn-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#1F2937] mb-2">Pasien Hari Ini</h1>
        <p className="text-gray-600">Daftar pasien yang terjadwal untuk hari ini</p>
      </div>

      {/* Count */}
      <div className="card bg-gradient-to-br from-green-50 to-green-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#34A853] rounded-xl flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-gray-600 mb-1">Total Pasien Hari Ini</p>
            <p className="text-3xl text-[#1F2937] font-bold">{pasienHariIni.length}</p>
          </div>
        </div>
      </div>

      {/* List */}
      {pasienHariIni.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg text-[#1F2937] mb-2">Tidak Ada Pasien Hari Ini</h3>
          <p className="text-gray-600">Belum ada pasien yang terjadwal untuk hari ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pasienHariIni.map((item, index) => (
            <div key={item.pendaftaran.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-[#34A853]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-[#1F2937] font-semibold mb-1">
                      {item.pasien.nama}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatTime(item.pendaftaran.jadwal_kunjungan)}</span>
                      </div>
                      <div>
                        <span>Umur: {item.pasien.umur} tahun</span>
                      </div>
                      <div>
                        <span>Poli: {item.pendaftaran.tujuan_poli}</span>
                      </div>
                    </div>
                    {item.pasien.keluhan_terakhir && (
                      <p className="text-gray-600 mt-2">
                        <strong>Keluhan:</strong> {item.pasien.keluhan_terakhir}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handlePeriksaClick(item)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#34A853] text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Periksa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
