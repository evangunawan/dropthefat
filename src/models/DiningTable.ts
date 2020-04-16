export interface DiningTable {
  id?: string;
  tableNumber: number;
  status: 'available' | 'reserved' | 'dining' | 'unavailable';
  type: 'small' | 'medium' | 'large' | 'unknown';
  //small is for 1-4 people, medium 4-6 people, large is for groups > 6 people.
}
