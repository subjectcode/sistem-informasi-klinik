import { useState, useEffect } from 'react';
import { getPasien, addPasien, updatePasien, deletePasien, type Pasien } from '../../utils/seedData';
import { Users, Plus, Edit, Trash2, X, Save } from 'lucide-react';

export function KelolaPasien() {
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Pasien>>({
    nama: '',
    nik: '',
    umur: 0,
    alamat: '',
    no_hp: '',
    asuransi: 'Umum',
    keluhan_terakhir: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPasienList(getPasien());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePasien(editingId, formData);
    } else {
      addPasien(formData as Omit<Pasien, 'id'>);
    }
    resetForm();
    loadData();
  };

  const handleEdit = (pasien: Pasien) => {
    setFormData(pasien);
    setEditingId(pasien.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus data pasien ini?')) {
      deletePasien(id);
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({ nama: '', nik: '', umur: 0, alamat: '', no_hp: '', asuransi: 'Umum', keluhan_terakhir: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#1F2937] mb-2">Kelola Data Pasien</h1>
          <p className="text-gray-600">Manajemen data pasien rumah sakit</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 btn-primary"
        >
          <Plus className="w-5 h-5" />
          Tambah Pasien
        </button>
      </div>

      {isFormOpen && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-[#1F2937]">{editingId ? 'Edit' : 'Tambah'} Pasien</h3>
            <button onClick={resetForm} className="text-gray-600 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama Lengkap *"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="NIK *"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="Umur *"
                value={formData.umur}
                onChange={(e) => setFormData({ ...formData, umur: parseInt(e.target.value) })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="No. HP *"
                value={formData.no_hp}
                onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                className="input-field"
                required
              />
              <select
                value={formData.asuransi}
                onChange={(e) => setFormData({ ...formData, asuransi: e.target.value as any })}
                className="input-field"
              >
                <option value="BPJS">BPJS</option>
                <option value="Private">Private</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
            <textarea
              placeholder="Alamat *"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="input-field"
              rows={2}
              required
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

      <div className="table-container">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-[#1F2937]">Nama</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">NIK</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Umur</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">No. HP</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Asuransi</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pasienList.map((pasien) => (
              <tr key={pasien.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-[#1F2937]">{pasien.nama}</td>
                <td className="px-6 py-4 text-gray-600">{pasien.nik}</td>
                <td className="px-6 py-4 text-gray-600">{pasien.umur} th</td>
                <td className="px-6 py-4 text-gray-600">{pasien.no_hp}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-sm ${
                    pasien.asuransi === 'BPJS' ? 'bg-green-100 text-green-700' :
                    pasien.asuransi === 'Private' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {pasien.asuransi}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(pasien)} className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(pasien.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
