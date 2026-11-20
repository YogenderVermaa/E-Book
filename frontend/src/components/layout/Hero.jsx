import {
  ArrowRight,
  Sparkles,
  Compass,
  ShieldCheck,
  IndianRupee,
  Lock,
  Flame,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

const stats = [
  { value: '50K+', label: 'Daily Entries', accent: 'text-gray-900' },
  { value: '₹12L+', label: 'Earned by Creators', accent: 'text-indigo-600' },
  { value: '4.9/5', label: 'Reader Rating', accent: 'text-gray-900' },
];

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 py-14 sm:py-24 border-b border-gray-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-[30rem] h-[30rem] rounded-full bg-fuchsia-300/25 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(#c7d2fe 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div className="space-y-7">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-indigo-100 rounded-full text-indigo-700 font-semibold text-xs shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
                </span>
                The Next Generation of Daily Vlogging — In Written Text
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="text-4xl sm:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight">
                Share your daily life.{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Get paid to write your diary.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Turn your days into a binge-worthy written vlog. Readers discover your raw moments,
                subscribe, and pay via Razorpay to unlock your journey.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                >
                  {isAuthenticated ? 'Go to My Diaries' : 'Start Your Diary Vlog'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-800 rounded-2xl font-bold border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                >
                  <Compass className="w-5 h-5 text-indigo-600" />
                  Explore Diaries
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Secure sign-in
                </span>
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-600" /> Instant Razorpay payouts
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> AI writing assistant
                </span>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex items-center gap-6 sm:gap-8 pt-6 border-t border-gray-200/80">
                {stats.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-6 sm:gap-8">
                    {i > 0 && <div className="w-px h-10 bg-gray-200 -ml-6 sm:-ml-8 mr-0" />}
                    <div>
                      <div className={`text-2xl sm:text-3xl font-black ${s.accent}`}>{s.value}</div>
                      <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: live-feeling diary preview */}
          <Reveal delay={200}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-fuchsia-500/20 rounded-[2rem] blur-2xl -z-10" />

              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-2xl shadow-indigo-900/10 space-y-5 transition-transform duration-500 group-hover:-rotate-1 group-hover:scale-[1.01]">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-white font-extrabold shadow-md">
                      M
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                        Maya Sen
                      </h3>
                      <p className="text-xs text-gray-400">@maya_travels • 4.2k readers</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-black text-xs">
                    ₹99 Unlock
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                    <span className="px-2 py-0.5 bg-indigo-50 rounded-md">Day 4 of 10</span>
                    <span>• Manali Backpacking Diary</span>
                  </div>
                  <h4 className="text-xl font-black text-gray-900">
                    "The morning the mountain road disappeared into mist."
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    I woke up at 5:30 AM to the smell of woodsmoke and wet pine needles. The bus had
                    broken down right before the pass, and 12 strangers were sharing steaming chai
                    in a roadside dhaba...
                  </p>

                  {/* Blurred "locked" continuation */}
                  <div className="relative">
                    <div className="space-y-2 select-none blur-[3px] opacity-70" aria-hidden>
                      <div className="h-2.5 rounded-full bg-gray-200 w-full" />
                      <div className="h-2.5 rounded-full bg-gray-200 w-11/12" />
                      <div className="h-2.5 rounded-full bg-gray-200 w-8/12" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-gray-200 text-xs font-bold text-gray-700 shadow">
                        <Lock className="w-3.5 h-3.5" /> 6 days locked
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white flex items-center justify-between shadow-lg">
                    <div>
                      <div className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">
                        Keep reading
                      </div>
                      <div className="text-sm font-black">Unlock with Razorpay</div>
                    </div>
                    <span className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl">
                      Unlock ₹99
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating social proof */}
              <div className="hidden sm:flex absolute -top-5 -right-5 items-center gap-2 rounded-2xl bg-white border border-gray-100 shadow-xl px-3.5 py-2 text-xs font-bold text-gray-700 animate-bounce [animation-duration:3s]">
                <Users className="w-4 h-4 text-indigo-600" /> 12 new readers today
              </div>
              <div className="hidden sm:flex absolute -bottom-5 -left-5 items-center gap-2 rounded-2xl bg-white border border-gray-100 shadow-xl px-3.5 py-2 text-xs font-bold text-gray-700">
                <Flame className="w-4 h-4 text-orange-500" /> 42-day writing streak
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
