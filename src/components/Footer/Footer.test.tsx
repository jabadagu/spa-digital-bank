import { render, screen } from '@/test/test-utils';
import { Footer } from './Footer';

describe('Footer', () => {
  test('renders footer sections and copyright', () => {
    render(<Footer />);

    expect(screen.getByText(/Acerca de/i)).toBeInTheDocument();
    expect(screen.getByText(/Servicios/i)).toBeInTheDocument();
    expect(screen.getByText(/Legal/i)).toBeInTheDocument();

    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`, 'i'))).toBeInTheDocument();
    const banco = screen.getAllByText(/Banco Digital/i);
    expect(banco.length).toBeGreaterThan(0);
  });
});
