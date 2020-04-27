import { Vendor } from './Vendor';
import { MenuOrder } from './MenuOrder';

export interface Expenditure {
  time: number;
  menuOrders: MenuOrder[];
  pic: string;
  vendorName: string;
  total: number;
}
