import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, Package, 
  DollarSign, Clock, Plus, Edit2, Trash2,
  BarChart3, PieChart
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart as RePieChart, 
  Pie, Cell
} from 'recharts';
import type { Product, Order, DashboardStats, ProductRequest } from '@/types';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api';
import ProductFormModal from '@/components/ProductFormModal';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [categories, setCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsData, ordersData, productsData, categoriesData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getAllOrders(),
          apiService.getProducts('', '', 'name', 'asc', 0, 100),
          apiService.getCategories(),
        ]);
        setStats(statsData);
        setOrders(ordersData);
        setProducts(productsData.content);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate]);

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await apiService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmitProduct = async (data: ProductRequest) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = await apiService.updateProduct(editingProduct.id, data);
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const newProduct = await apiService.createProduct(data);
        setProducts([newProduct, ...products]);
        toast.success('Product created successfully');
      }
    } catch (error: any) {
      console.error('Failed to save product:', error);
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const salesData = stats?.salesByDate 
    ? Object.entries(stats.salesByDate).map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Number(amount),
      })).slice(-7)
    : [];

  const orderStatusData = stats?.ordersByStatus
    ? Object.entries(stats.ordersByStatus).map(([status, count]) => ({
        name: status,
        value: count,
      }))
    : [];

  const COLORS = ['#F4A300', '#D48806', '#4A2C2A', '#F5E6CA', '#FFF8E7'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'CONFIRMED': return <span className="w-4 h-4 rounded-full bg-blue-500" />;
      case 'PREPARING': return <Package className="w-4 h-4" />;
      case 'READY': return <span className="w-4 h-4 rounded-full bg-indigo-500" />;
      case 'DELIVERED': return <span className="w-4 h-4 rounded-full bg-green-500" />;
      case 'CANCELLED': return <span className="w-4 h-4 rounded-full bg-red-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
      case 'PREPARING': return 'bg-purple-100 text-purple-700';
      case 'READY': return 'bg-indigo-100 text-indigo-700';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full" />
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
          <h1 className="font-display text-4xl font-bold text-imperial-brown mb-2">
            Admin Dashboard
          </h1>
          <p className="text-imperial-brown/60">
            Manage your products, orders, and view analytics
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-imperial-gold text-white'
                  : 'bg-white text-imperial-brown hover:bg-imperial-soft/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { 
                  label: 'Total Revenue', 
                  value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, 
                  icon: DollarSign,
                  change: '+12%',
                  color: 'bg-green-100 text-green-700'
                },
                { 
                  label: 'Total Orders', 
                  value: stats?.totalOrders?.toString() || '0', 
                  icon: ShoppingBag,
                  change: '+8%',
                  color: 'bg-blue-100 text-blue-700'
                },
                { 
                  label: 'Total Products', 
                  value: stats?.totalProducts?.toString() || '0', 
                  icon: Package,
                  change: '+3%',
                  color: 'bg-purple-100 text-purple-700'
                },
                { 
                  label: 'Pending Orders', 
                  value: stats?.pendingOrders?.toString() || '0', 
                  icon: Clock,
                  change: 'Action needed',
                  color: 'bg-yellow-100 text-yellow-700'
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-luxury p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.color}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-imperial-brown/60 text-sm">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-imperial-brown">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales Chart */}
              <div className="card-luxury p-6">
                <h3 className="font-display text-lg font-bold text-imperial-brown mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-imperial-gold" />
                  Sales (Last 7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5E6CA" />
                    <XAxis dataKey="date" stroke="#4A2C2A" fontSize={12} />
                    <YAxis stroke="#4A2C2A" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFF8E7', 
                        border: '1px solid #F5E6CA',
                        borderRadius: '12px'
                      }} 
                    />
                    <Bar dataKey="amount" fill="#F4A300" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Order Status Chart */}
              <div className="card-luxury p-6">
                <h3 className="font-display text-lg font-bold text-imperial-brown mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-imperial-gold" />
                  Orders by Status
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {orderStatusData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-imperial-brown/70">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card-luxury p-6">
              <h3 className="font-display text-lg font-bold text-imperial-brown mb-6">
                Recent Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-imperial-soft">
                      <th className="text-left py-3 px-4 text-sm font-medium text-imperial-brown/60">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-imperial-brown/60">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-imperial-brown/60">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-imperial-brown/60">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-imperial-brown/60">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-imperial-soft/50">
                        <td className="py-3 px-4 text-sm">#{order.id.toString().padStart(4, '0')}</td>
                        <td className="py-3 px-4 text-sm">{order.userName}</td>
                        <td className="py-3 px-4 text-sm font-medium">${order.totalPrice.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-imperial-brown/60">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold text-imperial-brown">
                All Products
              </h2>
              <button
                onClick={handleAddProduct}
                data-testid="add-product-button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-imperial-gold text-white font-medium hover:bg-imperial-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>

            <div className="card-luxury overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-imperial-soft/30">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Product</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Category</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Price</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Stock</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-imperial-soft/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="font-medium text-imperial-brown">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">{product.category}</td>
                        <td className="py-4 px-6 text-sm font-medium">${product.price.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-700' 
                              : product.stock > 0 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              data-testid={`edit-product-${product.id}`}
                              className="w-8 h-8 rounded-lg bg-imperial-soft/50 flex items-center justify-center hover:bg-imperial-gold hover:text-white transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              data-testid={`delete-product-${product.id}`}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-display text-2xl font-bold text-imperial-brown mb-6">
              All Orders
            </h2>

            <div className="card-luxury overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-imperial-soft/30">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Order ID</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Customer</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Items</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Total</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-imperial-brown">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-imperial-soft/50">
                        <td className="py-4 px-6 text-sm font-medium">#{order.id.toString().padStart(4, '0')}</td>
                        <td className="py-4 px-6 text-sm">{order.userName}</td>
                        <td className="py-4 px-6 text-sm">{order.items.length} items</td>
                        <td className="py-4 px-6 text-sm font-medium">${order.totalPrice.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(order.status)}`}
                          >
                            {['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'].map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => alert('View details coming soon!')}
                            className="text-imperial-gold hover:underline text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProduct}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
};

export default AdminDashboard;
