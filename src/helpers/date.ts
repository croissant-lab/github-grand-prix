import dayjs from 'dayjs';

export const isInRange = (
  date: string,
  { start, end }: { start: string; end: string },
) => {
  const addEnd = dayjs(end).add(1, 'day').format();

  // startの0:00:00からend+1の0:00:00までを含む
  return dayjs(date).isBetween(start, addEnd, null, '[)');
};
