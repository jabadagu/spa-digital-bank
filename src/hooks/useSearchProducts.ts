import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '@/types';

interface UseSearchProductsProps {
  products: Product[];
  debounceTime?: number;
  initialQuery?: string;
}

interface UseSearchProductsReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedQuery: string;
  filteredProducts: Product[];
  isSearching: boolean;
  hasResults: boolean;
  totalResults: number;
  clearSearch: () => void;
}

/**
 * Hook personalizado para buscar productos con debounce
 * Optimizado para evitar re-renders innecesarios
 */
export const useSearchProducts = ({
  products,
  debounceTime = 300,
  initialQuery = '',
}: UseSearchProductsProps): UseSearchProductsReturn => {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);

  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery);

  const isSearching = searchQuery !== debouncedQuery && searchQuery.trim().length > 0;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, debounceTime]);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return products;
    }

    const query = debouncedQuery.toLowerCase().trim();

    return products.filter(
      product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.features?.some(feature => feature.toLowerCase().includes(query))
    );
  }, [products, debouncedQuery]);

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery: updateSearchQuery,
    debouncedQuery,
    filteredProducts,
    isSearching,
    hasResults: filteredProducts.length > 0,
    totalResults: filteredProducts.length,
    clearSearch,
  };
};
