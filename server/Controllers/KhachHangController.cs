using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.KhachHang;
using server.DTOs.Pagination;
using server.Filters;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/khach-hang")]
public class KhachHangController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public KhachHangController(HeThongQuanLyTiemChungContext ctx)
    {
        _ctx = ctx;
    }

    /* ---------- 1. Lấy danh sách khách hàng (có phân trang) ---------- */
    [HttpGet]
    [ConfigAuthorize]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] bool? isActive = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _ctx.NguoiDungs
                .Include(n => n.ThongTinNguoiDungs)
                .Include(n => n.MaAnhNavigation)
                .Where(n => n.MaVaiTro.Trim() == "VT001" && n.IsDelete != true);

            // Tìm kiếm theo từ khóa
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(n => 
                    n.Ten.Contains(search) ||
                    n.Email.Contains(search) ||
                    (n.SoDienThoai != null && n.SoDienThoai.Contains(search)));
            }

            // Lọc theo trạng thái
            if (isActive.HasValue)
            {
                query = query.Where(n => n.IsActive == isActive.Value);
            }

            var result = await query
                .Select(n => new KhachHangDto
                {
                    MaNguoiDung = n.MaNguoiDung,
                    Ten = n.Ten,
                    Email = n.Email,
                    SoDienThoai = n.SoDienThoai,
                    NgaySinh = n.NgaySinh.HasValue ? n.NgaySinh.Value.ToString("yyyy-MM-dd") : null,
                    DiaChi = n.DiaChi,
                    GioiTinh = n.GioiTinh,
                    MaAnh = n.MaAnh,
                    IsActive = n.IsActive,
                    NgayTao = n.NgayTao,
                    NgayCapNhat = n.NgayCapNhat,
                    ThongTinNguoiDung = n.ThongTinNguoiDungs
                        .Where(t => t.IsDelete != true)
                        .Select(t => new ThongTinNguoiDungDto
                        {
                            MaThongTin = t.MaThongTin,
                            MaNguoiDung = t.MaNguoiDung,
                            ChieuCao = t.ChieuCao,
                            CanNang = t.CanNang,
                            Bmi = t.Bmi,
                            NhomMau = t.NhomMau,
                            BenhNen = t.BenhNen,
                            DiUng = t.DiUng,
                            ThuocDangDung = t.ThuocDangDung,
                            TinhTrangMangThai = t.TinhTrangMangThai,
                            NgayKhamGanNhat = t.NgayKhamGanNhat.HasValue ? t.NgayKhamGanNhat.Value.ToString("yyyy-MM-dd") : null,
                            IsActive = t.IsActive,
                            NgayTao = t.NgayTao,
                            NgayCapNhat = t.NgayCapNhat
                        })
                        .FirstOrDefault()
                })
                .ToPagedAsync(page, pageSize, ct);

            return ApiResponse.Success("Lấy danh sách khách hàng thành công", result);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách khách hàng: {ex.Message}");
        }
    }

    /* ---------- 2. Lấy thông tin khách hàng theo ID ---------- */
    [HttpGet("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        try
        {
            var khachHang = await _ctx.NguoiDungs
                .Include(n => n.ThongTinNguoiDungs)
                .Include(n => n.MaAnhNavigation)
                .Where(n => n.MaNguoiDung == id && n.MaVaiTro.Trim() == "VT001" && n.IsDelete != true)
                .Select(n => new KhachHangDto
                {
                    MaNguoiDung = n.MaNguoiDung,
                    Ten = n.Ten,
                    Email = n.Email,
                    SoDienThoai = n.SoDienThoai,
                    NgaySinh = n.NgaySinh.HasValue ? n.NgaySinh.Value.ToString("yyyy-MM-dd") : null,
                    DiaChi = n.DiaChi,
                    GioiTinh = n.GioiTinh,
                    MaAnh = n.MaAnh,
                    IsActive = n.IsActive,
                    NgayTao = n.NgayTao,
                    NgayCapNhat = n.NgayCapNhat,
                    ThongTinNguoiDung = n.ThongTinNguoiDungs
                        .Where(t => t.IsDelete != true)
                        .Select(t => new ThongTinNguoiDungDto
                        {
                            MaThongTin = t.MaThongTin,
                            MaNguoiDung = t.MaNguoiDung,
                            ChieuCao = t.ChieuCao,
                            CanNang = t.CanNang,
                            Bmi = t.Bmi,
                            NhomMau = t.NhomMau,
                            BenhNen = t.BenhNen,
                            DiUng = t.DiUng,
                            ThuocDangDung = t.ThuocDangDung,
                            TinhTrangMangThai = t.TinhTrangMangThai,
                            NgayKhamGanNhat = t.NgayKhamGanNhat.HasValue ? t.NgayKhamGanNhat.Value.ToString("yyyy-MM-dd") : null,
                            IsActive = t.IsActive,
                            NgayTao = t.NgayTao,
                            NgayCapNhat = t.NgayCapNhat
                        })
                        .FirstOrDefault()
                })
                .FirstOrDefaultAsync(ct);

            if (khachHang == null)
            {
                return ApiResponse.Error("Không tìm thấy khách hàng", 404);
            }

            return ApiResponse.Success("Lấy thông tin khách hàng thành công", khachHang);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy thông tin khách hàng: {ex.Message}");
        }
    }

    /* ---------- 3. Tạo khách hàng mới ---------- */
    [HttpPost]
    [ConfigAuthorize]
    public async Task<IActionResult> Create([FromBody] CreateKhachHangDto dto, CancellationToken ct = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return ApiResponse.Error("Dữ liệu không hợp lệ", 400);
            }

            // Kiểm tra email đã tồn tại
            var existingUser = await _ctx.NguoiDungs
                .FirstOrDefaultAsync(n => n.Email == dto.Email && n.IsDelete != true, ct);
            
            if (existingUser != null)
            {
                return ApiResponse.Error("Email đã được sử dụng");
            }

            // Kiểm tra số điện thoại đã tồn tại
            if (!string.IsNullOrEmpty(dto.SoDienThoai))
            {
                var existingPhone = await _ctx.NguoiDungs
                    .FirstOrDefaultAsync(n => n.SoDienThoai == dto.SoDienThoai && n.IsDelete != true, ct);
                
                if (existingPhone != null)
                {
                    return ApiResponse.Error("Số điện thoại đã được sử dụng");
                }
            }

            // Kiểm tra vai trò có tồn tại
            var vaiTro = await _ctx.VaiTros
                .FirstOrDefaultAsync(v => v.MaVaiTro == "VT001" && v.IsDelete != true, ct);
            
            if (vaiTro == null)
            {
                return ApiResponse.Error("Vai trò khách hàng không tồn tại");
            }


            // Tạo người dùng mới
            var newUser = new NguoiDung
            {
                MaNguoiDung = Guid.NewGuid().ToString("N"),
                Ten = dto.Ten,
                Email = dto.Email,
                SoDienThoai = string.IsNullOrEmpty(dto.SoDienThoai) ? null : dto.SoDienThoai,
                MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
                NgaySinh = !string.IsNullOrEmpty(dto.NgaySinh) ? DateOnly.ParseExact(dto.NgaySinh, "yyyy-MM-dd", null) : null,
                GioiTinh = string.IsNullOrEmpty(dto.GioiTinh) ? null : dto.GioiTinh,
                DiaChi = string.IsNullOrEmpty(dto.DiaChi) ? null : dto.DiaChi,
                MaVaiTro = "VT001",
                MaAnh = string.IsNullOrEmpty(dto.MaAnh) ? null : dto.MaAnh,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _ctx.NguoiDungs.Add(newUser);

            // Tạo thông tin người dùng nếu có
            if (dto.ChieuCao.HasValue || dto.CanNang.HasValue || !string.IsNullOrEmpty(dto.NhomMau) ||
                !string.IsNullOrEmpty(dto.BenhNen) || !string.IsNullOrEmpty(dto.DiUng) ||
                !string.IsNullOrEmpty(dto.ThuocDangDung) || dto.TinhTrangMangThai.HasValue ||
                !string.IsNullOrEmpty(dto.NgayKhamGanNhat))
            {
                var thongTin = new ThongTinNguoiDung
                {
                    MaThongTin = Guid.NewGuid().ToString("N"),
                    MaNguoiDung = newUser.MaNguoiDung,
                    ChieuCao = dto.ChieuCao,
                    CanNang = dto.CanNang,
                    NhomMau = dto.NhomMau,
                    BenhNen = dto.BenhNen,
                    DiUng = dto.DiUng,
                    ThuocDangDung = dto.ThuocDangDung,
                    TinhTrangMangThai = dto.TinhTrangMangThai,
                    NgayKhamGanNhat = !string.IsNullOrEmpty(dto.NgayKhamGanNhat) ? DateOnly.ParseExact(dto.NgayKhamGanNhat, "yyyy-MM-dd", null) : null,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };

                // Tính BMI nếu có chiều cao và cân nặng
                if (dto.ChieuCao.HasValue && dto.CanNang.HasValue && dto.ChieuCao > 0)
                {
                    var heightInMeters = (double)dto.ChieuCao.Value / 100;
                    thongTin.Bmi = (decimal)((double)dto.CanNang.Value / (heightInMeters * heightInMeters));
                }

                _ctx.ThongTinNguoiDungs.Add(thongTin);
            }

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo khách hàng thành công", new { MaNguoiDung = newUser.MaNguoiDung });
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi tạo khách hàng: {ex.Message}");
        }
    }

    /* ---------- 4. Cập nhật thông tin khách hàng ---------- */
    [HttpPut("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateKhachHangDto dto, CancellationToken ct = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return ApiResponse.Error("Dữ liệu không hợp lệ", 400);
            }

            var khachHang = await _ctx.NguoiDungs
                .Include(n => n.ThongTinNguoiDungs)
                .FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.MaVaiTro == "VT001" && n.IsDelete != true, ct);

            if (khachHang == null)
            {
                return ApiResponse.Error("Không tìm thấy khách hàng", 404);
            }

            // Kiểm tra số điện thoại đã tồn tại (nếu thay đổi)
            if (!string.IsNullOrEmpty(dto.SoDienThoai) && dto.SoDienThoai != khachHang.SoDienThoai)
            {
                var existingPhone = await _ctx.NguoiDungs
                    .FirstOrDefaultAsync(n => n.SoDienThoai == dto.SoDienThoai && n.MaNguoiDung != id && n.IsDelete != true, ct);
                
                if (existingPhone != null)
                {
                    return ApiResponse.Error("Số điện thoại đã được sử dụng");
                }
            }

            // Kiểm tra ảnh có tồn tại (nếu có cung cấp maAnh)
            if (!string.IsNullOrEmpty(dto.MaAnh))
            {
                var existingImage = await _ctx.NguonAnhs
                    .FirstOrDefaultAsync(a => a.MaAnh == dto.MaAnh && a.IsDelete != true, ct);
                
                if (existingImage == null)
                {
                    return ApiResponse.Error("Ảnh không tồn tại");
                }
            }

            // Cập nhật thông tin cơ bản
            khachHang.Ten = dto.Ten;
            khachHang.SoDienThoai = string.IsNullOrEmpty(dto.SoDienThoai) ? null : dto.SoDienThoai;
            khachHang.NgaySinh = !string.IsNullOrEmpty(dto.NgaySinh) ? DateOnly.ParseExact(dto.NgaySinh, "yyyy-MM-dd", null) : khachHang.NgaySinh;
            khachHang.DiaChi = string.IsNullOrEmpty(dto.DiaChi) ? null : dto.DiaChi;
            khachHang.GioiTinh = string.IsNullOrEmpty(dto.GioiTinh) ? null : dto.GioiTinh;
            khachHang.MaAnh = string.IsNullOrEmpty(dto.MaAnh) ? null : dto.MaAnh;
            khachHang.IsActive = dto.IsActive ?? khachHang.IsActive;
            khachHang.NgayCapNhat = DateTime.UtcNow;

            // Cập nhật hoặc tạo thông tin người dùng
            var thongTin = khachHang.ThongTinNguoiDungs.FirstOrDefault(t => t.IsDelete != true);
            
            if (thongTin == null)
            {
                // Tạo mới thông tin người dùng
                thongTin = new ThongTinNguoiDung
                {
                    MaThongTin = Guid.NewGuid().ToString("N"),
                    MaNguoiDung = khachHang.MaNguoiDung,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };
                _ctx.ThongTinNguoiDungs.Add(thongTin);
            }

            thongTin.ChieuCao = dto.ChieuCao ?? thongTin.ChieuCao;
            thongTin.CanNang = dto.CanNang ?? thongTin.CanNang;
            thongTin.NhomMau = string.IsNullOrEmpty(dto.NhomMau) ? thongTin.NhomMau : dto.NhomMau;
            thongTin.BenhNen = string.IsNullOrEmpty(dto.BenhNen) ? thongTin.BenhNen : dto.BenhNen;
            thongTin.DiUng = string.IsNullOrEmpty(dto.DiUng) ? thongTin.DiUng : dto.DiUng;
            thongTin.ThuocDangDung = string.IsNullOrEmpty(dto.ThuocDangDung) ? thongTin.ThuocDangDung : dto.ThuocDangDung;
            thongTin.TinhTrangMangThai = dto.TinhTrangMangThai ?? thongTin.TinhTrangMangThai;
            thongTin.NgayKhamGanNhat = !string.IsNullOrEmpty(dto.NgayKhamGanNhat) ? DateOnly.ParseExact(dto.NgayKhamGanNhat, "yyyy-MM-dd", null) : thongTin.NgayKhamGanNhat;
            thongTin.NgayCapNhat = DateTime.UtcNow;

            // Tính lại BMI nếu có chiều cao và cân nặng
            if (thongTin.ChieuCao.HasValue && thongTin.CanNang.HasValue && thongTin.ChieuCao > 0)
            {
                var heightInMeters = (double)thongTin.ChieuCao.Value / 100;
                thongTin.Bmi = (decimal)((double)thongTin.CanNang.Value / (heightInMeters * heightInMeters));
            }

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật thông tin khách hàng thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật thông tin khách hàng: {ex.Message}");
        }
    }

    /* ---------- 5. Xóa khách hàng (soft delete) ---------- */
    [HttpDelete("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        try
        {
            var khachHang = await _ctx.NguoiDungs
                .Include(n => n.ThongTinNguoiDungs)
                .FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.MaVaiTro == "VT001" && n.IsDelete != true, ct);

            if (khachHang == null)
            {
                return ApiResponse.Error("Không tìm thấy khách hàng", 404);
            }

            // Soft delete khách hàng
            khachHang.IsDelete = true;
            khachHang.IsActive = false;
            khachHang.NgayCapNhat = DateTime.UtcNow;

            // Soft delete thông tin người dùng
            foreach (var thongTin in khachHang.ThongTinNguoiDungs.Where(t => t.IsDelete != true))
            {
                thongTin.IsDelete = true;
                thongTin.IsActive = false;
                thongTin.NgayCapNhat = DateTime.UtcNow;
            }

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa khách hàng thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi xóa khách hàng: {ex.Message}");
        }
    }

    /* ---------- 6. Kích hoạt/vô hiệu hóa khách hàng ---------- */
    [HttpPatch("{id}/toggle-status")]
    [ConfigAuthorize]
    public async Task<IActionResult> ToggleStatus(string id, CancellationToken ct = default)
    {
        try
        {
            var khachHang = await _ctx.NguoiDungs
                .FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.MaVaiTro == "VT001" && n.IsDelete != true, ct);

            if (khachHang == null)
            {
                return ApiResponse.Error("Không tìm thấy khách hàng", 404);
            }

            khachHang.IsActive = !khachHang.IsActive;
            khachHang.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            var status = khachHang.IsActive == true ? "kích hoạt" : "vô hiệu hóa";
            return ApiResponse.Success($"Đã {status} khách hàng thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi thay đổi trạng thái khách hàng: {ex.Message}");
        }
    }
}