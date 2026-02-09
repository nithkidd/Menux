import type { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  LogOut, 
  Menu as MenuIcon,
  X,
  type LucideIcon
} from 'lucide-react';
import { useAuth } from '../../../features/auth/auth.context';
import { usePermissions } from '../../../shared/hooks/usePermissions';
import { Link } from 'react-router-dom';
import { useState } from 'react';

type Tab = 'overview' | 'businesses' | 'users';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const { signOut, user } = useAuth();
  const { isSuperAdmin } = usePermissions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: Tab; label: string; icon: LucideIcon; superOnly?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'businesses', label: 'Businesses', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users, superOnly: true },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-stone-100 dark:border-stone-800">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                MenuX Admin
              </span>
            </Link>
            <button 
              className="ml-auto lg:hidden text-stone-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="mb-8">
              <p className="px-4 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Main Menu
              </p>
              {navItems.map((item) => {
                if (item.superOnly && !isSuperAdmin) return null;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id as Tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/10 dark:text-orange-500' 
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold text-xs">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-200 truncate">
                  {user?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-stone-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center px-4 justify-between">
          <Link to="/" className="text-lg font-bold text-stone-900 dark:text-white">
            MenuX
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-stone-600 dark:text-stone-400"
          >
            <MenuIcon size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
