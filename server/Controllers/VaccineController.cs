using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.DTOs.Vaccine;
using server.Helpers;
using server.DTOs.Pagination;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VaccineController : ControllerBase
    {
        private readonly HeThongQuanLyTiemChungContext _context;

        public VaccineController(HeThongQuanLyTiemChungContext context)
        {
            _context = context;
        }

        // GET: api/Vaccine
        [HttpGet]
        public async Task<IActionResult> GetVaccines(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? manufacturer = null,
            [FromQuery] bool? isActive = null,
            CancellationToken ct = default)
        {
            try
            {
                var query = _context.Vaccines
                    .Where(v => v.IsDelete != true)
                    .AsQueryable();

                // Apply search filter
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(v => 
                        v.Ten.Contains(searchTerm) || 
                        v.NhaSanXuat.Contains(searchTerm) ||
                        v.PhongNgua.Contains(searchTerm));
                }

                // Apply manufacturer filter
                if (!string.IsNullOrEmpty(manufacturer))
                {
                    query = query.Where(v => v.NhaSanXuat == manufacturer);
                }

                // Apply active status filter
                if (isActive.HasValue)
                {
                    query = query.Where(v => v.IsActive == isActive.Value);
                }

                // Apply ordering
                query = query.OrderBy(v => v.Ten);

                // Apply pagination using ToPagedAsync
                var paged = await query.ToPagedAsync(page, pageSize, ct);

                // Map to DTOs
                var data = paged.Data.Select(v => new VaccineDto
                {
                    MaVaccine = v.MaVaccine,
                    Ten = v.Ten,
                    NhaSanXuat = v.NhaSanXuat,
                    TuoiBatDauTiem = v.TuoiBatDauTiem,
                    TuoiKetThucTiem = v.TuoiKetThucTiem,
                    HuongDanSuDung = v.HuongDanSuDung,
                    PhongNgua = v.PhongNgua,
                    IsActive = v.IsActive ?? true,
                    NgayTao = v.NgayTao,
                    NgayCapNhat = v.NgayCapNhat
                }).ToList();

                var result = new PagedResultDto<VaccineDto>(
                    paged.TotalCount,
                    paged.Page,
                    paged.PageSize,
                    paged.TotalPages,
                    data);

                return ApiResponse.Success("Lấy danh sách vaccine thành công", result);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error($"Lỗi khi lấy danh sách vaccine: {ex.Message}");
            }
        }

        // GET: api/Vaccine/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVaccine(string id, CancellationToken ct = default)
        {
            try
            {
                var vaccine = await _context.Vaccines
                    .Where(v => v.MaVaccine == id && v.IsDelete != true)
                    .Select(v => new VaccineDto
                    {
                        MaVaccine = v.MaVaccine,
                        Ten = v.Ten,
                        NhaSanXuat = v.NhaSanXuat,
                        TuoiBatDauTiem = v.TuoiBatDauTiem,
                        TuoiKetThucTiem = v.TuoiKetThucTiem,
                        HuongDanSuDung = v.HuongDanSuDung,
                        PhongNgua = v.PhongNgua,
                        IsActive = v.IsActive ?? true,
                        NgayTao = v.NgayTao,
                        NgayCapNhat = v.NgayCapNhat
                    })
                    .FirstOrDefaultAsync(ct);

                if (vaccine == null)
                {
                    return ApiResponse.Error("Không tìm thấy vaccine", 404);
                }

                return ApiResponse.Success("Lấy thông tin vaccine thành công", vaccine);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error($"Lỗi khi lấy thông tin vaccine: {ex.Message}");
            }
        }

        // GET: api/Vaccine/active
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveVaccines(CancellationToken ct = default)
        {
            try
            {
                var vaccines = await _context.Vaccines
                    .Where(v => v.IsActive == true && v.IsDelete != true)
                    .OrderBy(v => v.Ten)
                    .Select(v => new VaccineDto
                    {
                        MaVaccine = v.MaVaccine,
                        Ten = v.Ten,
                        NhaSanXuat = v.NhaSanXuat,
                        TuoiBatDauTiem = v.TuoiBatDauTiem,
                        TuoiKetThucTiem = v.TuoiKetThucTiem,
                        HuongDanSuDung = v.HuongDanSuDung,
                        PhongNgua = v.PhongNgua,
                        IsActive = v.IsActive ?? true,
                        NgayTao = v.NgayTao,
                        NgayCapNhat = v.NgayCapNhat
                    })
                    .ToListAsync(ct);

                return ApiResponse.Success("Lấy danh sách vaccine hoạt động thành công", vaccines);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error($"Lỗi khi lấy danh sách vaccine hoạt động: {ex.Message}");
            }
        }

        // GET: api/Vaccine/manufacturers
        [HttpGet("manufacturers")]
        public async Task<IActionResult> GetManufacturers(CancellationToken ct = default)
        {
            try
            {
                var manufacturers = await _context.Vaccines
                    .Where(v => v.IsDelete != true && !string.IsNullOrEmpty(v.NhaSanXuat))
                    .Select(v => v.NhaSanXuat)
                    .Distinct()
                    .OrderBy(m => m)
                    .ToListAsync(ct);

                return ApiResponse.Success("Lấy danh sách nhà sản xuất thành công", manufacturers);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error($"Lỗi khi lấy danh sách nhà sản xuất: {ex.Message}");
            }
        }

        // POST: api/Vaccine
        [HttpPost]
        public async Task<IActionResult> CreateVaccine([FromBody] VaccineCreateRequest request, CancellationToken ct = default)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Ten))
                {
                    return ApiResponse.Error("Tên vaccine không được để trống");
                }

                // Check if vaccine name already exists
                var existingVaccine = await _context.Vaccines
                    .FirstOrDefaultAsync(v => v.Ten.ToLower() == request.Ten.ToLower() && v.IsDelete != true, ct);

                if (existingVaccine != null)
                {
                    return ApiResponse.Error("Tên vaccine đã tồn tại");
                }

                var vaccine = new Vaccine
                {
                    MaVaccine = Guid.NewGuid().ToString(),
                    Ten = request.Ten.Trim(),
                    NhaSanXuat = request.NhaSanXuat?.Trim(),
                    TuoiBatDauTiem = request.TuoiBatDauTiem,
                    TuoiKetThucTiem = request.TuoiKetThucTiem,
                    HuongDanSuDung = request.HuongDanSuDung?.Trim(),
                    PhongNgua = request.PhongNgua?.Trim(),
                    IsActive = request.IsActive,
                    IsDelete = false,
                    NgayTao = DateTime.UtcNow,
                    NgayCapNhat = DateTime.UtcNow
                };

                _context.Vaccines.Add(vaccine);
                await _context.SaveChangesAsync(ct);

                var vaccineDto = new VaccineDto
                {
                    MaVaccine = vaccine.MaVaccine,
                    Ten = vaccine.Ten,
                    NhaSanXuat = vaccine.NhaSanXuat,
                    TuoiBatDauTiem = vaccine.TuoiBatDauTiem,
                    TuoiKetThucTiem = vaccine.TuoiKetThucTiem,
                    HuongDanSuDung = vaccine.HuongDanSuDung,
                    PhongNgua = vaccine.PhongNgua,
                    IsActive = vaccine.IsActive ?? true,
                    NgayTao = vaccine.NgayTao,
                    NgayCapNhat = vaccine.NgayCapNhat
                };

                return ApiResponse.Success("Tạo vaccine thành công", vaccineDto, 201);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error($"Lỗi khi tạo vaccine: {ex.Message}");
            }
        }

        // PUT: api/Vaccine/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVaccine(string id, [FromBody] VaccineUpdateRequest request, CancellationToken ct = default)
        {
            try
            {
                var vaccine = await _context.Vaccines
                    .FirstOrDefaultAsync(v => v.MaVaccine == id && v.IsDelete != true, ct);

                if (vaccine == null)
                {
                    return ApiResponse.Error("Không tìm thấy vaccine", 404);
                }

                if (string.IsNullOrWhiteSpace(request.Ten))
                {
                    return ApiResponse.Error("Tên vaccine không được để trống");
                }

                // Check if vaccine name already exists (excluding current vaccine)
                var existingVaccine = await _context.Vaccines
                    .FirstOrDefaultAsync(v => v.Ten.ToLower() == request.Ten.ToLower() 
                                            && v.MaVaccine != id 
                                            && v.IsDelete != true, ct);

                if (existingVaccine != null)
                {
                    return ApiResponse.Error("Tên vaccine đã tồn tại");
                }

                // Update vaccine properties
                vaccine.Ten = request.Ten.Trim();
                vaccine.NhaSanXuat = request.NhaSanXuat?.Trim();
                vaccine.TuoiBatDauTiem = request.TuoiBatDauTiem;
                vaccine.TuoiKetThucTiem = request.TuoiKetThucTiem;
                vaccine.HuongDanSuDung = request.HuongDanSuDung?.Trim();
                vaccine.PhongNgua = request.PhongNgua?.Trim();
                vaccine.IsActive = request.IsActive ?? vaccine.IsActive;
                vaccine.NgayCapNhat = DateTime.UtcNow;

                await _context.SaveChangesAsync(ct);

                var vaccineDto = new VaccineDto
                {
                    MaVaccine = vaccine.MaVaccine,
                    Ten = vaccine.Ten,
                    NhaSanXuat = vaccine.NhaSanXuat,
                    TuoiBatDauTiem = vaccine.TuoiBatDauTiem,
                    TuoiKetThucTiem = vaccine.TuoiKetThucTiem,
                    HuongDanSuDung = vaccine.HuongDanSuDung,
                    PhongNgua = vaccine.PhongNgua,
                    IsActive = vaccine.IsActive ?? true,
                    NgayTao = vaccine.NgayTao,
                    NgayCapNhat = vaccine.NgayCapNhat
                };

                return ApiResponse.Success("Cập nhật vaccine thành công", vaccineDto);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error($"Lỗi khi cập nhật vaccine: {ex.Message}");
            }
        }

        // DELETE: api/Vaccine/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVaccine(string id, CancellationToken ct = default)
        {
            try
            {
                var vaccine = await _context.Vaccines
                    .FirstOrDefaultAsync(v => v.MaVaccine == id && v.IsDelete != true, ct);

                if (vaccine == null)
                {
                    return ApiResponse.Error("Không tìm thấy vaccine", 404);
                }

                // Check if vaccine is being used in other tables
                var isUsedInServices = await _context.DichVuVaccines
                    .AnyAsync(dv => dv.MaVaccine == id, ct);

                    var isUsedInOrders = await _context.DonHangChiTiets
                        .AnyAsync(dh => dh.MaDichVu == id, ct);

                var isUsedInAppointments = await _context.LichHens
                    .AnyAsync(lh => lh.MaVaccine == id, ct);

                var isUsedInSchedules = await _context.LichTiemChuans
                    .AnyAsync(ltc => ltc.MaVaccine == id, ct);

                var isUsedInBatches = await _context.LoVaccines
                    .AnyAsync(lv => lv.MaVaccine == id, ct);

                var isUsedInInjectionRecords = await _context.PhieuTiems
                    .AnyAsync(pt => pt.MaVaccine == id, ct);

                if (isUsedInServices || isUsedInOrders || isUsedInAppointments || 
                    isUsedInSchedules || isUsedInBatches || isUsedInInjectionRecords)
                {
                    return ApiResponse.Error("Không thể xóa vaccine vì đang được sử dụng trong hệ thống");
                }

                // Soft delete
                vaccine.IsDelete = true;
                vaccine.IsActive = false;
                vaccine.NgayCapNhat = DateTime.UtcNow;

                await _context.SaveChangesAsync(ct);

                return ApiResponse.Success("Xóa vaccine thành công", null);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error($"Lỗi khi xóa vaccine: {ex.Message}");
            }
        }

        // PATCH: api/Vaccine/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateVaccineStatus(string id, [FromBody] VaccineStatusRequest request, CancellationToken ct = default)
        {
            try
            {
                var vaccine = await _context.Vaccines
                    .FirstOrDefaultAsync(v => v.MaVaccine == id && v.IsDelete != true, ct);

                if (vaccine == null)
                {
                    return ApiResponse.Error("Không tìm thấy vaccine", 404);
                }

                vaccine.IsActive = request.IsActive;
                vaccine.NgayCapNhat = DateTime.UtcNow;

                await _context.SaveChangesAsync(ct);

                var statusText = request.IsActive ? "kích hoạt" : "vô hiệu hóa";
                return ApiResponse.Success($"Đã {statusText} vaccine thành công", null);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error($"Lỗi khi cập nhật trạng thái vaccine: {ex.Message}");
            }
        }

        // GET: api/Vaccine/5/usage
        [HttpGet("{id}/usage")]
        public async Task<IActionResult> GetVaccineUsage(string id, CancellationToken ct = default)
        {
            try
            {
                var vaccine = await _context.Vaccines
                    .FirstOrDefaultAsync(v => v.MaVaccine == id && v.IsDelete != true, ct);

                if (vaccine == null)
                {
                    return ApiResponse.Error("Không tìm thấy vaccine", 404);
                }

                var usage = new VaccineUsageDto
                {
                    MaVaccine = id,
                    Ten = vaccine.Ten,
                    SoLuongSuDung = await _context.PhieuTiems.CountAsync(pt => pt.MaVaccine == id, ct),
                    SoLuongLichHen = await _context.LichHens.CountAsync(lh => lh.MaVaccine == id, ct),
                    SoLuongLichTiemChuan = await _context.LichTiemChuans.CountAsync(ltc => ltc.MaVaccine == id, ct),
                    SoLuongLoVaccine = await _context.LoVaccines.CountAsync(lv => lv.MaVaccine == id, ct),
                    SoLuongDichVu = await _context.DichVuVaccines.CountAsync(dv => dv.MaVaccine == id, ct),
                    SoLuongDonHang = await _context.DonHangChiTiets.CountAsync(dh => dh.MaDichVu == id, ct)
                };

                return ApiResponse.Success("Lấy thông tin sử dụng vaccine thành công", usage);
            }
            catch (Exception ex)
            {
                return ApiResponse.Error($"Lỗi khi lấy thông tin sử dụng vaccine: {ex.Message}");
            }
        }
    }
}