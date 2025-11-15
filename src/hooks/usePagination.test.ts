import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  test('paginates items correctly and changes page', () => {
    const items = Array.from({ length: 10 }, (_, i) => i + 1);
    const { result } = renderHook(() => usePagination({ items, itemsPerPage: 3 }));

    expect(result.current.totalPages).toBe(4);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedItems).toEqual([1, 2, 3]);

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems).toEqual([4, 5, 6]);
  });
});
