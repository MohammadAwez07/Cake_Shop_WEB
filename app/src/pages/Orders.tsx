import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Clock, CheckCircle, Truck, Package,
  XCircle, ChevronRight, Calendar
} from 'lucide-react';
import type { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api';

const Orders: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const data = await apiService.getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-5 h-5" />;
      case 'CONFIRMED': return <CheckCircle className="w-5 h-5" />;
      case 'PREPARING': return <Package className="w-5 h-5" />;
      case 'READY': return <CheckCircle className="w-5 h-5" />;
      case 'DELIVERED': return <Truck className="w-5 h-5" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PREPARING': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'READY': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusProgress = (status: string) => {
    const stages = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];
    const index = stages.indexOf(status);
    if (index === -1) return 0;
    return ((index + 1) / stages.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (orders.length === 0) {
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
            No Orders Yet
          </h2>
          <p className="text-imperial-brown/60 mb-8">
            You haven&apos;t placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-gold-gradient text-white font-semibold shadow-soft"
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold text-imperial-brown mb-2">
            My Orders
          </h1>
          <p className="text-imperial-brown/60">
            Track and manage your orders
          </p>
        </motion.div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-luxury overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-imperial-soft/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-display font-bold text-lg text-imperial-brown">
                        Order #{order.id.toString().padStart(4, '0')}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-imperial-brown/60">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-imperial-brown/60">Total</p>
                    <p className="font-display font-bold text-xl text-imperial-gold">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {order.status !== 'CANCELLED' && (
                  <div className="mt-6">
                    <div className="h-2 bg-imperial-soft rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getStatusProgress(order.status)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gold-gradient rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-imperial-brown/60">
                      <span>Ordered</span>
                      <span>Confirmed</span>
                      <span>Preparing</span>
                      <span>Ready</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-imperial-brown">{item.productName}</h4>
                        <p className="text-sm text-imperial-brown/60">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-imperial-brown">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-imperial-brown/60 text-center">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                {/* Delivery Info */}
                <div className="mt-6 pt-6 border-t border-imperial-soft/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-imperial-brown/60 mb-1">Delivery Address</p>
                      <p className="text-imperial-brown">{order.deliveryAddress}</p>
                      <p className="text-imperial-brown">{order.deliveryCity}, {order.deliveryZip}</p>
                    </div>
                    <div>
                      <p className="text-imperial-brown/60 mb-1">Contact</p>
                      <p className="text-imperial-brown">{order.deliveryPhone}</p>
                      {order.deliveryNotes && (
                        <p className="text-imperial-brown/60 mt-1">{order.deliveryNotes}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-imperial-soft/50 flex justify-end">
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-2 text-imperial-gold font-medium hover:underline"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
