export const DonHangTypes = {
  COMPLETED: 'COMPLETED', // Đã hoàn thành
  PAID: 'PAID', // Đã thanh toán
  PAYMENT_PENDING: 'PAYMENT_PENDING', // Chờ thanh toán
  PENDING: 'PENDING', // Chờ thanh toán
  PROCESSING: 'PROCESSING', // Đang xử lý
  FAILED: 'FAILED', // Đã thất bại
} as const;

export type DonHangType = typeof DonHangTypes[keyof typeof DonHangTypes];