using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Vaccine
{
    public class VaccineDto
    {
        public string MaVaccine { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Tên vaccine không được để trống")]
        public string Ten { get; set; } = string.Empty;
        
        public string? NhaSanXuat { get; set; }
        
        [Range(0, 120, ErrorMessage = "Tuổi bắt đầu tiêm phải từ 0 đến 120")]
        public int? TuoiBatDauTiem { get; set; }
        
        [Range(0, 120, ErrorMessage = "Tuổi kết thúc tiêm phải từ 0 đến 120")]
        public int? TuoiKetThucTiem { get; set; }
        
        [MaxLength(1000, ErrorMessage = "Hướng dẫn sử dụng không được quá 1000 ký tự")]
        public string? HuongDanSuDung { get; set; }
        
        [MaxLength(500, ErrorMessage = "Phòng ngừa không được quá 500 ký tự")]
        public string? PhongNgua { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime? NgayTao { get; set; }
        
        public DateTime? NgayCapNhat { get; set; }
    }

    public record VaccineDetailDto(
        string Id,
        string Name,
        string? Manufacturer,
        int? StartAge,
        int? EndAge,
        string? Usage,
        string? Prevention,
        DateTime CreatedAt,
        List<VaccineImageDto> Images
    );

    public record VaccineImageDto(
        string? ImageId,
        string? ImageUrl,
        int Order,
        bool IsMain
    );

    public record VaccineCreateDto(
        string Name,
        string? Manufacturer,
        int? StartAge,
        int? EndAge,
        string? Usage,
        string? Prevention
    );

    public record VaccineUpdateDto(
        string? Name = null,
        string? Manufacturer = null,
        int? StartAge = null,
        int? EndAge = null,
        string? Usage = null,
        string? Prevention = null
    );

    public record VaccineImageUpdateDto(
        string ImageId,
        int Order,
        bool IsMain
    );
}