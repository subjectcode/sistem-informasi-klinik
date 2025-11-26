import { useState, useEffect } from 'react';
import {
  getDokter,
  addDokter,
  updateDokter,
  deleteDokter,
  type Dokter,
  createDokterUser,
} from '../../utils/seedData';
import { Stethoscope, Plus, Edit, X, Save, Trash2 } from 'lucide-react';

export function KelolaDokter() {
  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Dokter>>({
    nama: '',
    spesialis: '',
    jadwal_praktek: ''
  });

  // field untuk akun login dokter (hanya dipakai saat tambah)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('123');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDokterList(getDokter());
  };

  const resetForm = () => {
    setFormData({ nama: '', spesialis: '', jadwal_praktek: '' });
    setEditingId(null);
    setLoginUsername('');
    setLoginPassword('123');
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // EDIT dokter (hanya update data dokter, akun login dibiarkan)
      updateDokter(editingId, formData);
    } else {
      // TAMBAH dokter baru
      const newDokter = addDokter(formData as Omit<Dokter, 'id'>);

      // kalau admin isi username → buat akun login dokter
      if (loginUsername.trim() !== '') {
        const password = loginPassword.trim() === '' ? '123' : loginPassword.trim();
        createDokterUser(newDokter.id, loginUsername.trim(), password);
        // opsional: alert kecil di real app / pakai toast
        console.log(
          `Akun dokter dibuat: username=${loginUsername.trim()} password=${password}`
        );
      }
    }

    resetForm();
    loadData();
  };

  const handleEdit = (dokter: Dokter) => {
    setFormData(dokter);
    setEditingId(dokter.id);
    // saat edit, kita tidak otak-atik akun login dokter
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus dokter ini beserta akun loginnya?')) {
      deleteDokter(id); // otomatis juga hapus akun user dokter (lihat seedData)
      resetForm();
      loadData();
    }
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
            resetForm();
            setIsFormOpen(true);
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
              {editingId ? 'Edit Dokter' : 'Tambah Dokter'}
            </h3>
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

            {/* Bagian akun login dokter — hanya muncul saat TAMBAH dokter */}
            {!editingId && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600 font-medium">
                  Akun Login Dokter (opsional)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Username login dokter (contoh: drnadia)"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="Password default (contoh: 123)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="input-field"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Jika dikosongkan, sistem hanya menambahkan data dokter tanpa membuat akun login.
                </p>
              </div>
            )}

            {/* Area tombol */}
            <div className="flex items-center justify-between mt-4">
              {/* Hapus dokter hanya saat sedang edit */}
              {editingId && (
                <button
                  type="button"
                  onClick={() => handleDelete(editingId)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
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
                <button
                  type="submit"
                  className="flex items-center gap-2 btn-success"
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* LIST DOKTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dokterList.map((dokter) => (
          <div key={dokter.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-[#34A853]" />
                </div>
                <div>
                  <h3 className="text-lg text-[#1F2937] font-semibold mb-1">
                    {dokter.nama}
                  </h3>
                  <p className="text-gray-600 mb-2">{dokter.spesialis}</p>
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
