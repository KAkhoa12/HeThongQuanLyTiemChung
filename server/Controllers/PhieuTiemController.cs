using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.DTOs;
using server.Helpers;
using server.DTOs.Pagination;
using server.DTOs.PhieuTiem;

namespace server.Controllers;

[ApiController]
[Route("api/phieu-tiem")]
public class PhieuTiemController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;
    private readonly ILogger<PhieuTiemController> _logger;

    public PhieuTiemController(HeThongQuanLyTiemChungContext context, ILogger<PhieuTiemController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /* ---------- 1. Lấy danh sách phiếu tiêm (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        [FromQuery] string? customerId = null,
        [FromQuery] string? doctorId = null,
        [FromQuery] string? status = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.PhieuTiems
                .Include(pt => pt.MaNguoiDungNavigation)
                .Include(pt => pt.MaBacSiNavigation)
                .ThenInclude(bs => bs.MaNguoiDungNavigation)
                .Include(pt => pt.MaDichVuNavigation)
                .Include(pt => pt.MaKeHoachTiemNavigation)
                .Include(pt => pt.ChiTietPhieuTiems)
                .ThenInclude(ctpt => ctpt.MaVaccineNavigation)
                .Where(pt => pt.IsDelete != true);

            // Filter by customer
            if (!string.IsNullOrEmpty(customerId))
            {
                query = query.Where(pt => pt.MaNguoiDung == customerId);
            }

            // Filter by doctor
            if (!string.IsNullOrEmpty(doctorId))
            {
                query = query.Where(pt => pt.MaBacSi == doctorId);
            }

            // Filter by status
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(pt => pt.TrangThai == status);
            }

            query = query.OrderByDescending(pt => pt.NgayTiem);

            var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

            var data = paged.Data.Select(pt => new
            {
                pt.MaPhieuTiem,
                pt.MaNguoiDung,
                CustomerName = pt.MaNguoiDungNavigation?.Ten,
                pt.MaBacSi,
                DoctorName = pt.MaBacSiNavigation?.MaNguoiDungNavigation?.Ten,
                pt.MaDichVu,
                ServiceName = pt.MaDichVuNavigation?.Ten,
                pt.NgayTiem,
                pt.TrangThai,
                pt.PhanUng,
                pt.MoTaPhanUng,
                ChiTietPhieuTiems = pt.ChiTietPhieuTiems.Select(ctpt => new
                {
                    ctpt.MaChiTietPhieuTiem,
                    ctpt.MaVaccine,
                    VaccineName = ctpt.MaVaccineNavigation?.Ten,
                    ctpt.MuiTiemThucTe,
                    ctpt.ThuTu
                }),
                pt.NgayTao
            }).ToList();

            return ApiResponse.Success(
                "Lấy danh sách phiếu tiêm thành công",
                new
                {
                    Data = data,
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                    TotalPages = paged.TotalPages
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu tiêm");
            return ApiResponse.Error("Lỗi server khi lấy danh sách phiếu tiêm");
        }
    }

    /* ---------- 2. Lấy phiếu tiêm theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        try
        {
            var phieuTiem = await _context.PhieuTiems
                .Include(pt => pt.MaNguoiDungNavigation)
                .Include(pt => pt.MaBacSiNavigation)
                .ThenInclude(bs => bs.MaNguoiDungNavigation)
                .Include(pt => pt.MaDichVuNavigation)
                .Include(pt => pt.MaKeHoachTiemNavigation)
                .Include(pt => pt.ChiTietPhieuTiems)
                .ThenInclude(ctpt => ctpt.MaVaccineNavigation)
                .FirstOrDefaultAsync(pt => pt.MaPhieuTiem == id, ct);

            if (phieuTiem == null)
            {
                return ApiResponse.Error("Không tìm thấy phiếu tiêm");
            }

            var result = new
            {
                phieuTiem.MaPhieuTiem,
                phieuTiem.MaNguoiDung,
                CustomerName = phieuTiem.MaNguoiDungNavigation?.Ten,
                CustomerPhone = phieuTiem.MaNguoiDungNavigation?.SoDienThoai,
                phieuTiem.MaBacSi,
                DoctorName = phieuTiem.MaBacSiNavigation?.MaNguoiDungNavigation?.Ten,
                phieuTiem.MaDichVu,
                ServiceName = phieuTiem.MaDichVuNavigation?.Ten,
                phieuTiem.NgayTiem,
                phieuTiem.TrangThai,
                phieuTiem.PhanUng,
                phieuTiem.MoTaPhanUng,
                ChiTietPhieuTiems = phieuTiem.ChiTietPhieuTiems.Select(ctpt => new
                {
                    ctpt.MaChiTietPhieuTiem,
                    ctpt.MaVaccine,
                    VaccineName = ctpt.MaVaccineNavigation?.Ten,
                    ctpt.MuiTiemThucTe,
                    ctpt.ThuTu
                }),
                phieuTiem.NgayTao
            };

            return ApiResponse.Success("Lấy thông tin phiếu tiêm thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông tin phiếu tiêm");
            return ApiResponse.Error("Lỗi server khi lấy thông tin phiếu tiêm");
        }
    }

    /* ---------- 3. Tạo phiếu tiêm mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePhieuTiemDto dto, CancellationToken ct = default)
    {
        try
        {
            var phieuTiem = new PhieuTiem
            {
                MaPhieuTiem = Guid.NewGuid().ToString("N"),
                NgayTiem = dto.NgayTiem,
                MaBacSi = dto.MaBacSi,
                MaDichVu = dto.MaDichVu,
                MaNguoiDung = dto.MaNguoiDung,
                MaKeHoachTiem = dto.MaKeHoachTiem,
                TrangThai = dto.TrangThai ?? "COMPLETED",
                PhanUng = dto.PhanUng,
                MoTaPhanUng = dto.MoTaPhanUng,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _context.PhieuTiems.Add(phieuTiem);

            // Tạo chi tiết phiếu tiêm
            foreach (var chiTietDto in dto.ChiTietPhieuTiems)
            {
                var chiTiet = new ChiTietPhieuTiem
                {
                    MaChiTietPhieuTiem = Guid.NewGuid().ToString("N"),
                    MaPhieuTiem = phieuTiem.MaPhieuTiem,
                    MaVaccine = chiTietDto.MaVaccine,
                    MuiTiemThucTe = chiTietDto.MuiTiemThucTe,
                    ThuTu = chiTietDto.ThuTu,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };
                _context.ChiTietPhieuTiems.Add(chiTiet);
            }

            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo phiếu tiêm thành công", phieuTiem.MaPhieuTiem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo phiếu tiêm");
            return ApiResponse.Error("Lỗi server khi tạo phiếu tiêm");
        }
    }

    /* ---------- 4. Cập nhật phiếu tiêm ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdatePhieuTiemDto dto, CancellationToken ct = default)
    {
        try
        {
            var phieuTiem = await _context.PhieuTiems.FindAsync(id);
            if (phieuTiem == null)
            {
                return ApiResponse.Error("Không tìm thấy phiếu tiêm");
            }

            if (dto.NgayTiem.HasValue)
                phieuTiem.NgayTiem = dto.NgayTiem.Value;

            if (!string.IsNullOrEmpty(dto.MaBacSi))
                phieuTiem.MaBacSi = dto.MaBacSi;

            if (!string.IsNullOrEmpty(dto.TrangThai))
                phieuTiem.TrangThai = dto.TrangThai;

            if (dto.PhanUng != null)
                phieuTiem.PhanUng = dto.PhanUng;

            if (dto.MoTaPhanUng != null)
                phieuTiem.MoTaPhanUng = dto.MoTaPhanUng;

            phieuTiem.NgayCapNhat = DateTime.UtcNow;

            _context.PhieuTiems.Update(phieuTiem);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật phiếu tiêm thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật phiếu tiêm");
            return ApiResponse.Error("Lỗi server khi cập nhật phiếu tiêm");
        }
    }

    /* ---------- 5. Lấy phiếu tiêm theo khách hàng ---------- */
    [HttpGet("by-customer/{customerId}")]
    public async Task<IActionResult> GetByCustomer(string customerId, CancellationToken ct = default)
    {
        try
        {
            var phieuTiems = await _context.PhieuTiems
                .Include(pt => pt.MaBacSiNavigation)
                .ThenInclude(bs => bs.MaNguoiDungNavigation)
                .Include(pt => pt.MaDichVuNavigation)
                .Include(pt => pt.ChiTietPhieuTiems)
                .ThenInclude(ctpt => ctpt.MaVaccineNavigation)
                .Where(pt => pt.MaNguoiDung == customerId && pt.IsDelete != true)
                .OrderByDescending(pt => pt.NgayTiem)
                .ToListAsync(ct);

            var result = phieuTiems.Select(pt => new
            {
                pt.MaPhieuTiem,
                pt.MaBacSi,
                DoctorName = pt.MaBacSiNavigation?.MaNguoiDungNavigation?.Ten,
                pt.MaDichVu,
                ServiceName = pt.MaDichVuNavigation?.Ten,
                pt.NgayTiem,
                pt.TrangThai,
                pt.PhanUng,
                pt.MoTaPhanUng,
                ChiTietPhieuTiems = pt.ChiTietPhieuTiems.Select(ctpt => new
                {
                    ctpt.MaChiTietPhieuTiem,
                    ctpt.MaVaccine,
                    VaccineName = ctpt.MaVaccineNavigation?.Ten,
                    ctpt.MuiTiemThucTe,
                    ctpt.ThuTu
                }),
                pt.NgayTao
            }).ToList();

            return ApiResponse.Success("Lấy phiếu tiêm theo khách hàng thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy phiếu tiêm theo khách hàng");
            return ApiResponse.Error("Lỗi server khi lấy phiếu tiêm theo khách hàng");
        }
    }

    /* ---------- 6. Lấy phiếu tiêm theo bác sĩ ---------- */
    [HttpGet("by-doctor/{doctorId}")]
    public async Task<IActionResult> GetByDoctor(string doctorId, CancellationToken ct = default)
    {
        try
        {
            var phieuTiems = await _context.PhieuTiems
                .Include(pt => pt.MaNguoiDungNavigation)
                .Include(pt => pt.MaBacSiNavigation)
                .ThenInclude(bs => bs.MaNguoiDungNavigation)
                .Include(pt => pt.MaDichVuNavigation)
                .Include(pt => pt.ChiTietPhieuTiems)
                .ThenInclude(ctpt => ctpt.MaVaccineNavigation)
                .Where(pt => pt.MaBacSi == doctorId && pt.IsDelete != true)
                .OrderByDescending(pt => pt.NgayTiem)
                .ToListAsync(ct);

            var result = phieuTiems.Select(pt => new
            {
                pt.MaPhieuTiem,
                pt.MaNguoiDung,
                CustomerName = pt.MaNguoiDungNavigation?.Ten,
                CustomerPhone = pt.MaNguoiDungNavigation?.SoDienThoai,
                pt.MaDichVu,
                ServiceName = pt.MaDichVuNavigation?.Ten,
                pt.NgayTiem,
                pt.TrangThai,
                pt.PhanUng,
                pt.MoTaPhanUng,
                ChiTietPhieuTiems = pt.ChiTietPhieuTiems.Select(ctpt => new
                {
                    ctpt.MaChiTietPhieuTiem,
                    ctpt.MaVaccine,
                    VaccineName = ctpt.MaVaccineNavigation?.Ten,
                    ctpt.MuiTiemThucTe,
                    ctpt.ThuTu
                }),
                pt.NgayTao
            }).ToList();

            return ApiResponse.Success("Lấy phiếu tiêm theo bác sĩ thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy phiếu tiêm theo bác sĩ");
            return ApiResponse.Error("Lỗi server khi lấy phiếu tiêm theo bác sĩ");
        }
    }

    /* ---------- 7. Tạo phiếu tiêm từ kế hoạch tiêm ---------- */
    [HttpPost("create-from-ke-hoach")]
    public async Task<IActionResult> CreateFromKeHoach([FromBody] CreatePhieuTiemFromKeHoachDto createDto, CancellationToken ct = default)
    {
        try
        {
            // Lấy kế hoạch tiêm
            var keHoachTiem = await _context.KeHoachTiems
                .Include(kht => kht.MaNguoiDungNavigation)
                .Include(kht => kht.MaDichVuNavigation)
                .Include(kht => kht.MaVaccineNavigation)
                .FirstOrDefaultAsync(kht => kht.MaKeHoachTiem == createDto.MaKeHoachTiem, ct);

            if (keHoachTiem == null)
            {
                return ApiResponse.Error("Không tìm thấy kế hoạch tiêm");
            }

            if (keHoachTiem.TrangThai == "COMPLETED")
            {
                return ApiResponse.Error("Kế hoạch tiêm này đã hoàn thành");
            }

            // Tạo phiếu tiêm
            var phieuTiem = new PhieuTiem
            {
                MaPhieuTiem = Guid.NewGuid().ToString("N"),
                MaNguoiDung = keHoachTiem.MaNguoiDung,
                MaDichVu = keHoachTiem.MaDichVu,
                MaKeHoachTiem = keHoachTiem.MaKeHoachTiem,
                MaBacSi = createDto.MaBacSi,
                NgayTiem = createDto.NgayTiem ?? DateTime.UtcNow,
                TrangThai = "COMPLETED",
                PhanUng = createDto.PhanUng,
                MoTaPhanUng = createDto.MoTaPhanUng,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _context.PhieuTiems.Add(phieuTiem);

            // Tạo chi tiết phiếu tiêm
            var chiTietPhieuTiem = new ChiTietPhieuTiem
            {
                MaChiTietPhieuTiem = Guid.NewGuid().ToString("N"),
                MaPhieuTiem = phieuTiem.MaPhieuTiem,
                MaVaccine = keHoachTiem.MaVaccine,
                MuiTiemThucTe = keHoachTiem.MuiThu,
                ThuTu = 1,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _context.ChiTietPhieuTiems.Add(chiTietPhieuTiem);

            // Cập nhật trạng thái kế hoạch tiêm
            keHoachTiem.TrangThai = "COMPLETED";

            await _context.SaveChangesAsync(ct);

            // Lấy thông tin đầy đủ để trả về
            var result = await GetById(phieuTiem.MaPhieuTiem, ct);

            return ApiResponse.Success("Tạo phiếu tiêm từ kế hoạch thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo phiếu tiêm từ kế hoạch");
            return ApiResponse.Error("Lỗi server khi tạo phiếu tiêm từ kế hoạch");
        }
    }

    /* ---------- 8. Lấy danh sách kế hoạch tiêm sẵn sàng cho tiêm ---------- */
    [HttpGet("ready-to-vaccinate/{customerId}")]
    public async Task<IActionResult> GetReadyToVaccinate(string customerId, CancellationToken ct = default)
    {
        try
        {
            var readyKeHoach = await (from kht in _context.KeHoachTiems
                                    join dv in _context.DichVus on kht.MaDichVu equals dv.MaDichVu
                                    join v in _context.Vaccines on kht.MaVaccine equals v.MaVaccine
                                    where kht.MaNguoiDung == customerId
                                          && (kht.TrangThai == "SCHEDULED" || kht.TrangThai == "PENDING")
                                          && kht.NgayDuKien <= DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7)) // Trong 7 ngày tới
                                    orderby kht.NgayDuKien
                                    select new
                                    {
                                        kht.MaKeHoachTiem,
                                        ServiceName = dv.Ten,
                                        VaccineName = v.Ten,
                                        kht.MuiThu,
                                        kht.NgayDuKien,
                                        kht.TrangThai,
                                        IsReady = kht.NgayDuKien <= DateOnly.FromDateTime(DateTime.UtcNow)
                                    }).ToListAsync(ct);

            return ApiResponse.Success("Lấy danh sách kế hoạch sẵn sàng tiêm thành công", readyKeHoach);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách kế hoạch sẵn sàng tiêm");
            return ApiResponse.Error("Lỗi server khi lấy danh sách kế hoạch sẵn sàng tiêm");
        }
    }
}

// DTOs
public class CreatePhieuTiemDto
{
    public DateTime? NgayTiem { get; set; }
    public string? MaBacSi { get; set; }
    public string? MaDichVu { get; set; }
    public string? MaNguoiDung { get; set; }
    public string? MaKeHoachTiem { get; set; }
    public string? TrangThai { get; set; }
    public string? PhanUng { get; set; }
    public string? MoTaPhanUng { get; set; }
    public List<ChiTietPhieuTiemForCreateDto> ChiTietPhieuTiems { get; set; } = new List<ChiTietPhieuTiemForCreateDto>();
}


public class UpdatePhieuTiemDto
{
    public DateTime? NgayTiem { get; set; }
    public string? MaBacSi { get; set; }
    public string? TrangThai { get; set; }
    public string? PhanUng { get; set; }
    public string? MoTaPhanUng { get; set; }
}

public class CreatePhieuTiemFromKeHoachDto
{
    public string MaKeHoachTiem { get; set; } = null!;
    public string? MaBacSi { get; set; }
    public DateTime? NgayTiem { get; set; }
    public string? PhanUng { get; set; }
    public string? MoTaPhanUng { get; set; }
}