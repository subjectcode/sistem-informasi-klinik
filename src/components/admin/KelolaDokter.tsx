import { useState, useEffect } from 'react';
import { getDokter, addDokter, updateDokter, type Dokter } from '../../utils/seedData';
import { Stethoscope, Plus, Edit, X, Save } from 'lucide-react';

export function KelolaDokter() {
  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Dokter>>({
    nama: '',
    spesialis: '',
    jadwal_praktek: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDokterList(getDokter());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateDokter(editingId, formData);
    } else {
      addDokter(formData as Omit<Dokter, 'id'>);
    }
    resetForm();
    loadData();
  };

  const handleEdit = (dokter: Dokter) => {
    setFormData(dokter);
    setEditingId(dokter.id);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({ nama: '', spesialis: '', jadwal_praktek: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#1F2937] mb-2">Kelola Data Dokter</h1>
          <p className="text-gray-600">Manajemen data dokter rumah sakit</p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 btn-primary">
          <Plus className="w-5 h-5" />
          Tambah Dokter
        </button>
      </div>

      {isFormOpen && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-[#1F2937]">{editingId ? 'Edit' : 'Tambah'} Dokter</h3>
            <button onClick={resetForm} className="text-gray-600 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama Dokter (contoh: dr. Ahmad) *"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Spesialis (contoh: Umum, Penyakit Dalam) *"
                value={formData.spesialis}
                onChange={(e) => setFormData({ ...formData, spesialis: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Jadwal Praktek (contoh: Senin-Jumat 08:00-15:00)"
              value={formData.jadwal_praktek}
              onChange={(e) => setFormData({ ...formData, jadwal_praktek: e.target.value })}
              className="input-field"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="btn-secondary">Batal</button>
              <button type="submit" className="flex items-center gap-2 btn-success">
                <Save className="w-4 h-4" />
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dokterList.map((dokter) => (
          <div key={dokter.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-[#34A853]" />
                </div>
                <div>
                  <h3 className="text-lg text-[#1F2937] font-semibold mb-1">{dokter.nama}</h3>
                  <p className="text-gray-600 mb-2">{dokter.spesialis}</p>
                  <p className="text-sm text-gray-500">{dokter.jadwal_praktek}</p>
                </div>
              </div>
              <button onClick={() => handleEdit(dokter)} className="text-blue-600 hover:text-blue-800">
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
