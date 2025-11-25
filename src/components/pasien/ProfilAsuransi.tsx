import { useState, useEffect } from 'react';
import { getPasienById, updatePasien, type Pasien } from '../../utils/seedData';
import { User, Phone, MapPin, IdCard, Calendar, Shield, Save, CheckCircle } from 'lucide-react';

interface ProfilAsuransiProps {
  user: any;
}

export function ProfilAsuransi({ user }: ProfilAsuransiProps) {
  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Pasien>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [user.pasien_id]);

  const loadData = () => {
    const data = getPasienById(user.pasien_id);
    if (data) {
      setPasien(data);
      setFormData(data);
    }
  };

  const handleSave = () => {
    if (pasien) {
      updatePasien(pasien.id, formData);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        loadData();
      }, 2000);
    }
  };

  if (!pasien) {
    return <div className="text-center py-8 text-gray-600">Data tidak ditemukan</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#1F2937] mb-2">Profil & Asuransi</h1>
          <p className="text-gray-600">Kelola informasi pribadi dan data asuransi Anda</p>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">Data berhasil diperbarui</span>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-[#1F2937]">Informasi Pribadi</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(pasien);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#34A853] text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Simpan
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 mb-2">
              <User className="w-4 h-4" />
              Nama Lengkap
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-[#1F2937] text-lg">{pasien.nama}</p>
            )}
          </div>

          {/* NIK */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 mb-2">
              <IdCard className="w-4 h-4" />
              NIK
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.nik || ''}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-[#1F2937] text-lg">{pasien.nik}</p>
            )}
          </div>

          {/* Umur */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              Umur
            </label>
            {isEditing ? (
              <input
                type="number"
                value={formData.umur || 0}
                onChange={(e) => setFormData({ ...formData, umur: parseInt(e.target.value) })}
                className="input-field"
              />
            ) : (
              <p className="text-[#1F2937] text-lg">{pasien.umur} tahun</p>
            )}
          </div>

          {/* No HP */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 mb-2">
              <Phone className="w-4 h-4" />
              No. Telepon
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.no_hp || ''}
                onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-[#1F2937] text-lg">{pasien.no_hp}</p>
            )}
          </div>

          {/* Alamat */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              Alamat
            </label>
            {isEditing ? (
              <textarea
                value={formData.alamat || ''}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="input-field"
                rows={2}
              />
            ) : (
              <p className="text-[#1F2937] text-lg">{pasien.alamat}</p>
            )}
          </div>
        </div>
      </div>

      {/* Insurance Card */}
      <div className="card bg-gradient-to-br from-blue-50 to-green-50 border-2">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-[#1A73E8] rounded-xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl text-[#1F2937] mb-1">Informasi Asuransi</h3>
            <p className="text-gray-600">Jenis penjaminan kesehatan Anda</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <label className="block text-gray-600 mb-2">Jenis Asuransi</label>
          {isEditing ? (
            <select
              value={formData.asuransi || 'Umum'}
              onChange={(e) => setFormData({ ...formData, asuransi: e.target.value as any })}
              className="input-field"
            >
              <option value="BPJS">BPJS Kesehatan</option>
              <option value="Private">Asuransi Swasta</option>
              <option value="Umum">Umum (Tanpa Asuransi)</option>
            </select>
          ) : (
            <div className="flex items-center gap-3">
              <span className={`inline-flex px-4 py-2 rounded-lg text-lg font-medium ${
                pasien.asuransi === 'BPJS' ? 'bg-green-100 text-green-700' :
                pasien.asuransi === 'Private' ? 'bg-purple-100 text-purple-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {pasien.asuransi === 'BPJS' ? 'BPJS Kesehatan' :
                 pasien.asuransi === 'Private' ? 'Asuransi Swasta' :
                 'Umum (Tanpa Asuransi)'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
