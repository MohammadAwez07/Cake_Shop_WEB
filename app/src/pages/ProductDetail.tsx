import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, ShoppingCart, Heart, Share2, ArrowLeft, 
  Plus, Minus, Check, Truck, Shield, Clock 
} from 'lucide-react';
import type { Product, Review } from '@/types';
import apiService from '@/services/api';
import { useCart } from '@/context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItem, updateQuantity } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [productData, reviewsData] = await Promise.all([
          apiService.getProductById(parseInt(id)),
          apiService.getProductReviews(parseInt(id)),
        ]);
        
        setProduct(productData);
        setReviews(reviewsData);
        
        // Fetch related products from same category
        const related = await apiService.getProductsByCategory(productData.category);
        setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 4));
        
        // Check if product is in cart
        const cartItem = getCartItem(productData.id);
        if (cartItem) {
          setQuantity(cartItem.quantity);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        navigate('/shop');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id, navigate, getCartItem]);

  const handleAddToCart = () => {
    if (product) {
      if (isInCart(product.id)) {
        updateQuantity(product.id, quantity);
      } else {
        for (let i = 0; i < quantity; i++) {
          addToCart(product);
        }
      }
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product?.stock || 99, prev + delta)));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-2xl bg-imperial-soft/50 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-imperial-soft/50 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-imperial-soft/50 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-imperial-soft/50 rounded w-full animate-pulse" />
              <div className="h-4 bg-imperial-soft/50 rounded w-5/6 animate-pulse" />
              <div className="h-12 bg-imperial-soft/50 rounded w-1/3 animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-imperial-brown mb-4">
            Product not found
          </h2>
          <Link to="/shop" className="text-imperial-gold hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const productInCart = isInCart(product.id);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-imperial-brown/60 mb-8"
        >
          <Link to="/" className="hover:text-imperial-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-imperial-gold transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-imperial-gold transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-imperial-brown">{product.name}</span>
        </motion.nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-card mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <span className="absolute top-4 left-4 badge-gold">
                  Featured
                </span>
              )}
            </div>
            {/* Thumbnail Gallery - would show multiple images if available */}
            <div className="flex gap-3">
              {[product.imageUrl].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === idx ? 'border-imperial-gold' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-imperial-brown/60 hover:text-imperial-gold transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-imperial-soft/50 text-imperial-brown/70 text-sm">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-imperial-gold text-imperial-gold" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-imperial-brown/60">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-bold text-imperial-brown mb-4">
              {product.name}
            </h1>

            <p className="text-imperial-gold font-bold text-3xl mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-imperial-brown/70 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: Truck, text: 'Free Delivery' },
                { icon: Shield, text: 'Fresh Guarantee' },
                { icon: Clock, text: 'Same Day Available' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-imperial-brown/60">
                  <feature.icon className="w-4 h-4 text-imperial-gold" />
                  {feature.text}
                </div>
              ))}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-xl border border-imperial-soft flex items-center justify-center hover:border-imperial-gold disabled:opacity-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-xl border border-imperial-soft flex items-center justify-center hover:border-imperial-gold disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 max-w-xs flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
                  product.stock === 0
                    ? 'bg-imperial-soft/50 text-imperial-brown/40 cursor-not-allowed'
                    : productInCart
                    ? 'bg-green-500 text-white shadow-soft'
                    : 'bg-gold-gradient text-white shadow-soft hover:shadow-glow'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0
                  ? 'Out of Stock'
                  : productInCart
                  ? 'Update Cart'
                  : 'Add to Cart'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-imperial-soft hover:border-imperial-gold'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-xl border border-imperial-soft flex items-center justify-center hover:border-imperial-gold transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-imperial-soft pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-imperial-brown/60">Category:</span>
                  <span className="ml-2 text-imperial-brown font-medium">{product.category}</span>
                </div>
                <div>
                  <span className="text-imperial-brown/60">SKU:</span>
                  <span className="ml-2 text-imperial-brown font-medium">CAKE-{product.id.toString().padStart(4, '0')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl font-bold text-imperial-brown mb-6">
            Customer Reviews
          </h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-imperial-brown/60">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="card-luxury p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-imperial-gold text-imperial-gold'
                            : 'text-imperial-soft'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-imperial-brown/70 mb-4">{review.comment}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-imperial-gold/20 flex items-center justify-center">
                      <span className="text-imperial-gold font-semibold">
                        {review.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-imperial-brown">{review.userName}</p>
                      <p className="text-sm text-imperial-brown/50">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-bold text-imperial-brown mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group card-luxury"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-imperial-brown mb-1 line-clamp-1 group-hover:text-imperial-gold transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-imperial-gold font-bold">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
