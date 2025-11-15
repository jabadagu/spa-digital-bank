import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import './i18n';

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});
