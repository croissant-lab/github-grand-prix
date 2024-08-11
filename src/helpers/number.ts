export const roundDigit = (num: number, digit: number) => {
  // biome-ignore lint/style/useExponentiationOperator: <explanation>
  const pow = Math.pow(10, digit);
  return Math.round(num * pow) / pow;
};
