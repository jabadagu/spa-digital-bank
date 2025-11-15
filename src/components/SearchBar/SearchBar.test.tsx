import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/assets/styles/theme';

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'home.searchPlaceholder': 'Buscar productos financieros...',
        'home.searchLabel': 'Buscar productos',
        'home.clearSearch': 'Limpiar búsqueda',
      };
      return translations[key] || key;
    },
  }),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('SearchBar', () => {
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    mockOnSearchChange.mockClear();
  });

  test('renders search input with placeholder', () => {
    renderWithTheme(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />);

    const input = screen.getByPlaceholderText('Buscar productos financieros...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-label', 'Buscar productos');
  });

  test('displays search icon', () => {
    renderWithTheme(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />);

    const searchIcon = screen.getByTestId('search-icon');
    expect(searchIcon).toBeInTheDocument();
  });

  test('calls onSearchChange when typing', () => {
    renderWithTheme(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'tarjeta' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('tarjeta');
  });

  test('displays current search query value', () => {
    renderWithTheme(
      <SearchBar searchQuery="cuenta de ahorros" onSearchChange={mockOnSearchChange} />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('cuenta de ahorros');
  });

  test('shows loading indicator when searching', () => {
    renderWithTheme(
      <SearchBar searchQuery="test" onSearchChange={mockOnSearchChange} isSearching={true} />
    );

    // Check for loading spinner (should be present in DOM)
    const loadingSpinner = document.querySelector('svg[viewBox="0 0 20 20"]');
    expect(loadingSpinner).toBeInTheDocument();
  });

  test('shows clear button when there is a search query and not searching', () => {
    renderWithTheme(
      <SearchBar searchQuery="test query" onSearchChange={mockOnSearchChange} isSearching={false} />
    );

    const clearButton = screen.getByRole('button', { name: /limpiar búsqueda/i });
    expect(clearButton).toBeInTheDocument();
  });

  test('clears search when clear button is clicked', () => {
    renderWithTheme(
      <SearchBar searchQuery="test query" onSearchChange={mockOnSearchChange} isSearching={false} />
    );

    const clearButton = screen.getByRole('button', { name: /limpiar búsqueda/i });
    fireEvent.click(clearButton);

    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });

  test('does not show clear button when searching', () => {
    renderWithTheme(
      <SearchBar searchQuery="test query" onSearchChange={mockOnSearchChange} isSearching={true} />
    );

    const clearButton = screen.queryByRole('button', { name: /limpiar búsqueda/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  test('does not show clear button when search query is empty', () => {
    renderWithTheme(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} isSearching={false} />
    );

    const clearButton = screen.queryByRole('button', { name: /limpiar búsqueda/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  test('uses custom placeholder when provided', () => {
    renderWithTheme(
      <SearchBar
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        placeholder="Custom placeholder"
      />
    );

    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  test('applies custom className when provided', () => {
    renderWithTheme(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} className="custom-class" />
    );

    const container = screen.getByRole('textbox').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  test('maintains focus on input during typing', async () => {
    renderWithTheme(<SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />);

    const input = screen.getByRole('textbox');
    input.focus();

    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: 't' } });

    await waitFor(() => {
      expect(document.activeElement).toBe(input);
    });
  });
});
