import { ArrowRight, Sparkles, BookOpen, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import HERO_IMG from '../../assets/hero.png';

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative bg-gradient-to-br from-violet-50 via-white to-purple-50 overflow-hidden py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full text-violet-600 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Publishing</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Create Stunning{' '}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Ebooks in Minutes
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              From idea to published ebook - let AI handle the heavy lifting while you focus on your
              creativity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all transform hover:scale-105"
              >
                <span>Start Creating For Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all"
              >
                <span>Watch Demo</span>
                <span className="text-violet-600">→</span>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Books Created</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-gray-900">10 Min</div>
                <div className="text-sm text-gray-600">Avg. Creating Time</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative lg:ml-8">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>

              {/* Main image container */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <img src={HERO_IMG} alt="AI book Creator Dashboard" className="w-full h-auto" />

                {/* Floating AI Processing Card */}
                <div className="absolute top-8 -left-4 bg-white rounded-xl shadow-xl p-4 animate-bounce">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <Zap className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Processing</div>
                      <div className="text-sm font-semibold text-gray-900">AI Generation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Completed Card */}
            <div className="absolute bottom-8 -right-4 bg-white rounded-xl shadow-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Completed</div>
                  <div className="text-xs text-gray-500">274 Pages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
