import { render, screen } from '@/test/test-utils';
import { ProductDetail } from './ProductDetail';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

jest.mock('@/hooks/useProduct', () => ({
  useProduct: () => ({
    product: {
      id: '1',
      title: 'Test Product',
      description: 'Test Description',
      shortDescription: 'Short Description',
      category: 'Test Category',
      image: 'test.jpg',
      features: ['Feature 1', 'Feature 2'],
    },
    loading: false,
    error: null,
  }),
}));

describe('ProductDetail Component', () => {
  it('should render product details', () => {
    render(<ProductDetail />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
