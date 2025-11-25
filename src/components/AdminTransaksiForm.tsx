import { useState, useEffect } from 'react';
import { getPasien, addTransaksi, type Pasien } from '../utils/dataInitializer';
import { Save, CheckCircle } from 'lucide-react';

interface AdminTransaksiFormProps {
  onSuccess: () => void;
}

export function AdminTransaksiForm({ onSuccess }: AdminTransaksiFormProps) {
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [formData, setFormData] = useState({
    pasien_id: '',
    obat: '',
    harga: '',
    status_pembayaran: 'Belum Lunas',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const data = getPasien();
    setPasienList(data);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      
      addTransaksi({
        pasien_id: parseInt(formData.pasien_id),
        obat: formData.obat,
        harga: parseInt(formData.harga),
        status_pembayaran: formData.status_pembayaran as 'Lunas' | 'Belum Lunas',
        tanggal: today,
      });

      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form
      setFormData({
        pasien_id: '',
        obat: '',
        harga: '',
        status_pembayaran: 'Belum Lunas',
      });

      // Hide success message and redirect after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 2000);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Tambah Transaksi</h2>
        <p className="text-gray-600">Input data pembayaran obat pasien</p>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-900">Transaksi berhasil ditambahkan!</p>
              <p className="text-green-700">Mengalihkan ke daftar transaksi...</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pilih Pasien */}
          <div>
            <label htmlFor="pasien_id" className="block text-gray-700 mb-2">
              Pilih Pasien <span className="text-red-500">*</span>
            </label>
            <select
              id="pasien_id"
              name="pasien_id"
              value={formData.pasien_id}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">-- Pilih Pasien --</option>
              {pasienList.map(pasien => (
                <option key={pasien.id} value={pasien.id}>
                  {pasien.nama} ({pasien.umur} tahun)
                </option>
              ))}
            </select>
          </div>

          {/* Nama Obat */}
          <div>
            <label htmlFor="obat" className="block text-gray-700 mb-2">
              Nama Obat <span className="text-red-500">*</span>
            </label>
            <input
              id="obat"
              name="obat"
              type="text"
              value={formData.obat}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Contoh: Paracetamol 500mg"
            />
          </div>

          {/* Harga */}
          <div>
            <label htmlFor="harga" className="block text-gray-700 mb-2">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              id="harga"
              name="harga"
              type="number"
              value={formData.harga}
              onChange={handleChange}
              required
              min="0"
              step="1000"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Contoh: 50000"
            />
          </div>

          {/* Status Pembayaran */}
          <div>
            <label htmlFor="status_pembayaran" className="block text-gray-700 mb-2">
              Status Pembayaran <span className="text-red-500">*</span>
            </label>
            <select
              id="status_pembayaran"
              name="status_pembayaran"
              value={formData.status_pembayaran}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-gray-700">
          💡 <strong>Tips:</strong> Pastikan data yang diinput sudah benar sebelum menyimpan. Data transaksi akan langsung masuk ke sistem.
        </p>
      </div>
    </div>
  );
}
