export const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

export const totalArrayValues = (numbers: number[]): string => {
  return formatCurrency(numbers.reduce((total, num) => total + num, 0));
};