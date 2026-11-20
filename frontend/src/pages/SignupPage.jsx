import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Headphones,
} from 'lucide-react';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
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
            Create your LifeLog
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Join thousands of creators writing daily life stories and monetizing their diaries.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-8 sm:p-10 border border-gray-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Instant 1-Click Creator Setup</span>
            </div>
            <p className="text-sm text-gray-600 font-normal">
              Sign up with Google — no password, no email verification delay.
            </p>
          </div>

          {/* Real Standard Google Sign-In */}
          <div className="py-2">
            <GoogleSignInButton text="Sign up with Google" textType="signup_with" />
          </div>

          {/* Creator Features List */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
            <div className="flex items-start gap-3 text-xs text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Interactive 3D Flipbook</strong> with photo embeds and mood tracking.
              </span>
            </div>
            <div className="flex items-start gap-3 text-xs text-gray-600">
              <Headphones className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Audio Vlogs & Music</strong> for ambient listening while reading.
              </span>
            </div>
            <div className="flex items-start gap-3 text-xs text-gray-600">
              <CreditCard className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Instant UPI & Razorpay Monetization</strong> to earn directly from
                subscribers.
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>Google Identity Verified &bull; Zero spam guarantee</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have a LifeLog?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Sign in to your diary
            </Link>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-4">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
