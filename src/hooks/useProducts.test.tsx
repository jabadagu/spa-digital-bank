import { render, screen, waitFor } from '@/test/test-utils';
import { useProducts } from './useProducts';
import { apiService } from '@/services/api';

const TestComponent = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
};

describe('useProducts', () => {
  test('fetches and displays products', async () => {
    const mockData = [
      {
        id: '1',
        title: 'P1',
        shortDescription: 's',
        description: 'd',
        image: 'i',
        category: 'Cuentas',
      },
    ];
    jest.spyOn(apiService, 'getProducts').mockResolvedValueOnce(mockData as any);

    render(<TestComponent />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/P1/)).toBeInTheDocument());
  });
});
