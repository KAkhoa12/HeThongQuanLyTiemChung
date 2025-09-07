using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Order;
using server.Filters;
using server.Helpers;
using server.Models;
using System.Security.Cryptography;
using System.Text;

namespace server.Controllers;

[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;
    private readonly IConfiguration _configuration;

    public OrderController(HeThongQuanLyTiemChungContext ctx, IConfiguration configuration)
    {
        _ctx = ctx;
        _configuration = configuration;
    }

    /* ---------- 1. Tạo đơn hàng mới ---------- */
    [HttpPost]
    [ConfigAuthorize]
    public async Task<IActionResult> CreateOrder(
        [FromBody] OrderCreateDto dto,
        CancellationToken ct)
    {
        try
        {
            // Tạo mã đơn hàng
            var orderCode = GenerateOrderCode();
            
            // Tính tổng tiền
            var totalAmount = dto.Items.Sum(item => item.Quantity * item.UnitPrice);
            
            // Lấy thông tin người dùng đã đăng nhập
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return ApiResponse.Error("Người dùng chưa đăng nhập", 401);
            }

            // Tạo đơn hàng
            var order = new DonHang
            {
                MaDonHang = Guid.NewGuid().ToString("N"),
                MaNguoiDung = userId, // Lấy từ người dùng đã đăng nhập
                MaDiaDiemYeuThich = dto.PreferredLocationId,
                NgayDat = DateTime.Now,
                TongTienGoc = totalAmount,
                TongTienThanhToan = totalAmount,
                TrangThaiDon = "PENDING",
                GhiChu = $"Khách hàng: {dto.CustomerName}, SĐT: {dto.CustomerPhone}, Email: {dto.CustomerEmail}, Địa chỉ: {dto.CustomerAddress}",
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.Now
            };

            _ctx.DonHangs.Add(order);

            // Tạo chi tiết đơn hàng
            foreach (var item in dto.Items)
            {
                var orderDetail = new DonHangChiTiet
                {
                    MaDonHangChiTiet = Guid.NewGuid().ToString("N"),
                    MaDonHang = order.MaDonHang,
                    MaDichVu = item.ServiceId, // ServiceId là MaDichVu
                    SoMuiChuan = item.Quantity,
                    DonGiaMui = item.UnitPrice,
                    ThanhTien = item.Quantity * item.UnitPrice,
                    IsActive = true,
                    IsDelete = false
                };

                _ctx.DonHangChiTiets.Add(orderDetail);
            }

            await _ctx.SaveChangesAsync(ct);

            var response = new OrderResponseDto(
                order.MaDonHang,
                orderCode,
                totalAmount,
                order.TrangThaiDon ?? "PENDING",
                order.NgayTao ?? DateTime.Now
            );

            return ApiResponse.Success("Tạo đơn hàng thành công", response, 201);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi tạo đơn hàng: {ex.Message}", 500);
        }
    }

    /* ---------- 2. Lấy thông tin đơn hàng ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(string id, CancellationToken ct)
    {
        var order = await _ctx.DonHangs
            .Include(d => d.DonHangChiTiets.Where(dct => dct.IsDelete != true))
                .ThenInclude(dct => dct.MaDichVuNavigation)
            .Include(d => d.MaDiaDiemYeuThichNavigation)
            // ✅ Thêm include cho thông tin khuyến mãi
            .Include(d => d.DonHangKhuyenMais.Where(dhkm => dhkm.IsDelete != true))
                .ThenInclude(dhkm => dhkm.MaKhuyenMaiNavigation)
            .FirstOrDefaultAsync(d => d.MaDonHang == id && d.IsDelete != true, ct);

        if (order == null)
            return ApiResponse.Error("Không tìm thấy đơn hàng", 404);

        // Tạo DTO để tránh circular reference
        var orderDto = new
        {
            order.MaDonHang,
            order.MaNguoiDung,
            order.MaDiaDiemYeuThich,
            order.NgayDat,
            order.TongTienGoc,
            order.TongTienThanhToan,
            order.TrangThaiDon,
            order.GhiChu,
            order.NgayTao,
            order.NgayCapNhat,
            order.IsActive,
            order.IsDelete,
            DonHangChiTiets = order.DonHangChiTiets?.Select(dct => new
            {
                dct.MaDonHangChiTiet,
                dct.MaDonHang,
                dct.MaDichVu,
                dct.SoMuiChuan,
                dct.ThanhTien,
                dct.IsActive,
                dct.IsDelete,
                DichVu = dct.MaDichVuNavigation != null ? new
                {
                    dct.MaDichVuNavigation.MaDichVu,
                    dct.MaDichVuNavigation.Ten,
                    dct.MaDichVuNavigation.MoTa,
                    dct.MaDichVuNavigation.Gia,
                    dct.MaDichVuNavigation.MaLoaiDichVu
                } : null
            }).ToList(),
            DiaDiemYeuThich = order.MaDiaDiemYeuThichNavigation != null ? new
            {
                order.MaDiaDiemYeuThichNavigation.MaDiaDiem,
                order.MaDiaDiemYeuThichNavigation.Ten,
                order.MaDiaDiemYeuThichNavigation.DiaChi,
                order.MaDiaDiemYeuThichNavigation.SoDienThoai,
                order.MaDiaDiemYeuThichNavigation.Email
            } : null,
            // ✅ Thêm thông tin khuyến mãi
            DonHangKhuyenMais = order.DonHangKhuyenMais?.Select(dhkm => new
            {
                dhkm.MaDonHangKhuyenMai,
                dhkm.MaDonHang,
                dhkm.MaKhuyenMai,
                dhkm.GiamGiaGoc,
                dhkm.GiamGiaThucTe,
                dhkm.NgayApDung,
                KhuyenMai = dhkm.MaKhuyenMaiNavigation != null ? new
                {
                    dhkm.MaKhuyenMaiNavigation.Code,
                    dhkm.MaKhuyenMaiNavigation.TenKhuyenMai,
                    dhkm.MaKhuyenMaiNavigation.LoaiGiam,
                    dhkm.MaKhuyenMaiNavigation.GiaTriGiam
                } : null
            }).ToList()
        };

        return ApiResponse.Success("Lấy thông tin đơn hàng thành công", orderDto);
    }

    /* ---------- 3. Cập nhật trạng thái đơn hàng ---------- */
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(
        string id,
        [FromBody] string status,
        CancellationToken ct)
    {
        var order = await _ctx.DonHangs
            .FirstOrDefaultAsync(d => d.MaDonHang == id && d.IsDelete != true, ct);

        if (order == null)
            return ApiResponse.Error("Không tìm thấy đơn hàng", 404);

        order.TrangThaiDon = status;
        order.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Cập nhật trạng thái đơn hàng thành công", null);
    }

    /* ---------- 4. Cập nhật số tiền giảm trong đơn hàng ---------- */
    [HttpPut("{id}/discount")]
    public async Task<IActionResult> UpdateOrderDiscount(
        string id, 
        [FromBody] UpdateOrderDiscountDto dto,
        CancellationToken ct)
    {
        try
        {
            var order = await _ctx.DonHangs
                .FirstOrDefaultAsync(d => d.MaDonHang == id && d.IsDelete != true, ct);

            if (order == null)
                return ApiResponse.Error("Không tìm thấy đơn hàng", 404);

            // Cập nhật số tiền thanh toán sau khi giảm giá
            order.TongTienThanhToan = Math.Max(0, order.TongTienGoc - dto.DiscountAmount);
            order.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);
            
            return ApiResponse.Success("Cập nhật số tiền giảm thành công", new
            {
                MaDonHang = order.MaDonHang,
                TongTienGoc = order.TongTienGoc,
                SoTienGiam = dto.DiscountAmount,
                TongTienThanhToan = order.TongTienThanhToan
            });
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật số tiền giảm: {ex.Message}", 500);
        }
    }

    /* ---------- 5. Xóa đơn hàng (soft delete) ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(string id, CancellationToken ct)
    {
        var order = await _ctx.DonHangs
            .FirstOrDefaultAsync(d => d.MaDonHang == id && d.IsDelete != true, ct);

        if (order == null)
            return ApiResponse.Error("Không tìm thấy đơn hàng", 404);

        order.IsDelete = true;
        order.NgayCapNhat = DateTime.UtcNow;

        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa đơn hàng thành công", null);
    }

    /* ---------- 5. Lấy danh sách đơn hàng của người dùng đã đăng nhập ---------- */
    [HttpGet("my-orders")]
    [ConfigAuthorize]
    public async Task<IActionResult> GetMyOrders(CancellationToken ct)
    {
        // Lấy thông tin người dùng đã đăng nhập
        var userId = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return ApiResponse.Error("Người dùng chưa đăng nhập", 401);
        }

        // Sử dụng Select để tránh circular reference
        var orders = await _ctx.DonHangs
            .Where(d => d.IsDelete != true && d.MaNguoiDung == userId)
            .OrderByDescending(d => d.NgayTao)
            // ✅ Thêm include cho thông tin khuyến mãi
            .Include(d => d.DonHangKhuyenMais.Where(dhkm => dhkm.IsDelete != true))
                .ThenInclude(dhkm => dhkm.MaKhuyenMaiNavigation)
            .Select(d => new
            {
                d.MaDonHang,
                d.MaNguoiDung,
                d.MaDiaDiemYeuThich,
                d.NgayDat,
                d.TongTienGoc,
                d.TongTienThanhToan,
                d.TrangThaiDon,
                d.GhiChu,
                d.NgayTao,
                d.NgayCapNhat,
                d.IsActive,
                d.IsDelete,
                DonHangChiTiets = d.DonHangChiTiets
                    .Where(dct => dct.IsDelete != true)
                    .Select(dct => new
                    {
                        dct.MaDonHangChiTiet,
                        dct.MaDonHang,
                        dct.MaDichVu,
                        dct.SoMuiChuan,
                        dct.DonGiaMui,
                        dct.ThanhTien,
                        dct.IsActive,
                        dct.IsDelete,
                        MaDichVuNavigation = new
                        {
                            dct.MaDichVuNavigation.MaDichVu,
                            dct.MaDichVuNavigation.Ten,
                            dct.MaDichVuNavigation.MoTa,
                            dct.MaDichVuNavigation.Gia
                        }
                    }).ToList(),
                MaDiaDiemYeuThichNavigation = d.MaDiaDiemYeuThichNavigation != null ? new
                {
                    d.MaDiaDiemYeuThichNavigation.MaDiaDiem,
                    d.MaDiaDiemYeuThichNavigation.Ten,
                    d.MaDiaDiemYeuThichNavigation.DiaChi
                } : null,
                // ✅ Thêm thông tin khuyến mãi
                DonHangKhuyenMais = d.DonHangKhuyenMais.Select(dhkm => new
                {
                    dhkm.MaDonHangKhuyenMai,
                    dhkm.MaDonHang,
                    dhkm.MaKhuyenMai,
                    dhkm.GiamGiaGoc,
                    dhkm.GiamGiaThucTe,
                    dhkm.NgayApDung,
                    KhuyenMai = dhkm.MaKhuyenMaiNavigation != null ? new
                    {
                        dhkm.MaKhuyenMaiNavigation.Code,
                        dhkm.MaKhuyenMaiNavigation.TenKhuyenMai,
                        dhkm.MaKhuyenMaiNavigation.LoaiGiam,
                        dhkm.MaKhuyenMaiNavigation.GiaTriGiam
                    } : null
                }).ToList()
            })
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách đơn hàng thành công", orders);
    }

    /* ---------- 6. Kiểm tra điều kiện mua đơn hàng ---------- */
    [HttpPost("check-eligibility")]
    [ConfigAuthorize]
    public async Task<IActionResult> CheckOrderEligibility(
        [FromBody] CheckOrderEligibilityDto dto,
        CancellationToken ct)
    {
        try
        {
            // Lấy thông tin người dùng đã đăng nhập
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return ApiResponse.Error("Người dùng chưa đăng nhập", 401);
            }

            // Lấy thông tin người dùng
            var user = await _ctx.NguoiDungs
                .FirstOrDefaultAsync(u => u.MaNguoiDung == userId && u.IsDelete != true, ct);

            if (user == null)
            {
                return ApiResponse.Error("Không tìm thấy thông tin người dùng", 404);
            }

            var eligibilityResult = new
            {
                IsEligible = true,
                Warnings = new List<string>(),
                Errors = new List<string>(),
                UserInfo = new
                {
                    user.MaNguoiDung,
                    user.Ten,
                    user.NgaySinh,
                    user.GioiTinh
                },
                ServiceChecks = new List<object>()
            };

            var warnings = new List<string>();
            var errors = new List<string>();
            var serviceChecks = new List<object>();

            // Kiểm tra từng dịch vụ trong đơn hàng
            foreach (var item in dto.Items)
            {
                var serviceCheck = await CheckServiceEligibility(user, item.ServiceId, ct);
                serviceChecks.Add(serviceCheck);

                // Cast to dynamic để truy cập properties
                var checkResult = (dynamic)serviceCheck;
                
                if (!checkResult.IsEligible)
                {
                    errors.AddRange((List<string>)checkResult.Errors);
                    eligibilityResult = new
                    {
                        IsEligible = false,
                        Warnings = warnings,
                        Errors = errors,
                        UserInfo = new
                        {
                            user.MaNguoiDung,
                            user.Ten,
                            user.NgaySinh,
                            user.GioiTinh
                        },
                        ServiceChecks = serviceChecks
                    };
                }
                else
                {
                    warnings.AddRange((List<string>)checkResult.Warnings);
                }
            }

            return ApiResponse.Success("Kiểm tra điều kiện mua đơn hàng thành công", eligibilityResult);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi kiểm tra điều kiện mua đơn hàng: {ex.Message}", 500);
        }
    }

    /* ---------- Helper Methods ---------- */
    private string GenerateOrderCode()
    {
        var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
        var random = new Random();
        var randomPart = random.Next(1000, 9999).ToString();
        return $"DH{timestamp}{randomPart}";
    }

    private async Task<object> CheckServiceEligibility(NguoiDung user, string serviceId, CancellationToken ct)
    {
        var warnings = new List<string>();
        var errors = new List<string>();

        // Lấy thông tin dịch vụ
        var service = await _ctx.DichVus
            .Include(d => d.DieuKienDichVus)
            .FirstOrDefaultAsync(d => d.MaDichVu == serviceId && d.IsDelete != true, ct);

        if (service == null)
        {
            errors.Add($"Dịch vụ {serviceId} không tồn tại hoặc đã bị xóa");
            return new { IsEligible = false, Errors = errors, Warnings = warnings };
        }

        // Kiểm tra điều kiện tuổi
        if (user.NgaySinh.HasValue && service.DieuKienDichVus.Any())
        {
            var ageInMonths = CalculateAgeInMonths(user.NgaySinh.Value);
            
            foreach (var condition in service.DieuKienDichVus)
            {
                if (condition.TuoiThangToiThieu.HasValue && ageInMonths < condition.TuoiThangToiThieu.Value)
                {
                    errors.Add($"Tuổi không đủ để sử dụng dịch vụ {service.Ten}. Yêu cầu tối thiểu: {condition.TuoiThangToiThieu.Value} tháng");
                }
                
                if (condition.TuoiThangToiDa.HasValue && ageInMonths > condition.TuoiThangToiDa.Value)
                {
                    errors.Add($"Tuổi vượt quá để sử dụng dịch vụ {service.Ten}. Yêu cầu tối đa: {condition.TuoiThangToiDa.Value} tháng");
                }

                if (!string.IsNullOrEmpty(condition.GioiTinh) && 
                    !string.IsNullOrEmpty(user.GioiTinh) && 
                    condition.GioiTinh != user.GioiTinh)
                {
                    errors.Add($"Giới tính không phù hợp với dịch vụ {service.Ten}. Yêu cầu: {condition.GioiTinh}");
                }
            }
        }

        // Kiểm tra xem người dùng đã đăng ký dịch vụ này chưa
        var existingRegistration = await _ctx.PhieuDangKyLichTiems
            .Where(p => p.MaKhachHang == user.MaNguoiDung && 
                       p.MaDichVu == serviceId && 
                       p.IsDelete != true &&
                       (p.TrangThai == "PENDING" || p.TrangThai == "APPROVED"))
            .FirstOrDefaultAsync(ct);

        if (existingRegistration != null)
        {
            warnings.Add($"Bạn đã đăng ký dịch vụ {service.Ten} trước đó (Trạng thái: {existingRegistration.TrangThai})");
        }

        // Kiểm tra xem người dùng đã tiêm dịch vụ này chưa
        var existingVaccination = await _ctx.PhieuTiems
            .Where(p => p.MaNguoiDung == user.MaNguoiDung && 
                       p.MaDichVu == serviceId && 
                       p.IsDelete != true)
            .FirstOrDefaultAsync(ct);

        if (existingVaccination != null)
        {
            warnings.Add($"Bạn đã tiêm dịch vụ {service.Ten} trước đó (Ngày tiêm: {existingVaccination.NgayTiem?.ToString("dd/MM/yyyy")})");
        }

        // Kiểm tra xem có đơn hàng đang chờ xử lý hoặc đã thanh toán cho dịch vụ này không
        var existingOrder = await _ctx.DonHangs
            .Include(d => d.DonHangChiTiets)
            .Where(d => d.MaNguoiDung == user.MaNguoiDung && 
                       d.IsDelete != true &&
                       (d.TrangThaiDon == "PENDING" || 
                        d.TrangThaiDon == "PAYMENT_PENDING" || 
                        d.TrangThaiDon == "PAID" || 
                        d.TrangThaiDon == "CONFIRMED" ||
                        d.TrangThaiDon == "PROCESSING") &&
                       d.DonHangChiTiets.Any(dct => dct.MaDichVu == serviceId && dct.IsDelete != true))
            .FirstOrDefaultAsync(ct);

        if (existingOrder != null)
        {
            if (existingOrder.TrangThaiDon == "PENDING" || existingOrder.TrangThaiDon == "PAYMENT_PENDING")
            {
                warnings.Add($"Bạn đã có đơn hàng đang chờ xử lý cho dịch vụ {service.Ten} (Trạng thái: {existingOrder.TrangThaiDon})");
            }
            else if (existingOrder.TrangThaiDon == "PAID" || existingOrder.TrangThaiDon == "CONFIRMED" || existingOrder.TrangThaiDon == "PROCESSING")
            {
                errors.Add($"Bạn đã có đơn hàng đã thanh toán cho dịch vụ {service.Ten} (Trạng thái: {existingOrder.TrangThaiDon}). Vui lòng chờ xử lý hoặc liên hệ hỗ trợ.");
            }
        }

        return new
        {
            ServiceId = serviceId,
            ServiceName = service.Ten,
            IsEligible = !errors.Any(),
            Errors = errors,
            Warnings = warnings
        };
    }

    private int CalculateAgeInMonths(DateOnly birthDate)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var age = today.Year - birthDate.Year;
        
        if (today.Month < birthDate.Month || 
            (today.Month == birthDate.Month && today.Day < birthDate.Day))
        {
            age--;
        }
        
        return age * 12 + (today.Month - birthDate.Month);
    }
} 