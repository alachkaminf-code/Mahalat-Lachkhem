import type { Product, Category, Brand } from '../types';

export function formatPrice(price: number, currency: string = 'DZD'): string {
  return `${Math.round(price).toLocaleString('en-US')} ${currency}`;
}

export function getProductName(product: Product, lang: 'ar' | 'en'): string {
  return lang === 'ar' ? product.name_ar : product.name_en;
}

export function getProductDescription(product: Product, lang: 'ar' | 'en'): string {
  return lang === 'ar' ? product.description_ar : product.description_en;
}

export function getCategoryName(category: Category, lang: 'ar' | 'en'): string {
  return lang === 'ar' ? category.name_ar : category.name_en;
}

export function getBrandName(brand: Brand, lang: 'ar' | 'en'): string {
  return lang === 'ar' ? brand.name_ar : brand.name_en;
}

export function getDiscountPercent(product: Product): number {
  if (!product.discount_price || product.discount_price >= product.price) return 0;
  return Math.round(((product.price - product.discount_price) / product.price) * 100);
}

export function getEffectivePrice(product: Product): number {
  return product.discount_price ?? product.price;
}

export function calculateShipping(wilayaCost: number, isHomeDelivery: boolean, homeCost: number): number {
  return isHomeDelivery ? homeCost : wilayaCost;
}

export function calculateTax(subtotal: number, taxRate: number = 0.19): number {
  return subtotal * taxRate;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
