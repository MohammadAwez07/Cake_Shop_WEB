import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Star, ChefHat, Truck, Award, 
  Heart, Sparkles 
} from 'lucide-react';
import type { Product } from '@/types';
import apiService from '@/services/api';
import { useCart } from '@/context/CartContext';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await apiService.getFeaturedProducts();
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80"
            alt="Luxury Cake"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-imperial-brown/90 via-imperial-brown/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-imperial-gold" />
              <span className="text-white/90 text-sm font-medium">Artisanal Bakery Since 1995</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Taste the{' '}
              <span className="text-gradient bg-gold-gradient bg-clip-text text-transparent">
                Art of Baking
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed"
            >
              Indulge in our handcrafted cakes made with the finest ingredients. 
              Every bite is a celebration of flavor, artistry, and love.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-gradient text-white font-semibold shadow-soft hover:shadow-glow transition-shadow"
                >
                  Explore Our Cakes
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Our Story
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20"
            >
              {[
                { value: '25+', label: 'Years Experience' },
                { value: '50K+', label: 'Happy Customers' },
                { value: '100+', label: 'Cake Varieties' },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="font-display text-3xl font-bold text-imperial-gold">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-imperial-gold" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-imperial-gold/10 text-imperial-gold text-sm font-medium mb-4">
              Our Signature Collection
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-imperial-brown mb-4">
              Featured Cakes
            </h2>
            <p className="text-imperial-brown/60 max-w-2xl mx-auto">
              Discover our most beloved creations, handcrafted with passion and perfected over generations.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-luxury p-4">
                  <div className="aspect-square rounded-xl bg-imperial-soft/50 animate-pulse" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-imperial-soft/50 rounded animate-pulse" />
                    <div className="h-3 bg-imperial-soft/50 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={fadeInUp}
                  className="group card-luxury"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-imperial-brown/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      className="absolute bottom-4 left-4 right-4 py-3 rounded-xl bg-white text-imperial-brown font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-soft"
                    >
                      Add to Cart
                    </motion.button>
                    {product.featured && (
                      <span className="absolute top-3 left-3 badge-gold">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-imperial-gold text-imperial-gold" />
                      <span className="text-sm text-imperial-brown/70">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-imperial-brown mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-imperial-gold font-bold text-xl">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-imperial-gold text-imperial-gold font-semibold hover:bg-imperial-gold hover:text-white transition-colors"
              >
                View All Cakes
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-imperial-gold/10 text-imperial-gold text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-imperial-brown mb-4">
              The AMMAS Difference
            </h2>
            <p className="text-imperial-brown/60 max-w-2xl mx-auto">
              We believe in creating more than just cakes – we create memories that last a lifetime.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: ChefHat,
                title: 'Master Bakers',
                description: 'Our team of expert bakers brings decades of experience to every creation.',
              },
              {
                icon: Heart,
                title: 'Premium Ingredients',
                description: 'We use only the finest, locally-sourced ingredients for authentic flavors.',
              },
              {
                icon: Truck,
                title: 'Fresh Delivery',
                description: 'Same-day delivery ensures your cake arrives fresh and perfect every time.',
              },
              {
                icon: Award,
                title: 'Award Winning',
                description: 'Recognized excellence with multiple awards for our artisanal creations.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-8 rounded-2xl bg-imperial-cream hover:bg-imperial-soft/50 transition-colors group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-semibold text-xl text-imperial-brown mb-3">
                  {feature.title}
                </h3>
                <p className="text-imperial-brown/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-imperial-gold/10 text-imperial-gold text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-imperial-brown mb-4">
              What Our Customers Say
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: 'Sarah Johnson',
                role: 'Wedding Client',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                quote: 'The wedding cake was absolutely stunning! Not only did it look like a piece of art, but it tasted divine. Our guests are still talking about it!',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'Regular Customer',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                quote: 'I\'ve been ordering from AMMAS for years. Their attention to detail and consistent quality is unmatched. The chocolate truffle is my favorite!',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Event Planner',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                quote: 'As an event planner, I need reliable partners. AMMAS never disappoints. Their custom cakes always exceed my clients\' expectations.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="card-luxury p-8 relative"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-imperial-gold text-imperial-gold" />
                  ))}
                </div>
                <p className="text-imperial-brown/70 mb-6 leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-imperial-brown">{testimonial.name}</h4>
                    <p className="text-sm text-imperial-brown/60">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=1920&q=80"
                alt="Bakery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-imperial-brown/80" />
            </div>
            
            <div className="relative z-10 py-16 px-8 md:px-16 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-display text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                Ready to Order Your Dream Cake?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-white/70 max-w-2xl mx-auto mb-8"
              >
                Whether it&apos;s a birthday, wedding, or just because – we&apos;re here to make your celebration sweeter.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/shop">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl bg-gold-gradient text-white font-semibold shadow-soft hover:shadow-glow transition-shadow"
                  >
                    Order Now
                  </motion.button>
                </Link>
                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    Contact Us
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
