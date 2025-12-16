import { BookOpen, Twitter, Linkedin, Github, Book } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="">
      <div className="">
        <div className=""></div>
      </div>
      <div className="">
        <div className="">
          <div className="">
            <a href="/" className="">
              <div className="">
                <BookOpen className="" />
              </div>
              <span className="">AI Ebook</span>
            </a>
            <p className="">Create , design and publish stunning ebooks with us</p>

            <div className="flex">
              <a href="https://x.com/yogendervermaa" className="" aria-label="Twitter">
                <Twitter className="" />
              </a>
              <a
                href="https://www.linkedin.com/in/yogendervermaa/"
                className=""
                aria-label="LinkedIn"
              >
                <Linkedin className="" />
              </a>
              <a href="https://github.com/YogenderVermaa" className="" aria-label="Github">
                <Github className="" />
              </a>
            </div>
          </div>
        </div>
        <div className="">
          <div className="">
            <p className="">© {new Date().getFullYear()} Ai-Ebook creator.All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
