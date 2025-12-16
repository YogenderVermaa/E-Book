import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { BookOpen, Menu, X, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
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

  return (
    <header>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-105   ">
              <BookOpen className="h-5 w-5 text-white/80 rotate-20 " />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">AI-EBook</span>
          </a>

          <div className="hidden md:flex items-center space-x-3">
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
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg hover:from-orange-700 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </a>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className=" md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-100 cursor-pointer"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="">
          {isAuthenticated ? (
            <div className="">
              <div className="">
                <div className="">
                  <span className="">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="">{user?.name}</div>
                  <div className="">{user?.email}</div>
                </div>
              </div>
              <button className="" onClick={() => logout()}>
                <LogOut className="" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <div>
              <a href="/login" className="">
                Login
              </a>
              <a href="/singup" className="">
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
