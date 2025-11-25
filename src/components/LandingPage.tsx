import { User, Stethoscope, Shield } from 'lucide-react';

interface LandingPageProps {
  onRoleSelect: (role: 'pasien' | 'dokter' | 'admin') => void;
}

export function LandingPage({ onRoleSelect }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-[#E8ECF1] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#1A73E8] rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl text-[#1F2937]">Rumah Sakit Sehat Sentosa</h1>
              <p className="text-gray-600">Sistem Informasi Manajemen Rumah Sakit</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-[#1F2937] mb-4">
            Selamat Datang di Rumah Sakit Sehat Sentosa
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Rumah Sakit yang terpadu untuk kemudahan pelayanan kesehatan Anda
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Pasien */}
          <button
            onClick={() => onRoleSelect('pasien')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-[#1A73E8] transform hover:-translate-y-2"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#1A73E8] transition-colors">
              <User className="w-10 h-10 text-[#1A73E8] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl text-[#1F2937] mb-3">Pasien</h3>
            <p className="text-gray-600 mb-6">
              Daftar berobat, lihat rekam medis, dan kelola pembayaran
            </p>
            <div className="inline-flex items-center text-[#1A73E8] group-hover:gap-2 transition-all">
              <span className="font-medium">Masuk sebagai Pasien</span>
              <svg className="w-5 h-5 ml-2 group-hover:ml-3 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Dokter */}
          <button
            onClick={() => onRoleSelect('dokter')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-[#34A853] transform hover:-translate-y-2"
          >
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#34A853] transition-colors">
              <Stethoscope className="w-10 h-10 text-[#34A853] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl text-[#1F2937] mb-3">Dokter</h3>
            <p className="text-gray-600 mb-6">
              Lihat jadwal pasien, input hasil pemeriksaan dan resep
            </p>
            <div className="inline-flex items-center text-[#34A853] group-hover:gap-2 transition-all">
              <span className="font-medium">Masuk sebagai Dokter</span>
              <svg className="w-5 h-5 ml-2 group-hover:ml-3 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Admin */}
          <button
            onClick={() => onRoleSelect('admin')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-purple-600 transform hover:-translate-y-2"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors">
              <Shield className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl text-[#1F2937] mb-3">Admin</h3>
            <p className="text-gray-600 mb-6">
              Kelola data, verifikasi pendaftaran, dan buat laporan
            </p>
            <div className="inline-flex items-center text-purple-600 group-hover:gap-2 transition-all">
              <span className="font-medium">Masuk sebagai Admin</span>
              <svg className="w-5 h-5 ml-2 group-hover:ml-3 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#1A73E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg text-[#1F2937] mb-2">Pelayanan 24/7</h4>
            <p className="text-gray-600">Akses sistem kapan saja, dimana saja</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#34A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-lg text-[#1F2937] mb-2">Data Aman</h4>
            <p className="text-gray-600">Keamanan data pasien terjamin</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg text-[#1F2937] mb-2">Proses Cepat</h4>
            <p className="text-gray-600">Pendaftaran dan pelayanan yang efisien</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8ECF1] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Rumah Sakit Sehat Sentosa. All rights reserved.</p>
            <p className="mt-2">Sistem Informasi Manajemen Rumah Sakit</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
