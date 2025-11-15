import { translateProduct, translateProducts } from './translateProduct';

const product = {
  id: '1',
  title: 'Prod',
  description: 'desc',
  shortDescription: 'sdesc',
  image: 'img',
  category: 'Cuentas',
};

describe('translateProduct util', () => {
  test('translates category according to i18n default (es)', () => {
    const translated = translateProduct(product as any);
    expect(translated.category).toBe('Cuentas');
  });

  test('translateProducts maps array', () => {
    const arr = translateProducts([product as any]);
    expect(arr).toHaveLength(1);
    expect(arr[0].category).toBe('Cuentas');
  });
});
