import dateFormat from 'dateformat';

//To increase reusability, we put all repeated methods here.

export function renderCurrency(price: number) {
  const regex = new RegExp(/\B(?=(\d{3})+(?!\d))/g);
  const temp = price.toString().replace(regex, ',');
  return 'Rp' + temp;
}

export function renderTime(ms: number) {
  if (!!ms) {
    const date = new Date(ms);
    const result = dateFormat(date, 'ddd, dd-mmm-yyyy HH:MM');
    return result;
  } else {
    return 'NaN';
  }
}

export function renderDiscount(ms: number) {
  return ms * 100 + ' %';
}
