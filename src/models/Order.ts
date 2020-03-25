import { MenuOrder } from './MenuOrder';

export interface Order {
  time: number;
  menuOrders: MenuOrder[];
  pic: string;
  total: number;
}
