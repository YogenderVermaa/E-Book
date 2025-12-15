import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { BookOpen } from 'lucide-react';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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
      <div>
        <a href="/">
          <BookOpen />
        </a>
      </div>

      {isAuthenticated && (
        <div ref={dropdownRef}>
          <ProfileDropdown
            isOpen={profileDropdownOpen}
            onToggle={(e) => {
              e.stopPropagation();
              setProfileDropdownOpen((prev) => !prev);
            }}
            avatar={user?.avatar || ''}
            companyName={user?.name || ''}
            email={user?.email || ''}
            onLogout={logout}
          />
        </div>
      )}
    </header>
  );
}

export default Navbar;
