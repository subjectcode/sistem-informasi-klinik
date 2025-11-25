import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { KelolaPasien } from './KelolaPasien';
import { KelolaDokter } from './KelolaDokter';
import { VerifikasiPendaftaran } from './VerifikasiPendaftaran';
import { DataPemeriksaan } from './DataPemeriksaan';
import { KelolaTransaksi } from './KelolaTransaksi';
import { Laporan } from './Laporan';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export type AdminView = 'pasien' | 'dokter' | 'verifikasi' | 'pemeriksaan' | 'transaksi' | 'laporan';

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('verifikasi');

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      <AdminSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {currentView === 'pasien' && <KelolaPasien />}
          {currentView === 'dokter' && <KelolaDokter />}
          {currentView === 'verifikasi' && <VerifikasiPendaftaran />}
          {currentView === 'pemeriksaan' && <DataPemeriksaan />}
          {currentView === 'transaksi' && <KelolaTransaksi />}
          {currentView === 'laporan' && <Laporan />}
        </div>
      </div>
    </div>
  );
}
