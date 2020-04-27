import { Product } from './Product';

export interface Order {
  id?: string;
  time: number;
  product: Product[];
  pic: string;
  vendor: string;
  total: number;
}
