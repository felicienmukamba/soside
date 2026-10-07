import { StockStatus } from '@app/store-contracts';
import { loadSettings, money, shippingFeeFor, slugify } from './common/helpers';
import { stockStatusOf } from './entities/product-variant.entity';
import { invoiceTotals } from './orders/invoices.service';
import { OrderItem } from './entities';

describe('règles boutique', () => {
  const settings = loadSettings({ STORE_SHIPPING_FEE: '5', STORE_FREE_SHIPPING_FROM: '300', STORE_CITIES: 'Goma, Bukavu' });

  it('lit la configuration depuis l\'environnement', () => {
    expect(settings).toEqual({ currency: 'USD', cities: ['Goma', 'Bukavu'], shippingFee: 5, freeShippingFrom: 300 });
  });

  it('offre la livraison à partir du seuil, et pas de frais pour un panier vide', () => {
    expect(shippingFeeFor(0, settings)).toBe(0);
    expect(shippingFeeFor(299.99, settings)).toBe(5);
    expect(shippingFeeFor(300, settings)).toBe(0);
  });

  it('calcule le statut de stock', () => {
    expect(stockStatusOf(0, 2)).toBe(StockStatus.OUT_OF_STOCK);
    expect(stockStatusOf(2, 2)).toBe(StockStatus.LOW_STOCK);
    expect(stockStatusOf(3, 2)).toBe(StockStatus.IN_STOCK);
    expect(stockStatusOf(0, 2, false)).toBe(StockStatus.IN_STOCK); // stock non suivi
  });

  it('extrait la TVA incluse des prix TTC, ligne par ligne', () => {
    const items = [
      { totalLine: 116, taxRate: 16 },
      { totalLine: 50, taxRate: 0 },
    ] as OrderItem[];
    expect(invoiceTotals({ items, totalAmount: 171 })).toEqual({ totalInclTax: 171, totalTax: 16, totalExclTax: 155 });
  });

  it('arrondit les montants au centime', () => {
    expect(money(0.1 + 0.2)).toBe(0.3);
    expect(money(1080 * 3)).toBe(3240);
  });

  it('génère des slugs sans accents', () => {
    expect(slugify('Montres connectées & Écouteurs')).toBe('montres-connectees-ecouteurs');
  });
});
