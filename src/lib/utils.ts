import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ProductVariant } from '@/features/product/api/productApi';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function formatPrice(price: number | undefined | null): string {
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(numPrice);
}

export function getLowestPrice(variants: ProductVariant[]): number {
  if (!variants || variants.length === 0) return 0;
  return Math.min(...variants.map((v) => v.price));
}
