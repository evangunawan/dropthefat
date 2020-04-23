export interface Employee {
  id?: string;
  name: string;
  address: string;
  contact: string;
  role: 'cashier' | 'waiter' | 'waitress' | 'unknown';
  username: string;
  password: string;
}
