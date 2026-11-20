import { useState, useEffect } from 'react';
import { BookOpen, Compass, LayoutDashboard, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserMenu from '../ui/UserMenu';

const tabs = [
  { to: '/dashboard', label: 'My Diaries', icon: LayoutDashboard },
  { to: '/explore', label: 'Explore Feed', icon: Compass },
  { to: '/profile', label: 'Profile', icon: User },
];

const DashBoardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to) => pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex flex-col">
      <style>{`
        @keyframes dl-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        .dl-in { animation: dl-in .35s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .dl-in { animation: none } }
      `}</style>

      <header
        className={`sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b transition-shadow ${
          scrolled ? 'border-gray-200/70 shadow-sm' : 'border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:rotate-[-6deg] group-hover:scale-105 transition-all">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-none">
                    LifeLog
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-0.5">
                    Written Daily Vlogs
                  </span>
                </div>
              </Link>

              <nav className="hidden sm:flex items-center gap-1">
                {tabs.slice(0, 2).map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      isActive(to)
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* key re-triggers the fade on every route change */}
      <main
        key={pathname}
        className="dl-in flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 sm:pb-8"
      >
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur-xl border-t border-gray-200/70 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-3">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                  active ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                <span
                  className={`px-4 py-1 rounded-full transition-colors ${
                    active ? 'bg-indigo-50' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashBoardLayout;
