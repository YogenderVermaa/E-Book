import { FEATURES } from '../../utils/data.js';

const Features = () => {
  return (
    <div id="features" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full text-violet-600 font-medium text-sm mb-6">
            <span>✨</span>
            <span>Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Create a Book
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Our platform is packed with powerful features to make book creation effortless
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-violet-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-all duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>

                  <div className="flex items-center text-violet-600 font-medium text-sm group-hover:text-violet-700 transition-colors">
                    <span className="flex items-center">
                      Learn more
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-12 text-center shadow-2xl">
          <p className="text-2xl font-bold text-white mb-6">Ready to get started?</p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            <span>Start Creating Today</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Features;
