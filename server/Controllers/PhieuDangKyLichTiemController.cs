using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.DTOs;
using server.ModelViews;
using server.Helpers;
using server.DTOs.Pagination;

namespace server.Controllers;

[ApiController]
[Route("api/appointments")]
public class PhieuDangKyLichTiemController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;
    private readonly ILogger<PhieuDangKyLichTiemController> _logger;

    public PhieuDangKyLichTiemController(HeThongQuanLyTiemChungContext context, ILogger<PhieuDangKyLichTiemController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /* ---------- 1. Lấy danh sách phiếu đăng ký (có phân trang) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        try
        {
            var query = from p in _context.PhieuDangKyLichTiems
                        join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                        join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                        where p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDichVu = p.MaDichVu,
                            NgayDangKy = p.NgayDangKy.ToString("yyyy-MM-dd HH:mm:ss"),
                            TrangThai = p.TrangThai,
                            LyDoTuChoi = p.LyDoTuChoi,
                            GhiChu = p.GhiChu,
                            IsDelete = p.IsDelete,
                            IsActive = p.IsActive,
                            NgayTao = p.NgayTao.HasValue ? p.NgayTao.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                            NgayCapNhat = p.NgayCapNhat.HasValue ? p.NgayCapNhat.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                            TenKhachHang = kh.Ten,
                            SoDienThoaiKhachHang = kh.SoDienThoai,
                            EmailKhachHang = kh.Email,
                            TenDichVu = dv.Ten,
                            MaDonHangDisplay = p.MaDichVu
                        };

            var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);

            return ApiResponse.Success(
                "Lấy danh sách phiếu đăng ký lịch tiêm thành công",
                new PagedResultDto<PhieuDangKyLichTiemVM>(
                    paged.TotalCount,
                    paged.Page,
                    paged.PageSize,
                    paged.TotalPages,
                    paged.Data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi lấy danh sách phiếu đăng ký lịch tiêm");
        }
    }



    /* ---------- 3. Lấy thông tin phiếu đăng ký theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        try
        {
            var phieuDangKy = await (from p in _context.PhieuDangKyLichTiems
                                    join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                                    join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                                    where p.MaPhieuDangKy == id && p.IsDelete != true && p.IsActive == true
                                    select new PhieuDangKyLichTiemVM
                                    {
                                        MaPhieuDangKy = p.MaPhieuDangKy,
                                        MaKhachHang = p.MaKhachHang,
                                        MaDichVu = p.MaDichVu,
                                        NgayDangKy = p.NgayDangKy.ToString("yyyy-MM-dd HH:mm:ss"),
                                        TrangThai = p.TrangThai,
                                        LyDoTuChoi = p.LyDoTuChoi,
                                        GhiChu = p.GhiChu,
                                        IsDelete = p.IsDelete,
                                        IsActive = p.IsActive,
                                        NgayTao = p.NgayTao.HasValue ? p.NgayTao.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                                        NgayCapNhat = p.NgayCapNhat.HasValue ? p.NgayCapNhat.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                                        TenKhachHang = kh.Ten,
                                        SoDienThoaiKhachHang = kh.SoDienThoai,
                                        EmailKhachHang = kh.Email,
                                        TenDichVu = dv.Ten,
                                        MaDonHangDisplay = p.MaDichVu
                                    }).FirstOrDefaultAsync(ct);

            if (phieuDangKy == null)
            {
                return ApiResponse.Error("Không tìm thấy phiếu đăng ký lịch tiêm");
            }

            return ApiResponse.Success("Lấy thông tin phiếu đăng ký lịch tiêm thành công", phieuDangKy);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông tin phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi lấy thông tin phiếu đăng ký lịch tiêm");
        }
    }

    /* ---------- 2. Tạo phiếu đăng ký từ đơn hàng ---------- */
    [HttpPost("create-from-order")]
    public async Task<IActionResult> CreateFromOrder([FromBody] CreateAppointmentFromOrderDto createDto, CancellationToken ct = default)
    {
        try
        {
            // Lấy thông tin đơn hàng
            var order = await _context.DonHangs
                .Include(dh => dh.DonHangChiTiets)
                .FirstOrDefaultAsync(dh => dh.MaDonHang == createDto.OrderId, ct);

            if (order == null)
            {
                return ApiResponse.Error("Không tìm thấy đơn hàng");
            }

            // Tạo phiếu đăng ký cho từng dịch vụ trong đơn hàng
            var createdAppointments = new List<string>();

            foreach (var chiTiet in order.DonHangChiTiets)
            {
                var phieuDangKy = new PhieuDangKyLichTiem
                {
                    MaPhieuDangKy = Guid.NewGuid().ToString(),
                    MaKhachHang = order.MaNguoiDung,
                    MaDichVu = chiTiet.MaDichVu,
                    NgayDangKy = DateTime.Now,
                    TrangThai = "Pending",
                    GhiChu = createDto.GhiChu,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.PhieuDangKyLichTiems.Add(phieuDangKy);
                createdAppointments.Add(phieuDangKy.MaPhieuDangKy);
            }

            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo phiếu đăng ký lịch tiêm từ đơn hàng thành công", createdAppointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo phiếu đăng ký lịch tiêm từ đơn hàng");
            return ApiResponse.Error("Lỗi server khi tạo phiếu đăng ký lịch tiêm từ đơn hàng");
        }
    }

    /* ---------- 5. Tạo phiếu đăng ký lịch tiêm thông thường ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(CreatePhieuDangKyLichTiemDto createDto, CancellationToken ct = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return ApiResponse.Error("Dữ liệu không hợp lệ");
            }

            var phieuDangKy = new PhieuDangKyLichTiem
            {
                MaPhieuDangKy = Guid.NewGuid().ToString(),
                MaKhachHang = createDto.MaKhachHang,
                MaDichVu = createDto.MaDichVu,
                NgayDangKy = DateTime.Now,
                TrangThai = "Pending",
                GhiChu = createDto.GhiChu,
                IsDelete = false,
                IsActive = true,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            _context.PhieuDangKyLichTiems.Add(phieuDangKy);
            await _context.SaveChangesAsync(ct);

            // Lấy thông tin đầy đủ để trả về
            var result = await GetById(phieuDangKy.MaPhieuDangKy, ct);

            return CreatedAtAction(nameof(GetById), new { id = phieuDangKy.MaPhieuDangKy }, 
                ApiResponse.Success("Tạo phiếu đăng ký lịch tiêm thành công", result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi tạo phiếu đăng ký lịch tiêm");
        }
    }

    /* ---------- 6. Cập nhật phiếu đăng ký ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdatePhieuDangKyLichTiemDto updateDto, CancellationToken ct = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return ApiResponse.Error("Dữ liệu không hợp lệ");
            }

            var phieuDangKy = await _context.PhieuDangKyLichTiems.FindAsync(id);
            if (phieuDangKy == null)
            {
                return ApiResponse.Error("Không tìm thấy phiếu đăng ký lịch tiêm");
            }

            // Cập nhật các trường
            if (!string.IsNullOrEmpty(updateDto.GhiChu))
                phieuDangKy.GhiChu = updateDto.GhiChu;

            phieuDangKy.NgayCapNhat = DateTime.Now;

            _context.PhieuDangKyLichTiems.Update(phieuDangKy);
            await _context.SaveChangesAsync(ct);

            // Lấy thông tin đầy đủ để trả về
            var result = await GetById(id, ct);

            return ApiResponse.Success("Cập nhật phiếu đăng ký lịch tiêm thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi cập nhật phiếu đăng ký lịch tiêm");
        }
    }

    /* ---------- 7. Duyệt phiếu đăng ký ---------- */
    [HttpPut("{id}/approve")]
    public async Task<IActionResult> ApproveAppointment(string id, ApproveAppointmentDto approveDto, CancellationToken ct = default)
    {
        try
        {
            var phieuDangKy = await _context.PhieuDangKyLichTiems.FindAsync(id);
            if (phieuDangKy == null)
            {
                return ApiResponse.Error("Không tìm thấy phiếu đăng ký lịch tiêm");
            }

            if (phieuDangKy.TrangThai != "Pending")
            {
                return ApiResponse.Error("Phiếu đăng ký không ở trạng thái chờ xác nhận");
            }

            // Cập nhật trạng thái
            phieuDangKy.TrangThai = approveDto.Status;
            if (approveDto.Status == "Rejected" && !string.IsNullOrEmpty(approveDto.Reason))
            {
                phieuDangKy.LyDoTuChoi = approveDto.Reason;
            }
            else
            {
                phieuDangKy.LyDoTuChoi = null;
            }

            phieuDangKy.NgayCapNhat = DateTime.Now;

            // Nếu trạng thái là "Approved", tạo PhieuTiem mới
            if (approveDto.Status == "Approved")
            {
                var phieuTiem = new PhieuTiem
                {
                    MaPhieuTiem = Guid.NewGuid().ToString(),
                    MaNguoiDung = phieuDangKy.MaKhachHang,
                    MaDichVu = phieuDangKy.MaDichVu,
                    TrangThai = "NOTIFICATION",
                    NgayTiem = DateTime.UtcNow,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };

                _context.PhieuTiems.Add(phieuTiem);
                
                // Tạo chi tiết phiếu tiêm mặc định
                var chiTietPhieuTiem = new ChiTietPhieuTiem
                {
                    MaChiTietPhieuTiem = Guid.NewGuid().ToString(),
                    MaPhieuTiem = phieuTiem.MaPhieuTiem,
                    MaVaccine = "default", // Cần cập nhật để lấy từ dịch vụ thực tế
                    MuiTiemThucTe = 1,
                    ThuTu = 1,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };
                
                _context.ChiTietPhieuTiems.Add(chiTietPhieuTiem);
            }

            _context.PhieuDangKyLichTiems.Update(phieuDangKy);
            await _context.SaveChangesAsync(ct);

            // Lấy thông tin đầy đủ để trả về
            var result = await GetById(id, ct);

            return ApiResponse.Success($"Duyệt phiếu đăng ký lịch tiêm thành công - Trạng thái: {approveDto.Status}", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi duyệt phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi duyệt phiếu đăng ký lịch tiêm"+ex.Message);
        }
    }

    /* ---------- 8. Xóa phiếu đăng ký ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        try
        {
            var phieuDangKy = await _context.PhieuDangKyLichTiems.FindAsync(id);
            if (phieuDangKy == null)
            {
                return ApiResponse.Error("Không tìm thấy phiếu đăng ký lịch tiêm");
            }

            phieuDangKy.IsDelete = true;
            phieuDangKy.IsActive = false;
            phieuDangKy.NgayCapNhat = DateTime.Now;

            _context.PhieuDangKyLichTiems.Update(phieuDangKy);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa phiếu đăng ký lịch tiêm thành công", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi xóa phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi xóa phiếu đăng ký lịch tiêm");
        }
    }

    /* ---------- 9. Lấy phiếu đăng ký theo khách hàng ---------- */
    [HttpGet("by-customer/{customerId}")]
    public async Task<IActionResult> GetByCustomer(string customerId, CancellationToken ct = default)
    {
        try
        {
            var query = from p in _context.PhieuDangKyLichTiems
                        join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                        join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                        where p.MaKhachHang == customerId && p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDichVu = p.MaDichVu,
                            NgayDangKy = p.NgayDangKy.ToString("yyyy-MM-dd HH:mm:ss"),
                            TrangThai = p.TrangThai,
                            LyDoTuChoi = p.LyDoTuChoi,
                            GhiChu = p.GhiChu,
                            IsDelete = p.IsDelete,
                            IsActive = p.IsActive,
                            NgayTao = p.NgayTao.HasValue ? p.NgayTao.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                            NgayCapNhat = p.NgayCapNhat.HasValue ? p.NgayCapNhat.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                            TenKhachHang = kh.Ten,
                            SoDienThoaiKhachHang = kh.SoDienThoai,
                            EmailKhachHang = kh.Email,
                            TenDichVu = dv.Ten,
                            MaDonHangDisplay = p.MaDichVu
                        };

            var phieuDangKys = await query.ToListAsync(ct);

            return ApiResponse.Success("Lấy danh sách phiếu đăng ký lịch tiêm theo khách hàng thành công", phieuDangKys);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu đăng ký lịch tiêm theo khách hàng");
            return ApiResponse.Error("Lỗi server khi lấy danh sách phiếu đăng ký lịch tiêm theo khách hàng");
        }
    }

    /* ---------- 10. Lấy tất cả phiếu đăng ký tiêm chủng theo maNguoiDung (có phân trang) ---------- */
    [HttpGet("by-user/{maNguoiDung}")]
    public async Task<IActionResult> GetAllByUser(
        string maNguoiDung,
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        try
        {
            _logger.LogInformation("Bắt đầu lấy danh sách phiếu đăng ký cho maNguoiDung: {maNguoiDung}", maNguoiDung);
            
            // Kiểm tra xem maNguoiDung có tồn tại không
            var userExists = await _context.NguoiDungs.AnyAsync(u => u.MaNguoiDung == maNguoiDung, ct);
            if (!userExists)
            {
                _logger.LogWarning("Không tìm thấy người dùng với maNguoiDung: {maNguoiDung}", maNguoiDung);
                return ApiResponse.Error($"Không tìm thấy người dùng với mã: {maNguoiDung}");
            }

            var query = from p in _context.PhieuDangKyLichTiems
                        join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                        join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                        where p.MaKhachHang == maNguoiDung && p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDichVu = p.MaDichVu,
                            NgayDangKy = p.NgayDangKy.ToString("yyyy-MM-dd HH:mm:ss"),
                            TrangThai = p.TrangThai,
                            LyDoTuChoi = p.LyDoTuChoi,
                            GhiChu = p.GhiChu,
                            IsDelete = p.IsDelete,
                            IsActive = p.IsActive,
                            NgayTao = p.NgayTao.HasValue ? p.NgayTao.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                            NgayCapNhat = p.NgayCapNhat.HasValue ? p.NgayCapNhat.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                            TenKhachHang = kh.Ten,
                            SoDienThoaiKhachHang = kh.SoDienThoai,
                            EmailKhachHang = kh.Email,
                            TenDichVu = dv.Ten,
                            MaDonHangDisplay = p.MaDichVu
                        };

            _logger.LogInformation("Thực hiện query với page: {page}, pageSize: {pageSize}", page, pageSize);
            var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);
            
            _logger.LogInformation("Query thành công, tổng số: {totalCount}", paged.TotalCount);

            return ApiResponse.Success(
                "Lấy danh sách phiếu đăng ký lịch tiêm theo người dùng thành công",
                new PagedResultDto<PhieuDangKyLichTiemVM>(
                    paged.TotalCount,
                    paged.Page,
                    paged.PageSize,
                    paged.TotalPages,
                    paged.Data));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu đăng ký lịch tiêm theo người dùng");
            return ApiResponse.Error("Lỗi server khi lấy danh sách phiếu đăng ký lịch tiêm theo người dùng");
        }
    }

    /* ---------- 11. Test endpoint để kiểm tra controller ---------- */
    [HttpGet("test")]
    public IActionResult Test()
    {
        return ApiResponse.Success("Controller hoạt động bình thường", new { timestamp = DateTime.Now });
    }

    /* ---------- 12. Kiểm tra dữ liệu trong database ---------- */
    [HttpGet("check-data")]
    public async Task<IActionResult> CheckData(CancellationToken ct = default)
    {
        try
        {
            var totalPhieuDangKy = await _context.PhieuDangKyLichTiems.CountAsync(ct);
            var totalNguoiDung = await _context.NguoiDungs.CountAsync(ct);
            var totalDonHang = await _context.DonHangs.CountAsync(ct);

            return ApiResponse.Success("Thông tin database", new
            {
                totalPhieuDangKy,
                totalNguoiDung,
                totalDonHang
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi kiểm tra dữ liệu database");
            return ApiResponse.Error("Lỗi server khi kiểm tra dữ liệu database");
        }
    }

    // DTO cho việc đăng ký từ đơn hàng
    public class CreateAppointmentFromOrderDto
    {
        public string OrderId { get; set; } = null!;
        public string? GhiChu { get; set; }
    }

    // DTO cho việc duyệt phiếu
    public class ApproveAppointmentDto
    {
        public string Status { get; set; } = null!; // "Approved" hoặc "Rejected"
        public string? Reason { get; set; } // Lý do từ chối nếu có
    }
} 