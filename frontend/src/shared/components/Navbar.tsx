import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../features/auth/auth.context';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <LayoutDashboard className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">MenuX</span>
            </Link>
          </div>
          
          {/* Middle Links - Only show on Landing Page */}
          <div className="hidden md:flex items-center space-x-8">
            {isLanding && (
                <>
                    <a href="#features" className="text-stone-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors font-medium">Features</a>
                    <a href="#pricing" className="text-stone-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors font-medium">Pricing</a>
                </>
            )}
            {!isLanding && user && (
                 <Link to="/dashboard" className="text-stone-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors font-medium">Dashboard</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none btn-press"
                  >
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
                        {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 rounded-2xl shadow-lg py-1 border border-stone-100 dark:border-stone-800 ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                        <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                            <p className="text-sm font-bold text-stone-900 dark:text-white truncate">{user.full_name || 'User'}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                        </div>
                        <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={() => {
                                signOut();
                                setIsDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                  )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-medium hidden sm:block">
                  Login
                </Link>
                <Link
                  to="/dashboard" // Redirects to login if not auth
                  className="bg-stone-900 text-white hover:bg-stone-800 px-4 py-2 rounded-2xl font-medium transition-all shadow-sm hover:shadow-md btn-press"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
