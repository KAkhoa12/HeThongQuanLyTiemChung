using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Quyen;
using server.Helpers;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuyenController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _context;

    public QuyenController(HeThongQuanLyTiemChungContext context)
    {
        _context = context;
    }

    // GET: api/quyen
    [HttpGet]
    public async Task<IActionResult> GetQuyens(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? module = null,
        CancellationToken ct = default)
    {
        try
        {
            var query = _context.Quyens
                .Where(q => q.IsDelete != true)
                .AsQueryable();

            // Filter by search
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(q => 
                    q.TenQuyen.Contains(search) || 
                    q.MoTa.Contains(search) ||
                    q.Module.Contains(search));
            }

            // Filter by module
            if (!string.IsNullOrEmpty(module))
            {
                query = query.Where(q => q.Module == module);
            }

            var result = await query
                .OrderBy(q => q.TenQuyen)
                .ToPagedAsync(page, pageSize, ct);

            return ApiResponse.Success("Lấy danh sách quyền thành công", result);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách quyền: {ex.Message}", 500);
        }
    }

    // GET: api/quyen/{maQuyen}
    [HttpGet("{maQuyen}")]
    public async Task<IActionResult> GetQuyen(string maQuyen, CancellationToken ct = default)
    {
        try
        {
            var quyen = await _context.Quyens
                .Where(q => q.MaQuyen == maQuyen && q.IsDelete != true)
                .FirstOrDefaultAsync(ct);

            if (quyen == null)
            {
                return ApiResponse.Error("Không tìm thấy quyền", 404);
            }

            var quyenDto = new QuyenDto
            {
                MaQuyen = quyen.MaQuyen,
                TenQuyen = quyen.TenQuyen,
                MoTa = quyen.MoTa,
                Module = quyen.Module,
                IsDelete = quyen.IsDelete,
                IsActive = quyen.IsActive,
                NgayTao = quyen.NgayTao,
                NgayCapNhat = quyen.NgayCapNhat
            };

            return ApiResponse.Success("Lấy thông tin quyền thành công", quyenDto);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy thông tin quyền: {ex.Message}", 500);
        }
    }

    // GET: api/quyen/modules
    [HttpGet("modules")]
    public async Task<IActionResult> GetModules(CancellationToken ct = default)
    {
        try
        {
            var modules = await _context.Quyens
                .Where(q => q.IsDelete != true && q.IsActive == true)
                .Select(q => q.Module)
                .Distinct()
                .OrderBy(m => m)
                .ToListAsync(ct);

            return ApiResponse.Success("Lấy danh sách modules thành công", modules);
        }
        catch (Exception ex)
        {
            return ApiResponse.Error($"Lỗi khi lấy danh sách modules: {ex.Message}", 500);
        }
    }
} 