import { FEATURES } from '../../utils/data.js';
import { Sparkles, ArrowRight, PenLine, Rocket, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

const steps = [
  {
    icon: PenLine,
    title: 'Write your day',
    desc: 'Add text, photos, mood and audio. The AI assistant helps when you are stuck.',
  },
  {
    icon: Rocket,
    title: 'Publish & grow',
    desc: 'Set free and locked days. Readers find you on the Explore feed.',
  },
  {
    icon: Wallet,
    title: 'Get paid',
    desc: 'Readers unlock via UPI or Razorpay. Earnings land straight with you.',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 font-semibold text-xs mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Built for Daily Life Creators & Avid Readers
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                vlog in written text
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500">
              A frictionless platform to document your days, sign in in seconds, and monetize via
              Razorpay.
            </p>
          </div>
        </Reveal>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title ?? i} delay={(i % 3) * 100}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10">
                  <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-400/0 to-violet-400/0 group-hover:from-indigo-400/20 group-hover:to-violet-400/20 blur-2xl transition-all duration-500" />
                  <span className="absolute top-6 right-7 text-5xl font-black text-gray-100 group-hover:text-indigo-100 transition-colors select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div
                    className={`relative w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-[-4deg] transition-all`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="relative text-lg font-black text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="relative text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* How it works */}
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              How it works
            </p>
            <h3 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              From first entry to first payout
            </h3>
          </div>
        </Reveal>

        <div className="relative grid md:grid-cols-3 gap-8 mb-24">
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 120}>
              <div className="relative text-center px-4">
                <div className="relative mx-auto mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Icon className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                </div>
                <h4 className="font-black text-gray-900 mb-1.5">{title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 sm:p-14 text-center text-white shadow-2xl shadow-indigo-500/30">
            <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
            <div className="relative space-y-4">
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                Ready to turn your life into a written vlog series?
              </h3>
              <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
                Join creators writing daily diaries and earning from their true stories.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black hover:bg-gray-100 transition-all hover:-translate-y-0.5 shadow-xl"
                >
                  Get Started in 30 Seconds
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold border border-white/30 hover:bg-white/10 transition-all"
                >
                  Browse diaries first
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Features;
