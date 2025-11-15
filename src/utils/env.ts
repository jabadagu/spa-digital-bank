/**
 * Utilidad para obtener variables de entorno de manera compatible con testing
 */
export const getEnvVar = (key: string, defaultValue = ''): string => {
  // En testing, usar process.env
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return process.env[key] || defaultValue;
  }

  // En producción/desarrollo, usar import.meta.env
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - import.meta está disponible en runtime de Vite
    const viteEnv = import.meta.env;
    return viteEnv[key] || defaultValue;
  }

  return defaultValue;
};

export const getApiBaseUrl = (): string => {
  const baseUrl = getEnvVar('VITE_API_BASE_URL', '');
  // Si no hay variable de entorno configurada, usar la ruta relativa correcta
  if (!baseUrl) {
    // En desarrollo con Vite, usar ruta relativa desde public/
    if (typeof window !== 'undefined') {
      return '/spa-digital-bank/';
    }
    return '';
  }
  return baseUrl;
};
