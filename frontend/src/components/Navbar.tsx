import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  LayoutDashboard, 
  Upload, 
  LogOut, 
  User, 
  Settings,
  MessageSquare,
  Bell,
  Search,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SLACK_ROLE_CONFIG } from '../types/user-personas';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userRole = user?.role as keyof typeof SLACK_ROLE_CONFIG;
  const roleConfig = userRole ? SLACK_ROLE_CONFIG[userRole] : null;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slack-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/dashboard" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-slack-purple via-slack-blue to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slack-gray-800 tracking-tight group-hover:text-slack-purple transition-colors duration-300">
                  DesignSight
                </span>
                <span className="text-xs text-slack-gray-500 font-medium tracking-wider uppercase">
                  AI-Powered Design Feedback
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-12">
            <motion.div 
              className="relative w-full"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slack-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects, images, feedback..."
                className="w-full pl-12 pr-4 py-3 bg-slack-gray-50/50 border border-slack-gray-200/50 rounded-2xl text-sm font-medium text-slack-gray-700 placeholder-slack-gray-400 focus:outline-none focus:ring-2 focus:ring-slack-purple/20 focus:border-slack-purple/30 focus:bg-white transition-all duration-300"
              />
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-slack-gray-600 hover:text-slack-gray-900 hover:bg-gradient-to-r hover:from-slack-purple/5 hover:to-slack-blue/5 transition-all duration-300 group"
              >
                <LayoutDashboard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Dashboard
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link
                to="/upload"
                className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-slack-gray-600 hover:text-slack-gray-900 hover:bg-gradient-to-r hover:from-slack-purple/5 hover:to-slack-blue/5 transition-all duration-300 group"
              >
                <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Upload
              </Link>
            </motion.div>
          </div>

          {/* Right Side - Notifications, Profile */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <motion.button 
              className="relative p-3 rounded-xl text-slack-gray-400 hover:text-slack-gray-600 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 group-hover:animate-pulse" />
              <span className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></span>
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-slack-purple/5 hover:to-slack-blue/5 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slack-purple via-slack-blue to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-bold text-slack-gray-800">{user?.name}</p>
                  <p className="text-xs text-slack-gray-500 font-medium">
                    {roleConfig?.label}
                  </p>
                </div>
              </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slack-gray-200/50 py-3 z-50"
                  >
                    <div className="px-5 py-4 border-b border-slack-gray-100/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slack-purple via-slack-blue to-indigo-600 flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slack-gray-800">{user?.name}</p>
                          <p className="text-xs text-slack-gray-500 font-medium">{user?.email}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs px-3 py-1 bg-gradient-to-r from-slack-purple/10 to-slack-blue/10 text-slack-purple rounded-full font-semibold">
                              {roleConfig?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        <Link
                          to="/profile"
                          className="flex items-center px-5 py-3 text-sm font-medium text-slack-gray-700 hover:bg-gradient-to-r hover:from-slack-purple/5 hover:to-slack-blue/5 transition-all duration-300 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                          Profile
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        <Link
                          to="/settings"
                          className="flex items-center px-5 py-3 text-sm font-medium text-slack-gray-700 hover:bg-gradient-to-r hover:from-slack-purple/5 hover:to-slack-blue/5 transition-all duration-300 group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                          Settings
                        </Link>
                      </motion.div>
                      <div className="border-t border-slack-gray-100/50 my-2"></div>
                      <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group"
                        >
                          <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                          Sign out
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl text-slack-gray-400 hover:text-slack-gray-600 hover:bg-gradient-to-r hover:from-slack-purple/5 hover:to-slack-blue/5 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-slack-gray-200/50 py-6 bg-gradient-to-b from-white/95 to-slack-gray-50/50 backdrop-blur-sm"
            >
              <div className="space-y-3">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-slack-gray-600 hover:text-slack-gray-900 hover:bg-gradient-to-r hover:from-slack-purple/5 hover:to-slack-blue/5 transition-all duration-300 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/upload"
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-slack-gray-600 hover:text-slack-gray-900 hover:bg-gradient-to-r hover:from-slack-purple/5 hover:to-slack-blue/5 transition-all duration-300 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Upload className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Upload
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-slack-gray-600 hover:text-slack-gray-900 hover:bg-gradient-to-r hover:from-slack-purple/5 hover:to-slack-blue/5 transition-all duration-300 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Profile
                  </Link>
                </motion.div>
                <div className="border-t border-slack-gray-200/50 my-3"></div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group"
                  >
                    <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Sign out
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
