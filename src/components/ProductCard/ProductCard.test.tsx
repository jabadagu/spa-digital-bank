import { render, screen } from '@/test/test-utils';
import { ProductCard } from './ProductCard';

const product = {
  id: '1',
  title: 'Test Product',
  description: 'Full description',
  shortDescription: 'Short desc',
  image: 'test.jpg',
  category: 'Cuentas',
};

describe('ProductCard', () => {
  test('renders product details and view more button', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Short desc/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver más/i)).toBeInTheDocument();
  });
});
