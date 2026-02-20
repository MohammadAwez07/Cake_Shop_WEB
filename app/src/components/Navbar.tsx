import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, User, Menu, X, Cake, LogOut, 
  LayoutDashboard, ChevronDown 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-soft py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow"
              >
                <Cake className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-imperial-brown leading-tight">
                  AMMAS
                </span>
                <span className="text-xs text-imperial-gold font-medium tracking-wider">
                  PASTRIES
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium text-sm transition-colors ${
                    isActive(link.path)
                      ? 'text-imperial-gold'
                      : 'text-imperial-brown hover:text-imperial-gold'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-gradient rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link to="/cart" className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive('/cart')
                      ? 'bg-imperial-gold text-white'
                      : 'bg-imperial-soft/50 text-imperial-brown hover:bg-imperial-gold hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </motion.div>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gold-gradient text-white text-xs font-bold rounded-full flex items-center justify-center shadow-soft"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </Link>

              {/* User Actions */}
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isProfileOpen
                        ? 'bg-imperial-gold text-white'
                        : 'bg-imperial-soft/50 text-imperial-brown hover:bg-imperial-gold hover:text-white'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block text-sm font-medium">{user?.name.split(' ')[0]}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-luxury overflow-hidden z-50"
                      >
                        <div className="p-2">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-imperial-brown hover:bg-imperial-soft/50 transition-colors"
                            >
                              <LayoutDashboard className="w-5 h-5 text-imperial-gold" />
                              <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                          )}
                          <Link
                            to="/orders"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-imperial-brown hover:bg-imperial-soft/50 transition-colors"
                          >
                            <ShoppingBag className="w-5 h-5 text-imperial-gold" />
                            <span className="text-sm font-medium">My Orders</span>
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-gradient text-white font-medium text-sm shadow-soft hover:shadow-glow transition-shadow"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">Sign In</span>
                  </motion.button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-xl bg-imperial-soft/50 text-imperial-brown flex items-center justify-center hover:bg-imperial-gold hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-luxury"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
            >
              <div className="pt-20 px-6">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                          isActive(link.path)
                            ? 'bg-imperial-gold text-white'
                            : 'text-imperial-brown hover:bg-imperial-soft/50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {!isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 pt-8 border-t border-imperial-soft"
                  >
                    <Link to="/login">
                      <button className="w-full py-3 rounded-xl bg-gold-gradient text-white font-medium shadow-soft">
                        Sign In
                      </button>
                    </Link>
                    <p className="mt-4 text-center text-sm text-imperial-brown/60">
                      Don&apos;t have an account?{' '}
                      <Link to="/register" className="text-imperial-gold font-medium hover:underline">
                        Sign Up
                      </Link>
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
