using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Kho;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonHangKhuyenMaiController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public DonHangKhuyenMaiController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // POST: api/DonHangKhuyenMai
    [HttpPost]
    public async Task<IActionResult> CreateDonHangKhuyenMai([FromBody] CreateDonHangKhuyenMaiRequest request, CancellationToken ct = default)
    {
        // Sử dụng transaction để đảm bảo atomicity và tránh race condition
        using var transaction = await _context.Database.BeginTransactionAsync(ct);
        
        try
        {
            // Log để debug
            Console.WriteLine($"[CreateDonHangKhuyenMai] Bắt đầu tạo bản ghi cho đơn hàng: {request.MaDonHang}, mã khuyến mãi: {request.MaKhuyenMai}");
            
            // Kiểm tra đơn hàng có tồn tại không
            var donHang = await _context.DonHangs
                .FirstOrDefaultAsync(dh => dh.MaDonHang == request.MaDonHang, ct);
            
            if (donHang == null)
            {
                return ApiResponse.Error("Đơn hàng không tồn tại");
            }

            // Kiểm tra khuyến mãi có tồn tại không
            var khuyenMai = await _context.KhuyenMais
                .FirstOrDefaultAsync(km => km.Code == request.MaKhuyenMai, ct);
            
            if (khuyenMai == null)
            {
                return ApiResponse.Error("Mã khuyến mãi không tồn tại");
            }

            // ✅ Xử lý trùng lặp: Nếu có bản ghi cũ thì xóa đi và tạo mới
            Console.WriteLine($"[CreateDonHangKhuyenMai] Kiểm tra bản ghi tồn tại cho đơn hàng: {request.MaDonHang}, mã khuyến mãi: {khuyenMai.MaKhuyenMai}");
            
            var existingRecord = await _context.DonHangKhuyenMais
                .FirstOrDefaultAsync(dhkm => 
                    dhkm.MaDonHang == request.MaDonHang && 
                    dhkm.MaKhuyenMai == khuyenMai.MaKhuyenMai, ct);

            if (existingRecord != null)
            {
                Console.WriteLine($"[CreateDonHangKhuyenMai] Phát hiện bản ghi trùng lặp: {existingRecord.MaDonHangKhuyenMai}, sẽ xóa và tạo mới");
                
                // Xóa bản ghi cũ
                _context.DonHangKhuyenMais.Remove(existingRecord);
                
                // Giảm số lượt đã dùng của khuyến mãi cũ
                var oldKhuyenMai = await _context.KhuyenMais
                    .FirstOrDefaultAsync(km => km.MaKhuyenMai == existingRecord.MaKhuyenMai, ct);
                if (oldKhuyenMai != null && oldKhuyenMai.SoLuotDaDung > 0)
                {
                    oldKhuyenMai.SoLuotDaDung = Math.Max(0, oldKhuyenMai.SoLuotDaDung.Value - 1);
                    oldKhuyenMai.NgayCapNhat = DateTime.Now;
                }
                
                Console.WriteLine($"[CreateDonHangKhuyenMai] Đã xóa bản ghi cũ và giảm số lượt sử dụng");
            }

            // Tạo bản ghi mới
            var donHangKhuyenMai = new DonHangKhuyenMai
            {
                MaDonHangKhuyenMai = Guid.NewGuid().ToString(),
                MaDonHang = request.MaDonHang,
                MaKhuyenMai = khuyenMai.MaKhuyenMai,
                GiamGiaGoc = request.GiamGiaGoc,
                GiamGiaThucTe = request.GiamGiaThucTe,
                NgayApDung = DateTime.Now,
                IsDelete = false,
                IsActive = true,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            _context.DonHangKhuyenMais.Add(donHangKhuyenMai);

            // Cập nhật số lượt đã dùng của khuyến mãi
            khuyenMai.SoLuotDaDung = (khuyenMai.SoLuotDaDung ?? 0) + 1;
            khuyenMai.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync(ct);
            
            // Commit transaction nếu mọi thứ thành công
            await transaction.CommitAsync(ct);
            
            Console.WriteLine($"[CreateDonHangKhuyenMai] Tạo thành công bản ghi: {donHangKhuyenMai.MaDonHangKhuyenMai}");

            // ✅ Trả về DTO thay vì entity để tránh circular reference
            var responseDto = new DonHangKhuyenMaiDto
            {
                MaDonHangKhuyenMai = donHangKhuyenMai.MaDonHangKhuyenMai,
                MaDonHang = donHangKhuyenMai.MaDonHang,
                MaKhuyenMai = donHangKhuyenMai.MaKhuyenMai,
                GiamGiaGoc = donHangKhuyenMai.GiamGiaGoc,
                GiamGiaThucTe = donHangKhuyenMai.GiamGiaThucTe,
                NgayApDung = donHangKhuyenMai.NgayApDung,
                IsDelete = donHangKhuyenMai.IsDelete,
                IsActive = donHangKhuyenMai.IsActive,
                NgayTao = donHangKhuyenMai.NgayTao,
                NgayCapNhat = donHangKhuyenMai.NgayCapNhat
            };

            var message = existingRecord != null 
                ? "Cập nhật bản ghi đơn hàng khuyến mãi thành công" 
                : "Tạo bản ghi đơn hàng khuyến mãi thành công";
            
            return ApiResponse.Success(message, responseDto);
        }
        catch (Exception ex)
        {
            // Rollback transaction nếu có lỗi
            await transaction.RollbackAsync(ct);
            return ApiResponse.Error($"Lỗi server: {ex.Message}", 500);
        }
    }

    // GET: api/DonHangKhuyenMai/donhang/{maDonHang}
    [HttpGet("donhang/{maDonHang}")]
    public async Task<IActionResult> GetByMaDonHang(string maDonHang, CancellationToken ct = default)
    {
        try
        {
            var donHangKhuyenMai = await _context.DonHangKhuyenMais
                .Where(dhkm => dhkm.MaDonHang == maDonHang && dhkm.IsDelete != true)
                .Select(dhkm => new DonHangKhuyenMaiResponseDto
                {
                    MaDonHangKhuyenMai = dhkm.MaDonHangKhuyenMai,
                    MaDonHang = dhkm.MaDonHang,
                    MaKhuyenMai = dhkm.MaKhuyenMai,
                    GiamGiaGoc = dhkm.GiamGiaGoc,
                    GiamGiaThucTe = dhkm.GiamGiaThucTe,
                    NgayApDung = dhkm.NgayApDung,
                    KhuyenMai = new KhuyenMaiInfoDto
                    {
                        Code = dhkm.MaKhuyenMaiNavigation.Code,
                        TenKhuyenMai = dhkm.MaKhuyenMaiNavigation.TenKhuyenMai,
                        LoaiGiam = dhkm.MaKhuyenMaiNavigation.LoaiGiam,
                        GiaTriGiam = dhkm.MaKhuyenMaiNavigation.GiaTriGiam
                    }
                })
                .ToListAsync(ct);

            return Ok(ApiResponse.Success("Lấy thông tin khuyến mãi đơn hàng thành công", donHangKhuyenMai));
        }
        catch (Exception ex)
        {
                return ApiResponse.Error($"Lỗi server: {ex.Message}", 500);
        }
    }

    // GET: api/DonHangKhuyenMai/khuyenmai/{maKhuyenMai}
    [HttpGet("khuyenMai/{maKhuyenMai}")]
    public async Task<IActionResult> GetByMaKhuyenMai(string maKhuyenMai, CancellationToken ct = default)
    {
        try
        {
            var donHangKhuyenMai = await _context.DonHangKhuyenMais
                .Where(dhkm => dhkm.MaKhuyenMai == maKhuyenMai && dhkm.IsDelete != true)
                .Select(dhkm => new DonHangKhuyenMaiOrderResponseDto
                {
                    MaDonHangKhuyenMai = dhkm.MaDonHangKhuyenMai,
                    MaDonHang = dhkm.MaDonHang,
                    MaKhuyenMai = dhkm.MaKhuyenMai,
                    GiamGiaGoc = dhkm.GiamGiaGoc,
                    GiamGiaThucTe = dhkm.GiamGiaThucTe,
                    NgayApDung = dhkm.NgayApDung,
                    DonHang = new DonHangInfoDto
                    {
                        MaDonHang = dhkm.MaDonHangNavigation.MaDonHang,
                        MaNguoiDung = dhkm.MaDonHangNavigation.MaNguoiDung,
                        TongTienGoc = dhkm.MaDonHangNavigation.TongTienGoc,
                        TongTienThanhToan = dhkm.MaDonHangNavigation.TongTienThanhToan,
                        TrangThaiDon = dhkm.MaDonHangNavigation.TrangThaiDon
                    }
                })
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy thông tin đơn hàng sử dụng khuyến mãi thành công", donHangKhuyenMai);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi server: {ex.Message}", 500);
        }
    }
} 