import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cake, Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
          className="relative mb-8"
        >
          <div className="w-40 h-40 mx-auto rounded-full bg-imperial-soft/50 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-imperial-soft flex items-center justify-center">
              <Cake className="w-16 h-16 text-imperial-gold" />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center shadow-soft"
          >
            <span className="font-display font-bold text-2xl text-white">?</span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-7xl font-bold text-imperial-gold mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl font-bold text-imperial-brown mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-imperial-brown/60 mb-8 text-lg"
        >
          Oops! Looks like this page has been eaten. 
          The cake you&apos;re looking for doesn&apos;t exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gold-gradient text-white font-semibold shadow-soft hover:shadow-glow transition-shadow w-full sm:w-auto"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-imperial-gold text-imperial-gold font-semibold hover:bg-imperial-gold hover:text-white transition-colors w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex justify-center gap-4"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="w-3 h-3 rounded-full bg-imperial-gold/30"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
