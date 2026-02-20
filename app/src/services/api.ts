import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { 
  AuthResponse, LoginRequest, RegisterRequest, 
  Product, ProductRequest, Order, OrderRequest, 
  Review, ReviewRequest, DashboardStats, PageResponse 
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  // Product APIs
  async getProducts(
    category?: string,
    search?: string,
    sortBy: string = 'name',
    sortOrder: string = 'asc',
    page: number = 0,
    size: number = 12
  ): Promise<PageResponse<Product>> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await this.client.get<PageResponse<Product>>(`/products?${params}`);
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await this.client.get<Product>(`/products/${id}`);
    return response.data;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await this.client.get<Product[]>('/products/featured');
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await this.client.get<string[]>('/products/categories');
    return response.data;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await this.client.get<Product[]>(`/products/category/${category}`);
    return response.data;
  }

  // Admin Product APIs
  async createProduct(data: ProductRequest): Promise<Product> {
    const response = await this.client.post<Product>('/admin/products', data);
    return response.data;
  }

  async updateProduct(id: number, data: ProductRequest): Promise<Product> {
    const response = await this.client.put<Product>(`/admin/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.client.delete(`/admin/products/${id}`);
  }

  // Order APIs
  async getUserOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/orders/user');
    return response.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await this.client.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async createOrder(data: OrderRequest): Promise<Order> {
    const response = await this.client.post<Order>('/orders', data);
    return response.data;
  }

  // Admin Order APIs
  async getAllOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/admin/orders');
    return response.data;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const response = await this.client.put<Order>(`/admin/orders/${orderId}/status?status=${status}`);
    return response.data;
  }

  // Review APIs
  async getProductReviews(productId: number): Promise<Review[]> {
    const response = await this.client.get<Review[]>(`/reviews/product/${productId}`);
    return response.data;
  }

  async createReview(data: ReviewRequest): Promise<Review> {
    const response = await this.client.post<Review>('/reviews', data);
    return response.data;
  }

  async updateReview(reviewId: number, data: ReviewRequest): Promise<Review> {
    const response = await this.client.put<Review>(`/reviews/${reviewId}`, data);
    return response.data;
  }

  async deleteReview(reviewId: number): Promise<void> {
    await this.client.delete(`/reviews/${reviewId}`);
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.client.get<DashboardStats>('/admin/dashboard/stats');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
