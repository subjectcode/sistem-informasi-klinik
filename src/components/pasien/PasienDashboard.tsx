import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ProfilAsuransi } from './ProfilAsuransi';
import { RiwayatBerobat } from './RiwayatBerobat';
import { DaftarBerobat } from './DaftarBerobat';
import { RekamMedis } from './RekamMedis';
import { StatusPembayaran } from './StatusPembayaran';

interface PasienDashboardProps {
  user: any;
  onLogout: () => void;
}

export type PasienView = 'profil' | 'riwayat' | 'daftar' | 'rekam-medis' | 'pembayaran';

export function PasienDashboard({ user, onLogout }: PasienDashboardProps) {
  const [currentView, setCurrentView] = useState<PasienView>('profil');

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {currentView === 'profil' && <ProfilAsuransi user={user} />}
          {currentView === 'riwayat' && <RiwayatBerobat pasienId={user.pasien_id} />}
          {currentView === 'daftar' && <DaftarBerobat pasienId={user.pasien_id} />}
          {currentView === 'rekam-medis' && <RekamMedis pasienId={user.pasien_id} />}
          {currentView === 'pembayaran' && <StatusPembayaran pasienId={user.pasien_id} />}
        </div>
      </div>
    </div>
  );
}
