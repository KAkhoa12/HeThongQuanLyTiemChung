using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Order;
using server.Helpers;
using server.Models;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace server.Controllers;

[ApiController]
[Route("api/payments/momo")]
public class MoMoPaymentController : ControllerBase
{
    private readonly HeThongQuanLyTiemChungContext _ctx;
    private readonly IConfiguration _configuration;
    private readonly ILogger<MoMoPaymentController> _logger;

    public MoMoPaymentController(
        HeThongQuanLyTiemChungContext ctx, 
        IConfiguration configuration,
        ILogger<MoMoPaymentController> logger)
    {
        _ctx = ctx;
        _configuration = configuration;
        _logger = logger;
    }

    /* ---------- 1. Tạo thanh toán MoMo ---------- */
    [HttpPost("create")]
    public async Task<IActionResult> CreateMoMoPayment(
        [FromBody] MoMoPaymentRequestDto dto,
        CancellationToken ct)
    {
        try
        {
            // Kiểm tra đơn hàng tồn tại
            var order = await _ctx.DonHangs
                .FirstOrDefaultAsync(d => d.MaDonHang == dto.OrderId && d.IsDelete != true, ct);

            if (order == null)
                return ApiResponse.Error("Không tìm thấy đơn hàng", 404);

            // Cập nhật trạng thái đơn hàng
            order.TrangThaiDon = "PAYMENT_PENDING";
            order.NgayCapNhat = DateTime.Now;

            // Tạo URL thanh toán MoMo
            _logger.LogInformation($"Bắt đầu tạo URL thanh toán MoMo cho đơn hàng: {dto.OrderId}");
            var paymentUrl = await CreateMoMoPaymentUrl(dto);

            if (string.IsNullOrEmpty(paymentUrl))
            {
                _logger.LogError($"Không thể tạo URL thanh toán MoMo cho đơn hàng: {dto.OrderId}");
                return ApiResponse.Error("Không thể tạo URL thanh toán MoMo", 500);
            }

            _logger.LogInformation($"Tạo URL thanh toán MoMo thành công: {paymentUrl}");

            var response = new MoMoPaymentResponseDto(
                dto.OrderId,
                paymentUrl,
                Guid.NewGuid().ToString("N"),
                "PENDING",
                "Đang chờ thanh toán"
            );

            await _ctx.SaveChangesAsync(ct);

            return ApiResponse.Success("Tạo thanh toán MoMo thành công", response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo thanh toán MoMo");
            return ApiResponse.Error($"Lỗi khi tạo thanh toán: {ex.Message}", 500);
        }
    }

    /* ---------- 2. Callback từ MoMo ---------- */
    [HttpPost("callback")]
    public async Task<IActionResult> MoMoCallback(
        [FromBody] PaymentCallbackDto dto,
        CancellationToken ct)
    {
        try
        {
            _logger.LogInformation($"Nhận callback từ MoMo: {JsonSerializer.Serialize(dto)}");

            // Kiểm tra đơn hàng
            var order = await _ctx.DonHangs
                .FirstOrDefaultAsync(d => d.MaDonHang == dto.OrderId && d.IsDelete != true, ct);

            if (order == null)
            {
                _logger.LogWarning($"Không tìm thấy đơn hàng: {dto.OrderId}");
                return BadRequest("Order not found");
            }

            // Cập nhật trạng thái đơn hàng dựa trên kết quả thanh toán
            if (dto.Status.ToUpper() == "SUCCESS")
            {
                order.TrangThaiDon = "PAID";
                order.GhiChu += $"\n[MoMo] Thanh toán thành công - {DateTime.Now:dd/MM/yyyy HH:mm:ss}";
            }
            else
            {
                order.TrangThaiDon = "PAYMENT_FAILED";
                order.GhiChu += $"\n[MoMo] Thanh toán thất bại - {dto.Message} - {DateTime.Now:dd/MM/yyyy HH:mm:ss}";
            }

            order.NgayCapNhat = DateTime.UtcNow;
            await _ctx.SaveChangesAsync(ct);

            _logger.LogInformation($"Cập nhật trạng thái đơn hàng {dto.OrderId} thành công");

            // Trả về response theo yêu cầu của MoMo
            return Ok(new { 
                errorCode = "0", 
                message = "Success" 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi xử lý callback MoMo");
            return BadRequest(new { 
                errorCode = "1", 
                message = "Internal error" 
            });
        }
    }

    /* ---------- 3. Kiểm tra trạng thái thanh toán ---------- */
    [HttpGet("status/{orderId}")]
    public async Task<IActionResult> CheckPaymentStatus(
        string orderId,
        CancellationToken ct)
    {
        var order = await _ctx.DonHangs
            .FirstOrDefaultAsync(d => d.MaDonHang == orderId && d.IsDelete != true, ct);

        if (order == null)
            return ApiResponse.Error("Không tìm thấy đơn hàng", 404);

        return ApiResponse.Success("Kiểm tra trạng thái thanh toán thành công", new
        {
            OrderId = order.MaDonHang,
            Status = order.TrangThaiDon,
            LastUpdated = order.NgayCapNhat
        });
    }

    /* ---------- Helper Methods ---------- */
    private async Task<string> CreateMoMoPaymentUrl(MoMoPaymentRequestDto dto)
    {
        try
        {
            // Lấy cấu hình MoMo từ appsettings
            var partnerCode = _configuration["MoMo:PartnerCode"];
            var accessKey = _configuration["MoMo:AccessKey"];
            var secretKey = _configuration["MoMo:SecretKey"];
            var endpoint = _configuration["MoMo:Endpoint"];

            if (string.IsNullOrEmpty(partnerCode) || string.IsNullOrEmpty(accessKey) || 
                string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(endpoint))
            {
                _logger.LogError($"Thiếu cấu hình MoMo - PartnerCode: {partnerCode}, AccessKey: {accessKey}, SecretKey: {!string.IsNullOrEmpty(secretKey)}, Endpoint: {endpoint}");
                return string.Empty;
            }

            _logger.LogInformation($"Cấu hình MoMo: PartnerCode={partnerCode}, Endpoint={endpoint}");

            // Tạo request data
            var requestId = Guid.NewGuid().ToString("N");
            var orderId = dto.OrderId; // Sử dụng OrderId (maDonHang) thay vì OrderCode
            var amount = ((long)dto.Amount).ToString();
            var orderInfo = dto.OrderInfo;
            var returnUrl = _configuration["MoMo:ReturnUrl"] ?? "http://localhost:5173/payment-success";
            var ipnUrl = _configuration["MoMo:IpnUrl"] ?? $"{_configuration["BaseUrl"]}/api/payments/momo/callback";
            var requestType = "payWithMethod";
            var extraData = "";
            
            // Thêm thông tin khuyến mãi vào extraData nếu có
            if (!string.IsNullOrEmpty(dto.PromotionCode) && dto.DiscountAmount.HasValue)
            {
                extraData = $"promotionCode={dto.PromotionCode}&discountAmount={dto.DiscountAmount}";
            }

            // Validation
            if (string.IsNullOrEmpty(orderId) || string.IsNullOrEmpty(amount) || string.IsNullOrEmpty(orderInfo))
            {
                _logger.LogError($"Dữ liệu request không hợp lệ: OrderId={orderId}, Amount={amount}, OrderInfo={orderInfo}");
                return string.Empty;
            }

            _logger.LogInformation($"Request data: OrderId={orderId}, Amount={amount}, OrderInfo={orderInfo}");
            _logger.LogInformation($"URLs: ReturnUrl={returnUrl}, IpnUrl={ipnUrl}");

            // Tạo chuỗi để ký (theo đúng thứ tự của MoMo - theo tài liệu chính thức)
            var rawSignature = $"accessKey={accessKey}&amount={amount}&extraData={extraData}&ipnUrl={ipnUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={partnerCode}&redirectUrl={returnUrl}&requestId={requestId}&requestType={requestType}";

            // Thử thứ tự khác theo tài liệu MoMo
            var rawSignatureAlt = $"accessKey={accessKey}&amount={amount}&extraData={extraData}&ipnUrl={ipnUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={partnerCode}&redirectUrl={returnUrl}&requestId={requestId}&requestType={requestType}";

            _logger.LogInformation($"Raw signature string (original): {rawSignature}");
            _logger.LogInformation($"Raw signature string (alternative): {rawSignatureAlt}");

            _logger.LogInformation($"Raw signature string: {rawSignature}");

            // Tạo chữ ký với các cách khác nhau
            var signature = GenerateSignature(rawSignature, secretKey);
            var signatureBase64 = GenerateSignatureBase64(rawSignature, secretKey);
            var signatureHexUpper = GenerateSignatureHexUpper(rawSignature, secretKey);
            
            _logger.LogInformation($"Generated signature (Hex Lower): {signature}");
            _logger.LogInformation($"Generated signature (Base64): {signatureBase64}");
            _logger.LogInformation($"Generated signature (Hex Upper): {signatureHexUpper}");
            
            // Sử dụng chữ ký Hex (theo chuẩn MoMo)
            var finalSignature = signature;

            // Tạo request body
            var requestBody = new
            {
                partnerCode = partnerCode,
                partnerName = "HUITKIT",
                storeId = "HUITKIT_STORE",
                requestId = requestId,
                amount = amount,
                orderId = orderId,
                orderInfo = orderInfo,
                redirectUrl = returnUrl,
                ipnUrl = ipnUrl,
                lang = "vi",
                requestType = requestType,
                extraData = extraData,
                signature = finalSignature
            };

            // Gọi API MoMo
            using var httpClient = new HttpClient();
            
            // Cấu hình timeout từ appsettings
            var timeoutSeconds = _configuration.GetValue<int>("MoMo:TimeoutSeconds", 300);
            httpClient.Timeout = TimeSpan.FromSeconds(timeoutSeconds);
            
            var jsonContent = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            _logger.LogInformation($"Gọi API MoMo: {endpoint} với timeout: {timeoutSeconds}s");
            _logger.LogInformation($"Request body: {jsonContent}");

            var response = await httpClient.PostAsync(endpoint, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation($"Response status: {response.StatusCode}");
            _logger.LogInformation($"Response content: {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = JsonSerializer.Deserialize<JsonElement>(responseContent);
                if (responseData.TryGetProperty("payUrl", out var payUrlElement))
                {
                    return payUrlElement.GetString() ?? string.Empty;
                }
            }

            _logger.LogError($"Lỗi khi gọi API MoMo: {responseContent}");
            return string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo URL thanh toán MoMo");
            return string.Empty;
        }
    }

    private string GenerateSignature(string message, string secretKey)
    {
        try
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
            
            // MoMo yêu cầu Hex encoding, không phải Base64
            var signature = Convert.ToHexString(hash).ToLower();
            
            _logger.LogInformation($"Message to sign: {message}");
            _logger.LogInformation($"Secret key length: {secretKey.Length}");
            _logger.LogInformation($"Generated signature (Hex): {signature}");
            
            return signature;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo chữ ký");
            return string.Empty;
        }
    }

    private string GenerateSignatureBase64(string message, string secretKey)
    {
        try
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
            return Convert.ToBase64String(hash);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo chữ ký Base64");
            return string.Empty;
        }
    }

    private string GenerateSignatureHexUpper(string message, string secretKey)
    {
        try
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
            return Convert.ToHexString(hash).ToUpper();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi tạo chữ ký Hex Upper");
            return string.Empty;
        }
    }
} 