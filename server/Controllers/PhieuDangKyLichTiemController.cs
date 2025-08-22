using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.DTOs;
using server.ModelViews;
using server.Helpers;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhieuDangKyLichTiemController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;
    private readonly ILogger<PhieuDangKyLichTiemController> _logger;

    public PhieuDangKyLichTiemController(HeThongQuanLyTiemChungContext context, ILogger<PhieuDangKyLichTiemController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/PhieuDangKyLichTiem
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var query = from p in _context.PhieuDangKyLichTiems
                        join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                        join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                        join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                        join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                        where p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDichVu = p.MaDichVu,
                            MaBacSi = p.MaBacSi,
                            NgayDangKy = p.NgayDangKy,
                            NgayHenTiem = p.NgayHenTiem,
                            GioHenTiem = p.GioHenTiem,
                            TrangThai = p.TrangThai,
                            LyDoTuChoi = p.LyDoTuChoi,
                            GhiChu = p.GhiChu,
                            IsDelete = p.IsDelete,
                            IsActive = p.IsActive,
                            NgayTao = p.NgayTao,
                            NgayCapNhat = p.NgayCapNhat,
                            TenKhachHang = kh.Ten,
                            SoDienThoaiKhachHang = kh.SoDienThoai,
                            EmailKhachHang = kh.Email,
                            TenDichVu = dv.Ten,
                            TenBacSi = nd.Ten
                        };

            var phieuDangKys = await query.ToListAsync();

            return ApiResponse.Success("Lấy danh sách phiếu đăng ký lịch tiêm thành công", phieuDangKys);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi lấy danh sách phiếu đăng ký lịch tiêm");
        }
    }

    // GET: api/PhieuDangKyLichTiem/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var phieuDangKy = await (from p in _context.PhieuDangKyLichTiems
                                    join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                                    join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                                    join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                                    join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                                    where p.MaPhieuDangKy == id && p.IsDelete != true && p.IsActive == true
                                    select new PhieuDangKyLichTiemVM
                                    {
                                        MaPhieuDangKy = p.MaPhieuDangKy,
                                        MaKhachHang = p.MaKhachHang,
                                        MaDichVu = p.MaDichVu,
                                        MaBacSi = p.MaBacSi,
                                        NgayDangKy = p.NgayDangKy,
                                        NgayHenTiem = p.NgayHenTiem,
                                        GioHenTiem = p.GioHenTiem,
                                        TrangThai = p.TrangThai,
                                        LyDoTuChoi = p.LyDoTuChoi,
                                        GhiChu = p.GhiChu,
                                        IsDelete = p.IsDelete,
                                        IsActive = p.IsActive,
                                        NgayTao = p.NgayTao,
                                        NgayCapNhat = p.NgayCapNhat,
                                        TenKhachHang = kh.Ten,
                                        SoDienThoaiKhachHang = kh.SoDienThoai,
                                        EmailKhachHang = kh.Email,
                                        TenDichVu = dv.Ten,
                                        TenBacSi = nd.Ten
                                    }).FirstOrDefaultAsync();

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

    // GET: api/PhieuDangKyLichTiem/ByKhachHang/{maKhachHang}
    [HttpGet("ByKhachHang/{maKhachHang}")]
    public async Task<IActionResult> GetByKhachHang(string maKhachHang)
    {
        try
        {
            var query = from p in _context.PhieuDangKyLichTiems
                        join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                        join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                        join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                        join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                        where p.MaKhachHang == maKhachHang && p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDichVu = p.MaDichVu,
                            MaBacSi = p.MaBacSi,
                            NgayDangKy = p.NgayDangKy,
                            NgayHenTiem = p.NgayHenTiem,
                            GioHenTiem = p.GioHenTiem,
                            TrangThai = p.TrangThai,
                            LyDoTuChoi = p.LyDoTuChoi,
                            GhiChu = p.GhiChu,
                            IsDelete = p.IsDelete,
                            IsActive = p.IsActive,
                            NgayTao = p.NgayTao,
                            NgayCapNhat = p.NgayCapNhat,
                            TenKhachHang = kh.Ten,
                            SoDienThoaiKhachHang = kh.SoDienThoai,
                            EmailKhachHang = kh.Email,
                            TenDichVu = dv.Ten,
                            TenBacSi = nd.Ten
                        };

            var phieuDangKys = await query.ToListAsync();

            return ApiResponse.Success("Lấy danh sách phiếu đăng ký lịch tiêm theo khách hàng thành công", phieuDangKys);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu đăng ký lịch tiêm theo khách hàng");
            return ApiResponse.Error("Lỗi server khi lấy danh sách phiếu đăng ký lịch tiêm theo khách hàng");
        }
    }

    // GET: api/PhieuDangKyLichTiem/ByBacSi/{maBacSi}
    [HttpGet("ByBacSi/{maBacSi}")]
    public async Task<IActionResult> GetByBacSi(string maBacSi)
    {
        try
        {
            var query = from p in _context.PhieuDangKyLichTiems
                        join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                        join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                        join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                        join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                        where p.MaBacSi == maBacSi && p.IsDelete != true && p.IsActive == true
                        select new PhieuDangKyLichTiemVM
                        {
                            MaPhieuDangKy = p.MaPhieuDangKy,
                            MaKhachHang = p.MaKhachHang,
                            MaDichVu = p.MaDichVu,
                            MaBacSi = p.MaBacSi,
                            NgayDangKy = p.NgayDangKy,
                            NgayHenTiem = p.NgayHenTiem,
                            GioHenTiem = p.GioHenTiem,
                            TrangThai = p.TrangThai,
                            LyDoTuChoi = p.LyDoTuChoi,
                            GhiChu = p.GhiChu,
                            IsDelete = p.IsDelete,
                            IsActive = p.IsActive,
                            NgayTao = p.NgayTao,
                            NgayCapNhat = p.NgayCapNhat,
                            TenKhachHang = kh.Ten,
                            SoDienThoaiKhachHang = kh.SoDienThoai,
                            EmailKhachHang = kh.Email,
                            TenDichVu = dv.Ten,
                            TenBacSi = nd.Ten
                        };

            var phieuDangKys = await query.ToListAsync();

            return ApiResponse.Success("Lấy danh sách phiếu đăng ký lịch tiêm theo bác sĩ thành công", phieuDangKys);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách phiếu đăng ký lịch tiêm theo bác sĩ");
            return ApiResponse.Error("Lỗi server khi lấy danh sách phiếu đăng ký lịch tiêm theo bác sĩ");
        }
    }

    // POST: api/PhieuDangKyLichTiem
    [HttpPost]
    public async Task<IActionResult> Create(CreatePhieuDangKyLichTiemDto createDto)
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
                MaBacSi = createDto.MaBacSi,
                NgayDangKy = DateTime.Now,
                NgayHenTiem = createDto.NgayHenTiem,
                GioHenTiem = createDto.GioHenTiem,
                TrangThai = "Chờ duyệt",
                GhiChu = createDto.GhiChu,
                IsDelete = false,
                IsActive = true,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            _context.PhieuDangKyLichTiems.Add(phieuDangKy);
            await _context.SaveChangesAsync();

            // Lấy thông tin đầy đủ để trả về
            var result = await (from p in _context.PhieuDangKyLichTiems
                               join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                               join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                               join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                               join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                               where p.MaPhieuDangKy == phieuDangKy.MaPhieuDangKy
                               select new PhieuDangKyLichTiemVM
                               {
                                   MaPhieuDangKy = p.MaPhieuDangKy,
                                   MaKhachHang = p.MaKhachHang,
                                   MaDichVu = p.MaDichVu,
                                   MaBacSi = p.MaBacSi,
                                   NgayDangKy = p.NgayDangKy,
                                   NgayHenTiem = p.NgayHenTiem,
                                   GioHenTiem = p.GioHenTiem,
                                   TrangThai = p.TrangThai,
                                   LyDoTuChoi = p.LyDoTuChoi,
                                   GhiChu = p.GhiChu,
                                   IsDelete = p.IsDelete,
                                   IsActive = p.IsActive,
                                   NgayTao = p.NgayTao,
                                   NgayCapNhat = p.NgayCapNhat,
                                   TenKhachHang = kh.Ten,
                                   SoDienThoaiKhachHang = kh.SoDienThoai,
                                   EmailKhachHang = kh.Email,
                                   TenDichVu = dv.Ten,
                                   TenBacSi = nd.Ten
                               }).FirstOrDefaultAsync();

            return CreatedAtAction(nameof(GetById), new { id = phieuDangKy.MaPhieuDangKy }, 
                ApiResponse.Success("Tạo phiếu đăng ký lịch tiêm thành công", result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi tạo phiếu đăng ký lịch tiêm");
        }
    }

    // PUT: api/PhieuDangKyLichTiem/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdatePhieuDangKyLichTiemDto updateDto)
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
            if (updateDto.NgayHenTiem.HasValue)
                phieuDangKy.NgayHenTiem = updateDto.NgayHenTiem.Value;
            if (!string.IsNullOrEmpty(updateDto.GioHenTiem))
                phieuDangKy.GioHenTiem = updateDto.GioHenTiem;
            if (!string.IsNullOrEmpty(updateDto.GhiChu))
                phieuDangKy.GhiChu = updateDto.GhiChu;

            phieuDangKy.NgayCapNhat = DateTime.Now;

            _context.PhieuDangKyLichTiems.Update(phieuDangKy);
            await _context.SaveChangesAsync();

            // Lấy thông tin đầy đủ để trả về
            var result = await (from p in _context.PhieuDangKyLichTiems
                               join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                               join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                               join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                               join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                               where p.MaPhieuDangKy == id
                               select new PhieuDangKyLichTiemVM
                               {
                                   MaPhieuDangKy = p.MaPhieuDangKy,
                                   MaKhachHang = p.MaKhachHang,
                                   MaDichVu = p.MaDichVu,
                                   MaBacSi = p.MaBacSi,
                                   NgayDangKy = p.NgayDangKy,
                                   NgayHenTiem = p.NgayHenTiem,
                                   GioHenTiem = p.GioHenTiem,
                                   TrangThai = p.TrangThai,
                                   LyDoTuChoi = p.LyDoTuChoi,
                                   GhiChu = p.GhiChu,
                                   IsDelete = p.IsDelete,
                                   IsActive = p.IsActive,
                                   NgayTao = p.NgayTao,
                                   NgayCapNhat = p.NgayCapNhat,
                                   TenKhachHang = kh.Ten,
                                   SoDienThoaiKhachHang = kh.SoDienThoai,
                                   EmailKhachHang = kh.Email,
                                   TenDichVu = dv.Ten,
                                   TenBacSi = nd.Ten
                               }).FirstOrDefaultAsync();

            return ApiResponse.Success("Cập nhật phiếu đăng ký lịch tiêm thành công", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi cập nhật phiếu đăng ký lịch tiêm");
        }
    }

    // PUT: api/PhieuDangKyLichTiem/5/Duyet
    [HttpPut("{id}/Duyet")]
    public async Task<IActionResult> DuyetPhieu(string id, DuyetPhieuDto duyetDto)
    {
        try
        {
            var phieuDangKy = await _context.PhieuDangKyLichTiems.FindAsync(id);
            if (phieuDangKy == null)
            {
                return ApiResponse.Error("Không tìm thấy phiếu đăng ký lịch tiêm");
            }

            if (phieuDangKy.TrangThai != "Chờ duyệt")
            {
                return ApiResponse.Error("Phiếu đăng ký không ở trạng thái chờ duyệt");
            }

            // Cập nhật trạng thái
            phieuDangKy.TrangThai = duyetDto.TrangThai;
            if (duyetDto.TrangThai == "Từ chối" && !string.IsNullOrEmpty(duyetDto.LyDoTuChoi))
            {
                phieuDangKy.LyDoTuChoi = duyetDto.LyDoTuChoi;
            }
            else
            {
                phieuDangKy.LyDoTuChoi = null;
            }

            phieuDangKy.NgayCapNhat = DateTime.Now;

            _context.PhieuDangKyLichTiems.Update(phieuDangKy);
            await _context.SaveChangesAsync();

            // Lấy thông tin đầy đủ để trả về
            var result = await (from p in _context.PhieuDangKyLichTiems
                               join kh in _context.NguoiDungs on p.MaKhachHang equals kh.MaNguoiDung
                               join dv in _context.DichVus on p.MaDichVu equals dv.MaDichVu
                               join bs in _context.BacSis on p.MaBacSi equals bs.MaBacSi
                               join nd in _context.NguoiDungs on bs.MaNguoiDung equals nd.MaNguoiDung
                               where p.MaPhieuDangKy == id
                               select new PhieuDangKyLichTiemVM
                               {
                                   MaPhieuDangKy = p.MaPhieuDangKy,
                                   MaKhachHang = p.MaKhachHang,
                                   MaDichVu = p.MaDichVu,
                                   MaBacSi = p.MaBacSi,
                                   NgayDangKy = p.NgayDangKy,
                                   NgayHenTiem = p.NgayHenTiem,
                                   GioHenTiem = p.GioHenTiem,
                                   TrangThai = p.TrangThai,
                                   LyDoTuChoi = p.LyDoTuChoi,
                                   GhiChu = p.GhiChu,
                                   IsDelete = p.IsDelete,
                                   IsActive = p.IsActive,
                                   NgayTao = p.NgayTao,
                                   NgayCapNhat = p.NgayCapNhat,
                                   TenKhachHang = kh.Ten,
                                   SoDienThoaiKhachHang = kh.SoDienThoai,
                                   EmailKhachHang = kh.Email,
                                   TenDichVu = dv.Ten,
                                   TenBacSi = nd.Ten
                               }).FirstOrDefaultAsync();

            return ApiResponse.Success($"Duyệt phiếu đăng ký lịch tiêm thành công - Trạng thái: {duyetDto.TrangThai}", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi duyệt phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi duyệt phiếu đăng ký lịch tiêm");
        }
    }

    // DELETE: api/PhieuDangKyLichTiem/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
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
            await _context.SaveChangesAsync();

            return ApiResponse.Success("Xóa phiếu đăng ký lịch tiêm thành công", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi xóa phiếu đăng ký lịch tiêm");
            return ApiResponse.Error("Lỗi server khi xóa phiếu đăng ký lịch tiêm");
        }
    }
} 