import React from 'react'
import { Outlet, Link } from "react-router-dom"
import "../App.css"
import Header from '@/components/header'

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto">
        <Header />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">Trimrr</h2>
            <p className="mt-2 text-sm text-gray-400">
              The only URL shortener you’ll ever need. Fast, secure & reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li><Link to="/" className="hover:text-red-400">Home</Link></li>
              <li><Link to="/pricing" className="hover:text-red-400">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-red-400">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-red-400">Contact</Link></li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white">Connect</h3>
            <div className="mt-3 flex justify-center sm:justify-start space-x-4">
              <a href="#" className="hover:text-red-400">Twitter</a>
              <a href="#" className="hover:text-red-400">GitHub</a>
              <a href="#" className="hover:text-red-400">LinkedIn</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
          <p>Made with ❤️ by Trimrr • © {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
