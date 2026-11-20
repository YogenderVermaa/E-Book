import { BookOpen, Twitter, Linkedin, Github, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Product',
    links: [
      { to: '/explore', label: 'Explore Diaries' },
      { to: '/dashboard', label: 'My Dashboard' },
      { to: '/signup', label: 'Start Writing' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/login', label: 'Sign In' },
      { to: '/signup', label: 'Create Diary' },
      { to: '/profile', label: 'Profile Settings' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/terms', label: 'Terms of Service' },
      { to: '/privacy', label: 'Privacy Policy' },
    ],
  },
];

const socials = [
  { href: 'https://x.com/yogendervermaa', label: 'Twitter', icon: Twitter },
  { href: 'https://www.linkedin.com/in/yogendervermaa/', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://github.com/YogenderVermaa', label: 'GitHub', icon: Github },
];

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-64 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                LifeLog
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Written daily life diaries and text vlogs. Document your journey, connect with
              readers, and earn with Razorpay.
            </p>
            <div className="flex gap-2.5 pt-1">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-indigo-600 hover:border-indigo-500 hover:-translate-y-0.5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-gray-300 hover:text-white hover:translate-x-0.5 inline-block transition-all"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} LifeLog. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Made with ♥ in India</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-colors"
            >
              Back to top <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
