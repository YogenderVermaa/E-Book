import { useState, useEffect, useRef } from 'react';
import { BookOpen, Menu, X, LogOut, User } from 'lucide-react';

const ProfileDropdown = ({ isOpen, onToggle, avatar, companyName, email, userRole }) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
    >
      <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
        {companyName?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="text-left hidden lg:block">
        <div className="text-sm font-semibold text-gray-900">{companyName}</div>
        <div className="text-xs text-gray-500">{userRole}</div>
      </div>
    </button>

    {isOpen && (
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="font-semibold text-gray-900">{companyName}</div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    )}
  </div>
);

const Navbar = () => {
  // Mock auth context
  const [user, setUser] = useState({ name: 'John', email: 'john@example.com', role: 'Author' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <BookOpen className="w-5 h-5 text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              AI-EBook
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3" ref={dropdownRef}>
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar || ''}
                companyName={user?.name || ''}
                email={user?.email || ''}
                userRole={user?.role || ''}
              />
            ) : (
              <>
                <a
                  href="/login"
                  className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-200">
          {isAuthenticated ? (
            <div className="px-4 py-4 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{user?.name}</div>
                  <div className="text-xs text-gray-600 truncate">{user?.email}</div>
                  <div className="text-xs text-violet-600 font-medium mt-0.5">{user?.role}</div>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 font-semibold"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-3">
              <a
                href="/login"
                className="block w-full px-4 py-3 text-center text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Login
              </a>
              <a
                href="/signup"
                className="block w-full px-4 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
