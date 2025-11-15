import { render, screen } from '@/test/test-utils';
import { Pagination } from './Pagination';

const mockOnPageChange = jest.fn();

describe('Pagination Component', () => {
  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('should render pagination with correct total pages', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByText(/página.*1.*de.*5/i)).toBeInTheDocument();
  });

  it('should call onPageChange when clicking page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);
    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    nextButton.click();
    expect(mockOnPageChange).toHaveBeenCalled();
  });
});
