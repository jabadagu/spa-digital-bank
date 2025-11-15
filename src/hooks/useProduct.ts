import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '@/services/api';
import { translateProduct } from '@/utils/translateProduct';
import type { Product } from '@/types';

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useProduct = (id: string): UseProductReturn => {
  const { i18n, t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProductById(id);
      if (!data) {
        setError(new Error(t('product.notFound')));
      } else {
        const translated = translateProduct(data);
        setProduct(translated);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Re-traducir producto cuando cambie el idioma
  useEffect(() => {
    if (product) {
      const rawProduct = { ...product };
      const translated = translateProduct(rawProduct);
      setProduct(translated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};
