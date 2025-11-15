import axios from 'axios';
import { apiService } from './api';

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de i18n
jest.mock('@/i18n/config', () => ({
  t: jest.fn((key: string) => {
    const translations: { [key: string]: string } = {
      'api.loadProductsError': 'Error al cargar productos',
      'api.successMessage': 'Mensaje enviado exitosamente',
      'api.errorMessage': 'Error al enviar el mensaje',
      'api.connectionError': 'Error de conexión',
    };
    return translations[key] || key;
  }),
}));

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Math.random para hacer predecibles los tests de submitContactForm
    jest.spyOn(Math, 'random').mockReturnValue(0.5); // > 0.3, será success
    // Mock setTimeout para que no haga delay real en tests
    jest.spyOn(global, 'setTimeout').mockImplementation(cb => {
      cb();
      return {} as NodeJS.Timeout;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getProducts', () => {
    test('returns parsed json when response is ok', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Test Product',
          shortDescription: 'Short desc',
          description: 'Full description',
          image: 'test.jpg',
          category: 'Cuentas',
          features: ['feature1'],
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: mockData,
      });

      const products = await apiService.getProducts();
      expect(products).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith('mock/products.json');
    });

    test('throws error when response is not ok', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 404 },
      });

      await expect(apiService.getProducts()).rejects.toThrow('Error al cargar productos');
    });

    test('throws error when axios fails', async () => {
      const networkError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(networkError);

      await expect(apiService.getProducts()).rejects.toThrow('Error al cargar productos');
    });
  });

  describe('getProductById', () => {
    const mockProducts = [
      {
        id: '1',
        title: 'Product 1',
        shortDescription: 'Short 1',
        description: 'Description 1',
        image: 'image1.jpg',
        category: 'Cuentas',
        features: ['feature1'],
      },
      {
        id: '2',
        title: 'Product 2',
        shortDescription: 'Short 2',
        description: 'Description 2',
        image: 'image2.jpg',
        category: 'Tarjetas',
        features: ['feature2'],
      },
    ];

    beforeEach(() => {
      mockedAxios.get.mockResolvedValue({
        data: mockProducts,
      });
    });

    test('returns product when id exists', async () => {
      const product = await apiService.getProductById('1');
      expect(product).toEqual(mockProducts[0]);
    });

    test('returns null when id does not exist', async () => {
      const product = await apiService.getProductById('999');
      expect(product).toBeNull();
    });

    test('throws error when getProducts fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.getProductById('1')).rejects.toThrow('Error al cargar productos');
    });
  });

  describe('submitContactForm', () => {
    const mockFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      documentType: 'DNI',
      documentNumber: '12345678',
      subject: 'Test Subject',
      message: 'Test message',
    };

    test('returns success response when Math.random > 0.3', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(Math, 'random').mockReturnValue(0.5); // > 0.3

      const result = await apiService.submitContactForm(mockFormData);

      expect(result).toEqual({
        success: true,
        message: 'Mensaje enviado exitosamente',
      });
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
      expect(consoleSpy).toHaveBeenCalledWith('Submitting contact form', mockFormData);
      consoleSpy.mockRestore();
    });

    test('returns error response when Math.random <= 0.3', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(Math, 'random').mockReturnValue(0.2);

      const result = await apiService.submitContactForm(mockFormData);

      expect(result).toEqual({
        success: false,
        message: 'Error al enviar el mensaje',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Submitting contact form', mockFormData);
      consoleSpy.mockRestore();
    });

    test('returns connection error when exception is thrown', async () => {
      // Mock setTimeout to throw an error
      jest.spyOn(global, 'setTimeout').mockImplementation(() => {
        throw new Error('Timeout error');
      });

      const result = await apiService.submitContactForm(mockFormData);

      expect(result).toEqual({
        success: false,
        message: 'Error de conexión',
      });
    });
  });

  describe('constructor', () => {
    test('creates api service instance correctly', () => {
      expect(apiService).toBeDefined();
      expect(typeof apiService.getProducts).toBe('function');
      expect(typeof apiService.getProductById).toBe('function');
      expect(typeof apiService.submitContactForm).toBe('function');
    });
  });
});
