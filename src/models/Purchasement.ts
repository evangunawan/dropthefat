import { Material } from './Material';

export interface Order {
  id?: string;
  time: number;
  materials: Material[];
  pic: string;
  vendor: string;
  total: number;
}
