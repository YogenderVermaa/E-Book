import { Link } from 'react-router-dom';
import { BookOpen, Headphones, CreditCard, Sparkles } from 'lucide-react';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';
import AuthLayout from '../components/auth/AuthLayout';

const features = [
  {
    icon: BookOpen,
    title: 'Interactive 3D flipbook',
    desc: 'Photo embeds and mood tracking on every page.',
    bg: 'bg-indigo-50',
    color: 'text-indigo-600',
  },
  {
    icon: Headphones,
    title: 'Audio vlogs & music',
    desc: 'Ambient listening while readers explore your story.',
    bg: 'bg-violet-50',
    color: 'text-violet-600',
  },
  {
    icon: CreditCard,
    title: 'UPI & Razorpay payouts',
    desc: 'Earn directly from your subscribers.',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
  },
];

const SignupPage = () => {
  return (
    <AuthLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Set up in under 10 seconds
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Create your LifeLog
        </h1>
        <p className="text-gray-500 mt-2">
          Write your daily story, build an audience, and earn from your diary.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-gray-100 shadow-xl shadow-indigo-100/50 p-6 sm:p-8">
        <GoogleSignInButton text="Sign up with Google" textType="signup_with" />
        <p className="text-xs text-gray-400 text-center mt-3">
          No password. No email verification delay.
        </p>

        <ul className="mt-6 pt-6 border-t border-gray-100 space-y-4">
          {features.map(({ icon: Icon, title, desc, bg, color }) => (
            <li key={title} className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center mt-5">
        By continuing, you agree to our{' '}
        <Link to="/" className="underline hover:text-gray-600">
          Terms
        </Link>{' '}
        and{' '}
        <Link to="/" className="underline hover:text-gray-600">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-sm text-gray-500 text-center mt-4">
        Already have a LifeLog?{' '}
        <Link
          to="/login"
          className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
