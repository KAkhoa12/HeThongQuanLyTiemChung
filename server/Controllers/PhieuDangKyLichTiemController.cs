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
                        join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                        join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                        where p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDichVu = p.MaDichVu,
                            MaBacSi = p.MaBacSi,
                            NgayDangKy = p.NgayDangKy,
                            NgayHenTiem = p.NgayHenTiem,
                            GioHenTiem = p.GioHenTiem,
                            TrangThai = p.TrangThai,
                            LyDoTuChoi = p.LyDoTuChoi,
                            GhiChu = p.GhiChu,
                            IsDelete = p.IsDelete,
                            IsActive = p.IsActive,
                            NgayTao = p.NgayTao,
                            NgayCapNhat = p.NgayCapNhat,
                            TenKhachHang = kh.Ten,
                            SoDienThoaiKhachHang = kh.SoDienThoai,
                            EmailKhachHang = kh.Email,
                            TenDichVu = dv.Ten,
                            TenBacSi = nd.Ten
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

    /* ---------- 2. Lấy lịch trống theo bác sĩ và địa điểm ---------- */
    [HttpGet("available-slots")]
    public async Task<IActionResult> GetAvailableSlots(
        [FromQuery] string doctorId,
        [FromQuery] string locationId,
        [FromQuery] DateOnly? fromDate = null,
        [FromQuery] DateOnly? toDate = null,
        CancellationToken ct = default)
    {
        try
        {
            // Kiểm tra bác sĩ tồn tại
            if (!await _context.BacSis.AnyAsync(b => b.MaBacSi == doctorId && b.IsDelete == false, ct))
                return ApiResponse.Error("Không tìm thấy bác sĩ", 404);

            // Kiểm tra địa điểm tồn tại
            if (!await _context.DiaDiems.AnyAsync(d => d.MaDiaDiem == locationId && d.IsDelete == false, ct))
                return ApiResponse.Error("Không tìm thấy địa điểm", 404);

            // Mặc định lấy lịch từ ngày hiện tại đến 30 ngày sau
            var today = DateOnly.FromDateTime(DateTime.Today);
            fromDate ??= today;
            toDate ??= today.AddDays(30);

            // Lấy lịch làm việc có sẵn của bác sĩ
            var availableSchedules = await _context.LichLamViecs
                .Where(l => l.MaBacSi == doctorId &&
                           l.MaDiaDiem == locationId &&
                           l.IsDelete == false &&
                           l.IsActive == true &&
                           l.TrangThai == "Available" &&
                           l.NgayLam >= fromDate &&
                           l.NgayLam <= toDate &&
                           l.SoLuongCho > (l.DaDat ?? 0))
                .OrderBy(l => l.NgayLam)
                .ThenBy(l => l.GioBatDau)
                .Select(l => new
                {
                    l.MaLichLamViec,
                    l.NgayLam,
                    l.GioBatDau,
                    l.GioKetThuc,
                    l.SoLuongCho,
                    AvailableSlots = l.SoLuongCho - (l.DaDat ?? 0),
                    l.TrangThai
                })
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy lịch trống thành công", availableSchedules);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy lịch trống");
            return ApiResponse.Error("Lỗi server khi lấy lịch trống");
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
                                    join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                                    join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                                    where p.MaPhieuDangKy == id && p.IsDelete != true && p.IsActive == true
                                    select new PhieuDangKyLichTiemVM
                                    {
                                        MaPhieuDangKy = p.MaPhieuDangKy,
                                        MaKhachHang = p.MaKhachHang,
                                        MaDichVu = p.MaDichVu,
                                        MaBacSi = p.MaBacSi,
                                        NgayDangKy = p.NgayDangKy,
                                        NgayHenTiem = p.NgayHenTiem,
                                        GioHenTiem = p.GioHenTiem,
                                        TrangThai = p.TrangThai,
                                        LyDoTuChoi = p.LyDoTuChoi,
                                        GhiChu = p.GhiChu,
                                        IsDelete = p.IsDelete,
                                        IsActive = p.IsActive,
                                        NgayTao = p.NgayTao,
                                        NgayCapNhat = p.NgayCapNhat,
                                        TenKhachHang = kh.Ten,
                                        SoDienThoaiKhachHang = kh.SoDienThoai,
                                        EmailKhachHang = kh.Email,
                                        TenDichVu = dv.Ten,
                                        TenBacSi = nd.Ten
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

    /* ---------- 4. Đăng ký lịch tiêm từ đơn hàng đã thanh toán ---------- */
    [HttpPost("from-order")]
    public async Task<IActionResult> CreateFromOrder(CreateAppointmentFromOrderDto createDto, CancellationToken ct = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return ApiResponse.Error("Dữ liệu không hợp lệ");
            }

            // Kiểm tra đơn hàng tồn tại và đã thanh toán
            var order = await _context.DonHangs
                .FirstOrDefaultAsync(d => d.MaDonHang == createDto.OrderId && 
                                        d.IsDelete == false && 
                                        d.TrangThaiDon == "PAID", ct);
            
            if (order == null)
                return ApiResponse.Error("Đơn hàng không tồn tại hoặc chưa thanh toán", 400);

            // Kiểm tra bác sĩ tồn tại
            if (!await _context.BacSis.AnyAsync(b => b.MaBacSi == createDto.DoctorId && b.IsDelete == false, ct))
                return ApiResponse.Error("Không tìm thấy bác sĩ", 404);

            // Kiểm tra lịch làm việc có sẵn
            var schedule = await _context.LichLamViecs
                .FirstOrDefaultAsync(l => l.MaLichLamViec == createDto.ScheduleId &&
                                        l.MaBacSi == createDto.DoctorId &&
                                        l.IsDelete == false &&
                                        l.IsActive == true &&
                                        l.TrangThai == "Available" &&
                                        l.SoLuongCho > (l.DaDat ?? 0), ct);

            if (schedule == null)
                return ApiResponse.Error("Lịch làm việc không có sẵn", 400);

            // Kiểm tra thời gian hợp lệ
            if (createDto.AppointmentDate < DateOnly.FromDateTime(DateTime.Today))
                return ApiResponse.Error("Ngày hẹn không thể trong quá khứ", 400);

            // Kiểm tra thời gian hẹn có trong lịch làm việc không
            if (createDto.AppointmentDate != schedule.NgayLam)
                return ApiResponse.Error("Ngày hẹn không khớp với lịch làm việc của bác sĩ", 400);

            // Kiểm tra giờ hẹn có trong khung giờ làm việc không
            var appointmentTime = TimeOnly.Parse(createDto.AppointmentTime);
            if (appointmentTime < schedule.GioBatDau || appointmentTime >= schedule.GioKetThuc)
                return ApiResponse.Error("Giờ hẹn không nằm trong khung giờ làm việc của bác sĩ", 400);

            // Tạo phiếu đăng ký lịch tiêm
            var appointment = new PhieuDangKyLichTiem
            {
                MaPhieuDangKy = Guid.NewGuid().ToString(),
                MaKhachHang = order.MaNguoiDung,
                MaDichVu = createDto.ServiceId,
                MaBacSi = createDto.DoctorId,
                NgayDangKy = DateTime.Now,
                NgayHenTiem = createDto.AppointmentDate.ToDateTime(TimeOnly.MinValue),
                GioHenTiem = createDto.AppointmentTime,
                TrangThai = "Chờ xác nhận",
                GhiChu = createDto.GhiChu,
                IsDelete = false,
                IsActive = true,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            _context.PhieuDangKyLichTiems.Add(appointment);

            // Cập nhật số chỗ đã đặt trong lịch làm việc
            schedule.DaDat = (schedule.DaDat ?? 0) + 1;
            if (schedule.DaDat >= schedule.SoLuongCho)
            {
                schedule.TrangThai = "Full";
            }

            await _context.SaveChangesAsync(ct);

            // Lấy thông tin đầy đủ để trả về
            var result = await GetById(appointment.MaPhieuDangKy, ct);

            return CreatedAtAction(nameof(GetById), new { id = appointment.MaPhieuDangKy }, 
                ApiResponse.Success("Đăng ký lịch tiêm thành công", result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi đăng ký lịch tiêm từ đơn hàng");
            return ApiResponse.Error("Lỗi server khi đăng ký lịch tiêm");
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
                MaBacSi = createDto.MaBacSi,
                NgayDangKy = DateTime.Now,
                NgayHenTiem = createDto.NgayHenTiem,
                GioHenTiem = createDto.GioHenTiem,
                TrangThai = "Chờ duyệt",
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
            if (updateDto.NgayHenTiem.HasValue)
                phieuDangKy.NgayHenTiem = updateDto.NgayHenTiem.Value;
            if (!string.IsNullOrEmpty(updateDto.GioHenTiem))
                phieuDangKy.GioHenTiem = updateDto.GioHenTiem;
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

            if (phieuDangKy.TrangThai != "Chờ xác nhận")
            {
                return ApiResponse.Error("Phiếu đăng ký không ở trạng thái chờ xác nhận");
            }

            // Cập nhật trạng thái
            phieuDangKy.TrangThai = approveDto.Status;
            if (approveDto.Status == "Từ chối" && !string.IsNullOrEmpty(approveDto.Reason))
            {
                phieuDangKy.LyDoTuChoi = approveDto.Reason;
            }
            else
            {
                phieuDangKy.LyDoTuChoi = null;
            }

            phieuDangKy.NgayCapNhat = DateTime.Now;

            _context.PhieuDangKyLichTiems.Update(phieuDangKy);
            await _context.SaveChangesAsync(ct);

            // Lấy thông tin đầy đủ để trả về
            var result = await GetById(id, ct);

            return ApiResponse.Success($"Duyệt phiếu đăng ký lịch tiêm thành công - Trạng thái: {approveDto.Status}", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi duyệt phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi duyệt phiếu đăng ký lịch tiêm");
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
                        join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                        join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                        where p.MaKhachHang == customerId && p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDichVu = p.MaDichVu,
                            MaBacSi = p.MaBacSi,
                            NgayDangKy = p.NgayDangKy,
                            NgayHenTiem = p.NgayHenTiem,
                            GioHenTiem = p.GioHenTiem,
                            TrangThai = p.TrangThai,
                            LyDoTuChoi = p.LyDoTuChoi,
                            GhiChu = p.GhiChu,
                            IsDelete = p.IsDelete,
                            IsActive = p.IsActive,
                            NgayTao = p.NgayTao,
                            NgayCapNhat = p.NgayCapNhat,
                            TenKhachHang = kh.Ten,
                            SoDienThoaiKhachHang = kh.SoDienThoai,
                            EmailKhachHang = kh.Email,
                            TenDichVu = dv.Ten,
                            TenBacSi = nd.Ten
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

    /* ---------- 10. Lấy phiếu đăng ký theo bác sĩ ---------- */
    [HttpGet("by-doctor/{doctorId}")]
    public async Task<IActionResult> GetByDoctor(string doctorId, CancellationToken ct = default)
    {
        try
        {
            var query = from p in _context.PhieuDangKyLichTiems
                        join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                        join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                        join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                        join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                        where p.MaBacSi == doctorId && p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDichVu = p.MaDichVu,
                            MaBacSi = p.MaBacSi,
                            NgayDangKy = p.NgayDangKy,
                            NgayHenTiem = p.NgayHenTiem,
                            GioHenTiem = p.GioHenTiem,
                            TrangThai = p.TrangThai,
                            LyDoTuChoi = p.LyDoTuChoi,
                            GhiChu = p.GhiChu,
                            IsDelete = p.IsDelete,
                            IsActive = p.IsActive,
                            NgayTao = p.NgayTao,
                            NgayCapNhat = p.NgayCapNhat,
                            TenKhachHang = kh.Ten,
                            SoDienThoaiKhachHang = kh.SoDienThoai,
                            EmailKhachHang = kh.Email,
                            TenDichVu = dv.Ten,
                            TenBacSi = nd.Ten
                        };

            var phieuDangKys = await query.ToListAsync(ct);

            return ApiResponse.Success("Lấy danh sách phiếu đăng ký lịch tiêm theo bác sĩ thành công", phieuDangKys);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu đăng ký lịch tiêm theo bác sĩ");
            return ApiResponse.Error("Lỗi server khi lấy danh sách phiếu đăng ký lịch tiêm theo bác sĩ");
        }
    }

    // DTO cho việc đăng ký từ đơn hàng
    public class CreateAppointmentFromOrderDto
    {
        public string OrderId { get; set; } = null!;
        public string DoctorId { get; set; } = null!;
        public string ServiceId { get; set; } = null!;
        public string ScheduleId { get; set; } = null!;
        public DateOnly AppointmentDate { get; set; }
        public string AppointmentTime { get; set; } = null!;
        public string? GhiChu { get; set; }
    }

    // DTO cho việc duyệt phiếu
    public class ApproveAppointmentDto
    {
        public string Status { get; set; } = null!; // "Chấp nhận" hoặc "Từ chối"
        public string? Reason { get; set; } // Lý do từ chối nếu có
    }
} 