import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Target,
  MessageCircle,
  TrendingUp,
  Settings,
  LogOut,
  Repeat,
  Lightbulb,
  User,
  Building2,
  CreditCard as PaymentIcon,
  FileSpreadsheet,
  Globe,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Transaksi', path: '/transactions' },
    { icon: PiggyBank, label: 'Anggaran', path: '/budgets' },
    { icon: Users, label: 'Group Budget', path: '/group-budgets' },
    { icon: Target, label: 'Tujuan Keuangan', path: '/goals' },
    { icon: TrendingUp, label: 'Analisis', path: '/analytics' },
    { icon: MessageCircle, label: 'Chat AI', path: '/chatbot' },
    { icon: Lightbulb, label: 'AI Recommendations', path: '/ai-recommendations' },
    { icon: CreditCard, label: 'E-Wallet Integration', path: '/e-wallet-integration' },
  ];

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen fixed inset-y-0 z-30 bg-white border-r border-neutral-100 shadow-xl transition-all duration-300 ${collapsed ? 'w-16' : 'w-52'}`}
      style={{ top: 0 }}
    >
      {/* User Info & Collapse Button */}
      <div className={`flex items-center justify-between px-2 py-3 border-b border-neutral-100 ${collapsed ? 'justify-center' : ''}`} style={{ minHeight: 56 }}>
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <img
              src={user?.avatar || '/avatar-default.svg'}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-primary-200 object-cover bg-neutral-100"
            />
            <div>
              <div className="font-bold text-neutral-800 text-xs leading-tight">{user?.name || 'Pengguna'}</div>
              <div className="text-[10px] text-neutral-400">{user?.email || '-'}</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1 rounded-lg hover:bg-neutral-100 transition-colors ml-auto"
          aria-label={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      {/* Menu */}
      <nav className="flex-1 px-1 py-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group w-full flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 text-left rounded-lg transition-all duration-200 font-medium font-inter relative overflow-hidden
                ${isActive ? 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 shadow-md scale-[1.03]' : 'text-neutral-600 hover:bg-neutral-50 hover:text-primary-700'}
              `}
            >
              <Icon size={18} className={`mr-0 ${collapsed ? '' : 'mr-2'} transition-all`} />
              {!collapsed && <span className="truncate text-sm transition-all">{item.label}</span>}
              {isActive && <span className="absolute left-0 top-0 h-full w-1 bg-primary-500 rounded-r-lg animate-slide-in" />}
            </button>
          );
        })}
      </nav>
      {/* Bottom Actions */}
      <div className={`px-1 pb-3 space-y-1 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        <button
          onClick={() => navigate('/preferences')}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 text-left rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-primary-700 transition-all duration-200`}
        >
          <User size={16} className={`mr-0 ${collapsed ? '' : 'mr-2'}`} />
          {!collapsed && <span className="font-medium font-inter text-sm">Preferences</span>}
        </button>
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 text-left rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-primary-700 transition-all duration-200`}
        >
          <Settings size={16} className={`mr-0 ${collapsed ? '' : 'mr-2'}`} />
          {!collapsed && <span className="font-medium font-inter text-sm">Pengaturan</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200`}
        >
          <LogOut size={16} className={`mr-0 ${collapsed ? '' : 'mr-2'}`} />
          {!collapsed && <span className="font-medium font-inter text-sm">Keluar</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;