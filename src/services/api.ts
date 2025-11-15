import axios from 'axios';
import i18n from '@/i18n/config';
import type { ApiResponse, Product } from '@/types';
import { getApiBaseUrl } from '@/utils/env';

class ApiService {
  private async loadProducts(language: string = 'es'): Promise<Product[]> {
    try {
      // Determinar el archivo según el idioma
      const languageFile = language === 'en' ? 'products-en.json' : 'products-es.json';
      const url = `${getApiBaseUrl()}mock/${languageFile}`;
      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error(i18n.t('api.loadProductsError'));
    }
  }

  async getProducts(language?: string): Promise<Product[]> {
    // Si no se especifica idioma, usar el idioma actual de i18n
    const lang = language || i18n.language || 'es';
    return await this.loadProducts(lang);
  }

  async getProductById(id: string, language?: string): Promise<Product | null> {
    const products = await this.getProducts(language);
    const product = products.find(product => product.id === id) || null;

    if (!product) {
      console.warn(
        `Product with ID '${id}' not found. Available IDs: ${products.map(p => p.id).join(', ')}`
      );
    }

    return product;
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
