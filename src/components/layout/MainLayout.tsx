import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  UserCircle, 
  Wallet, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      isActive 
        ? "bg-campayn-primary text-white shadow-lg shadow-violet-500/20" 
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <span className="transition-transform group-hover:scale-110">{icon}</span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-campayn-dark">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-campayn-primary rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Megaphone className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Campayn
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem to="/campaigns" icon={<Megaphone size={20} />} label="Campaigns" />
          <SidebarItem to="/wallet" icon={<Wallet size={20} />} label="Earnings" />
          <SidebarItem to="/profile" icon={<UserCircle size={20} />} label="Profile" />
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" />
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-campayn-dark/80 backdrop-blur-lg border-b border-white/5 px-6 flex items-center justify-between z-50">
        <span className="text-xl font-bold">Campayn</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-campayn-dark z-40 p-6 pt-24 space-y-4">
          <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem to="/campaigns" icon={<Megaphone size={20} />} label="Campaigns" />
          <SidebarItem to="/wallet" icon={<Wallet size={20} />} label="Earnings" />
          <SidebarItem to="/profile" icon={<UserCircle size={20} />} label="Profile" />
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-campayn-dark/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-campayn-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search campaigns, brands..." 
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-campayn-primary/50 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">Creator Dashboard</p>
                <p className="text-[10px] text-slate-500 font-medium">Standard Account</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-campayn-primary to-violet-600 p-[1px]">
                <div className="w-full h-full rounded-xl bg-campayn-dark flex items-center justify-center overflow-hidden">
                  <UserCircle size={24} className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
