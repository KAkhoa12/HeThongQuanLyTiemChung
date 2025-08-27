namespace server.DTOs.Vaccine
{
    public class VaccineUsageDto
    {
        public string MaVaccine { get; set; } = string.Empty;
        public string Ten { get; set; } = string.Empty;
        public int SoLuongSuDung { get; set; } // Số lượng phiếu tiêm
        public int SoLuongLichHen { get; set; } // Số lượng lịch hẹn
        public int SoLuongLichTiemChuan { get; set; } // Số lượng lịch tiêm chuẩn
        public int SoLuongLoVaccine { get; set; } // Số lượng lô vaccine
        public int SoLuongDichVu { get; set; } // Số lượng dịch vụ
        public int SoLuongDonHang { get; set; } // Số lượng đơn hàng
    }
} 