import { renderHook, act } from '@testing-library/react';
import { useSearchProducts } from './useSearchProducts';
import type { Product } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Cuenta de Ahorros',
    shortDescription: 'Cuenta básica para ahorrar',
    description: 'Una cuenta de ahorros perfecta para comenzar',
    image: 'savings.jpg',
    category: 'Cuentas',
    features: ['Sin comisiones', 'Intereses competitivos'],
  },
  {
    id: '2',
    title: 'Tarjeta de Crédito Premium',
    shortDescription: 'Tarjeta con beneficios exclusivos',
    description: 'Tarjeta de crédito con múltiples beneficios',
    image: 'credit.jpg',
    category: 'Tarjetas',
    features: ['Programa de puntos', 'Seguro de viaje'],
  },
  {
    id: '3',
    title: 'Préstamo Personal',
    shortDescription: 'Financiación rápida',
    description: 'Préstamo personal con aprobación inmediata',
    image: 'loan.jpg',
    category: 'Préstamos',
    features: ['Aprobación rápida', 'Tasas competitivas'],
  },
];

describe('useSearchProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should initialize with empty search query', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    expect(result.current.searchQuery).toBe('');
    expect(result.current.debouncedQuery).toBe('');
    expect(result.current.filteredProducts).toEqual(mockProducts);
    expect(result.current.isSearching).toBe(false);
  });

  test('should update search query immediately', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    act(() => {
      result.current.setSearchQuery('tarjeta');
    });

    expect(result.current.searchQuery).toBe('tarjeta');
    expect(result.current.isSearching).toBe(true);
    expect(result.current.debouncedQuery).toBe(''); // Still empty until debounce completes
  });

  test('should debounce search query', () => {
    const { result } = renderHook(() =>
      useSearchProducts({ products: mockProducts, debounceTime: 300 })
    );

    act(() => {
      result.current.setSearchQuery('tarjeta');
    });

    expect(result.current.debouncedQuery).toBe('');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.debouncedQuery).toBe('tarjeta');
    expect(result.current.isSearching).toBe(false);
  });

  test('should filter products by title', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    act(() => {
      result.current.setSearchQuery('tarjeta');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].title).toBe('Tarjeta de Crédito Premium');
  });

  test('should filter products by description', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    act(() => {
      result.current.setSearchQuery('ahorros');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].id).toBe('1');
  });

  test('should filter products by category', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    act(() => {
      result.current.setSearchQuery('préstamos');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].category).toBe('Préstamos');
  });

  test('should filter products by features', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    act(() => {
      result.current.setSearchQuery('seguro de viaje');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].features).toContain('Seguro de viaje');
  });

  test('should be case insensitive', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    act(() => {
      result.current.setSearchQuery('TARJETA');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].title).toBe('Tarjeta de Crédito Premium');
  });

  test('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    act(() => {
      result.current.setSearchQuery('xyz123');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredProducts).toHaveLength(0);
  });

  test('should return all products when search query is empty', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    // First set a search query
    act(() => {
      result.current.setSearchQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredProducts).toHaveLength(0);

    // Then clear it
    act(() => {
      result.current.setSearchQuery('');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredProducts).toHaveLength(3);
  });

  test('should handle whitespace-only queries', () => {
    const { result } = renderHook(() => useSearchProducts({ products: mockProducts }));

    act(() => {
      result.current.setSearchQuery('   ');
      jest.advanceTimersByTime(300);
    });

    expect(result.current.filteredProducts).toEqual(mockProducts);
  });

  test('should use custom debounce time', () => {
    const { result } = renderHook(() =>
      useSearchProducts({ products: mockProducts, debounceTime: 500 })
    );

    act(() => {
      result.current.setSearchQuery('tarjeta');
    });

    act(() => {
      jest.advanceTimersByTime(300); // Less than custom debounce time
    });

    expect(result.current.debouncedQuery).toBe('');
    expect(result.current.isSearching).toBe(true);

    act(() => {
      jest.advanceTimersByTime(200); // Total 500ms
    });

    expect(result.current.debouncedQuery).toBe('tarjeta');
    expect(result.current.isSearching).toBe(false);
  });

  test('should cancel previous debounce when new query is set', () => {
    const { result } = renderHook(() =>
      useSearchProducts({ products: mockProducts, debounceTime: 300 })
    );

    act(() => {
      result.current.setSearchQuery('tar');
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Set new query before first one completes
    act(() => {
      result.current.setSearchQuery('tarjeta');
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should still be empty as we haven't completed the full debounce time for 'tarjeta'
    expect(result.current.debouncedQuery).toBe('');

    act(() => {
      jest.advanceTimersByTime(100); // Complete debounce for 'tarjeta'
    });

    expect(result.current.debouncedQuery).toBe('tarjeta');
  });
});
