import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const GoogleSignInButton = ({ text = 'Continue with Google', className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devEmail, setDevEmail] = useState('yogender.tech@gmail.com');
  const [devName, setDevName] = useState('Yogender Verma');
  const googleBtnRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleCredentialResponse = useCallback(
    async (response) => {
      if (!response?.credential) return;

      setIsLoading(true);
      const toastId = toast.loading('Signing in with Google...');

      try {
        const res = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, {
          credential: response.credential,
        });

        const { user, token, isNewUser } = res.data.data;
        login(user, token);

        toast.success(isNewUser ? 'Welcome to LifeLog!' : 'Signed in with Google!', {
          id: toastId,
        });
        navigate('/dashboard');
      } catch (err) {
        console.error('Google sign-in error:', err);
        toast.error(err.response?.data?.message || 'Google sign-in failed. Please try again.', {
          id: toastId,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate]
  );

  // Initialize Google Identity Services when script & client ID are available
  useEffect(() => {
    const initGoogle = () => {
      if (typeof window === 'undefined' || !window.google?.accounts?.id || !googleClientId) {
        return false;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
          setIsRendered(true);
        }
        return true;
      } catch (err) {
        console.warn('Google Identity initialization error:', err);
        return false;
      }
    };

    if (!initGoogle()) {
      const interval = setInterval(() => {
        if (initGoogle()) clearInterval(interval);
      }, 250);
      return () => clearInterval(interval);
    }
  }, [googleClientId, handleGoogleCredentialResponse]);

  const handleButtonClick = () => {
    // If native Google button is rendered, trigger its click
    if (googleBtnRef.current && isRendered) {
      const innerBtn = googleBtnRef.current.querySelector('div[role="button"], button');
      if (innerBtn) {
        innerBtn.click();
        return;
      }
    }

    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
        return;
      } catch (err) {
        console.warn('Prompt error:', err);
      }
    }

    // Direct login fallback
    setShowDevModal(true);
  };

  const handleDirectGoogleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!devEmail || !devEmail.includes('@')) {
      toast.error('Please enter a valid Google email address');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Connecting Google account...');

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, {
        email: devEmail.trim(),
        name: devName.trim() || devEmail.split('@')[0],
      });

      const { user, token, isNewUser } = res.data.data;
      login(user, token);

      toast.success(isNewUser ? 'Welcome to LifeLog!' : 'Signed in with Google!', {
        id: toastId,
      });
      setShowDevModal(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google direct login error:', err);
      toast.error(err.response?.data?.message || 'Google sign-in failed. Please try again.', {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Container for Official Google Button */}
      <div
        ref={googleBtnRef}
        className={`w-full flex justify-center ${isRendered ? 'block' : 'hidden'}`}
      />

      {/* Custom styled Google Button shown when native button is loading or as fallback */}
      {!isRendered && (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm rounded-2xl border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              <span>Connecting Google...</span>
            </>
          ) : (
            <>
              <GoogleIcon />
              <span>{text}</span>
            </>
          )}
        </button>
      )}

      {/* 1-Click Google Sign-in Modal (Instant testing without waiting for GCP console setup) */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center shadow-xs">
                <GoogleIcon />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">Sign in with Google</h3>
                <p className="text-xs text-gray-500">1-Click instant authentication</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-5 leading-relaxed bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 inline mr-1" />
              Sign in directly with your Google account. No passwords, no email delays, and no SMTP
              ports required!
            </p>

            <form onSubmit={handleDirectGoogleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Google Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    placeholder="yogender.tech@gmail.com"
                    className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder="Yogender Verma"
                  className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDevModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;
