/**
 * @jest-environment jsdom
 */

// Mock react-dom/client
const mockRender = jest.fn();
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
  })),
}));

// Mock the App component
jest.mock('./App.tsx', () => ({
  default: () => 'App Component',
}));

// Mock i18n config
jest.mock('./i18n/config', () => ({}));

describe('main.tsx', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create and append root element
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
  });

  it('should render the App component when root element exists', async () => {
    // Import and execute main.tsx
    await import('./main.tsx');

    // Verify that render was called
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('should import i18n configuration', async () => {
    // This test verifies that the i18n config import doesn't throw
    await expect(import('./main.tsx')).resolves.toBeDefined();
  });
});
