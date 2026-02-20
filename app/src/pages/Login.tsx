import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, 
  Cake, CheckCircle 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=1200&q=80"
          alt="Bakery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-imperial-brown/90 to-imperial-brown/50" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-xl bg-gold-gradient flex items-center justify-center shadow-soft">
                <Cake className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl leading-tight">AMMAS</span>
                <span className="block text-xs text-imperial-gold tracking-wider">PASTRIES</span>
              </div>
            </div>
            
            <h2 className="font-display text-4xl font-bold mb-6">
              Welcome Back to<br />
              <span className="text-gradient">Sweetness</span>
            </h2>
            
            <p className="text-white/70 text-lg mb-8 max-w-md">
              Sign in to access your account, track orders, and enjoy exclusive member benefits.
            </p>
            
            <div className="space-y-4">
              {[
                'Track your orders in real-time',
                'Save your favorite cakes',
                'Exclusive member discounts',
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-imperial-gold flex-shrink-0" />
                  <span className="text-white/80">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-imperial-cream">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center">
              <Cake className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xl">AMMAS</span>
              <span className="block text-xs text-imperial-gold tracking-wider">PASTRIES</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-imperial-brown mb-2">
              Sign In
            </h1>
            <p className="text-imperial-brown/60">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-imperial-gold font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-imperial-brown mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-imperial-brown/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input-luxury pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-imperial-brown mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-imperial-brown/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="input-luxury pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-imperial-brown/40 hover:text-imperial-brown transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-imperial-soft text-imperial-gold focus:ring-imperial-gold" />
                <span className="text-sm text-imperial-brown/70">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-imperial-gold hover:underline">
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gold-gradient text-white font-semibold shadow-soft hover:shadow-glow transition-shadow disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-imperial-brown/60 mb-4">Or continue with</p>
            <div className="flex justify-center gap-3">
              {['Google', 'Facebook'].map((provider) => (
                <button
                  key={provider}
                  className="px-6 py-3 rounded-xl border border-imperial-soft bg-white text-imperial-brown font-medium hover:border-imperial-gold transition-colors"
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-xl bg-imperial-soft/30">
            <p className="text-sm text-imperial-brown/60 text-center">
              <strong>Demo:</strong> admin@ammaspastries.com / admin123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
