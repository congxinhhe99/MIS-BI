export const stringToBoolean = (item: string) => {
  switch (item) {
    case 'Sử dụng':
    case 'Hoạt động':
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'Không sử dụng':
    case 'Không hoạt động':
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(item);
  }
};
export const numberWithCommas = (item: string) => {
  return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
