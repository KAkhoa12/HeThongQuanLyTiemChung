using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.NguoiDung;
using server.DTOs.Pagination;
using server.Filters;
using server.Helpers;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;

    public UserController(HeThongQuanLyTiemChungContext ctx)
    {
        _ctx = ctx;
    }
    /* ---------- 0. Thêm mới bác sĩ ---------- */
    [HttpPost("doctor")]
    public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto dto, CancellationToken ct = default)
    {
        try
        {
            // Kiểm tra email đã tồn tại
            var existingUser = await _ctx.NguoiDungs
                .FirstOrDefaultAsync(n => n.Email == dto.Email && n.IsDelete != true, ct);
            
            if (existingUser != null)
            {
                return ApiResponse.Error("Email đã được sử dụng");
            }

            // Kiểm tra số điện thoại đã tồn tại
            var existingPhone = await _ctx.NguoiDungs
                .FirstOrDefaultAsync(n => n.SoDienThoai == dto.SoDienThoai && n.IsDelete != true, ct);
            
            if (existingPhone != null)
            {
                return ApiResponse.Error("Số điện thoại đã được sử dụng");
            }

            // Kiểm tra vai trò có tồn tại
            var vaiTro = await _ctx.VaiTros
                .FirstOrDefaultAsync(v => v.MaVaiTro == dto.MaVaiTro && v.IsDelete != true, ct);
            
            if (vaiTro == null)
            {
                return ApiResponse.Error("Vai trò không tồn tại");
            }

            // Kiểm tra địa điểm có tồn tại
            var diaDiem = await _ctx.DiaDiems
                .FirstOrDefaultAsync(d => d.MaDiaDiem == dto.MaDiaDiem && d.IsDelete != true, ct);
            
            if (diaDiem == null)
            {
                return ApiResponse.Error("Địa điểm không tồn tại");
            }

            // Tạo người dùng mới
            var newUser = new NguoiDung
            {
                MaNguoiDung = Guid.NewGuid().ToString("N"),
                Ten = dto.Ten,
                Email = dto.Email,
                SoDienThoai = dto.SoDienThoai,
                MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
                NgaySinh = dto.NgaySinh,
                GioiTinh = dto.GioiTinh,
                DiaChi = dto.DiaChi,
                MaVaiTro = dto.MaVaiTro,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _ctx.NguoiDungs.Add(newUser);

            // Tạo thông tin bác sĩ
            var newDoctor = new BacSi
            {
                MaBacSi = Guid.NewGuid().ToString("N"),
                MaNguoiDung = newUser.MaNguoiDung,
                ChuyenMon = dto.ChuyenMon,
                SoGiayPhep = dto.SoGiayPhep,
                MaDiaDiem = dto.MaDiaDiem,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _ctx.BacSis.Add(newDoctor);

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo bác sĩ thành công", new { 
                maNguoiDung = newUser.MaNguoiDung,
                maBacSi = newDoctor.MaBacSi 
            });
        }
        catch (Exception ex)
        {
            return ApiResponse.Error("Lỗi server khi tạo bác sĩ");
        }
    }

    /* ---------- 0.1. Thêm mới quản lý ---------- */
    [HttpPost("manager")]
    public async Task<IActionResult> CreateManager([FromBody] CreateManagerDto dto, CancellationToken ct = default)
    {
        try
        {
            // Kiểm tra email đã tồn tại
            var existingUser = await _ctx.NguoiDungs
                .FirstOrDefaultAsync(n => n.Email == dto.Email && n.IsDelete != true, ct);
            
            if (existingUser != null)
            {
                return ApiResponse.Error("Email đã được sử dụng");
            }

            // Kiểm tra số điện thoại đã tồn tại
            var existingPhone = await _ctx.NguoiDungs
                .FirstOrDefaultAsync(n => n.SoDienThoai == dto.SoDienThoai && n.IsDelete != true, ct);
            
            if (existingPhone != null)
            {
                return ApiResponse.Error("Số điện thoại đã được sử dụng");
            }

            // Kiểm tra vai trò có tồn tại
            var vaiTro = await _ctx.VaiTros
                .FirstOrDefaultAsync(v => v.MaVaiTro == dto.MaVaiTro && v.IsDelete != true, ct);
            
            if (vaiTro == null)
            {
                return ApiResponse.Error("Vai trò không tồn tại");
            }

            // Tạo người dùng mới
            var newUser = new NguoiDung
            {
                MaNguoiDung = Guid.NewGuid().ToString("N"),
                Ten = dto.Ten,
                Email = dto.Email,
                SoDienThoai = dto.SoDienThoai,
                MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
                NgaySinh = dto.NgaySinh,
                GioiTinh = dto.GioiTinh,
                DiaChi = dto.DiaChi,
                MaVaiTro = dto.MaVaiTro,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _ctx.NguoiDungs.Add(newUser);

            // Tạo thông tin quản lý
            var newManager = new QuanLy
            {
                MaQuanLy = Guid.NewGuid().ToString("N"),
                MaNguoiDung = newUser.MaNguoiDung,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                NgayCapNhat = DateTime.UtcNow
            };

            _ctx.QuanLies.Add(newManager);

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo quản lý thành công", new { 
                maNguoiDung = newUser.MaNguoiDung,
                maQuanLy = newManager.MaQuanLy 
            });
        }
        catch (Exception ex)
        {
            return ApiResponse.Error("Lỗi server khi tạo quản lý");
        }
    }
    /* ---------- 1. Lấy thông tin profile của người dùng đã đăng nhập ---------- */
    [HttpGet("profile")]
    [ConfigAuthorize]
    public async Task<IActionResult> GetMyProfile(CancellationToken ct)
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return ApiResponse.Error("Người dùng chưa đăng nhập", 401);
            }

            var user = await _ctx.NguoiDungs
                .Include(n => n.MaVaiTroNavigation)
                .Include(n => n.BacSi)
                .Include(n => n.QuanLy)
                .FirstOrDefaultAsync(n => n.MaNguoiDung == userId && n.IsDelete != true, ct);

            if (user == null)
            {
                return ApiResponse.Error("Không tìm thấy thông tin người dùng", 404);
            }

            // Query trực tiếp từ bảng ThongTinNguoiDungs
            var healthInfo = await _ctx.ThongTinNguoiDungs
                .FirstOrDefaultAsync(t => t.MaNguoiDung == userId && t.IsDelete != true, ct);
            
            // Nếu chưa có ThongTinNguoiDung, tạo mới
            if (healthInfo == null)
            {
                healthInfo = new ThongTinNguoiDung
                {
                    MaThongTin = Guid.NewGuid().ToString("N"),
                    MaNguoiDung = user.MaNguoiDung,
                    ChieuCao = null,
                    CanNang = null,
                    Bmi = null,
                    NhomMau = null,
                    BenhNen = null,
                    DiUng = null,
                    ThuocDangDung = null,
                    TinhTrangMangThai = null,
                    NgayKhamGanNhat = null,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };
                
                _ctx.ThongTinNguoiDungs.Add(healthInfo);
                await _ctx.SaveChangesAsync(ct);
            }

            var healthInfoDto = new HealthInfoDto(
                healthInfo.MaThongTin,
                healthInfo.ChieuCao,
                healthInfo.CanNang,
                healthInfo.Bmi,
                healthInfo.NhomMau,
                healthInfo.BenhNen,
                healthInfo.DiUng,
                healthInfo.ThuocDangDung,
                healthInfo.TinhTrangMangThai,
                healthInfo.NgayKhamGanNhat
            );

            // Tạo thông tin theo vai trò
            object? roleInfo = null;
            switch (user.MaVaiTro)
            {
                case "VT001": // USER
                    roleInfo = new UserHealthInfoDto(
                        healthInfo.MaThongTin,
                        healthInfo.ChieuCao,
                        healthInfo.CanNang,
                        healthInfo.Bmi,
                        healthInfo.NhomMau,
                        healthInfo.BenhNen,
                        healthInfo.DiUng,
                        healthInfo.ThuocDangDung,
                        healthInfo.TinhTrangMangThai,
                        healthInfo.NgayKhamGanNhat
                    );
                    break;
                    
                case "VT002": // DOCTOR
                    if (user.BacSi != null)
                    {
                        roleInfo = new BacSiInfoDto(
                            user.BacSi.MaBacSi,
                            user.BacSi.ChuyenMon,
                            user.BacSi.SoGiayPhep,
                            user.BacSi.MaDiaDiem
                        );
                    }
                    break;
                    
                case "VT003": // MANAGER
                    if (user.QuanLy != null)
                    {
                        roleInfo = new QuanLyInfoDto(
                            user.QuanLy.MaQuanLy
                        );
                    }
                    break;
            }

            var profile = new UserCompleteProfileDto(
                user.MaNguoiDung,
                user.Ten,
                user.Email,
                user.SoDienThoai,
                user.NgaySinh,
                user.DiaChi,
                user.MaVaiTro,
                user.NgayTao,
                user.MaAnh,
                user.IsActive,
                roleInfo
            );

            return ApiResponse.Success("Lấy thông tin profile thành công", profile);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy thông tin profile: {ex}");
        }
    }

    /* ---------- 2. Cập nhật thông tin cá nhân ---------- */
    [HttpPut("profile")]
    [ConfigAuthorize]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UserProfileUpdateDto dto,
        CancellationToken ct)
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return ApiResponse.Error("Người dùng chưa đăng nhập", 401);
            }

            var user = await _ctx.NguoiDungs
                .Include(n => n.BacSi)
                .Include(n => n.QuanLy)
                .FirstOrDefaultAsync(n => n.MaNguoiDung == userId && n.IsDelete != true, ct);

            if (user == null)
            {
                return ApiResponse.Error("Không tìm thấy thông tin người dùng", 404);
            }

            // Cập nhật thông tin cơ bản
            if (!string.IsNullOrEmpty(dto.Ten))
                user.Ten = dto.Ten;
            
            if (!string.IsNullOrEmpty(dto.SoDienThoai))
                user.SoDienThoai = dto.SoDienThoai;
            
            if (dto.NgaySinh.HasValue)
                user.NgaySinh = dto.NgaySinh;
            
            if (!string.IsNullOrEmpty(dto.DiaChi))
                user.DiaChi = dto.DiaChi;

            // Cập nhật ảnh đại diện nếu có
            if (!string.IsNullOrEmpty(dto.MaAnh))
                user.MaAnh = dto.MaAnh;

            user.NgayCapNhat = DateTime.UtcNow;

            // Cập nhật thông tin theo vai trò
            switch (user.MaVaiTro)
            {
                case "VT002": // DOCTOR
                    if (user.BacSi != null && dto.BacSiInfo != null)
                    {
                        user.BacSi.ChuyenMon = dto.BacSiInfo.ChuyenMon ?? user.BacSi.ChuyenMon;
                        user.BacSi.SoGiayPhep = dto.BacSiInfo.SoGiayPhep ?? user.BacSi.SoGiayPhep;
                        user.BacSi.NgayCapNhat = DateTime.UtcNow;
                    }
                    break;
                    
                case "VT003": // MANAGER
                    // Manager có thể có thông tin bác sĩ (nếu trước đó là bác sĩ)
                    if (user.BacSi != null && dto.BacSiInfo != null)
                    {
                        user.BacSi.ChuyenMon = dto.BacSiInfo.ChuyenMon ?? user.BacSi.ChuyenMon;
                        user.BacSi.SoGiayPhep = dto.BacSiInfo.SoGiayPhep ?? user.BacSi.SoGiayPhep;
                        user.BacSi.NgayCapNhat = DateTime.UtcNow;
                    }
                    // Manager không có thông tin riêng trong bảng QuanLy, chỉ là vai trò
                    break;
                    
                case "VT001": // USER
                default:
                    // User thường chỉ cập nhật thông tin cơ bản
                    break;
            }

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật thông tin cá nhân thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật thông tin cá nhân: {ex.Message}", 500);
        }
    }

    /* ---------- 3. Cập nhật thông tin sức khỏe ---------- */
    [HttpPut("health-info")]
    [ConfigAuthorize]
    public async Task<IActionResult> UpdateHealthInfo(
        [FromBody] HealthInfoUpdateDto dto,
        CancellationToken ct)
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return ApiResponse.Error("Người dùng chưa đăng nhập", 401);
            }

            var healthInfo = await _ctx.ThongTinNguoiDungs
                .FirstOrDefaultAsync(t => t.MaNguoiDung == userId && t.IsDelete != true, ct);

            if (healthInfo == null)
            {
                // Tạo mới nếu chưa có
                healthInfo = new ThongTinNguoiDung
                {
                    MaThongTin = Guid.NewGuid().ToString("N"),
                    MaNguoiDung = userId,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow
                };
                _ctx.ThongTinNguoiDungs.Add(healthInfo);
            }

            // Cập nhật thông tin sức khỏe
            if (dto.ChieuCao.HasValue)
                healthInfo.ChieuCao = dto.ChieuCao;
            
            if (dto.CanNang.HasValue)
                healthInfo.CanNang = dto.CanNang;
            
            if (!string.IsNullOrEmpty(dto.NhomMau))
                healthInfo.NhomMau = dto.NhomMau;
            
            if (!string.IsNullOrEmpty(dto.BenhNen))
                healthInfo.BenhNen = dto.BenhNen;
            
            if (!string.IsNullOrEmpty(dto.DiUng))
                healthInfo.DiUng = dto.DiUng;
            
            if (!string.IsNullOrEmpty(dto.ThuocDangDung))
                healthInfo.ThuocDangDung = dto.ThuocDangDung;
            
            if (dto.TinhTrangMangThai.HasValue)
                healthInfo.TinhTrangMangThai = dto.TinhTrangMangThai;
            
            if (dto.NgayKhamGanNhat.HasValue)
                healthInfo.NgayKhamGanNhat = dto.NgayKhamGanNhat;

            // Tính BMI nếu có chiều cao và cân nặng
            if (dto.ChieuCao.HasValue && dto.CanNang.HasValue)
            {
                var heightInMeters = dto.ChieuCao.Value / 100;
                healthInfo.Bmi = Math.Round(dto.CanNang.Value / (heightInMeters * heightInMeters), 2);
            }

            healthInfo.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật thông tin sức khỏe thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật thông tin sức khỏe: {ex.Message}", 500);
        }
    }

    /* ---------- 4. Đổi mật khẩu ---------- */
    [HttpPut("change-password")]
    [ConfigAuthorize]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordDto dto,
        CancellationToken ct)
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return ApiResponse.Error("Người dùng chưa đăng nhập", 401);
            }

            var user = await _ctx.NguoiDungs
                .FirstOrDefaultAsync(n => n.MaNguoiDung == userId && n.IsDelete != true, ct);

            if (user == null)
            {
                return ApiResponse.Error("Không tìm thấy thông tin người dùng", 404);
            }

            // Kiểm tra mật khẩu cũ
            if (user.MatKhau != dto.OldPassword)
            {
                return ApiResponse.Error("Mật khẩu cũ không đúng", 400);
            }

            // Cập nhật mật khẩu mới
            user.MatKhau = dto.NewPassword;
            user.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Đổi mật khẩu thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi đổi mật khẩu: {ex.Message}", 500);
        }
    }

    /* ---------- 5. Lấy danh sách tất cả người dùng (cho admin) ---------- */
    [HttpGet]
    [ConfigAuthorize]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? roleId = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _ctx.NguoiDungs
                .Include(n => n.MaVaiTroNavigation)
                .Where(n => n.IsDelete != true);

            // Apply search filter
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(n => 
                    n.Ten.Contains(search) || 
                    n.Email.Contains(search) || 
                    n.SoDienThoai.Contains(search) ||
                    n.MaVaiTroNavigation.TenVaiTro.Contains(search)
                );
            }

            // Apply role filter
            if (!string.IsNullOrEmpty(roleId))
            {
                query = query.Where(n => n.MaVaiTro == roleId);
            }

            var totalCount = await query.CountAsync(ct);
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var users = await query
                .OrderBy(n => n.Ten)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(n => new UserDto(
                    n.MaNguoiDung,
                    n.Ten,
                    n.Email,
                    n.SoDienThoai,
                    n.NgaySinh,
                    n.DiaChi,
                    n.GioiTinh,
                    n.MaVaiTro
                ))
                .ToListAsync(ct);

            var result = new PagedResultDto<UserDto>
            (            
                totalCount,
                page,
                pageSize,
                totalPages,
                users
            );

            return ApiResponse.Success("Lấy danh sách người dùng thành công", result);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách người dùng: {ex.Message}", 500);
        }
    }

    /* ---------- 6. Lấy thông tin người dùng theo ID (cho admin) ---------- */
    [HttpGet("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> GetUserById(string id, CancellationToken ct)
    {
        try
        {
            var user = await _ctx.NguoiDungs
                .Include(n => n.MaVaiTroNavigation)
                .Include(n => n.BacSi)
                .Include(n => n.QuanLy)
                .FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.IsDelete != true, ct);

            if (user == null)
            {
                return ApiResponse.Error("Không tìm thấy người dùng", 404);
            }

            // Query trực tiếp từ bảng ThongTinNguoiDungs
            var healthInfo = await _ctx.ThongTinNguoiDungs
                .FirstOrDefaultAsync(t => t.MaNguoiDung == id && t.IsDelete != true, ct);
            
            // Nếu chưa có ThongTinNguoiDung, tạo mới
            if (healthInfo == null)
            {
                healthInfo = new ThongTinNguoiDung
                {
                    MaThongTin = Guid.NewGuid().ToString("N"),
                    MaNguoiDung = user.MaNguoiDung,
                    ChieuCao = null,
                    CanNang = null,
                    Bmi = null,
                    NhomMau = null,
                    BenhNen = null,
                    DiUng = null,
                    ThuocDangDung = null,
                    TinhTrangMangThai = null,
                    NgayKhamGanNhat = null,
                    IsActive = true,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };
                
                _ctx.ThongTinNguoiDungs.Add(healthInfo);
                await _ctx.SaveChangesAsync(ct);
            }

            var healthInfoDto = new HealthInfoDto(
                healthInfo.MaThongTin,
                healthInfo.ChieuCao,
                healthInfo.CanNang,
                healthInfo.Bmi,
                healthInfo.NhomMau,
                healthInfo.BenhNen,
                healthInfo.DiUng,
                healthInfo.ThuocDangDung,
                healthInfo.TinhTrangMangThai,
                healthInfo.NgayKhamGanNhat
            );

            // Tạo thông tin theo vai trò
            object? roleInfo = null;
            switch (user.MaVaiTro)
            {
                case "VT001": // USER
                    roleInfo = new UserHealthInfoDto(
                        healthInfo.MaThongTin,
                        healthInfo.ChieuCao,
                        healthInfo.CanNang,
                        healthInfo.Bmi,
                        healthInfo.NhomMau,
                        healthInfo.BenhNen,
                        healthInfo.DiUng,
                        healthInfo.ThuocDangDung,
                        healthInfo.TinhTrangMangThai,
                        healthInfo.NgayKhamGanNhat
                    );
                    break;
                    
                case "VT002": // DOCTOR
                    if (user.BacSi != null)
                    {
                        roleInfo = new BacSiInfoDto(
                            user.BacSi.MaBacSi,
                            user.BacSi.ChuyenMon,
                            user.BacSi.SoGiayPhep,
                            user.BacSi.MaDiaDiem
                        );
                    }
                    break;
                    
                case "VT003": // MANAGER
                    if (user.QuanLy != null)
                    {
                        roleInfo = new QuanLyInfoDto(
                            user.QuanLy.MaQuanLy
                        );
                    }
                    break;
            }

            var profile = new UserCompleteProfileDto(
                user.MaNguoiDung,
                user.Ten,
                user.Email,
                user.SoDienThoai,
                user.NgaySinh,
                user.DiaChi,
                user.MaVaiTro,
                user.NgayTao,
                user.MaAnh,
                user.IsActive,
                roleInfo
            );

            return ApiResponse.Success("Lấy thông tin người dùng thành công", profile);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy thông tin người dùng: {ex.Message}", 500);
        }
    }

    /* ---------- 7. Cập nhật thông tin người dùng theo ID (cho admin) ---------- */
    [HttpPut("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> UpdateUserById(
        string id,
        [FromBody] UserProfileUpdateDto dto,
        CancellationToken ct)
    {
        try
        {
            var user = await _ctx.NguoiDungs
                .Include(n => n.BacSi)
                .Include(n => n.QuanLy)
                .FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.IsDelete != true, ct);

            if (user == null)
            {
                return ApiResponse.Error("Không tìm thấy người dùng", 404);
            }

            // Cập nhật thông tin cơ bản
            if (!string.IsNullOrEmpty(dto.Ten))
                user.Ten = dto.Ten;
            
            if (!string.IsNullOrEmpty(dto.SoDienThoai))
                user.SoDienThoai = dto.SoDienThoai;
            
            if (dto.NgaySinh.HasValue)
                user.NgaySinh = dto.NgaySinh;
            
            if (!string.IsNullOrEmpty(dto.DiaChi))
                user.DiaChi = dto.DiaChi;

            if (dto.IsActive.HasValue)
                user.IsActive = dto.IsActive.Value;

            // Cập nhật ảnh đại diện nếu có
            if (!string.IsNullOrEmpty(dto.MaAnh))
                user.MaAnh = dto.MaAnh;

            user.NgayCapNhat = DateTime.UtcNow;

            // Cập nhật thông tin theo vai trò
            switch (user.MaVaiTro)
            {
                case "VT002": // DOCTOR
                    if (user.BacSi != null && dto.BacSiInfo != null)
                    {
                        user.BacSi.ChuyenMon = dto.BacSiInfo.ChuyenMon ?? user.BacSi.ChuyenMon;
                        user.BacSi.SoGiayPhep = dto.BacSiInfo.SoGiayPhep ?? user.BacSi.SoGiayPhep;
                        user.BacSi.MaDiaDiem = dto.BacSiInfo.MaDiaDiem ?? user.BacSi.MaDiaDiem;
                        user.BacSi.NgayCapNhat = DateTime.UtcNow;
                    }
                    break;
                    
                case "VT003": // MANAGER
                    // Manager có thể có thông tin bác sĩ (nếu trước đó là bác sĩ)
                    if (user.BacSi != null && dto.BacSiInfo != null)
                    {
                        user.BacSi.ChuyenMon = dto.BacSiInfo.ChuyenMon ?? user.BacSi.ChuyenMon;
                        user.BacSi.SoGiayPhep = dto.BacSiInfo.SoGiayPhep ?? user.BacSi.SoGiayPhep;
                        user.BacSi.MaDiaDiem = dto.BacSiInfo.MaDiaDiem ?? user.BacSi.MaDiaDiem;
                        user.BacSi.NgayCapNhat = DateTime.UtcNow;
                    }
                    // Manager không có thông tin riêng trong bảng QuanLy, chỉ là vai trò
                    break;
                    
                case "VT001": // USER
                default:
                    // User thường chỉ cập nhật thông tin cơ bản
                    break;
            }

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Cập nhật thông tin người dùng thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi cập nhật thông tin người dùng: {ex.Message}", 500);
        }
    }

    /* ---------- 8. Xóa người dùng theo ID (cho admin) ---------- */
    [HttpDelete("{id}")]
    [ConfigAuthorize]
    public async Task<IActionResult> DeleteUserById(string id, CancellationToken ct)
    {
        try
        {
            var user = await _ctx.NguoiDungs
                .FirstOrDefaultAsync(n => n.MaNguoiDung == id && n.IsDelete != true, ct);

            if (user == null)
            {
                return ApiResponse.Error("Không tìm thấy người dùng", 404);
            }

            // Soft delete
            user.IsDelete = true;
            user.NgayCapNhat = DateTime.UtcNow;

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Xóa người dùng thành công", null);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi xóa người dùng: {ex.Message}", 500);
        }
    }
}

// DTO cho đổi mật khẩu
public record ChangePasswordDto(
    string OldPassword,
    string NewPassword
);

public record CreateDoctorDto(
    string Ten,
    string Email,
    string SoDienThoai,
    string MatKhau,
    string MaVaiTro,
    string MaDiaDiem,
    string ChuyenMon,
    string SoGiayPhep,
    DateOnly NgaySinh,
    string GioiTinh,
    string DiaChi
);
public record CreateManagerDto(
    string Ten,
    string Email,
    string SoDienThoai,
    string MatKhau,
    string MaVaiTro,
    DateOnly NgaySinh,
    string GioiTinh,
    string DiaChi
);