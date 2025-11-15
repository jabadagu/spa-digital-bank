import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '@/services/api';
import { translateProducts } from '@/utils/translateProduct';
import type { Product } from '@/types';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProducts();
      const translated = translateProducts(data);
      setProducts(translated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Re-traducir productos cuando cambie el idioma
  useEffect(() => {
    if (products.length > 0) {
      const rawProducts = products.map(p => ({ ...p, category: p.category }));
      const translated = translateProducts(rawProducts);
      setProducts(translated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};
