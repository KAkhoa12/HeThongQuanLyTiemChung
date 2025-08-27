using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Vaccine
{
    public class VaccineCreateRequest
    {
        [Required(ErrorMessage = "Tên vaccine không được để trống")]
        [StringLength(200, ErrorMessage = "Tên vaccine không được quá 200 ký tự")]
        public string Ten { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "Nhà sản xuất không được quá 200 ký tự")]
        public string? NhaSanXuat { get; set; }
        
        [Range(0, 120, ErrorMessage = "Tuổi bắt đầu tiêm phải từ 0 đến 120")]
        public int? TuoiBatDauTiem { get; set; }
        
        [Range(0, 120, ErrorMessage = "Tuổi kết thúc tiêm phải từ 0 đến 120")]
        public int? TuoiKetThucTiem { get; set; }
        
        [StringLength(1000, ErrorMessage = "Hướng dẫn sử dụng không được quá 1000 ký tự")]
        public string? HuongDanSuDung { get; set; }
        
        [StringLength(500, ErrorMessage = "Phòng ngừa không được quá 500 ký tự")]
        public string? PhongNgua { get; set; }
        
        public bool IsActive { get; set; } = true;
    }
} 