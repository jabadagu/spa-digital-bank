import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import './i18n';

// Mock process.env para compatibilidad con variables de Vite
process.env.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL || '';

// Mock del módulo env para testing
jest.mock('@/utils/env', () => ({
  getEnvVar: jest.fn((key: string, defaultValue = '') => {
    return process.env[key] || defaultValue;
  }),
  getApiBaseUrl: jest.fn(() => process.env.VITE_API_BASE_URL || ''),
}));

// Polyfills for Node/JSDOM environment
const util = require('util');
if (typeof global.TextEncoder === 'undefined') {
  // @ts-ignore
  global.TextEncoder = util.TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // @ts-ignore
  global.TextDecoder = util.TextDecoder;
}

// Mock global fetch
global.fetch = jest.fn();

// Mock window.scrollTo to avoid JSDOM not implemented error
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Polyfill matchMedia
if (typeof window.matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Polyfill IntersectionObserver used by framer-motion
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (global as any).IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    constructor() {}
    observe() {
      return null;
    }
    unobserve() {
      return null;
    }
    disconnect() {
      return null;
    }
    takeRecords() {
      return [];
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).IntersectionObserver = MockIntersectionObserver;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.IntersectionObserver = MockIntersectionObserver as any;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});
