export const getStartAndEndOfThisMonth = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return [startOfMonth, endOfMonth];
};
export const getStartOfTheMonth = (givenDate: Date) => {
  const date = new Date(givenDate);
  return new Date(date.getFullYear(), date.getMonth(), 1);
};
