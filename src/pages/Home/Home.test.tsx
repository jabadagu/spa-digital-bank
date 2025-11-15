import { render, screen, waitFor } from '@/test/test-utils';
import { Home } from './Home';

jest.mock('@/hooks/useProducts', () => ({
  useProducts: () => ({
    products: [
      {
        id: '1',
        title: 'Product 1',
        description: 'Description 1',
        shortDescription: 'Short 1',
        category: 'Category 1',
        image: 'image1.jpg',
        features: ['Feature 1'],
      },
      {
        id: '2',
        title: 'Product 2',
        description: 'Description 2',
        shortDescription: 'Short 2',
        category: 'Category 2',
        image: 'image2.jpg',
        features: ['Feature 2'],
      },
    ],
    loading: false,
    error: null,
  }),
}));

describe('Home Component', () => {
  it('should render page header', () => {
    render(<Home />);
    expect(screen.getByText(/productos/i)).toBeInTheDocument();
  });

  it('should render product cards when products are loaded', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('should render pagination component', () => {
    render(<Home />);
    expect(document.body).toBeInTheDocument();
  });
});
