import { Product } from './Product';

export interface Vendor {
  id?: string;
  name: string;
  address: string;
  contact: string;
  products: Product[];
}
