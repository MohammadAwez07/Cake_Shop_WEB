import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, MapPin, Phone, User, Check, 
  ArrowLeft, Package, Truck, Shield 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    notes: '',
  });

  const shippingCost = totalPrice > 100 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  if (items.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderRequest = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        deliveryAddress: formData.address,
        deliveryCity: formData.city,
        deliveryZip: formData.zip,
        deliveryPhone: formData.phone,
        deliveryNotes: formData.notes,
      };

      await apiService.createOrder(orderRequest);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <Check className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-imperial-brown mb-3">
            Order Placed Successfully!
          </h2>
          <p className="text-imperial-brown/60 mb-8">
            Thank you for your order. We&apos;ll send you a confirmation email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/orders')}
              className="px-8 py-4 rounded-xl bg-gold-gradient text-white font-semibold shadow-soft"
            >
              View My Orders
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/shop')}
              className="px-8 py-4 rounded-xl border-2 border-imperial-gold text-imperial-gold font-semibold"
            >
              Continue Shopping
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-imperial-brown/60 hover:text-imperial-gold transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
          <h1 className="font-display text-4xl font-bold text-imperial-brown">
            Checkout
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-luxury p-6 mb-6"
              >
                <h2 className="font-display text-xl font-bold text-imperial-brown mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-imperial-gold" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-imperial-brown mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-luxury"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-imperial-brown mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-luxury"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-imperial-brown mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-imperial-brown/40" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="input-luxury pl-12"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-luxury p-6 mb-6"
              >
                <h2 className="font-display text-xl font-bold text-imperial-brown mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-imperial-gold" />
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-imperial-brown mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="input-luxury"
                      placeholder="123 Baker Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-imperial-brown mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="input-luxury"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imperial-brown mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        className="input-luxury"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-imperial-brown mb-2">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-luxury resize-none"
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-luxury p-6 mb-6"
              >
                <h2 className="font-display text-xl font-bold text-imperial-brown mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-imperial-gold" />
                  Payment Method
                </h2>
                <div className="p-4 rounded-xl bg-imperial-soft/30 border-2 border-imperial-gold">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-imperial-gold bg-imperial-gold flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium text-imperial-brown">Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-imperial-brown/60 mt-2 ml-8">
                    Pay when your order arrives. Our delivery partner will collect the payment.
                  </p>
                </div>
              </motion.div>

              {/* Mobile Order Summary */}
              <div className="lg:hidden">
                <OrderSummary 
                  totalPrice={totalPrice}
                  shippingCost={shippingCost}
                  tax={tax}
                  finalTotal={finalTotal}
                  items={items}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gold-gradient text-white font-semibold shadow-soft hover:shadow-glow transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : `Place Order - $${finalTotal.toFixed(2)}`}
              </motion.button>
            </form>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block">
            <OrderSummary 
              totalPrice={totalPrice}
              shippingCost={shippingCost}
              tax={tax}
              finalTotal={finalTotal}
              items={items}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrderSummaryProps {
  totalPrice: number;
  shippingCost: number;
  tax: number;
  finalTotal: number;
  items: { product: { name: string; price: number; imageUrl: string }; quantity: number }[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  totalPrice, shippingCost, tax, finalTotal, items 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="lg:sticky lg:top-28"
  >
    <div className="card-luxury p-6">
      <h2 className="font-display text-xl font-bold text-imperial-brown mb-6">
        Order Summary
      </h2>

      {/* Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-3">
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-imperial-brown text-sm line-clamp-1">
                {item.product.name}
              </h4>
              <p className="text-imperial-brown/60 text-sm">
                Qty: {item.quantity}
              </p>
              <p className="text-imperial-gold font-medium text-sm">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-imperial-soft pt-4 space-y-3">
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
      </div>

      <div className="border-t border-imperial-soft pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="font-display font-bold text-lg text-imperial-brown">Total</span>
          <span className="font-display font-bold text-2xl text-imperial-gold">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-imperial-soft">
        {[
          { icon: Package, text: 'Secure' },
          { icon: Truck, text: 'Fast' },
          { icon: Shield, text: 'Guaranteed' },
        ].map((badge, idx) => (
          <div key={idx} className="text-center">
            <badge.icon className="w-5 h-5 mx-auto mb-1 text-imperial-gold" />
            <span className="text-xs text-imperial-brown/60">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default Checkout;
