export interface Reservation {
  id?: string;
  pic: string;
  createdTime: number;
  reservationTime: number;
  guests: number;
  tableNumber?: number;
}
