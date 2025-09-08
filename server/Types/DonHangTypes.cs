namespace server.Types
{
    public static class DonHangTypes
    {
        public const string COMPLETED = "COMPLETED"; // Đã hoàn thành
        public const string PAID = "PAID"; // Đã thanh toán
        public const string PAYMENT_PENDING = "PAYMENT_PENDING"; // Chờ thanh toán
        public const string PENDING = "PENDING"; // Chờ thanh toán
        public const string PROCESSING = "PROCESSING"; // Đang xử lý
        public const string FAILED = "FAILED"; // Đã thất bại
    }
}
