import { renderHook } from '@/test/test-utils';
import { useProduct } from './useProduct';

jest.mock('@/services/api', () => ({
  apiService: {
    getProductById: jest.fn(),
  },
}));

describe('useProduct Hook', () => {
  it('should return loading state initially', () => {
    const { result } = renderHook(() => useProduct('1'));
    expect(result.current.loading).toBe(true);
  });
});
