using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.NhanVien;
using server.DTOs.Pagination;
using server.Filters;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/nhan-vien")]
public class NhanVienController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public NhanVienController(HeThongQuanLyTiemChungContext ctx)
    {
        _ctx = ctx;
    }

    /* ---------- 1. Lấy danh sách nhân viên (có phân trang) ---------- */
    [HttpGet]
    [ConfigAuthorize]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? maDiaDiem = null,
        [FromQuery] string? chucVu = null,
        [FromQuery] bool? isActive = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _ctx.NhanViens
                .Include(n => n.MaNguoiDungNavigation)
                    .ThenInclude(u => u.MaAnhNavigation)
                .Include(n => n.MaDiaDiemNavigation)
                .Where(n => n.MaNguoiDungNavigation != null && 
                           n.MaNguoiDungNavigation.MaVaiTro == "VT004" && 
                           n.MaNguoiDungNavigation.IsDelete != true);

            // Tìm kiếm theo từ khóa
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(n => 
                    n.MaNguoiDungNavigation.Ten.Contains(search) ||
                    n.MaNguoiDungNavigation.Email.Contains(search) ||
                    (n.MaNguoiDungNavigation.SoDienThoai != null && n.MaNguoiDungNavigation.SoDienThoai.Contains(search)) ||
                    (n.ChucVu != null && n.ChucVu.Contains(search)));
            }

            // Lọc theo địa điểm
            if (!string.IsNullOrEmpty(maDiaDiem))
            {
                query = query.Where(n => n.MaDiaDiem == maDiaDiem);
            }

            // Lọc theo chức vụ
            if (!string.IsNullOrEmpty(chucVu))
            {
                query = query.Where(n => n.ChucVu == chucVu);
            }

            // Lọc theo trạng thái
            if (isActive.HasValue)
            {
                query = query.Where(n => n.MaNguoiDungNavigation.IsActive == isActive.Value);
            }

            var result = await query
                .Select(n => new NhanVienDto
                {
                    MaNhanVien = n.MaNhanVien,
                    MaNguoiDung = n.MaNguoiDung,
                    ChucVu = n.ChucVu,
                    MaDiaDiem = n.MaDiaDiem,
                    TenDiaDiem = n.MaDiaDiemNavigation.Ten,
                    Ten = n.MaNguoiDungNavigation.Ten,
                    Email = n.MaNguoiDungNavigation.Email,
                    SoDienThoai = n.MaNguoiDungNavigation.SoDienThoai,
                    NgaySinh = n.MaNguoiDungNavigation.NgaySinh.HasValue ? n.MaNguoiDungNavigation.NgaySinh.Value.ToString("yyyy-MM-dd") : null,
                    DiaChi = n.MaNguoiDungNavigation.DiaChi,
                    GioiTinh = n.MaNguoiDungNavigation.GioiTinh,
                    MaAnh = n.MaNguoiDungNavigation.MaAnh,
                    IsActive = n.MaNguoiDungNavigation.IsActive,
                    NgayTao = n.MaNguoiDungNavigation.NgayTao,
                    NgayCapNhat = n.MaNguoiDungNavigation.NgayCapNhat
                })
                .ToPagedAsync(page, pageSize, ct);

            return ApiResponse.Success("Lấy danh sách nhân viên thành công", result);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách nhân viên: {ex.Message}");
        }
    }

    /* ---------- 2. Lấy thông tin nhân viên theo ID ---------- */
    [HttpGet("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
    {
        try
        {
            var nhanVien = await _ctx.NhanViens
                .Include(n => n.MaNguoiDungNavigation)
                    .ThenInclude(u => u.MaAnhNavigation)
                .Include(n => n.MaDiaDiemNavigation)
                .Where(n => n.MaNhanVien == id && 
                           n.MaNguoiDungNavigation != null &&
                           n.MaNguoiDungNavigation.MaVaiTro == "VT004" && 
                           n.MaNguoiDungNavigation.IsDelete != true)
                .Select(n => new NhanVienDto
                {
                    MaNhanVien = n.MaNhanVien,
                    MaNguoiDung = n.MaNguoiDung,
                    ChucVu = n.ChucVu,
                    MaDiaDiem = n.MaDiaDiem,
                    TenDiaDiem = n.MaDiaDiemNavigation.Ten,
                    Ten = n.MaNguoiDungNavigation.Ten,
                    Email = n.MaNguoiDungNavigation.Email,
                    SoDienThoai = n.MaNguoiDungNavigation.SoDienThoai,
                    NgaySinh = n.MaNguoiDungNavigation.NgaySinh.HasValue ? n.MaNguoiDungNavigation.NgaySinh.Value.ToString("yyyy-MM-dd") : null,
                    DiaChi = n.MaNguoiDungNavigation.DiaChi,
                    GioiTinh = n.MaNguoiDungNavigation.GioiTinh,
                    MaAnh = n.MaNguoiDungNavigation.MaAnh,
                    IsActive = n.MaNguoiDungNavigation.IsActive,
                    NgayTao = n.MaNguoiDungNavigation.NgayTao,
                    NgayCapNhat = n.MaNguoiDungNavigation.NgayCapNhat
                })
                .FirstOrDefaultAsync(ct);

            if (nhanVien == null)
            {
                return ApiResponse.Error("Không tìm thấy nhân viên", 404);
            }

            return ApiResponse.Success("Lấy thông tin nhân viên thành công", nhanVien);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy thông tin nhân viên: {ex.Message}");
        }
    }

    /* ---------- 3. Tạo nhân viên mới ---------- */
    [HttpPost]
    [ConfigAuthorize]
    public async Task<IActionResult> Create([FromBody] CreateNhanVienDto dto, CancellationToken ct = default)
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
                .FirstOrDefaultAsync(v => v.MaVaiTro == "VT004" && v.IsDelete != true, ct);
            
            if (vaiTro == null)
            {
                return ApiResponse.Error("Vai trò nhân viên không tồn tại");
            }

            // Kiểm tra địa điểm có tồn tại (nếu có)
            if (!string.IsNullOrEmpty(dto.MaDiaDiem))
            {
                var diaDiem = await _ctx.DiaDiems
                    .FirstOrDefaultAsync(d => d.MaDiaDiem == dto.MaDiaDiem && d.IsDelete != true, ct);
                
                if (diaDiem == null)
                {
                    return ApiResponse.Error("Địa điểm không tồn tại");
                }
            }

            // Tạo người dùng mới
            var newUser = new NguoiDung
            {
                MaNguoiDung = Guid.NewGuid().ToString("N"),
                Ten = dto.Ten,
                Email = dto.Email,
                SoDienThoai = dto.SoDienThoai,
                MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
                NgaySinh = !string.IsNullOrEmpty(dto.NgaySinh) ? DateOnly.ParseExact(dto.NgaySinh, "yyyy-MM-dd", null) : null,
                GioiTinh = dto.GioiTinh,
                DiaChi = dto.DiaChi,
                MaVaiTro = "VT004",
                MaAnh = dto.MaAnh,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _ctx.NguoiDungs.Add(newUser);

            // Tạo thông tin nhân viên
            var newNhanVien = new NhanVien
            {
                MaNhanVien = Guid.NewGuid().ToString("N"),
                MaNguoiDung = newUser.MaNguoiDung,
                ChucVu = dto.ChucVu,
                MaDiaDiem = dto.MaDiaDiem
            };

            _ctx.NhanViens.Add(newNhanVien);

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo nhân viên thành công", new { 
                MaNhanVien = newNhanVien.MaNhanVien,
                MaNguoiDung = newUser.MaNguoiDung 
            });
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi tạo nhân viên: {ex.Message}");
        }
    }

    /* ---------- 4. Cập nhật thông tin nhân viên ---------- */
    [HttpPut("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateNhanVienDto dto, CancellationToken ct = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return ApiResponse.Error("Dữ liệu không hợp lệ", 400);
            }

            var nhanVien = await _ctx.NhanViens
                .Include(n => n.MaNguoiDungNavigation)
                    .ThenInclude(u => u.ThongTinNguoiDungs)
                .FirstOrDefaultAsync(n => n.MaNhanVien == id && 
                                        n.MaNguoiDungNavigation != null &&
                                        n.MaNguoiDungNavigation.MaVaiTro == "VT004" && 
                                        n.MaNguoiDungNavigation.IsDelete != true, ct);

            if (nhanVien == null)
            {
                return ApiResponse.Error("Không tìm thấy nhân viên", 404);
            }

            // Kiểm tra số điện thoại đã tồn tại (nếu thay đổi)
            if (!string.IsNullOrEmpty(dto.SoDienThoai) && dto.SoDienThoai != nhanVien.MaNguoiDungNavigation.SoDienThoai)
            {
                var existingPhone = await _ctx.NguoiDungs
                    .FirstOrDefaultAsync(n => n.SoDienThoai == dto.SoDienThoai && 
                                            n.MaNguoiDung != nhanVien.MaNguoiDung && 
                                            n.IsDelete != true, ct);
                
                if (existingPhone != null)
                {
                    return ApiResponse.Error("Số điện thoại đã được sử dụng");
                }
            }

            // Kiểm tra địa điểm có tồn tại (nếu thay đổi)
            if (!string.IsNullOrEmpty(dto.MaDiaDiem) && dto.MaDiaDiem != nhanVien.MaDiaDiem)
            {
                var diaDiem = await _ctx.DiaDiems
                    .FirstOrDefaultAsync(d => d.MaDiaDiem == dto.MaDiaDiem && d.IsDelete != true, ct);
                
                if (diaDiem == null)
                {
                    return ApiResponse.Error("Địa điểm không tồn tại");
                }
            }

            // Cập nhật thông tin cơ bản
            nhanVien.MaNguoiDungNavigation.Ten = dto.Ten;
            nhanVien.MaNguoiDungNavigation.SoDienThoai = dto.SoDienThoai;
            nhanVien.MaNguoiDungNavigation.NgaySinh = !string.IsNullOrEmpty(dto.NgaySinh) ? DateOnly.ParseExact(dto.NgaySinh, "yyyy-MM-dd", null) : nhanVien.MaNguoiDungNavigation.NgaySinh;
            nhanVien.MaNguoiDungNavigation.DiaChi = dto.DiaChi;
            nhanVien.MaNguoiDungNavigation.GioiTinh = dto.GioiTinh;
            nhanVien.MaNguoiDungNavigation.MaAnh = dto.MaAnh;
            nhanVien.MaNguoiDungNavigation.IsActive = dto.IsActive ?? nhanVien.MaNguoiDungNavigation.IsActive;
            nhanVien.MaNguoiDungNavigation.NgayCapNhat = DateTime.UtcNow;

            // Cập nhật thông tin nhân viên
            nhanVien.ChucVu = dto.ChucVu;
            nhanVien.MaDiaDiem = dto.MaDiaDiem;

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật thông tin nhân viên thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật thông tin nhân viên: {ex.Message}");
        }
    }

    /* ---------- 5. Xóa nhân viên (soft delete) ---------- */
    [HttpDelete("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> Delete(string id, CancellationToken ct = default)
    {
        try
        {
            var nhanVien = await _ctx.NhanViens
                .Include(n => n.MaNguoiDungNavigation)
                .FirstOrDefaultAsync(n => n.MaNhanVien == id && 
                                        n.MaNguoiDungNavigation != null &&
                                        n.MaNguoiDungNavigation.MaVaiTro == "VT004" && 
                                        n.MaNguoiDungNavigation.IsDelete != true, ct);

            if (nhanVien == null)
            {
                return ApiResponse.Error("Không tìm thấy nhân viên", 404);
            }

            // Soft delete người dùng
            nhanVien.MaNguoiDungNavigation.IsDelete = true;
            nhanVien.MaNguoiDungNavigation.IsActive = false;
            nhanVien.MaNguoiDungNavigation.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa nhân viên thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi xóa nhân viên: {ex.Message}");
        }
    }

    /* ---------- 6. Kích hoạt/vô hiệu hóa nhân viên ---------- */
    [HttpPatch("{id}/toggle-status")]
    [ConfigAuthorize]
    public async Task<IActionResult> ToggleStatus(string id, CancellationToken ct = default)
    {
        try
        {
            var nhanVien = await _ctx.NhanViens
                .Include(n => n.MaNguoiDungNavigation)
                .FirstOrDefaultAsync(n => n.MaNhanVien == id && 
                                        n.MaNguoiDungNavigation != null &&
                                        n.MaNguoiDungNavigation.MaVaiTro == "VT004" && 
                                        n.MaNguoiDungNavigation.IsDelete != true, ct);

            if (nhanVien == null)
            {
                return ApiResponse.Error("Không tìm thấy nhân viên", 404);
            }

            nhanVien.MaNguoiDungNavigation.IsActive = !nhanVien.MaNguoiDungNavigation.IsActive;
            nhanVien.MaNguoiDungNavigation.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            var status = nhanVien.MaNguoiDungNavigation.IsActive == true ? "kích hoạt" : "vô hiệu hóa";
            return ApiResponse.Success($"Đã {status} nhân viên thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi thay đổi trạng thái nhân viên: {ex.Message}");
        }
    }

    /* ---------- 7. Lấy danh sách chức vụ ---------- */
    [HttpGet("chuc-vu")]
    [ConfigAuthorize]
    public async Task<IActionResult> GetChucVu(CancellationToken ct = default)
    {
        try
        {
            var chucVus = await _ctx.NhanViens
                .Where(n => n.ChucVu != null && 
                           n.MaNguoiDungNavigation != null &&
                           n.MaNguoiDungNavigation.MaVaiTro == "VT004" && 
                           n.MaNguoiDungNavigation.IsDelete != true)
                .Select(n => n.ChucVu)
                .Distinct()
                .OrderBy(cv => cv)
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy danh sách chức vụ thành công", chucVus);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách chức vụ: {ex.Message}");
        }
    }
}