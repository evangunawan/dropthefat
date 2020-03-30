import { MenuOrder } from './MenuOrder';

export interface Order {
  id?: string;
  time: number;
  menuOrders: MenuOrder[];
  pic: string;
  total: number;
}
