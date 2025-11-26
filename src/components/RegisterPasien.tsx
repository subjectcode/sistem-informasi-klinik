import { useState } from 'react';
import { addPasien } from '../utils/seedData';
import {
  ArrowLeft,
  UserCircle2,
  Phone,
  MapPin,
  Shield,
  BadgeInfo,
  Lock,
  User as UserIcon,
} from 'lucide-react';

interface RegisterPasienProps {
  onBack: () => void;
  onSuccess: () => void; // dipanggil kalau sudah berhasil daftar -> balik ke login pasien
}

export function RegisterPasien({ onBack, onSuccess }: RegisterPasienProps) {
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [umur, setUmur] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [asuransi, setAsuransi] = useState<'BPJS' | 'Private' | 'Umum'>('Umum');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        // 1. Cek username sudah dipakai atau belum
        const rawUsers = localStorage.getItem('rs_users') || '[]';
        const users = JSON.parse(rawUsers) as any[];

        const usernameExists = users.some(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        );

        if (usernameExists) {
          setError('Username sudah digunakan, silakan pilih username lain.');
          setIsSubmitting(false);
          return;
        }

        // 2. Tambah data pasien ke rs_pasien
        const newPasien = addPasien({
          nama,
          nik,
          umur: Number(umur),
          alamat,
          no_hp: noHp,
          asuransi,
          keluhan_terakhir: '-',
        });

        // 3. Tambah akun login pasien ke rs_users
        const newUserId =
          users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

        const newUser = {
          id: newUserId,
          username,
          password,
          role: 'pasien' as const,
          pasien_id: newPasien.id,
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('rs_users', JSON.stringify(updatedUsers));

        // 4. Beres: arahkan kembali ke login pasien
        setIsSubmitting(false);
        onSuccess();
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan saat mendaftar. Coba lagi nanti.');
        setIsSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E8ECF1]">
          {/* Tombol Kembali */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Login</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1A73E8] rounded-2xl mb-4">
              <UserCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-[#1F2937] mb-2">
              Daftar Pasien Baru
            </h1>
            <p className="text-gray-600">
              Buat akun untuk mengakses portal pasien RS Sehat Sentosa
            </p>
          </div>

          {/* FORM DAFTAR */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Pribadi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-[#1F2937] mb-2 font-medium">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <UserIcon className="h-5 w-5 text-gray-400" /> */}
                  </div>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="input-field pl-14 pr-3 w-full placeholder:text-gray-400 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
              </div>

              {/* NIK */}
              <div>
                <label className="block text-[#1F2937] mb-2 font-medium">
                  NIK
                </label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="input-field w-full placeholder:text-gray-400 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan NIK"
                  required
                />
              </div>
            </div>

            {/* Umur & No HP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Umur */}
              <div>
                <label className="block text-[#1F2937] mb-2 font-medium">
                  Umur
                </label>
                <input
                  type="number"
                  min={0}
                  value={umur}
                  onChange={(e) => setUmur(e.target.value)}
                  className="input-field w-full placeholder:text-gray-400 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Umur"
                  required
                />
              </div>

              {/* No HP */}
              <div>
                <label className="block text-[#1F2937] mb-2 font-medium">
                  No. HP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <Phone className="h-5 w-5 text-gray-400" /> */}
                  </div>
                  <input
                    type="tel"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    className="input-field pl-14 pr-3 w-full placeholder:text-gray-400 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: 081234567890"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-[#1F2937] mb-2 font-medium">
                Alamat
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-2 pointer-events-none">
                  {/* <MapPin className="h-5 w-5 text-gray-400" /> */}
                </div>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="input-field pl-14 pr-3 w-full placeholder:text-gray-400 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  placeholder="Tuliskan alamat lengkap"
                  required
                />
              </div>
            </div>

            {/* Asuransi */}
            <div>
              <label className="block text-[#1F2937] mb-2 font-medium">
                Jenis Asuransi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* <Shield className="h-5 w-5 text-gray-400" /> */}
                </div>
                <select
                  value={asuransi}
                  onChange={(e) =>
                    setAsuransi(e.target.value as 'BPJS' | 'Private' | 'Umum')
                  }
                  className="input-field pl-14 pr-3 w-full border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BPJS">BPJS</option>
                  <option value="Private">Asuransi Private</option>
                  <option value="Umum">Umum (Tunai)</option>
                </select>
              </div>
            </div>

            {/* Akun Login */}
            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="flex items-center gap-2 mb-4">
                <BadgeInfo className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-gray-600">
                  Data di bawah ini akan digunakan untuk login ke portal pasien.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block text-[#1F2937] mb-2 font-medium">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <UserIcon className="h-5 w-5 text-gray-400" /> */}
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field pl-14 pr-3 w-full placeholder:text-gray-400 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Pilih username"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[#1F2937] mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <Lock className="h-5 w-5 text-gray-400" /> */}
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-14 pr-3 w-full placeholder:text-gray-400 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Minimal 3 karakter"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <BadgeInfo className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Tombol Submit */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-2 py-3 rounded-lg bg-[#1A73E8] text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
