import { useEffect, useRef, useState } from 'react';

const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // ✅ Correct ref

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white border shadow-lg rounded-md py-1 z-20"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menubutton"
          tabIndex="-1"
        >
          <div role="none">{children}</div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition cursor-pointer"
      role="menuitem"
      tabIndex="-1"
    >
      {children}
    </button>
  );
};

export default Dropdown;
