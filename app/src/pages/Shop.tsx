import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, ShoppingCart, Star, 
  Grid3X3, List, X, SlidersHorizontal 
} from 'lucide-react';
import type { Product, PageResponse } from '@/types';
import apiService from '@/services/api';
import { useCart } from '@/context/CartContext';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<PageResponse<Product> | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { addToCart } = useCart();

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '0'));

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getProducts(
        selectedCategory,
        searchQuery,
        sortBy,
        sortOrder,
        currentPage,
        12
      );
      console.debug('api.getProducts ->', {
        url: import.meta.env.VITE_API_URL,
        params: { selectedCategory, searchQuery, sortBy, sortOrder, currentPage, size: 12 },
        dataPreview: Array.isArray((data as any)?.content) ? (data as any).content.slice(0, 5) : data,
      });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await apiService.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const updateSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'name') params.set('sortBy', sortBy);
    if (sortOrder !== 'asc') params.set('sortOrder', sortOrder);
    if (currentPage > 0) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchQuery, selectedCategory, sortBy, sortOrder, currentPage, setSearchParams]);

  useEffect(() => {
    updateSearchParams();
  }, [updateSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchProducts();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setCurrentPage(0);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-imperial-brown mb-4">
            Our Cake Collection
          </h1>
          <p className="text-imperial-brown/60 max-w-2xl">
            Browse our exquisite selection of handcrafted cakes, each made with love and the finest ingredients.
          </p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-imperial-brown/40" />
              <input
                type="text"
                placeholder="Search cakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-imperial-soft bg-white focus:border-imperial-gold focus:ring-2 focus:ring-imperial-gold/20 transition-all"
              />
            </div>
          </form>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-imperial-soft bg-white text-imperial-brown"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* Category Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-imperial-soft bg-white text-imperial-brown hover:border-imperial-gold transition-colors">
                <Filter className="w-5 h-5" />
                {selectedCategory || 'All Categories'}
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-luxury overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-4 py-3 hover:bg-imperial-soft/50 transition-colors ${
                    !selectedCategory ? 'bg-imperial-gold/10 text-imperial-gold' : ''
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-4 py-3 hover:bg-imperial-soft/50 transition-colors ${
                      selectedCategory === cat ? 'bg-imperial-gold/10 text-imperial-gold' : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-imperial-soft bg-white text-imperial-brown hover:border-imperial-gold transition-colors">
                Sort by
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-luxury overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                {[
                  { label: 'Name (A-Z)', value: 'name', order: 'asc' },
                  { label: 'Name (Z-A)', value: 'name', order: 'desc' },
                  { label: 'Price (Low-High)', value: 'price', order: 'asc' },
                  { label: 'Price (High-Low)', value: 'price', order: 'desc' },
                ].map((option) => (
                  <button
                    key={`${option.value}-${option.order}`}
                    onClick={() => handleSortChange(option.value, option.order)}
                    className={`w-full text-left px-4 py-3 hover:bg-imperial-soft/50 transition-colors ${
                      sortBy === option.value && sortOrder === option.order
                        ? 'bg-imperial-gold/10 text-imperial-gold'
                        : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl border border-imperial-soft bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-imperial-gold text-white' : 'text-imperial-brown/60 hover:text-imperial-brown'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-imperial-gold text-white' : 'text-imperial-brown/60 hover:text-imperial-brown'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || sortBy !== 'name' || sortOrder !== 'asc') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-imperial-brown/60">
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <span>
              Showing {products?.content?.length ?? 0} of {products?.totalElements ?? 0} products
            </span>
          )}
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-luxury p-4 animate-pulse">
                <div className={`rounded-xl bg-imperial-soft/50 ${viewMode === 'grid' ? 'aspect-square' : 'h-48'}`} />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-imperial-soft/50 rounded w-3/4" />
                  <div className="h-3 bg-imperial-soft/50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (products?.content?.length ?? 0) === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-imperial-soft/50 flex items-center justify-center">
              <Search className="w-10 h-10 text-imperial-brown/40" />
            </div>
            <h3 className="font-display text-xl font-semibold text-imperial-brown mb-2">
              No products found
            </h3>
            <p className="text-imperial-brown/60 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl bg-imperial-gold text-white font-medium hover:bg-imperial-dark transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {(products?.content ?? []).map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`group card-luxury ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
                >
                  <Link 
                    to={`/product/${product.id}`}
                    className={`relative overflow-hidden ${viewMode === 'list' ? 'sm:w-64 flex-shrink-0' : ''}`}
                  >
                    <div className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'aspect-video sm:aspect-square'}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-imperial-brown/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {product.featured && (
                      <span className="absolute top-3 left-3 badge-gold">
                        Featured
                      </span>
                    )}
                  </Link>
                  
                  <div className={`p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-imperial-gold text-imperial-gold" />
                        <span className="text-sm text-imperial-brown/70">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-display font-semibold text-lg text-imperial-brown mb-2 line-clamp-2 group-hover:text-imperial-gold transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {viewMode === 'list' && (
                        <p className="text-imperial-brown/60 text-sm line-clamp-2 mb-4">
                          {product.description}
                        </p>
                      )}
                      <span className="inline-block px-3 py-1 rounded-full bg-imperial-soft/50 text-imperial-brown/70 text-xs mb-3">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className={`flex items-center ${viewMode === 'list' ? 'justify-between' : 'justify-between'}`}>
                      <span className="text-imperial-gold font-bold text-xl">
                        ${product.price.toFixed(2)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                          product.stock === 0
                            ? 'bg-imperial-soft/50 text-imperial-brown/40 cursor-not-allowed'
                            : 'bg-imperial-gold text-white hover:bg-imperial-dark shadow-soft hover:shadow-glow'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.stock === 0 ? 'Out of Stock' : 'Add'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {products && products.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-2 mt-12"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-xl border border-imperial-soft bg-white text-imperial-brown disabled:opacity-50 disabled:cursor-not-allowed hover:border-imperial-gold transition-colors"
            >
              Previous
            </button>
            
            {[...Array(products.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                  currentPage === i
                    ? 'bg-imperial-gold text-white'
                    : 'border border-imperial-soft bg-white text-imperial-brown hover:border-imperial-gold'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(products.totalPages - 1, p + 1))}
              disabled={currentPage === products.totalPages - 1}
              className="px-4 py-2 rounded-xl border border-imperial-soft bg-white text-imperial-brown disabled:opacity-50 disabled:cursor-not-allowed hover:border-imperial-gold transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-luxury overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold">Filters</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-10 h-10 rounded-xl bg-imperial-soft/50 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-semibold text-imperial-brown mb-4">Categories</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        !selectedCategory ? 'bg-imperial-gold text-white' : 'bg-imperial-soft/30 hover:bg-imperial-soft/50'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                          selectedCategory === cat ? 'bg-imperial-gold text-white' : 'bg-imperial-soft/30 hover:bg-imperial-soft/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-8">
                  <h4 className="font-semibold text-imperial-brown mb-4">Sort By</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Name (A-Z)', value: 'name', order: 'asc' },
                      { label: 'Name (Z-A)', value: 'name', order: 'desc' },
                      { label: 'Price (Low-High)', value: 'price', order: 'asc' },
                      { label: 'Price (High-Low)', value: 'price', order: 'desc' },
                    ].map((option) => (
                      <button
                        key={`${option.value}-${option.order}`}
                        onClick={() => handleSortChange(option.value, option.order)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                          sortBy === option.value && sortOrder === option.order
                            ? 'bg-imperial-gold text-white'
                            : 'bg-imperial-soft/30 hover:bg-imperial-soft/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-4 rounded-xl bg-gold-gradient text-white font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
