import i18n from '@/i18n/config';
import type { ApiResponse, Product } from '@/types';

class ApiService {
  async getProducts(): Promise<Product[]> {
    const response = await fetch('/mock/products.json');
    if (!response.ok) {
      throw new Error(i18n.t('api.loadProductsError'));
    }
    const products: Product[] = await response.json();
    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(product => product.id === id) || null;
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
