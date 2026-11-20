import { Link } from 'react-router-dom';
import { BookOpen, Flame, IndianRupee, Users, Star } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <style>{`
        @keyframes ll-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes ll-fade-up { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        .ll-float { animation: ll-float 6s ease-in-out infinite; }
        .ll-float-slow { animation: ll-float 8s ease-in-out infinite reverse; }
        .ll-fade-up { animation: ll-fade-up .6s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .ll-float, .ll-float-slow, .ll-fade-up { animation: none } }
      `}</style>

      {/* Left: brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 p-12 text-white">
        {/* Decorative orbs + grid */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <Link to="/" className="relative z-10 inline-flex items-center gap-2.5 w-fit">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight">LifeLog</span>
        </Link>

        {/* Floating diary preview */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-10">
          <div className="relative w-full max-w-sm">
            <div className="ll-float rounded-3xl bg-white text-gray-900 p-6 shadow-2xl shadow-black/30 rotate-[-3deg]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
                    Day 214
                  </p>
                  <p className="font-bold text-lg leading-tight">A quiet monsoon morning</p>
                </div>
                <span className="text-2xl">🌧️</span>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 rounded-full bg-gray-100 w-full" />
                <div className="h-2.5 rounded-full bg-gray-100 w-11/12" />
                <div className="h-2.5 rounded-full bg-gray-100 w-9/12" />
              </div>
              <div className="mt-4 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-400 text-xs font-medium">
                📷 photo embed
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                  Mood: Calm
                </span>
                <span>🎧 Audio vlog attached</span>
              </div>
            </div>

            {/* Floating chips */}
            <div className="ll-float-slow absolute -top-6 -right-4 flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-2 text-sm font-semibold shadow-lg">
              <IndianRupee className="w-4 h-4 text-emerald-300" />
              1,240 earned
            </div>
            <div className="ll-float absolute -bottom-5 -left-6 flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-2 text-sm font-semibold shadow-lg">
              <Flame className="w-4 h-4 text-orange-300" />
              42-day streak
            </div>
          </div>
        </div>

        {/* Bottom: pitch + stats */}
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
            Your everyday life,
            <br />
            worth reading — and worth earning from.
          </h2>
          <div className="mt-6 flex items-center gap-6 text-sm text-indigo-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Growing creator community</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Right: form panel */}
      <main className="relative flex items-center justify-center px-5 py-12 sm:px-10 bg-gradient-to-b from-white to-indigo-50/40">
        <div className="w-full max-w-md ll-fade-up">
          {/* Mobile brand */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              LifeLog
            </span>
          </Link>

          {children}

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-10">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Help
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
