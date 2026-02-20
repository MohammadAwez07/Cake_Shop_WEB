import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  Package, Truck, Shield 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const Cart: React.FC = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, itemCount } = useCart();
  const navigate = useNavigate();

  const shippingCost = totalPrice > 100 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-imperial-soft/50 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-imperial-brown/40" />
          </div>
          <h2 className="font-display text-2xl font-bold text-imperial-brown mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-imperial-brown/60 mb-8">
            Looks like you haven&apos;t added any delicious cakes to your cart yet.
          </p>
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-gold-gradient text-white font-semibold shadow-soft hover:shadow-glow transition-shadow"
            >
              Start Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold text-imperial-brown mb-2">
            Shopping Cart
          </h1>
          <p className="text-imperial-brown/60">
            You have {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-luxury p-4 mb-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Product Image */}
                  <Link 
                    to={`/product/${item.product.id}`}
                    className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-display font-semibold text-lg text-imperial-brown hover:text-imperial-gold transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-imperial-brown/60 text-sm mb-2">
                        {item.product.category}
                      </p>
                      <p className="text-imperial-gold font-bold text-lg">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-imperial-soft flex items-center justify-center hover:border-imperial-gold transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 rounded-lg border border-imperial-soft flex items-center justify-center hover:border-imperial-gold disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link 
              to="/shop"
              className="inline-flex items-center gap-2 text-imperial-gold font-medium hover:underline mt-4"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <div className="card-luxury p-6">
              <h2 className="font-display text-xl font-bold text-imperial-brown mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-imperial-brown/70">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-imperial-brown/70">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-imperial-brown/70">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shippingCost === 0 && (
                  <div className="text-green-600 text-sm flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    You saved $15 on shipping!
                  </div>
                )}
              </div>

              <div className="border-t border-imperial-soft pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold text-lg text-imperial-brown">Total</span>
                  <span className="font-display font-bold text-2xl text-imperial-gold">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl bg-gold-gradient text-white font-semibold shadow-soft hover:shadow-glow transition-shadow flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-imperial-soft">
                {[
                  { icon: Package, text: 'Secure Packaging' },
                  { icon: Truck, text: 'Fast Delivery' },
                  { icon: Shield, text: 'Quality Guaranteed' },
                ].map((badge, idx) => (
                  <div key={idx} className="text-center">
                    <badge.icon className="w-6 h-6 mx-auto mb-2 text-imperial-gold" />
                    <span className="text-xs text-imperial-brown/60">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
