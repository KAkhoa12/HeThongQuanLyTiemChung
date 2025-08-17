using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.NguoiDung;
using server.Models;
using server.Helpers;
using server.Filters;
using server.DTOs.Pagination;
namespace server.Controllers;

[ApiController]
[Route("api/users")]
[ConfigAuthorize]
public class UserController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public UserController(HeThongQuanLyTiemChungContext ctx) => _ctx = ctx;

    /* ---------- 1. Tất cả USER (paging) ---------- */
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        CancellationToken ct = default)
    {
        var query = _ctx.NguoiDungs
                        .Where(u => u.MaVaiTro == "VT001" && u.IsDelete == false)
                        .OrderByDescending(u => u.NgayTao);

        var paged = await query.ToPagedAsync(page!.Value, pageSize!.Value, ct);
        var data = paged.Data
     .Select(u => new UserInfoDto(
         u.MaNguoiDung,
         u.Ten,
         u.Email,
         u.SoDienThoai,
         u.NgaySinh,
         u.DiaChi,
         u.MaVaiTroNavigation.TenVaiTro ?? "USER",
         u.NgayTao!.Value))
     .ToList();

        return ApiResponse.Success(
            "Lấy danh sách người dùng thành công",
            new PagedResultDto<UserInfoDto>(
                paged.TotalCount,
                paged.Page,
                paged.PageSize,
                paged.TotalPages,
                data));
    }

    /* ---------- 2. Theo ID ---------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var user = await _ctx.NguoiDungs
            .FirstOrDefaultAsync(u => u.MaNguoiDung == id && u.IsDelete == false, ct);
        if (user == null) return NotFound();

        return ApiResponse.Success("Lấy thông tin người dùng thành công", new UserInfoDto(
            user.MaNguoiDung,
            user.Ten,
            user.Email,
            user.SoDienThoai,
            user.NgaySinh,
            user.DiaChi,
            user.MaVaiTro,
            user.NgayTao!.Value));
    }

    /* ---------- 3. Tạo mới ---------- */
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserCreateDto dto, CancellationToken ct)
    {
        if (await _ctx.NguoiDungs.AnyAsync(u => u.Email == dto.Email && u.IsDelete == false, ct))
            return ApiResponse.Error("Email đã tồn tại");
        if (await _ctx.NguoiDungs.AnyAsync(u => u.SoDienThoai == dto.SoDienThoai && u.IsDelete == false, ct))
            return ApiResponse.Error("Số điện thoại đã tồn tại");

        var user = new NguoiDung
        {
            MaNguoiDung = Guid.NewGuid().ToString("N"),
            Ten = dto.Ten,
            Email = dto.Email,
            MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
            SoDienThoai = dto.SoDienThoai,
            NgaySinh = dto.NgaySinh,
            DiaChi = dto.DiaChi,
            MaVaiTro = "VT001",
            IsActive = true,
            IsDelete = false,
            NgayTao = DateTime.UtcNow
        };

        _ctx.NguoiDungs.Add(user);
        await _ctx.SaveChangesAsync(ct);

        var userDto = new UserDto(user.MaNguoiDung, user.Ten, user.Email, user.SoDienThoai,
                        user.NgaySinh, user.DiaChi, user.MaVaiTro);
        return ApiResponse.Success("Tạo người dùng thành công", userDto);
    }

    /* ---------- 4. Cập nhật ---------- */
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
                                            [FromBody] UserUpdateDto dto,
                                            CancellationToken ct)
    {
        var user = await _ctx.NguoiDungs
            .FirstOrDefaultAsync(u => u.MaNguoiDung == dto.MaNguoiDung && u.IsDelete == false, ct);
        if (user == null) return ApiResponse.Error("Không tìm thấy người dùng");

        user.Ten = dto.Ten ?? user.Ten;
        user.SoDienThoai = dto.SoDienThoai ?? user.SoDienThoai;
        user.NgaySinh = dto.NgaySinh ?? user.NgaySinh;
        user.DiaChi = dto.DiaChi ?? user.DiaChi;
        user.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        var userDto = new UserDto(
                user.MaNguoiDung,
                user.Ten,
                user.Email,
                user.SoDienThoai,
                user.NgaySinh,
                user.DiaChi,
                user.MaVaiTro
            );
        return ApiResponse.Success("Cập nhập người dùng thành công", userDto); ;
    }

    /* ---------- 5. Xóa mềm ---------- */
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        var user = await _ctx.NguoiDungs
            .FirstOrDefaultAsync(u => u.MaNguoiDung == id && u.IsDelete == false, ct);
        if (user == null) return ApiResponse.Error("Không tìm thấy người dùng");

        user.IsDelete = true;
        user.NgayCapNhat = DateTime.UtcNow;
        await _ctx.SaveChangesAsync(ct);
        return ApiResponse.Success("Xóa người dùng thành công"); ;
    }
}