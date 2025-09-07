using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.DTOs;
using server.ModelViews;
using server.Helpers;
using server.DTOs.Pagination;
using server.DTOs.PhieuDangKyLichTiem;

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
            // Lấy thông tin đơn hàng và dịch vụ
            var order = await _context.DonHangs
                .Include(dh => dh.MaNguoiDungNavigation)
                .Include(dh => dh.DonHangChiTiets)
                .ThenInclude(dct => dct.MaDichVuNavigation)
                .ThenInclude(dv => dv.DichVuVaccines)
                .ThenInclude(dvv => dvv.MaVaccineNavigation)
                .FirstOrDefaultAsync(dh => dh.MaDonHang == createDto.OrderId, ct);

            if (order == null)
            {
                return ApiResponse.Error("Không tìm thấy đơn hàng");
            }

            // Lấy thông tin khách hàng từ đơn hàng
            var customerId = order.MaNguoiDung;
            if (string.IsNullOrEmpty(customerId))
            {
                return ApiResponse.Error("Đơn hàng không có thông tin khách hàng");
            }

            // Lấy thông tin tuổi khách hàng (giả sử có trường NgaySinh trong NguoiDung)
            var customer = await _context.NguoiDungs.FindAsync(customerId);
            var customerAgeInMonths = 0;
            if (customer?.NgaySinh != null)
            {
                // Convert DateOnly to DateTime for calculation
                var birthDate = customer.NgaySinh.Value.ToDateTime(TimeOnly.MinValue);
                var ageInDays = (DateTime.UtcNow - birthDate).TotalDays;
                customerAgeInMonths = (int)(ageInDays / 30.44); // Trung bình 30.44 ngày/tháng
            }

            // Tạo phiếu đăng ký cho từng dịch vụ trong đơn hàng
            var createdAppointments = new List<string>();

            foreach (var chiTiet in order.DonHangChiTiets)
            {
                // Tạo phiếu đăng ký cho dịch vụ
                var phieuDangKy = new PhieuDangKyLichTiem
                {
                    MaPhieuDangKy = Guid.NewGuid().ToString("N"),
                    MaKhachHang = customerId,
                    MaDichVu = chiTiet.MaDichVu,
                    MaDonHang = createDto.OrderId,
                    MaDiaDiem = createDto.MaDiaDiem,
                    NgayDangKy = createDto.NgayDangKy ?? DateTime.UtcNow,
                    TrangThai = "Pending",
                    GhiChu = createDto.GhiChu,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };

                _context.PhieuDangKyLichTiems.Add(phieuDangKy);

                // Tạo kế hoạch tiêm cho từng vaccine trong dịch vụ
                var dichVu = chiTiet.MaDichVuNavigation;
                if (dichVu?.DichVuVaccines?.Any() == true)
                {
                    foreach (var dichVuVaccine in dichVu.DichVuVaccines.OrderBy(dvv => dvv.ThuTu))
                    {
                        // Lấy lịch tiêm chuẩn của vaccine
                        var lichTiemChuans = await _context.LichTiemChuans
                            .Where(ltc => ltc.MaVaccine == dichVuVaccine.MaVaccine && ltc.IsActive == true)
                            .OrderBy(ltc => ltc.MuiThu)
                            .ToListAsync(ct);

                        foreach (var lichTiemChuan in lichTiemChuans)
                        {
                            // Tính ngày dự kiến cho mũi tiêm
                            var ngayDuKien = CalculateExpectedDate(lichTiemChuan, customerAgeInMonths);

                            var keHoachTiem = new KeHoachTiem
                            {
                                MaKeHoachTiem = Guid.NewGuid().ToString("N"),
                                MaNguoiDung = customerId,
                                MaDichVu = chiTiet.MaDichVu,
                                MaDonHang = createDto.OrderId,
                                MaVaccine = dichVuVaccine.MaVaccine,
                                MuiThu = lichTiemChuan.MuiThu,
                                NgayDuKien = ngayDuKien,
                                TrangThai = "PENDING"
                            };

                            _context.KeHoachTiems.Add(keHoachTiem);
                        }
                    }
                }

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

    private DateOnly CalculateExpectedDate(LichTiemChuan lichTiemChuan, int customerAgeInMonths)
    {
        var baseDate = DateTime.UtcNow;
        
        // Kiểm tra độ tuổi tối thiểu
        if (lichTiemChuan.TuoiThangToiThieu.HasValue && customerAgeInMonths < lichTiemChuan.TuoiThangToiThieu.Value)
        {
            // Tính ngày khi đủ tuổi
            var monthsToWait = lichTiemChuan.TuoiThangToiThieu.Value - customerAgeInMonths;
            baseDate = baseDate.AddMonths(monthsToWait);
        }

        // Thêm khoảng cách giữa các mũi
        if (lichTiemChuan.SoNgaySauMuiTruoc.HasValue && lichTiemChuan.MuiThu > 1)
        {
            baseDate = baseDate.AddDays(lichTiemChuan.SoNgaySauMuiTruoc.Value);
        }

        return DateOnly.FromDateTime(baseDate);
    }

    private async Task CreateAppointmentSchedule(KeHoachTiem keHoachTiem, PhieuDangKyLichTiem phieuDangKy, CancellationToken ct)
    {
        // Tìm lịch làm việc phù hợp
        var availableSchedules = await _context.LichLamViecs
            .Where(llv => llv.MaDiaDiem == phieuDangKy.MaDiaDiem 
                         && llv.NgayLam >= keHoachTiem.NgayDuKien 
                         && llv.DaDat < llv.SoLuongCho
                         && llv.IsActive == true)
            .OrderBy(llv => llv.NgayLam)
            .ThenBy(llv => llv.GioBatDau)
            .FirstOrDefaultAsync(ct);

        if (availableSchedules != null)
        {
            var lichHen = new LichHen
            {
                MaLichHen = Guid.NewGuid().ToString("N"),
                MaDonHang = phieuDangKy.MaDonHang,
                MaDiaDiem = phieuDangKy.MaDiaDiem,
                NgayHen = availableSchedules.NgayLam.ToDateTime(TimeOnly.MinValue),
                TrangThai = "SCHEDULED",
                GhiChu = $"Mũi {keHoachTiem.MuiThu} - {keHoachTiem.MaVaccineNavigation?.Ten}",
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _context.LichHens.Add(lichHen);

            // Cập nhật số lượng đã đặt
            availableSchedules.DaDat += 1;
            
            // Cập nhật trạng thái kế hoạch tiêm
            keHoachTiem.TrangThai = "SCHEDULED";
        }
    }

    /* ---------- 5. Tạo phiếu đăng ký lịch tiêm thông thường ---------- */
    [HttpPost]
    public async Task<IActionResult> Create(DTOs.PhieuDangKyLichTiem.CreatePhieuDangKyLichTiemDto createDto, CancellationToken ct = default)
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
                MaDiaDiem = createDto.MaDiaDiem,
                NgayDangKy = createDto.NgayDangKy ?? DateTime.Now,
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
            var phieuDangKy = await _context.PhieuDangKyLichTiems
                .Include(p => p.MaDonHangNavigation)
                .ThenInclude(dh => dh.KeHoachTiems)
                .ThenInclude(kht => kht.MaVaccineNavigation)
                .FirstOrDefaultAsync(p => p.MaPhieuDangKy == id, ct);

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

            phieuDangKy.NgayCapNhat = DateTime.UtcNow;

            // Nếu trạng thái là "APPROVED", tạo lịch hẹn cho mũi đầu tiên
            if (approveDto.Status == "Approved")
            {
                // Lấy tất cả kế hoạch tiêm của đơn hàng này
                var keHoachTiems = await _context.KeHoachTiems
                    .Where(kht => kht.MaDonHang == phieuDangKy.MaDonHang 
                                && kht.MaDichVu == phieuDangKy.MaDichVu
                                && kht.TrangThai == "Pending")
                    .OrderBy(kht => kht.MuiThu)
                    .ToListAsync(ct);

                // Tạo lịch hẹn cho mũi đầu tiên
                var muiDauTien = keHoachTiems.FirstOrDefault(kht => kht.MuiThu == 1);
                if (muiDauTien != null)
                {
                    await CreateAppointmentSchedule(muiDauTien, phieuDangKy, ct);
                }
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
            return ApiResponse.Error("Lỗi server khi duyệt phiếu đăng ký lịch tiêm: " + ex.Message);
        }
    }

    /* ---------- 8. Lấy lịch tiêm của phiếu đăng ký ---------- */
    [HttpGet("{id}/vaccination-schedule")]
    public async Task<IActionResult> GetVaccinationSchedule(string id, CancellationToken ct = default)
    {
        try
        {
            var phieuDangKy = await _context.PhieuDangKyLichTiems
                .Include(p => p.MaDonHangNavigation)
                .ThenInclude(dh => dh.KeHoachTiems)
                .ThenInclude(kht => kht.MaVaccineNavigation)
                .Include(p => p.MaDichVuNavigation)
                .ThenInclude(dv => dv.DichVuVaccines)
                .ThenInclude(dvv => dvv.MaVaccineNavigation)
                .FirstOrDefaultAsync(p => p.MaPhieuDangKy == id, ct);

            if (phieuDangKy == null)
            {
                return ApiResponse.Error("Không tìm thấy phiếu đăng ký");
            }

            var result = new
            {
                PhieuDangKy = new
                {
                    phieuDangKy.MaPhieuDangKy,
                    phieuDangKy.TrangThai,
                    phieuDangKy.NgayDangKy,
                    DichVu = phieuDangKy.MaDichVuNavigation?.Ten
                },
                KeHoachTiems = phieuDangKy.MaDonHangNavigation.KeHoachTiems
                    .Where(kht => kht.MaDichVu == phieuDangKy.MaDichVu)
                    .OrderBy(kht => kht.MuiThu)
                    .Select(kht => new
                    {
                        kht.MaKeHoachTiem,
                        kht.MuiThu,
                        kht.NgayDuKien,
                        kht.TrangThai,
                        Vaccine = kht.MaVaccineNavigation.Ten,
                        LichHen = _context.LichHens
                            .Where(lh => lh.MaDonHang == kht.MaDonHang)
                            .Select(lh => new
                            {
                                lh.MaLichHen,
                                lh.NgayHen,
                                lh.TrangThai
                            })
                            .FirstOrDefault()
                    })
                    .ToList()
            };

            return ApiResponse.Success("Lấy thông tin lịch tiêm thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông tin lịch tiêm");
            return ApiResponse.Error("Lỗi server khi lấy thông tin lịch tiêm");
        }
    }

    /* ---------- 9. Xóa phiếu đăng ký ---------- */
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

    /* ---------- 13. Kiểm tra tình trạng tiêm chủng của người dùng ---------- */
    [HttpGet("vaccination-status/{customerId}")]
    public async Task<IActionResult> GetVaccinationStatus(string customerId, CancellationToken ct = default)
    {
        try
        {
            // Kiểm tra người dùng đã tiêm dịch vụ nào
            var completedServices = await (from pt in _context.PhieuTiems
                                         join dv in _context.DichVus on pt.MaDichVu equals dv.MaDichVu
                                         where pt.MaNguoiDung == customerId 
                                               && pt.TrangThai == "COMPLETED"
                                               && pt.IsDelete != true
                                         select new
                                         {
                                             ServiceId = dv.MaDichVu,
                                             ServiceName = dv.Ten,
                                             CompletedDate = pt.NgayTiem,
                                             VaccineCount = pt.ChiTietPhieuTiems.Count
                                         }).ToListAsync(ct);

            // Kiểm tra người dùng đang tiêm dịch vụ nào (chưa hoàn thành)
            var inProgressServicesData = await (from kht in _context.KeHoachTiems
                                          join dv in _context.DichVus on kht.MaDichVu equals dv.MaDichVu
                                          where kht.MaNguoiDung == customerId 
                                                && kht.TrangThai != "COMPLETED"
                                          group kht by new { kht.MaDichVu, dv.Ten } into g
                                          select new
                                          {
                                              ServiceId = g.Key.MaDichVu,
                                              ServiceName = g.Key.Ten,
                                              TotalDoses = g.Count(),
                                              CompletedDoses = g.Count(x => x.TrangThai == "COMPLETED")
                                          }).ToListAsync(ct);

            // Tạo danh sách inProgressServices với NextDoseDate
            var inProgressServices = new List<object>();
            foreach (var service in inProgressServicesData)
            {
                var nextDose = await _context.KeHoachTiems
                    .Where(kht => kht.MaNguoiDung == customerId 
                               && kht.MaDichVu == service.ServiceId
                               && (kht.TrangThai == "PENDING" || kht.TrangThai == "SCHEDULED"))
                    .OrderBy(kht => kht.NgayDuKien)
                    .FirstOrDefaultAsync(ct);

                inProgressServices.Add(new
                {
                    service.ServiceId,
                    service.ServiceName,
                    service.TotalDoses,
                    service.CompletedDoses,
                    NextDoseDate = nextDose?.NgayDuKien
                });
            }

            // Kiểm tra người dùng có thể mua gói dịch vụ nào
            var availableServices = await (from dv in _context.DichVus
                                         where dv.IsActive == true && dv.IsDelete != true
                                         && !completedServices.Any(cs => cs.ServiceId == dv.MaDichVu)
                                         && !inProgressServicesData.Any(ips => ips.ServiceId == dv.MaDichVu)
                                         select new
                                         {
                                             ServiceId = dv.MaDichVu,
                                             ServiceName = dv.Ten,
                                             Description = dv.MoTa
                                         }).ToListAsync(ct);

            var result = new
            {
                CustomerId = customerId,
                CompletedServices = completedServices,
                InProgressServices = inProgressServices,
                AvailableServices = availableServices,
                Summary = new
                {
                    TotalCompleted = completedServices.Count,
                    TotalInProgress = inProgressServicesData.Count,
                    TotalAvailable = availableServices.Count
                }
            };

            return ApiResponse.Success("Lấy thông tin tình trạng tiêm chủng thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông tin tình trạng tiêm chủng");
            return ApiResponse.Error("Lỗi server khi lấy thông tin tình trạng tiêm chủng");
        }
    }

    /* ---------- 14. Lấy lịch tiêm chủng chi tiết của người dùng ---------- */
    [HttpGet("vaccination-schedule/{customerId}")]
    public async Task<IActionResult> GetCustomerVaccinationSchedule(string customerId, CancellationToken ct = default)
    {
        try
        {
            var schedule = await (from kht in _context.KeHoachTiems
                                join dv in _context.DichVus on kht.MaDichVu equals dv.MaDichVu
                                join v in _context.Vaccines on kht.MaVaccine equals v.MaVaccine
                                where kht.MaNguoiDung == customerId
                                orderby kht.MaDichVu, kht.MuiThu
                                select new
                                {
                                    kht.MaKeHoachTiem,
                                    ServiceName = dv.Ten,
                                    VaccineName = v.Ten,
                                    kht.MuiThu,
                                    kht.NgayDuKien,
                                    kht.TrangThai,
                                    PhieuTiem = kht.PhieuTiems.Select(pt => new
                                    {
                                        pt.MaPhieuTiem,
                                        pt.NgayTiem,
                                        pt.TrangThai,
                                        DoctorName = pt.MaBacSiNavigation != null ? 
                                                   pt.MaBacSiNavigation.MaNguoiDungNavigation != null ? 
                                                   pt.MaBacSiNavigation.MaNguoiDungNavigation.Ten : null : null
                                    }).FirstOrDefault()
                                }).ToListAsync(ct);

            // Nhóm theo dịch vụ
            var groupedSchedule = schedule.GroupBy(s => s.ServiceName)
                                         .Select(g => new
                                         {
                                             ServiceName = g.Key,
                                             TotalDoses = g.Count(),
                                             CompletedDoses = g.Count(x => x.TrangThai == "COMPLETED"),
                                             Doses = g.OrderBy(x => x.MuiThu).ToList()
                                         }).ToList();

            return ApiResponse.Success("Lấy lịch tiêm chủng thành công", groupedSchedule);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy lịch tiêm chủng");
            return ApiResponse.Error("Lỗi server khi lấy lịch tiêm chủng");
        }
    }

    // DTO cho việc duyệt phiếu
    public class ApproveAppointmentDto
    {
        public string Status { get; set; } = null!; // "APPROVED" hoặc "REJECTED"
        public string? Reason { get; set; } // Lý do từ chối nếu có
    }
} 