import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, Compass, User, LogOut } from 'lucide-react';

// One shared profile menu for Navbar + DashBoardLayout (replaces ProfileDropdown).
const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const name = user?.name || user?.email?.split('@')[0] || 'You';
  const avatar = user?.avatar || user?.picture;
  const close = () => setOpen(false);

  const item =
    'flex items-center gap-2.5 px-3 py-2 mx-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {avatar ? (
          <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline text-sm font-semibold text-gray-800 max-w-[110px] truncate">
          {name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        role="menu"
        className={`absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-indigo-900/10 py-2 z-50 transition-all duration-150 ${
          open ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
        }`}
      >
        <div className="px-4 py-3 mb-1 border-b border-gray-100">
          <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>
        <Link to="/dashboard" onClick={close} role="menuitem" className={item}>
          <LayoutDashboard className="w-4 h-4" /> My Diaries
        </Link>
        <Link to="/explore" onClick={close} role="menuitem" className={item}>
          <Compass className="w-4 h-4" /> Explore Feed
        </Link>
        <Link to="/profile" onClick={close} role="menuitem" className={item}>
          <User className="w-4 h-4" /> Profile Settings
        </Link>
        <div className="border-t border-gray-100 mt-1 pt-1">
          <button
            role="menuitem"
            onClick={() => {
              close();
              onLogout();
            }}
            className="flex w-[calc(100%-1rem)] items-center gap-2.5 px-3 py-2 mx-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
