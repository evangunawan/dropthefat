import { Product } from './Product';

export interface MaterialPurchase {
  product: Product;
  quantity: number;
  total?: number;
}
