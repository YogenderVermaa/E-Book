import { useState, useEffect } from 'react';
import { Album } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropDown from './ProfileDropdown';
const DashBoardLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useState(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileDropdownOpen]);
  return (
    <div>
      <div>
        <header>
          <div>
            <Link className="" to="/dashboard">
              <div>
                <Album className="" />
              </div>
              <span className="">AI ebook Creator</span>
            </Link>
          </div>

          <div className="">
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
        </header>
        <main className="">{children}</main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
