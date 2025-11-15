import { render, screen } from '@/test/test-utils';
import { Error } from './Error';

describe('Error Component', () => {
  it('should render error message with default props', () => {
    render(<Error />);
    expect(screen.getByText(/Error al cargar los productos/i)).toBeInTheDocument();
  });

  it('should render custom error message', () => {
    const customMessage = 'Custom error message';
    render(<Error message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should render try again button when onRetry is provided', () => {
    const mockRetry = jest.fn();
    render(<Error onRetry={mockRetry} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call custom onRetry function when button is clicked', () => {
    const mockRetry = jest.fn();
    render(<Error onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button');
    retryButton.click();

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
