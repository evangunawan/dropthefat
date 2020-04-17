export interface Promo {
  id?: string;
  codeId: string;
  title: string;
  startDate: number;
  expiredDate: number;
  discount: number;
}
