import { MenuOrder } from './MenuOrder';

export interface Order {
  id?: string;
  time: number;
  menuOrders: MenuOrder[];
  pic: string;
  total: number;
  status: 'completed' | 'active' | 'undefined';
  guests: number;
  paymentTime?: number;
  tableNumber?: number;
}
