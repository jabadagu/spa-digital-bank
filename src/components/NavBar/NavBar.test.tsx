import { render, screen } from '@/test/test-utils';
import { NavBar } from './NavBar';

describe('NavBar', () => {
  test('renders logo, links and controls', () => {
    render(<NavBar />);

    // logo from i18n -> 'Banco Digital'
    expect(screen.getByText(/Banco Digital/i)).toBeInTheDocument();

    // nav links
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();

    // language select
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    // theme toggle button (has aria-label)
    expect(screen.getByRole('button', { name: /Oscuro|Claro|theme/i })).toBeTruthy();
  });
});
