
import type { Product, SalesHistory } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod-001', name: 'Premium Coffee Beans', sku: 'CF-PRM-1KG', category: 'Groceries', currentStock: 80, reorderLevel: 50 },
  { id: 'prod-002', name: 'Organic Green Tea', sku: 'GT-ORG-500G', category: 'Groceries', currentStock: 45, reorderLevel: 50 },
  { id: 'prod-003', name: 'Artisan Bread Loaf', sku: 'BD-ART-1PC', category: 'Bakery', currentStock: 30, reorderLevel: 25 },
  { id: 'prod-004', name: 'Noise-Cancelling Headphones', sku: 'EL-HDPH-NC1', category: 'Electronics', currentStock: 15, reorderLevel: 20 },
  { id: 'prod-005', name: 'Smart Fitness Tracker', sku: 'EL-FT-TRK2', category: 'Electronics', currentStock: 60, reorderLevel: 40 },
  { id: 'prod-006', name: 'Yoga Mat', sku: 'SP-YGM-PRO', category: 'Sports', currentStock: 90, reorderLevel: 70 },
];

export const INITIAL_SALES_HISTORY: SalesHistory[] = [
  { productId: 'prod-001', weeklySales: [20, 22, 18, 25, 23, 28, 26, 30] }, // Stable, increasing
  { productId: 'prod-002', weeklySales: [15, 14, 16, 15, 35, 38, 40, 37] }, // Recent spike
  { productId: 'prod-003', weeklySales: [40, 42, 38, 45, 41, 43, 40, 44] }, // High volume, stable
  { productId: 'prod-004', weeklySales: [5, 6, 4, 7, 5, 8, 6, 9] },       // Low volume, slowly increasing
  { productId: 'prod-005', weeklySales: [10, 12, 25, 28, 15, 18, 30, 32] }, // Volatile, trendy
  { productId: 'prod-006', weeklySales: [25, 23, 26, 24, 25, 22, 27, 25] }, // Stable
];
