export const formatAge = (age: number, type: 'monthAge' | 'yearAge' = 'monthAge'): string => {
  if (type === 'yearAge') {
    const years = Math.floor(age / 12);
    return `${years} tuổi`;
  }
  return `${age} tháng`;
};

export const caculateAge = (birthday: string): string  => {
  const today = new Date();
  const birthDate = new Date(birthday);
  
  // Tính tổng số tháng
  let totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12;
  totalMonths += today.getMonth() - birthDate.getMonth();
  
  // Điều chỉnh nếu ngày chưa đến
  if (today.getDate() < birthDate.getDate()) {
    totalMonths--;
  }
  
  // Nếu <= 24 tháng thì hiển thị theo tháng, ngược lại hiển thị theo tuổi
  if (totalMonths <= 24) {
    return `${totalMonths} tháng`;
  } else {
    const years = Math.floor(totalMonths / 12);
    return `${years} tuổi`;
  }
};