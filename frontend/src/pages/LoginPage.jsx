import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Zap } from 'lucide-react';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';
import AuthLayout from '../components/auth/AuthLayout';

const trust = [
  { icon: ShieldCheck, text: 'Google OAuth 2.0', color: 'text-emerald-500' },
  { icon: Lock, text: 'Private diary', color: 'text-indigo-500' },
  { icon: Zap, text: 'No password', color: 'text-amber-500' },
];

const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Pick up your story where you left off — your readers are waiting.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-gray-100 shadow-xl shadow-indigo-100/50 p-6 sm:p-8">
        <GoogleSignInButton text="Sign in with Google" textType="signin_with" />

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
            Secure by design
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {trust.map(({ icon: Icon, text, color }) => (
            <div
              key={text}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-gray-50 py-3 px-2 text-center"
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-[11px] font-medium text-gray-600 leading-tight">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 text-center mt-6">
        New to LifeLog?{' '}
        <Link
          to="/signup"
          className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Create your diary
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
