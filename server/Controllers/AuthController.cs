using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.Models;
using server.ModelViews;
using BCrypt.Net;
using server.Helpers;
using server.DTOs.Auth;
using server.DTOs.NguoiDung;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers
{
    [Controller]
    [Route("api/[Controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly HeThongQuanLyTiemChungContext _context;
        private readonly IConfiguration _config;
        private readonly string _secretKey = "QuanLyTiemChungSuperSecretKey2023!@";

        public AuthController(ILogger<AuthController> logger, HeThongQuanLyTiemChungContext context, IConfiguration config)
        {
            _logger = logger;
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken ct)
        {
            // 1. Kiểm tra trùng lặp
            if (await _context.NguoiDungs.AnyAsync(u => u.Email == dto.Email, ct))
                return ApiResponse.Error("Email đã tồn tại", 409);

            if (await _context.NguoiDungs.AnyAsync(u => u.SoDienThoai == dto.SoDienThoai, ct))
                return ApiResponse.Error("Số điện thoại đã tồn tại", 409);

            var vaiTro = await _context.VaiTros.FirstOrDefaultAsync(v => v.TenVaiTro == "USER", ct);
            if (vaiTro == null)
                return ApiResponse.Error("Vai trò USER không tồn tại", 400);

            // 2. Tạo user
            var user = new NguoiDung
            {
                MaNguoiDung = Guid.NewGuid().ToString(),
                Ten = dto.Ten,
                Email = dto.Email,
                MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.MatKhau),
                SoDienThoai = dto.SoDienThoai,
                NgaySinh = dto.NgaySinh,
                DiaChi = dto.DiaChi,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow,
                MaVaiTro = vaiTro.MaVaiTro
            };

            _context.NguoiDungs.Add(user);
            await _context.SaveChangesAsync(ct);
            var userDto = new UserDto(
                user.MaNguoiDung,
                user.Ten,
                user.Email,
                user.SoDienThoai,
                user.NgaySinh,
                user.DiaChi,
                user.MaVaiTro
            );
            // 3. Trả về 201 Created
            return ApiResponse.Success("Tạo mới tài khoản thành công", userDto, 201);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken ct)
        {
            try
            {
                var user = await _context.NguoiDungs
                    .FirstOrDefaultAsync(u =>
                        u.Email == dto.Email &&
                        u.IsActive == true &&
                        u.IsDelete == false, ct);

                if (user == null || !BCrypt.Net.BCrypt.Verify(dto.MatKhau, user.MatKhau))
                    return ApiResponse.Error("Email hoặc mật khẩu không đúng", 401);

                var (accessToken, refreshToken) = await GenerateTokensAsync(user, ct);

                var tokenData = new TokenResponseDto(
                    AccessToken: accessToken,
                    RefreshToken: refreshToken,
                    ExpiresAt: DateTime.UtcNow.AddMinutes(GetAccessTokenExpiryInMinutes()),
                    UserId: user.MaNguoiDung);

                return ApiResponse.Success("Đăng nhập thành công", tokenData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đăng nhập");
                return ApiResponse.Error("Đã xảy ra lỗi hệ thống", 500);
            }
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto request, CancellationToken ct)
        {
            try
            {
                var session = await _context.PhienDangNhaps
                    .Include(p => p.MaNguoiDungNavigation)
                    .FirstOrDefaultAsync(p =>
                        p.RefreshToken == request.RefreshToken &&
                        p.ThoiHanRefresh > DateTime.UtcNow &&
                        p.IsActive == true &&
                        p.IsDelete == false, ct);

                if (session == null)
                    return ApiResponse.Error("Refresh token không hợp lệ hoặc đã hết hạn", 401);

                // Thu hồi token cũ
                session.IsActive = false;
                _context.PhienDangNhaps.Update(session);

                // Sinh cặp token mới
                var (newAccessToken, newRefreshToken) =
                    await GenerateTokensAsync(session.MaNguoiDungNavigation, ct);

                var tokenData = new TokenResponseDto(
                    AccessToken: newAccessToken,
                    RefreshToken: newRefreshToken,
                    ExpiresAt: DateTime.UtcNow.AddMinutes(GetAccessTokenExpiryInMinutes()),
                    UserId: session.MaNguoiDung);

                return ApiResponse.Success("Làm mới token thành công", tokenData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi refresh token");
                return ApiResponse.Error("Đã xảy ra lỗi hệ thống", 500);
            }
        }
        #region private helpers
        private async Task<(string AccessToken, string RefreshToken)> GenerateTokensAsync(NguoiDung user, CancellationToken ct)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.MaNguoiDung),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.MaNguoiDung),
                new Claim(ClaimTypes.Role, user.MaVaiTro)
            };

            var accessTokenExpiry = DateTime.UtcNow.AddMinutes(GetAccessTokenExpiryInMinutes());
            var jwt = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: accessTokenExpiry,
                signingCredentials: creds);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);

            var refreshToken = Guid.NewGuid().ToString("N");
            var refreshExpiry = DateTime.UtcNow.AddDays(GetRefreshTokenExpiryInDays());

            var session = new PhienDangNhap
            {
                MaPhien = Guid.NewGuid().ToString(),
                MaNguoiDung = user.MaNguoiDung,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ThoiHan = accessTokenExpiry,
                ThoiHanRefresh = refreshExpiry,
                IsActive = true,
                IsDelete = false,
                NgayTao = DateTime.UtcNow
            };

            _context.PhienDangNhaps.Add(session);
            await _context.SaveChangesAsync(ct);

            return (accessToken, refreshToken);
        }

        private int GetAccessTokenExpiryInMinutes() =>
            int.Parse(_config["Jwt:AccessTokenExpiryMinutes"] ?? "15");

        private int GetRefreshTokenExpiryInDays() =>
            int.Parse(_config["Jwt:RefreshTokenExpiryDays"] ?? "7");
        #endregion
    }   
}