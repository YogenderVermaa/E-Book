import { FEATURES } from '../../utils/data.js';
const Features = () => {
  return (
    <div id="features" className="">
      <div className="">
        <div>
          <div>
            <span></span>
            <span>Features</span>
          </div>
          <h2 className="">
            Everthing you need to
            <span className="">Create a book</span>
          </h2>
          <p>our platefrom is packed with powerfull features</p>
        </div>

        <div className="">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="">
                <div className=""></div>
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg shadow-${feature.gradient}/20 group-hover:scale-110 transition-all duration-300`}
                >
                  <Icon className="" />
                </div>

                <div>
                  <h3 className="">{feature.title}</h3>
                  <p className="">{feature.description}</p>
                </div>

                <div className="">
                  <span className="">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1 ground-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox=" 0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 517 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="">
          <p className="">Ready to get started</p>
          <a href="/signup" className="">
            <span>Start createing today</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
