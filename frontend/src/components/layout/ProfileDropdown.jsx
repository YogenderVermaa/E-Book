import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ProfileDropdown = ({ isOpen, onToggle, avatar, companyName, email, onLogout }) => {
  const navigate = useNavigate();
  return (
    <div className="">
      <button onClick={onToggle}>
        {avatar ? (
          <img src={avatar} alt="avatar" className="" />
        ) : (
          <div className="">
            <span className="">{companyName.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <ChevronDown className="" />
      </button>

      {isOpen && (
        <div className="">
          <div className="">
            <p className="">{companyName}</p>
            <p>{email}</p>
          </div>

          <a onClick={() => navigate('/profile')} className="">
            View Profile
          </a>
          <div className="">
            <a href="#" onClick={onLogout} className="">
              Sing out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
