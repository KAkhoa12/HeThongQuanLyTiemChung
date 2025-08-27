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
            .FirstOrDefaultAsync(d => d.MaDonHang == id && d.IsDelete != true, ct);

        if (order == null)
            return ApiResponse.Error("Không tìm thấy đơn hàng", 404);

        return ApiResponse.Success("Lấy thông tin đơn hàng thành công", order);
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

    /* ---------- 4. Xóa đơn hàng (soft delete) ---------- */
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
                } : null
            })
            .ToListAsync(ct);

        return ApiResponse.Success("Lấy danh sách đơn hàng thành công", orders);
    }

    /* ---------- Helper Methods ---------- */
    private string GenerateOrderCode()
    {
        var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
        var random = new Random();
        var randomPart = random.Next(1000, 9999).ToString();
        return $"DH{timestamp}{randomPart}";
    }
} 