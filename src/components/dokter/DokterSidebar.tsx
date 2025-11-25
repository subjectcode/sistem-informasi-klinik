import { Users, History, LogOut } from 'lucide-react';
import { getDokterById } from '../../utils/seedData';
import type { DokterView } from './DokterDashboard';

interface DokterSidebarProps {
  currentView: DokterView;
  onViewChange: (view: DokterView) => void;
  onLogout: () => void;
  user: any;
}

export function DokterSidebar({ currentView, onViewChange, onLogout, user }: DokterSidebarProps) {
  const dokter = getDokterById(user.dokter_id);

  const menuItems = [
    { id: 'pasien-hari-ini' as DokterView, label: 'Pasien Hari Ini', icon: Users },
    { id: 'riwayat' as DokterView, label: 'Riwayat Pemeriksaan', icon: History },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#E8ECF1] shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#E8ECF1]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#34A853] rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg text-[#1F2937] font-semibold">RS Sehat Sentosa</h2>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">Portal Dokter</p>
        {dokter && (
          <p className="text-sm text-[#34A853] font-medium">{dokter.nama}</p>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#34A853] text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#E8ECF1]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
