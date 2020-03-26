import { Menu } from './Menu';

export interface MenuOrder {
  menu: Menu;
  quantity: number;
  total?: number;
}
