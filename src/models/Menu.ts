export interface Menu {
  id?: string;
  name: string;
  type: 'drink' | 'main-course' | 'dessert';
  price: number;
  // deleted?: boolean;
}
