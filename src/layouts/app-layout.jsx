import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../App.css";
import Header from "@/components/header";
import { Github, Linkedin, Twitter } from "lucide-react";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto">
        <Header />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Trimrr</h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              The only URL shortener you’ll ever need.  
              <br />Fast, secure & reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="hover:text-red-400 transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="hover:text-red-400 transition-colors">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-red-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-red-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-red-400 transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white">Connect</h3>
            <div className="mt-4 flex justify-center md:justify-start space-x-5">
              <a href="#" className="hover:text-red-400 transition-colors">
                <Twitter size={22} />
              </a>
              <a href="https://github.com/arunava2018" className="hover:text-red-400 transition-colors">
                <Github size={22} />
              </a>
              <a href="https://www.linkedin.com/in/arunava-banerjee1/" className="hover:text-red-400 transition-colors">
                <Linkedin size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
          <p>
            Made with <span className="text-red-500">❤️</span> by{" "}
            <span className="font-medium text-gray-300">Trimrr</span> • ©{" "}
            {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
