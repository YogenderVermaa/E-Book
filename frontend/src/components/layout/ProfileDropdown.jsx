import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ isOpen, onToggle, avatar, companyName, email, onLogout }) => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-violet-50 transition-all duration-200 group"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
            <span className="text-white font-bold text-lg">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900 text-sm">{companyName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{email}</p>
          </div>

          <a
            onClick={() => navigate('/profile')}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors cursor-pointer font-medium"
          >
            View Profile
          </a>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <a
              href="#"
              onClick={onLogout}
              className="block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
