import axios from 'axios';
import i18n from '@/i18n/config';
import type { ApiResponse, Product } from '@/types';
import { getApiBaseUrl } from '@/utils/env';

class ApiService {
  private productsCache: Product[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  private async loadProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(`${getApiBaseUrl()}mock/products.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error(i18n.t('api.loadProductsError'));
    }
  }

  async getProducts(): Promise<Product[]> {
    const now = Date.now();

    // Usar cache si existe y no ha expirado
    if (this.productsCache && now - this.cacheTimestamp < this.CACHE_DURATION) {
      return this.productsCache;
    }

    // Cargar productos y actualizar cache
    this.productsCache = await this.loadProducts();
    this.cacheTimestamp = now;
    return this.productsCache;
  }

  async getProductById(id: string): Promise<Product | null> {
    // Optimización: usar cache de productos para evitar múltiples peticiones HTTP
    const products = await this.getProducts();
    const product = products.find(product => product.id === id) || null;

    if (!product) {
      console.warn(
        `Product with ID '${id}' not found. Available IDs: ${products.map(p => p.id).join(', ')}`
      );
    }

    return product;
  }

  // Método para limpiar cache manualmente si es necesario
  clearProductsCache(): void {
    this.productsCache = null;
    this.cacheTimestamp = 0;
  }

  async submitContactForm(data: {
    name: string;
    email: string;
    documentType: string;
    documentNumber: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse> {
    try {
      // Use the incoming data so it's not reported as unused (simulating a submit)
      console.log('Submitting contact form', data);

      const isSuccess = Math.random() > 0.3;

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isSuccess) {
        return {
          success: true,
          message: i18n.t('api.successMessage'),
        };
      } else {
        return {
          success: false,
          message: i18n.t('api.errorMessage'),
        };
      }
    } catch {
      return {
        success: false,
        message: i18n.t('api.connectionError'),
      };
    }
  }
}

export const apiService = new ApiService();
