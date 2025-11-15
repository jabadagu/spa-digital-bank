import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import { Home } from './Home';
import { useProducts } from '@/hooks/useProducts';
import { useSearchProducts } from '@/hooks/useSearchProducts';

// Mock de los hooks
jest.mock('@/hooks/useProducts');
jest.mock('@/hooks/useSearchProducts');

const mockUseProducts = useProducts as jest.MockedFunction<typeof useProducts>;
const mockUseSearchProducts = useSearchProducts as jest.MockedFunction<typeof useSearchProducts>;

const mockProducts = [
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
];

const defaultUseSearchProducts = {
  searchQuery: '',
  setSearchQuery: jest.fn(),
  debouncedQuery: '',
  filteredProducts: mockProducts,
  isSearching: false,
  hasResults: true,
  totalResults: mockProducts.length,
  clearSearch: jest.fn(),
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    mockUseSearchProducts.mockReturnValue(defaultUseSearchProducts);
  });

  describe('Loading state', () => {
    it('should show loading component when products are loading', () => {
      mockUseProducts.mockReturnValue({
        products: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      const { container } = render(<Home />);
      // Verificar que no se muestre el contenido principal cuando está cargando
      expect(screen.queryByText(/nuestros productos/i)).not.toBeInTheDocument();
      // Verificar que haya un elemento con animación de loading
      const loadingElement =
        container.querySelector('[class*="Loading"]') ||
        container.querySelector('[class*="Spinner"]');
      expect(loadingElement).toBeDefined();
    });
  });

  describe('Error state', () => {
    it('should show error component when there is an error', () => {
      const mockRefetch = jest.fn();
      mockUseProducts.mockReturnValue({
        products: [],
        loading: false,
        error: new Error('Error loading products'),
        refetch: mockRefetch,
      });

      render(<Home />);
      expect(screen.getByText(/error al cargar los productos/i)).toBeInTheDocument();

      const retryButton = screen.getByText(/intentar nuevamente/i);
      fireEvent.click(retryButton);
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Successful load', () => {
    it('should render page header', () => {
      render(<Home />);
      expect(screen.getByText(/nuestros productos/i)).toBeInTheDocument();
      expect(screen.getByText(/descubre las mejores opciones/i)).toBeInTheDocument();
    });

    it('should render search bar', () => {
      render(<Home />);
      expect(screen.getByPlaceholderText(/buscar productos financieros/i)).toBeInTheDocument();
    });

    it('should render product cards when products are loaded', async () => {
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
      });
    });
  });

  describe('Search functionality', () => {
    it('should show search results info when searching with results', () => {
      mockUseSearchProducts.mockReturnValue({
        ...defaultUseSearchProducts,
        debouncedQuery: 'test',
        filteredProducts: [mockProducts[0]],
      });

      render(<Home />);
      expect(screen.getByText(/1 producto encontrado/i)).toBeInTheDocument();
    });

    it('should show multiple results count correctly', () => {
      mockUseSearchProducts.mockReturnValue({
        ...defaultUseSearchProducts,
        debouncedQuery: 'product',
        filteredProducts: mockProducts,
      });

      render(<Home />);
      expect(screen.getByText(/2 productos encontrados/i)).toBeInTheDocument();
    });

    it('should show no results message when search has no matches', () => {
      mockUseSearchProducts.mockReturnValue({
        ...defaultUseSearchProducts,
        debouncedQuery: 'nonexistent',
        filteredProducts: [],
        isSearching: false,
      });

      render(<Home />);
      expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument();
      expect(screen.getByText(/intenta con otros términos/i)).toBeInTheDocument();
    });

    it('should clear search when clicking "ver todos los productos"', () => {
      const mockSetSearchQuery = jest.fn();
      mockUseSearchProducts.mockReturnValue({
        ...defaultUseSearchProducts,
        debouncedQuery: 'test',
        filteredProducts: [],
        setSearchQuery: mockSetSearchQuery,
      });

      render(<Home />);
      const clearButton = screen.getByText(/ver todos los productos/i);
      fireEvent.click(clearButton);
      expect(mockSetSearchQuery).toHaveBeenCalledWith('');
    });

    it('should not show search results info when searching is in progress', () => {
      mockUseSearchProducts.mockReturnValue({
        ...defaultUseSearchProducts,
        debouncedQuery: 'test',
        filteredProducts: [mockProducts[0]],
        isSearching: true,
      });

      render(<Home />);
      expect(screen.queryByText(/producto encontrado/i)).not.toBeInTheDocument();
    });

    it('should not show no results message when searching is in progress', () => {
      mockUseSearchProducts.mockReturnValue({
        ...defaultUseSearchProducts,
        debouncedQuery: 'test',
        filteredProducts: [],
        isSearching: true,
      });

      render(<Home />);
      expect(screen.queryByText(/no se encontraron productos/i)).not.toBeInTheDocument();
    });
  });

  describe('Product display logic', () => {
    it('should show all products when no search query', () => {
      render(<Home />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('should show only filtered products when searching', () => {
      mockUseSearchProducts.mockReturnValue({
        ...defaultUseSearchProducts,
        debouncedQuery: 'Product 1',
        filteredProducts: [mockProducts[0]],
      });

      render(<Home />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });

    it('should hide product grid when showing no results message', () => {
      mockUseSearchProducts.mockReturnValue({
        ...defaultUseSearchProducts,
        debouncedQuery: 'nonexistent',
        filteredProducts: [],
        isSearching: false,
      });

      render(<Home />);
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper main landmark', () => {
      render(<Home />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should have clear search button for screen readers', () => {
      mockUseSearchProducts.mockReturnValue({
        ...defaultUseSearchProducts,
        debouncedQuery: 'test',
        filteredProducts: [],
        isSearching: false,
      });

      render(<Home />);
      const clearButton = screen.getByText(/ver todos los productos/i);
      expect(clearButton).toHaveAttribute('style');
      expect(clearButton.style.cursor).toBe('pointer');
    });
  });
});
