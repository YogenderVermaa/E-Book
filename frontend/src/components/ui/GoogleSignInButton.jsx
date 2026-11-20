import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '840271893545-2ptnpk3if9ti0pntg5ff5g2dtebbl71m.apps.googleusercontent.com';

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

const GoogleSignInButton = ({
  text = 'Continue with Google',
  textType = 'continue_with',
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const googleBtnRef = useRef(null);
  const tokenClientRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Send verified credential or access_token to backend
  const handleAuthPayload = useCallback(
    async (payload) => {
      setIsLoading(true);
      const toastId = toast.loading('Authenticating with Google...');

      try {
        const res = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, payload);
        const { user, token, isNewUser } = res.data.data;
        login(user, token);

        toast.success(
          isNewUser ? `Welcome to LifeLog, ${user.name}!` : `Welcome back, ${user.name}!`,
          { id: toastId }
        );
        navigate('/dashboard');
      } catch (err) {
        console.error('Google sign-in error:', err);
        const message =
          err.response?.data?.message ||
          'Google authentication failed. Please check your connection and try again.';
        toast.error(message, { id: toastId });
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate]
  );

  // Callback for Google Identity Services ID Token
  const handleCredentialResponse = useCallback(
    async (response) => {
      if (!response?.credential) return;
      await handleAuthPayload({ credential: response.credential });
    },
    [handleAuthPayload]
  );

  // Initialize Google Identity Services
  useEffect(() => {
    let checkInterval = null;

    const setupGoogleAuth = () => {
      if (typeof window === 'undefined' || !window.google?.accounts) {
        return false;
      }

      try {
        // 1. Initialize Google ID Token Client
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // 2. Render Official Google Sign-In Button inside ref
        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: textType,
            shape: 'rectangular',
            logo_alignment: 'left',
          });
          setIsRendered(true);
        }

        // 3. Initialize OAuth 2.0 Token Client for custom button trigger
        if (window.google.accounts.oauth2) {
          tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'openid email profile',
            callback: (tokenResponse) => {
              if (tokenResponse?.access_token) {
                handleAuthPayload({ access_token: tokenResponse.access_token });
              } else if (tokenResponse?.error) {
                console.warn('OAuth popup dismissed or error:', tokenResponse.error);
              }
            },
          });
        }

        return true;
      } catch (err) {
        console.warn('Error setting up Google Auth:', err);
        return false;
      }
    };

    if (!setupGoogleAuth()) {
      checkInterval = setInterval(() => {
        if (setupGoogleAuth()) {
          clearInterval(checkInterval);
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [handleCredentialResponse, handleAuthPayload, textType]);

  // Click handler for fallback button: triggers standard OAuth 2.0 popup
  const handleTriggerOAuth = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }

    // Direct OAuth redirect standard fallback
    const redirectUri = window.location.origin + '/login';
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=openid%20email%20profile&prompt=select_account`;
    window.location.href = oauthUrl;
  };

  // Catch hash token if redirected via OAuth implicit flow
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const params = new window.URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        window.history.replaceState(null, '', window.location.pathname);
        handleAuthPayload({ access_token: accessToken });
      }
    }
  }, [handleAuthPayload]);

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Official Google Identity Button (Google iframe) */}
      <div
        ref={googleBtnRef}
        className={`w-full flex justify-center min-h-[44px] ${isRendered ? 'flex' : 'hidden'}`}
      />

      {/* Styled Google Button (displayed while script loads or if iframe hidden) */}
      {!isRendered && (
        <button
          type="button"
          onClick={handleTriggerOAuth}
          disabled={isLoading}
          className="w-full max-w-[320px] py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-lg border border-gray-300 hover:border-gray-400 shadow-sm transition-all duration-150 flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60"
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
    </div>
  );
};

export default GoogleSignInButton;
