import { Product } from './Product';

export interface Vendor {
  id?: string;
  name: string;
  address: string;
  phoneNumber: string;
  contact: string;
  products: Product[];
}
