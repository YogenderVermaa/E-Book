import { ArrowRight, Sparkles, BookOpen, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import HERO_IMG from '../../assets/hero.png';
const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative bg-gradient-to-br from-violet-50 via-white to-purple-50 overflow-hidden">
      <div className="max-w-7xl">
        <div className="">
          <Sparkles className="" />
          <span>AI-Powered Publish</span>
        </div>
        <h1 className="">
          Create Stunning
          <span>Ebooks in Minutes</span>
        </h1>

        <p className="">From ideea to publish ebook</p>

        <div className="">
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="">
            <span>Start creatig fro free</span>
            <ArrowRight className="" />
          </Link>

          <a href="#demo" className="">
            <span>Watch Demo</span>
            <span className="">-</span>
          </a>
        </div>
        <div className="">
          <div>
            <div className="">1</div>
            <div className="">Books Created</div>
          </div>
          <div className=""></div>
          <div>
            <div className="">4.9/5</div>
            <div>User Rating</div>
          </div>
          <div className=""></div>
          <div className="">
            <div className="">10 Min</div>
            <div className="">Avg.creating</div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="">
          <div className=""></div>
          <div className="">
            <img src={HERO_IMG} alt="AI book Creator Dashboard" className="" />

            <div>
              <div>
                <div>
                  <Zap className="" />
                </div>
              </div>
              <div>Processing</div>
              <div>Ai Generation</div>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div>
              <BookOpen className="" />
            </div>
            <div>
              <div className="">Completed</div>
              <div className="">274 Pages</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
