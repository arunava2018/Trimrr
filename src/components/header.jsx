import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LinkIcon, Menu, X, Settings, User, BarChart3 } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/useFetch";
import { BarLoader } from "react-spinners";
import { signout } from "@/db/apiAuth";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, fetchUser } = UrlState();
  const { loading, fn: fnLogOut } = useFetch(signout);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await fnLogOut();
    fetchUser();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard", requireAuth: true },
  ];

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Trimrrly
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                if (item.requireAuth && !user) return null;
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={item.path}
                      className={`relative px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        isActive
                          ? "text-white bg-red-500/20 border border-red-500/30"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl border border-red-500/20"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </motion.div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-red-500/30">
                        <AvatarImage
                          src={user?.user_metadata?.profile_pic}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white font-bold">
                          {user?.user_metadata?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white truncate max-w-32">
                          {user?.user_metadata?.name}
                        </div>
                        <div className="text-xs text-gray-400">Online</div>
                      </div>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl"
                  >
                    <DropdownMenuLabel className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.user_metadata?.profile_pic} />
                          <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                            {user?.user_metadata?.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white">
                            {user?.user_metadata?.name}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700/50" />
                    
                    <DropdownMenuItem asChild className="px-4 py-3 hover:bg-gray-800/50 focus:bg-gray-800/50">
                      <Link to="/dashboard" className="flex items-center space-x-3 cursor-pointer">
                        <LinkIcon className="h-4 w-4 text-blue-400" />
                        <span className="text-white">My Links</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="px-4 py-3 hover:bg-gray-800/50 focus:bg-gray-800/50 cursor-pointer">
                      <Link to="/dashboard" className="flex items-center space-x-3 cursor-pointer">
                        <BarChart3 className="h-4 w-4 text-green-400" />
                        <span className="text-white">Analytics</span>
                      </Link>
                    </DropdownMenuItem>


                    <DropdownMenuSeparator className="bg-gray-700/50" />
                    
                    <DropdownMenuItem
                      disabled={loading}
                      onClick={handleLogout}
                      className="px-4 py-3 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center w-full">
                          <BarLoader width={60} color="#ef4444" height={2} />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <LogOut className="h-4 w-4 text-red-400" />
                          <span className="text-red-400">Log out</span>
                        </div>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Navigation Items */}
                {navItems.map((item) => {
                  if (item.requireAuth && !user) return null;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl font-semibold transition-all ${
                          isActive
                            ? "text-white bg-red-500/20 border border-red-500/30"
                            : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* User Section */}
                {user ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="border-t border-gray-700/50 pt-4 space-y-3"
                  >
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.user_metadata?.profile_pic} />
                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                          {user?.user_metadata?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white">
                          {user?.user_metadata?.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleLogout}
                      disabled={loading}
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      {loading ? (
                        <BarLoader width={60} color="#ef4444" height={2} />
                      ) : (
                        <>
                          <LogOut className="mr-3 h-4 w-4" />
                          Log out
                        </>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="border-t border-gray-700/50 pt-4"
                  >
                    <Button
                      onClick={() => {
                        navigate("/auth");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl"
                    >
                      Get Started
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Top Loading Bar */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full z-50"
          >
            <BarLoader width="100%" color="#ef4444" height={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content overlap */}
      <div className="h-16" />
    </>
  );
};

export default Header;
