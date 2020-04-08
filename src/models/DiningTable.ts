export interface DiningTable {
  id?: string;
  table_number: string;
  status: 'available' | 'reserved' | 'dining' | 'unavailable';
  type: 'small' | 'medium' | 'large';
  //small is for 1-4 people, medium 4-6 people, large is for groups > 6 people.
}
