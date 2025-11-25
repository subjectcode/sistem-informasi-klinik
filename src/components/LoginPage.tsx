import { useState } from 'react';
import {
  authenticateUser
} from '../utils/seedData';
import {
  Lock,
  User,
  AlertCircle,
  ArrowLeft,
  UserCircle2,
  Stethoscope,
  Shield
} from 'lucide-react';

interface LoginPageProps {
  role: 'pasien' | 'dokter' | 'admin';
  onLogin: (user: any) => void;
  onBack: () => void;
}

export function LoginPage({ role, onLogin, onBack }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleConfig: Record<
    LoginPageProps['role'],
    {
      title: string;
      color: string;
      hoverColor: string;
      Icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    pasien: {
      title: 'Login Pasien',
      color: 'bg-[#1A73E8]',
      hoverColor: 'hover:bg-blue-700',
      Icon: UserCircle2,
    },
    dokter: {
      title: 'Login Dokter',
      color: 'bg-[#34A853]',
      hoverColor: 'hover:bg-green-700',
      Icon: Stethoscope,
    },
    admin: {
      title: 'Login Admin',
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      Icon: Shield,
    },
  };

  const config = roleConfig[role];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const user = authenticateUser(username, password);

      if (user && user.role === role) {
        onLogin(user);
      } else if (user && user.role !== role) {
        setError(
          `Akun ini bukan akun ${role}. Silakan login di halaman yang sesuai.`
        );
      } else {
        setError('Username atau password salah');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E8ECF1]">
        {/* Tombol Kembali tetap di luar kotak putih */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        {/* PERUBAHAN 1: Header dipindahkan ke dalam container bg-white di bawah ini */}
        
        {/* Container Utama (Kotak Putih) */}
          
          {/* Header (Dipindah ke Sini) */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 ${config.color} rounded-2xl mb-4`}
            >
              <config.Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-[#1F2937] mb-2">
              {config.title}
            </h1>
            <p className="text-gray-600">RS Sehat Sentosa</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-[#1F2937] mb-2 font-medium"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  // PERUBAHAN 2: pl-12 diganti jadi pl-14 agar teks geser ke kanan
                  className="input-field pl-14 pr-3 w-full placeholder:text-gray-400 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[#1F2937] mb-2 font-medium"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // PERUBAHAN 2: pl-12 diganti jadi pl-14
                  className="input-field pl-14 pr-3 w-full placeholder:text-gray-400 border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${config.color} text-white py-3 rounded-xl ${config.hoverColor} transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}