import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  ArrowRight,
  User,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devOtpCode, setDevOtpCode] = useState('');
  const [devConsoleHint, setDevConsoleHint] = useState(false);

  const otpInputsRef = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (step === 2 && otpInputsRef.current[0]) {
      otpInputsRef.current[0].focus();
    }
  }, [step]);

  const extractCooldownSeconds = (error) => {
    const dataRetry = error.response?.data?.retryAfter;
    if (typeof dataRetry === 'number') return dataRetry;

    const message = error.response?.data?.message || '';
    const match = message.match(/(\d+)\s*s/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 40;
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      const msg = 'Please enter your full name or creator handle.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      const msg = 'Please enter a valid email address.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (resendCooldown > 0) {
      setErrorMessage(`Please wait ${resendCooldown}s before requesting a new code.`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.SEND_OTP, {
        email: email.trim(),
      });

      const resData = response.data?.data || {};
      if (resData.loggedToConsole) {
        setDevConsoleHint(true);
      }
      if (resData.devOtp) {
        setDevOtpCode(resData.devOtp);
      }

      const cooldown = resData.cooldownSeconds || 40;
      setResendCooldown(cooldown);
      setSuccessMessage(`Verification code sent to ${email.trim()}! Please check your inbox.`);
      toast.success('Verification code sent to your email!');
      setStep(2);
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to send OTP code.';
      setErrorMessage(message);
      toast.error(message);

      if (status === 429) {
        const seconds = extractCooldownSeconds(error);
        setResendCooldown(seconds);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerVerification = async (codeToVerify) => {
    if (!codeToVerify || codeToVerify.length !== 6) return;

    setErrorMessage('');
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email: email.trim(),
        otp: codeToVerify,
        name: name.trim(),
      });

      const { user, token } = response.data.data;
      login(user, token);

      toast.success('Account created! Welcome to LifeLog.');
      navigate('/dashboard');
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Invalid or expired verification code.';
      setErrorMessage(message);
      toast.error(message);

      if (status === 429) {
        const seconds = extractCooldownSeconds(error);
        setResendCooldown(seconds);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    setErrorMessage('');
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }

    const completeCode = newOtp.join('');
    if (completeCode.length === 6 && !newOtp.includes('')) {
      triggerVerification(completeCode);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputsRef.current[index - 1]) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pasted.length >= 6) {
      const digits = pasted.slice(0, 6).split('');
      setOtp(digits);
      if (otpInputsRef.current[5]) otpInputsRef.current[5].focus();
      triggerVerification(digits.join(''));
    }
  };

  const handleFillDevOtp = (code) => {
    const digits = code.split('');
    setOtp(digits);
    triggerVerification(code);
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      const msg = 'Please enter all 6 digits of the code.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }
    triggerVerification(fullOtp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              LifeLog
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {step === 1 ? 'Start Your Daily Diary Vlog' : 'Verify Your Email'}
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            {step === 1
              ? 'Share your daily life, build an audience, and get paid.'
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-8 border border-gray-100">
          {/* Prominent High-Contrast Error Alert Banner */}
          {errorMessage && (
            <div className="mb-5 p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-3 text-sm text-red-800 shadow-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-red-900">Authentication Error</p>
                <p className="text-xs sm:text-sm text-red-700 mt-0.5 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-red-400 hover:text-red-700 font-bold text-sm px-1.5 py-0.5 rounded-lg hover:bg-red-100 transition-colors"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          )}

          {/* Prominent Success Alert Banner */}
          {successMessage && (
            <div className="mb-5 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 text-sm text-emerald-800 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-emerald-900">Code Sent</p>
                <p className="text-xs sm:text-sm text-emerald-700 mt-0.5 leading-relaxed">
                  {successMessage}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage('')}
                className="text-emerald-400 hover:text-emerald-700 font-bold text-sm px-1.5 py-0.5 rounded-lg hover:bg-emerald-100 transition-colors"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Full Name / Handle
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Johnathon Alford"
                    autoFocus
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="you@gmail.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Rate Limit Countdown Notice on Step 1 */}
              {resendCooldown > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>Please wait before requesting again:</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-950 font-black rounded-lg">
                    {resendCooldown}s
                  </span>
                </div>
              )}

              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-xs text-indigo-700">
                <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>We'll email you a 6-digit one-time code. No passwords to remember.</span>
              </div>

              <Button
                type="submit"
                disabled={resendCooldown > 0 || isLoading}
                isLoading={isLoading}
                icon={ArrowRight}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0
                  ? `Wait ${resendCooldown}s to Request Code`
                  : 'Continue with Email'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                {/* Live Resend Countdown Banner */}
                <div className="mb-4 p-3 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-indigo-900">
                  <div className="flex items-center gap-2 font-medium">
                    <Clock
                      className={`w-4 h-4 text-indigo-600 ${resendCooldown > 0 ? 'animate-pulse' : ''}`}
                    />
                    <span>{resendCooldown > 0 ? 'Resend available in' : 'Code not received?'}</span>
                  </div>
                  {resendCooldown > 0 ? (
                    <span className="px-2.5 py-1 bg-indigo-600 text-white font-black text-xs rounded-full shadow-xs">
                      {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 underline transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      Resend Now
                    </button>
                  )}
                </div>

                {/* Instant Dev Mode Helper */}
                {devOtpCode && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      <span>
                        Local Dev Code: <strong>{devOtpCode}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFillDevOtp(devOtpCode)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
                    >
                      Auto-fill & Register
                    </button>
                  </div>
                )}

                {devConsoleHint && !devOtpCode && (
                  <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 text-left leading-relaxed">
                    <strong>Notice:</strong> Your 6-digit code has been dispatched. If your inbox is
                    delayed or you are testing on Render, you can also view the OTP code instantly
                    in your backend server logs!
                  </div>
                )}

                <div className="flex justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border ${
                        errorMessage ? 'border-red-400 bg-red-50/30' : 'border-gray-300 bg-gray-50'
                      } focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all shadow-sm`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Tip: Code will auto-verify as soon as you type or paste all 6 digits.
                </p>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                Verify & Create Account
              </Button>

              <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp(['', '', '', '', '', '']);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleSendOtp}
                  className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
