import { useState, useEffect } from 'react';
import {
  getDokter,
  addDokter,
  updateDokter,
  deleteDokter,
  type Dokter,
} from '../../utils/seedData';
import { Stethoscope, Plus, Edit, X, Save, Trash2 } from 'lucide-react';

export function KelolaDokter() {
  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Dokter>>({
    nama: '',
    spesialis: '',
    jadwal_praktek: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDokterList(getDokter());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama || !formData.spesialis) return;

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

  const handleDelete = () => {
    if (!editingId) return;

    const ok = window.confirm(
      'Yakin ingin menghapus dokter ini? Data tidak bisa dikembalikan.'
    );
    if (!ok) return;

    deleteDokter(editingId);
    resetForm();
    loadData();
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
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditingId(null);
            setFormData({ nama: '', spesialis: '', jadwal_praktek: '' });
          }}
          className="flex items-center gap-2 btn-primary"
        >
          <Plus className="w-5 h-5" />
          Tambah Dokter
        </button>
      </div>

      {isFormOpen && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-[#1F2937]">
              {editingId ? 'Edit' : 'Tambah'} Dokter
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama Dokter *"
                value={formData.nama ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nama: e.target.value }))
                }
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Spesialis *"
                value={formData.spesialis ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, spesialis: e.target.value }))
                }
                className="input-field"
                required
              />
            </div>

            <input
              type="text"
              placeholder="Jadwal Praktek"
              value={formData.jadwal_praktek ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  jadwal_praktek: e.target.value,
                }))
              }
              className="input-field"
            />

            <div className="flex items-center justify-between pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                             text-red-600 border border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Dokter
                </button>
              )}

              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Batal
                </button>

                <button type="submit" className="btn-success flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dokterList.map((dokter) => (
          <div
            key={dokter.id}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-[#34A853]" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#1F2937]">
                    {dokter.nama}
                  </h3>
                  <p className="text-gray-600">{dokter.spesialis}</p>
                  <p className="text-sm text-gray-500">{dokter.jadwal_praktek}</p>
                </div>
              </div>

              <button
                onClick={() => handleEdit(dokter)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
