import { useState, useEffect } from 'react';
import { Album } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropDown from './ProfileDropdown';

const DashBoardLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileDropdownOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/20 to-purple-50/20">
      <div className="w-full">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link className="flex items-center gap-3 group" to="/dashboard">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Album className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  AI ebook Creator
                </span>
              </Link>

              <div className="flex items-center">
                <ProfileDropDown
                  isOpen={profileDropdownOpen}
                  onToggle={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                  avatar={user?.avatar || ''}
                  companyName={user?.name || ''}
                  email={user?.email || ''}
                  onLogout={logout}
                />
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
