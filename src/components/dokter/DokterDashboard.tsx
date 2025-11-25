import { useState } from 'react';
import { DokterSidebar } from './DokterSidebar';
import { PasienHariIni } from './PasienHariIni';
import { RiwayatPemeriksaan } from './RiwayatPemeriksaan';

interface DokterDashboardProps {
  user: any;
  onLogout: () => void;
}

export type DokterView = 'pasien-hari-ini' | 'riwayat';

export function DokterDashboard({ user, onLogout }: DokterDashboardProps) {
  const [currentView, setCurrentView] = useState<DokterView>('pasien-hari-ini');

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      <DokterSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={onLogout}
        user={user}
      />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {currentView === 'pasien-hari-ini' && <PasienHariIni dokterId={user.dokter_id} />}
          {currentView === 'riwayat' && <RiwayatPemeriksaan dokterId={user.dokter_id} />}
        </div>
      </div>
    </div>
  );
}
