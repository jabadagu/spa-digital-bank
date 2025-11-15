import { render, screen } from '@testing-library/react';
import App from './App';

// Mock de react-router-dom para evitar problemas con routing en tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
  }),
}));

describe('App Component', () => {
  it('should render the main application layout', () => {
    render(<App />);

    // Verificar que la aplicación se renderice sin errores
    expect(document.body).toBeInTheDocument();
  });

  it('should render navigation bar', () => {
    render(<App />);

    // Buscar un enlace específico en la navbar con texto "Banco Digital"
    expect(screen.getAllByText(/Banco Digital/i)[0]).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(<App />);

    // Buscar elementos del footer
    expect(screen.getByText(/©/)).toBeInTheDocument();
  });
});
