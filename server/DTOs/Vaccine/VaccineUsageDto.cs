namespace server.DTOs.Vaccine
{
    public class VaccineUsageDto
    {
        public string MaVaccine { get; set; } = string.Empty;
        public string Ten { get; set; } = string.Empty;
        public int SoLuongSuDung { get; set; } // Số lượng chi tiết phiếu tiêm
        public int SoLuongLichTiemChuan { get; set; } // Số lượng lịch tiêm chuẩn
        public int SoLuongLoVaccine { get; set; } // Số lượng lô vaccine
        public int SoLuongDichVu { get; set; } // Số lượng dịch vụ
    }
} 