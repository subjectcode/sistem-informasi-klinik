import { useState, useEffect } from 'react';
import { getTransaksi, getPasien, addTransaksi, updateTransaksi, addDetailObat, type Transaksi } from '../../utils/seedData';
import { CreditCard, Plus, Edit2 } from 'lucide-react';

export function KelolaTransaksi() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    pasien_id: '',
    total_biaya: '',
    metode_pembayaran: 'Cash' as 'Cash' | 'QRIS' | 'Transfer',
    status_pembayaran: 'Siap Dibayar' as 'Siap Dibayar' | 'Menunggu Verifikasi' | 'Lunas'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getTransaksi();
    setTransaksiList(data.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaksi({
      pasien_id: parseInt(formData.pasien_id),
      total_biaya: parseInt(formData.total_biaya),
      metode_pembayaran: formData.metode_pembayaran,
      status_pembayaran: formData.status_pembayaran,
      tanggal: new Date().toISOString()
    });
    setIsFormOpen(false);
    setFormData({ pasien_id: '', total_biaya: '', metode_pembayaran: 'Cash', status_pembayaran: 'Siap Dibayar' });
    loadData();
  };

  const handleUpdateStatus = (id: number, status: 'Siap Dibayar' | 'Menunggu Verifikasi' | 'Lunas') => {
    updateTransaksi(id, { status_pembayaran: status });
    loadData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  const pasienList = getPasien();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#1F2937] mb-2">Kelola Transaksi</h1>
          <p className="text-gray-600">Manajemen transaksi pembayaran pasien</p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2 btn-primary">
          <Plus className="w-5 h-5" />
          Tambah Transaksi
        </button>
      </div>

      {isFormOpen && (
        <div className="card">
          <h3 className="text-xl text-[#1F2937] mb-4">Tambah Transaksi Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.pasien_id}
                onChange={(e) => setFormData({ ...formData, pasien_id: e.target.value })}
                className="input-field"
                required
              >
                <option value="">-- Pilih Pasien --</option>
                {pasienList.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Total Biaya (Rp) *"
                value={formData.total_biaya}
                onChange={(e) => setFormData({ ...formData, total_biaya: e.target.value })}
                className="input-field"
                required
              />
              <select
                value={formData.metode_pembayaran}
                onChange={(e) => setFormData({ ...formData, metode_pembayaran: e.target.value as any })}
                className="input-field"
              >
                <option value="Cash">Cash</option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer">Transfer</option>
              </select>
              <select
                value={formData.status_pembayaran}
                onChange={(e) => setFormData({ ...formData, status_pembayaran: e.target.value as any })}
                className="input-field"
              >
                <option value="Siap Dibayar">Siap Dibayar</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Lunas">Lunas</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">Batal</button>
              <button type="submit" className="btn-success">Simpan</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-[#1F2937]">ID</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Tanggal</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Pasien</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Total Biaya</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Metode</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Status</th>
              <th className="px-6 py-3 text-left text-[#1F2937]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transaksiList.map((transaksi) => {
              const pasien = pasienList.find(p => p.id === transaksi.pasien_id);
              
              return (
                <tr key={transaksi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-[#1F2937]">#{transaksi.id}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(transaksi.tanggal)}</td>
                  <td className="px-6 py-4 text-[#1F2937]">{pasien?.nama}</td>
                  <td className="px-6 py-4 text-[#1F2937] font-medium">{formatCurrency(transaksi.total_biaya)}</td>
                  <td className="px-6 py-4 text-gray-600">{transaksi.metode_pembayaran}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-sm ${
                      transaksi.status_pembayaran === 'Lunas' ? 'badge-success' :
                      transaksi.status_pembayaran === 'Menunggu Verifikasi' ? 'badge-waiting' :
                      'badge-process'
                    }`}>
                      {transaksi.status_pembayaran}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {transaksi.status_pembayaran !== 'Lunas' && (
                      <button
                        onClick={() => handleUpdateStatus(transaksi.id, 'Lunas')}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Tandai Lunas
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
