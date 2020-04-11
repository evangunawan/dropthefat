import { Material } from './Material';

export interface MaterialPurchase {
  material: Material;
  quantity: number;
  total?: number;
}
