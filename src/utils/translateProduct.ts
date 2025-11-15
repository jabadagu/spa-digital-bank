import i18n from '@/i18n/config';
import type { Product } from '@/types';

const categoryTranslations: Record<string, { es: string; en: string }> = {
  Cuentas: { es: 'Cuentas', en: 'Accounts' },
  Tarjetas: { es: 'Tarjetas', en: 'Cards' },
  Préstamos: { es: 'Préstamos', en: 'Loans' },
  Ahorros: { es: 'Ahorros', en: 'Savings' },
  Inversiones: { es: 'Inversiones', en: 'Investments' },
  Seguros: { es: 'Seguros', en: 'Insurance' },
};

export const translateProduct = (product: Product): Product => {
  const lang = i18n.language || 'es';
  const translatedCategory = categoryTranslations[product.category]
    ? categoryTranslations[product.category][lang as 'es' | 'en']
    : product.category;

  return {
    ...product,
    category: translatedCategory,
  };
};

export const translateProducts = (products: Product[]): Product[] => {
  return products.map(translateProduct);
};
