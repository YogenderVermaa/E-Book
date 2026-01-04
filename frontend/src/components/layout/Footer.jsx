import { BookOpen, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-1 bg-gradient-to-r from-violet-600 to-purple-600"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-3 group justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                AI Ebook
              </span>
            </a>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Create, design and publish stunning ebooks with us
            </p>

            <div className="flex gap-3 justify-center pt-2">
              <a
                href="https://x.com/yogendervermaa"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-violet-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/yogendervermaa/"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-violet-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/YogenderVermaa"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-violet-600 transition-colors"
                aria-label="Github"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AI-Ebook Creator. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
