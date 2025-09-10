using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.DTOs;
using server.ModelViews;
using server.Helpers;
using server.DTOs.Pagination;
using server.DTOs.PhieuDangKyLichTiem;
using server.Types;

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
                        where p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
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
                            EmailKhachHang = kh.Email
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
                                    where p.MaPhieuDangKy == id && p.IsDelete != true && p.IsActive == true
                                    select new PhieuDangKyLichTiemVM
                                    {
                                        MaPhieuDangKy = p.MaPhieuDangKy,
                                        MaKhachHang = p.MaKhachHang,
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

    /* ---------- 2. Tạo kế hoạch tiêm trực tiếp từ đơn hàng đã thanh toán ---------- */
    [HttpPost("create-vaccination-plan-from-order")]
    public async Task<IActionResult> CreateVaccinationPlanFromOrder([FromBody] CreateVaccinationPlanFromOrderDto createDto, CancellationToken ct = default)
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

            // Kiểm tra đơn hàng đã thanh toán chưa
            if (order.TrangThaiDon != "PAID" && order.TrangThaiDon != "COMPLETED")
            {
                return ApiResponse.Error("Chỉ có thể tạo kế hoạch tiêm cho đơn hàng đã thanh toán");
            }

            // Lấy thông tin khách hàng từ đơn hàng
            var customerId = order.MaNguoiDung;
            if (string.IsNullOrEmpty(customerId))
            {
                return ApiResponse.Error("Đơn hàng không có thông tin khách hàng");
            }

            var createdPlans = new List<string>();

            // Tạo kế hoạch tiêm cho từng dịch vụ trong đơn hàng
            foreach (var chiTiet in order.DonHangChiTiets)
            {
                if (!string.IsNullOrEmpty(chiTiet.MaDichVu))
                {
                    // Tạo kế hoạch tiêm trực tiếp từ dịch vụ trong đơn hàng
                    await CreateVaccinationPlanFromService(customerId, chiTiet.MaDichVu, order.MaDonHang, createDto.MaDiaDiem, ct);
                    createdPlans.Add($"Kế hoạch tiêm cho dịch vụ {chiTiet.MaDichVu}");
                }
            }

            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo kế hoạch tiêm từ đơn hàng thành công", new { 
                OrderId = order.MaDonHang,
                CreatedPlans = createdPlans 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo kế hoạch tiêm từ đơn hàng");
            return ApiResponse.Error("Lỗi server khi tạo kế hoạch tiêm từ đơn hàng");
        }
    }

    /* ---------- 3. Tạo phiếu đăng ký từ đơn hàng ---------- */
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

                // KHÔNG tạo kế hoạch tiêm ngay lúc này
                // Kế hoạch tiêm sẽ được tạo khi phiếu đăng ký được duyệt

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

    // private async Task CreateNotificationAppointment(PhieuDangKyLichTiem phieuDangKy, CancellationToken ct)
    // {
    //     try
    //     {
    //         _logger.LogInformation("Bắt đầu tạo lịch hẹn thông báo cho phiếu {MaPhieuDangKy}", phieuDangKy.MaPhieuDangKy);
            
    //         // Tạo lịch hẹn thông báo với ngày hẹn là ngày đăng ký
    //         var lichHen = new LichHen
    //         {
    //             MaLichHen = Guid.NewGuid().ToString("N"),
    //             MaDiaDiem = phieuDangKy.MaDiaDiem,
    //             NgayHen = phieuDangKy.NgayDangKy, // Sử dụng ngày đăng ký làm ngày hẹn
    //             TrangThai = LichHenTypes.NOTIFICATION, // Trạng thái NOTIFICATION
    //             GhiChu = $"Thông báo duyệt phiếu đăng ký lịch tiêm - {phieuDangKy.MaPhieuDangKy}",
    //             IsActive = true,
    //             IsDelete = false,
    //             NgayTao = DateTime.UtcNow,
    //             NgayCapNhat = DateTime.UtcNow
    //         };

    //         _context.LichHens.Add(lichHen);
            
    //         _logger.LogInformation("Đã thêm lịch hẹn thông báo vào context: MaLichHen={MaLichHen}, MaDonHang={MaDonHang}, NgayHen={NgayHen}, TrangThai={TrangThai}", 
    //             lichHen.MaLichHen, lichHen.MaDonHang, lichHen.NgayHen, lichHen.TrangThai);
            
    //         // Log thêm thông tin về context state
    //         var entry = _context.Entry(lichHen);
    //         _logger.LogInformation("Entity state của lịch hẹn: {State}", entry.State);
            
    //         await Task.CompletedTask;
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError(ex, "Lỗi khi tạo lịch hẹn thông báo cho phiếu đăng ký {MaPhieuDangKy}", phieuDangKy.MaPhieuDangKy);
    //         throw;
    //     }
    // }

    private async Task CreateVaccinationPlanFromService(string customerId, string maDichVu, string maDonHang, string maDiaDiem, CancellationToken ct)
    {
        try
        {
            // B1: Lấy thông tin dịch vụ và điều kiện dịch vụ
            var dichVu = await _context.DichVus
                .Include(dv => dv.DichVuVaccines)
                .ThenInclude(dvv => dvv.MaVaccineNavigation)
                .Include(dv => dv.DieuKienDichVus)
                .FirstOrDefaultAsync(dv => dv.MaDichVu == maDichVu, ct);

            if (dichVu?.DichVuVaccines?.Any() != true)
            {
                _logger.LogWarning("Không tìm thấy vaccine trong dịch vụ {MaDichVu}", maDichVu);
                return;
            }

            // Lấy điều kiện dịch vụ (tuổi tối thiểu và tối đa)
            var dieuKienDichVu = dichVu.DieuKienDichVus?.FirstOrDefault();
            if (dieuKienDichVu == null)
            {
                _logger.LogWarning("Không tìm thấy điều kiện dịch vụ cho {MaDichVu}", maDichVu);
                return;
            }

            var minAgeForService = dieuKienDichVu.TuoiThangToiThieu ?? 0;
            var maxAgeForService = dieuKienDichVu.TuoiThangToiDa ?? 24;

            // Lấy tuổi hiện tại của người dùng
            var customer = await _context.NguoiDungs.FindAsync(customerId);
            var customerAgeInMonths = 0;
            if (customer?.NgaySinh != null)
            {
                var birthDate = customer.NgaySinh.Value.ToDateTime(TimeOnly.MinValue);
                var ageInDays = (DateTime.UtcNow - birthDate).TotalDays;
                customerAgeInMonths = (int)(ageInDays / 30.44);
            }

            _logger.LogInformation("Dịch vụ {maDichVu} có điều kiện: tuổi từ {minAge} đến {maxAge} tháng", 
                maDichVu, minAgeForService, maxAgeForService);
            _logger.LogInformation("Tuổi hiện tại của khách hàng: {customerAge} tháng", customerAgeInMonths);

            // B2: Lấy TẤT CẢ lịch tiêm chuẩn của các vaccine trong dịch vụ
            var vaccineIds = dichVu.DichVuVaccines.Select(dvv => dvv.MaVaccine).ToList();
            
            var allLichTiemChuans = await _context.LichTiemChuans
                .Where(ltc => vaccineIds.Contains(ltc.MaVaccine) 
                           && ltc.IsActive == true)
                .OrderBy(ltc => ltc.TuoiThangToiThieu)
                .ThenBy(ltc => ltc.MuiThu)
                .ToListAsync(ct);

            _logger.LogInformation("Tìm thấy {scheduleCount} lịch tiêm chuẩn phù hợp với điều kiện dịch vụ", allLichTiemChuans.Count);

            // B3: Gom nhóm tuổi từ thấp đến cao
            var ageGroups = allLichTiemChuans
                .GroupBy(ltc => new { ltc.TuoiThangToiThieu, ltc.TuoiThangToiDa })
                .OrderBy(g => g.Key.TuoiThangToiThieu)
                .ToList();

            _logger.LogInformation("Tìm thấy {ageGroupCount} nhóm tuổi: {ageGroups}", 
                ageGroups.Count, 
                string.Join(", ", ageGroups.Select(g => $"{g.Key.TuoiThangToiThieu}-{g.Key.TuoiThangToiDa}")));

            var currentDate = DateTime.UtcNow;

            // B4: Xử lý từng nhóm tuổi riêng biệt
            var muiCounter = 1; // Bộ đếm mũi tiêm toàn cục
            
            foreach (var ageGroup in ageGroups)
            {
                var groupLichTiemChuans = ageGroup.ToList();
                var ageRange = $"{ageGroup.Key.TuoiThangToiThieu}-{ageGroup.Key.TuoiThangToiDa}";
                
                // Xử lý logic lọc nhóm tuổi
                bool shouldProcessAgeGroup = false;
                
                if (customerAgeInMonths == 0)
                {
                    // Nếu không tính được tuổi, xử lý tất cả nhóm tuổi
                    shouldProcessAgeGroup = true;
                    _logger.LogInformation("Không tính được tuổi người dùng, xử lý tất cả nhóm tuổi");
                }
                else
                {
                    // Lấy TẤT CẢ nhóm tuổi từ tuổi hiện tại của người dùng trở lên
                    var minAge = ageGroup.Key.TuoiThangToiThieu ?? 0;
                    var maxAge = ageGroup.Key.TuoiThangToiDa ?? int.MaxValue;
                    
                    // Lấy nhóm tuổi nếu:
                    // 1. Người dùng nằm trong khoảng tuổi của nhóm, HOẶC
                    // 2. Tuổi tối thiểu của nhóm >= tuổi hiện tại của người dùng
                    shouldProcessAgeGroup = (customerAgeInMonths >= minAge && customerAgeInMonths <= maxAge) || 
                                          (minAge >= customerAgeInMonths);
                    
                    if (!shouldProcessAgeGroup)
                    {
                        _logger.LogInformation("Bỏ qua nhóm tuổi {ageRange} vì người dùng chưa đủ tuổi (hiện tại {customerAge} tháng, nhóm yêu cầu tối thiểu {minAge} tháng)", 
                            ageRange, customerAgeInMonths, minAge);
                        continue;
                    }
                }
                
                if (!shouldProcessAgeGroup) continue;
                
                _logger.LogInformation("Xử lý nhóm tuổi {ageRange} với {scheduleCount} lịch tiêm chuẩn", 
                    ageRange, groupLichTiemChuans.Count);

                // Lấy số mũi tối đa trong nhóm tuổi này
                var maxMuiInAgeGroup = groupLichTiemChuans.Max(ltc => ltc.MuiThu);
                
                _logger.LogInformation("Nhóm tuổi {ageRange} có tối đa {maxMui} mũi tiêm", 
                    ageRange, maxMuiInAgeGroup);

                // Tạo kế hoạch tiêm theo từng mũi trong nhóm tuổi này
                for (int mui = 1; mui <= maxMuiInAgeGroup; mui++)
                {
                    // Tìm tất cả vaccine cần tiêm ở mũi này
                    var vaccinesForThisMui = groupLichTiemChuans
                        .Where(ltc => ltc.MuiThu >= mui) // Vaccine có số mũi >= mũi hiện tại
                        .GroupBy(ltc => ltc.MaVaccine) // Nhóm theo vaccine để tránh trùng lặp
                        .Select(g => g.First()) // Lấy 1 record đại diện cho mỗi vaccine
                        .ToList();

                    if (vaccinesForThisMui.Any())
                    {
                        _logger.LogInformation("Mũi {mui} (toàn cục {muiCounter}): Tiêm {vaccineCount} vaccine trong nhóm tuổi {ageRange}", 
                            mui, muiCounter, vaccinesForThisMui.Count, ageRange);

                        // Tạo kế hoạch tiêm cho TẤT CẢ vaccine trong mũi này
                        foreach (var lichTiemChuan in vaccinesForThisMui)
                        {
                            var keHoachTiem = new KeHoachTiem
                            {
                                MaKeHoachTiem = Guid.NewGuid().ToString("N"),
                                MaNguoiDung = customerId,
                                MaDichVu = maDichVu,
                                MaDonHang = maDonHang,
                                MaVaccine = lichTiemChuan.MaVaccine,
                                MuiThu = muiCounter, // Sử dụng bộ đếm mũi tiêm toàn cục
                                NgayDuKien = null, // Không cập nhật ngày dự kiến
                                TrangThai = "PENDING"
                            };

                            _context.KeHoachTiems.Add(keHoachTiem);
                            
                            _logger.LogInformation("Tạo kế hoạch tiêm: Vaccine {maVaccine}, Mũi {muiCounter} (nhóm tuổi {ageRange}, mũi {mui})", 
                                lichTiemChuan.MaVaccine, muiCounter, ageRange, mui);
                        }
                        
                        muiCounter++; // Tăng bộ đếm mũi tiêm toàn cục
                    }
                }
            }

            _logger.LogInformation("Đã tạo kế hoạch tiêm cho khách hàng {customerId} với dịch vụ {maDichVu}", customerId, maDichVu);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo kế hoạch tiêm cho khách hàng {customerId} với dịch vụ {maDichVu}", customerId, maDichVu);
            throw;
        }
    }

    // private async Task CreateDetailedVaccinationPlan(PhieuDangKyLichTiem phieuDangKy, CancellationToken ct)
    // {
    //     try
    //     {
    //         // B1: Lấy thông tin dịch vụ và điều kiện dịch vụ
    //         var dichVu = await _context.DichVus
    //             .Include(dv => dv.DichVuVaccines)
    //             .ThenInclude(dvv => dvv.MaVaccineNavigation)
    //             .Include(dv => dv.DieuKienDichVus)
    //             .FirstOrDefaultAsync(dv => dv.MaDichVu == phieuDangKy.MaDichVu, ct);

    //         if (dichVu?.DichVuVaccines?.Any() != true)
    //         {
    //             _logger.LogWarning("Không tìm thấy vaccine trong dịch vụ {MaDichVu}", phieuDangKy.MaDichVu);
    //             return;
    //         }

    //         // Lấy điều kiện dịch vụ (tuổi tối thiểu và tối đa)
    //         var dieuKienDichVu = dichVu.DieuKienDichVus?.FirstOrDefault();
    //         if (dieuKienDichVu == null)
    //         {
    //             _logger.LogWarning("Không tìm thấy điều kiện dịch vụ cho {MaDichVu}", phieuDangKy.MaDichVu);
    //             return;
    //         }

    //         var minAgeForService = dieuKienDichVu.TuoiThangToiThieu ?? 0;
    //         var maxAgeForService = dieuKienDichVu.TuoiThangToiDa ?? 24;

    //         // Lấy tuổi hiện tại của người dùng
    //         var customer = await _context.NguoiDungs.FindAsync(phieuDangKy.MaKhachHang);
    //         var customerAgeInMonths = 0;
    //         if (customer?.NgaySinh != null)
    //         {
    //             var birthDate = customer.NgaySinh.Value.ToDateTime(TimeOnly.MinValue);
    //             var ageInDays = (DateTime.UtcNow - birthDate).TotalDays;
    //             customerAgeInMonths = (int)(ageInDays / 30.44);
    //         }

    //         _logger.LogInformation("Dịch vụ {maDichVu} có điều kiện: tuổi từ {minAge} đến {maxAge} tháng", 
    //             phieuDangKy.MaDichVu, minAgeForService, maxAgeForService);
    //         _logger.LogInformation("Tuổi hiện tại của khách hàng: {customerAge} tháng", customerAgeInMonths);

    //         // B2: Lấy TẤT CẢ lịch tiêm chuẩn của các vaccine trong dịch vụ
    //         var vaccineIds = dichVu.DichVuVaccines.Select(dvv => dvv.MaVaccine).ToList();
            
    //         var allLichTiemChuans = await _context.LichTiemChuans
    //             .Where(ltc => vaccineIds.Contains(ltc.MaVaccine) 
    //                        && ltc.IsActive == true)
    //             .OrderBy(ltc => ltc.TuoiThangToiThieu)
    //             .ThenBy(ltc => ltc.MuiThu)
    //             .ToListAsync(ct);

    //         _logger.LogInformation("Tìm thấy {scheduleCount} lịch tiêm chuẩn phù hợp với điều kiện dịch vụ", allLichTiemChuans.Count);

    //         // B3: Gom nhóm tuổi từ thấp đến cao
    //         var ageGroups = allLichTiemChuans
    //             .GroupBy(ltc => new { ltc.TuoiThangToiThieu, ltc.TuoiThangToiDa })
    //             .OrderBy(g => g.Key.TuoiThangToiThieu)
    //             .ToList();

    //         _logger.LogInformation("Tìm thấy {ageGroupCount} nhóm tuổi: {ageGroups}", 
    //             ageGroups.Count, 
    //             string.Join(", ", ageGroups.Select(g => $"{g.Key.TuoiThangToiThieu}-{g.Key.TuoiThangToiDa}")));

    //         var currentDate = DateTime.UtcNow;

    //         // B4: Xử lý từng nhóm tuổi riêng biệt
    //         var muiCounter = 1; // Bộ đếm mũi tiêm toàn cục
            
    //         foreach (var ageGroup in ageGroups)
    //         {
    //             var groupLichTiemChuans = ageGroup.ToList();
    //             var ageRange = $"{ageGroup.Key.TuoiThangToiThieu}-{ageGroup.Key.TuoiThangToiDa}";
                
    //             // Xử lý logic lọc nhóm tuổi
    //             bool shouldProcessAgeGroup = false;
                
    //             if (customerAgeInMonths == 0)
    //             {
    //                 // Nếu không tính được tuổi, xử lý tất cả nhóm tuổi
    //                 shouldProcessAgeGroup = true;
    //                 _logger.LogInformation("Không tính được tuổi người dùng, xử lý tất cả nhóm tuổi");
    //             }
    //             else
    //             {
    //                 // Lấy TẤT CẢ nhóm tuổi từ tuổi hiện tại của người dùng trở lên
    //                 // Ví dụ: người dùng 1 tháng → lấy nhóm 0-5, 5-9, 9-12, 12-24
    //                 // Ví dụ: người dùng 6 tháng → lấy nhóm 5-9, 9-12, 12-24
    //                 var minAge = ageGroup.Key.TuoiThangToiThieu ?? 0;
    //                 var maxAge = ageGroup.Key.TuoiThangToiDa ?? int.MaxValue;
                    
    //                 // Lấy nhóm tuổi nếu:
    //                 // 1. Người dùng nằm trong khoảng tuổi của nhóm, HOẶC
    //                 // 2. Tuổi tối thiểu của nhóm >= tuổi hiện tại của người dùng
    //                 shouldProcessAgeGroup = (customerAgeInMonths >= minAge && customerAgeInMonths <= maxAge) || 
    //                                       (minAge >= customerAgeInMonths);
                    
    //                 if (!shouldProcessAgeGroup)
    //                 {
    //                     _logger.LogInformation("Bỏ qua nhóm tuổi {ageRange} vì người dùng chưa đủ tuổi (hiện tại {customerAge} tháng, nhóm yêu cầu tối thiểu {minAge} tháng)", 
    //                         ageRange, customerAgeInMonths, minAge);
    //                     continue;
    //                 }
    //             }
                
    //             if (!shouldProcessAgeGroup) continue;
                
    //             _logger.LogInformation("Xử lý nhóm tuổi {ageRange} với {scheduleCount} lịch tiêm chuẩn", 
    //                 ageRange, groupLichTiemChuans.Count);

    //             // Debug: Log chi tiết các lịch tiêm chuẩn trong nhóm tuổi
    //             foreach (var ltc in groupLichTiemChuans)
    //             {
    //                 _logger.LogInformation("Lịch tiêm chuẩn: Vaccine {maVaccine}, Mũi {muiThu}, Tuổi {tuoiThangToiThieu}-{tuoiThangToiDa}", 
    //                     ltc.MaVaccine, ltc.MuiThu, ltc.TuoiThangToiThieu, ltc.TuoiThangToiDa);
    //             }

    //             // Lấy số mũi tối đa trong nhóm tuổi này
    //             var maxMuiInAgeGroup = groupLichTiemChuans.Max(ltc => ltc.MuiThu);
                
    //             _logger.LogInformation("Nhóm tuổi {ageRange} có tối đa {maxMui} mũi tiêm", 
    //                 ageRange, maxMuiInAgeGroup);

    //             // Tạo kế hoạch tiêm theo từng mũi trong nhóm tuổi này
    //             for (int mui = 1; mui <= maxMuiInAgeGroup; mui++)
    //             {
    //                 // Tìm tất cả vaccine cần tiêm ở mũi này
    //                 var vaccinesForThisMui = groupLichTiemChuans
    //                     .Where(ltc => ltc.MuiThu >= mui) // Vaccine có số mũi >= mũi hiện tại
    //                     .GroupBy(ltc => ltc.MaVaccine) // Nhóm theo vaccine để tránh trùng lặp
    //                     .Select(g => g.First()) // Lấy 1 record đại diện cho mỗi vaccine
    //                     .ToList();

    //                 if (vaccinesForThisMui.Any())
    //                 {
    //                     _logger.LogInformation("Mũi {mui} (toàn cục {muiCounter}): Tiêm {vaccineCount} vaccine trong nhóm tuổi {ageRange}", 
    //                         mui, muiCounter, vaccinesForThisMui.Count, ageRange);

    //                     // Tạo kế hoạch tiêm cho TẤT CẢ vaccine trong mũi này
    //                     foreach (var lichTiemChuan in vaccinesForThisMui)
    //                     {
    //                         var keHoachTiem = new KeHoachTiem
    //                         {
    //                             MaKeHoachTiem = Guid.NewGuid().ToString("N"),
    //                             MaNguoiDung = phieuDangKy.MaKhachHang,
    //                             MaDichVu = phieuDangKy.MaDichVu,
    //                             MaDonHang = phieuDangKy.MaDonHang,
    //                             MaVaccine = lichTiemChuan.MaVaccine,
    //                             MuiThu = muiCounter, // Sử dụng bộ đếm mũi tiêm toàn cục
    //                             NgayDuKien = null, // Không cập nhật ngày dự kiến
    //                             TrangThai = "PENDING"
    //                         };

    //                         _context.KeHoachTiems.Add(keHoachTiem);
                            
    //                         _logger.LogInformation("Tạo kế hoạch tiêm: Vaccine {maVaccine}, Mũi {muiCounter} (nhóm tuổi {ageRange}, mũi {mui})", 
    //                             lichTiemChuan.MaVaccine, muiCounter, ageRange, mui);
    //                     }
                        
    //                     muiCounter++; // Tăng bộ đếm mũi tiêm toàn cục
    //                 }
    //             }
    //         }

    //         await _context.SaveChangesAsync(ct);
    //         _logger.LogInformation("Đã tạo kế hoạch tiêm chi tiết cho phiếu đăng ký {MaPhieuDangKy}", phieuDangKy.MaPhieuDangKy);
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError(ex, "Lỗi khi tạo kế hoạch tiêm chi tiết cho phiếu đăng ký {MaPhieuDangKy}", phieuDangKy.MaPhieuDangKy);
    //         throw;
    //     }
    // }


    private DateOnly CalculateExpectedDateForMui(LichTiemChuan lichTiemChuan, DateTime baseDate, int muiThu)
    {
        var expectedDate = baseDate;
        
        // Nếu là mũi đầu tiên, sử dụng ngày đăng ký
        if (muiThu == 1)
        {
            return DateOnly.FromDateTime(expectedDate);
        }
        
        // Nếu có thông tin về số ngày cách mũi tiêm trước
        if (lichTiemChuan.SoNgaySauMuiTruoc.HasValue)
        {
            expectedDate = expectedDate.AddDays(lichTiemChuan.SoNgaySauMuiTruoc.Value);
        }
        else
        {
            // Nếu không có thông tin, sử dụng khoảng cách mặc định (30 ngày)
            expectedDate = expectedDate.AddDays(30 * (muiThu - 1));
        }
        
        return DateOnly.FromDateTime(expectedDate);
    }

    private async Task  CreateAppointmentSchedule(KeHoachTiem keHoachTiem, PhieuDangKyLichTiem phieuDangKy, CancellationToken ct)
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

            // Kiểm tra xem khách hàng có phiếu đăng ký nào đang Pending không
            var existingPendingAppointment = await _context.PhieuDangKyLichTiems
                .Where(p => p.MaKhachHang == createDto.MaKhachHang 
                           && p.TrangThai == "Pending" 
                           && p.IsDelete != true 
                           && p.IsActive == true)
                .FirstOrDefaultAsync(ct);

            if (existingPendingAppointment != null)
            {
                return ApiResponse.Error("Khách hàng đã có phiếu đăng ký lịch tiêm đang chờ xử lý. Vui lòng chờ xử lý phiếu hiện tại trước khi tạo phiếu mới");
            }

            var phieuDangKy = new PhieuDangKyLichTiem
            {
                MaPhieuDangKy = Guid.NewGuid().ToString(),
                MaKhachHang = createDto.MaKhachHang,
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

            if (!string.IsNullOrEmpty(updateDto.MaDiaDiem))
                phieuDangKy.MaDiaDiem = updateDto.MaDiaDiem;

            if (!string.IsNullOrEmpty(updateDto.NgayDangKy))
            {
                if (DateTime.TryParse(updateDto.NgayDangKy, out DateTime ngayDangKy))
                {
                    phieuDangKy.NgayDangKy = ngayDangKy;
                }
            }

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

            // Lưu thay đổi vào database
            _context.PhieuDangKyLichTiems.Update(phieuDangKy);
            await _context.SaveChangesAsync(ct);

            return ApiResponse.Success($"Duyệt phiếu đăng ký lịch tiêm thành công - Trạng thái: {approveDto.Status}");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error("Lỗi server khi duyệt phiếu đăng ký lịch tiêm: " + ex.Message);
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
                        where p.MaKhachHang == customerId && p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
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
                        join dd in _context.DiaDiems on p.MaDiaDiem equals dd.MaDiaDiem into ddGroup
                        from dd in ddGroup.DefaultIfEmpty()
                        where p.MaKhachHang == maNguoiDung && p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDiaDiem = p.MaDiaDiem,
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
                            TenDiaDiem = dd != null ? dd.Ten : null,
                        };

            _logger.LogInformation("Thực hiện query với page: {page}, pageSize: {pageSize}", page, pageSize);
            var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);
            
            _logger.LogInformation("Query thành công, tổng số: {totalCount}", paged.TotalCount);

            return ApiResponse.Success(
                "Lấy danh sách phiếu đăng ký lịch tiêm theo người dùng thành công",
                paged);
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
                                         where pt.MaNguoiDung == customerId 
                                               && pt.TrangThai == "COMPLETED"
                                               && pt.IsDelete != true
                                         select new
                                         {
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