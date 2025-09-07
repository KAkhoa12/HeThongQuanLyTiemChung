export const formatAge = (age: number, type: 'monthAge' | 'yearAge' = 'monthAge'): string => {
  if (type === 'yearAge') {
    const years = Math.floor(age / 12);
    return `${years} tuổi`;
  }
  return `${age} tháng`;
};
