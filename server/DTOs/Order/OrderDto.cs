namespace server.DTOs.Order
{
    public record OrderCreateDto(
        string CustomerName,
        string CustomerPhone,
        string CustomerEmail,
        string CustomerAddress,
        string? CustomerCity,
        string? CustomerDistrict,
        string? CustomerWard,
        string? CustomerIdentityCard,
        string? EmergencyContact,
        string? EmergencyPhone,
        string? EmergencyRelationship,
        string? PreferredLocationId,
        string PaymentMethod,
        List<OrderItemDto> Items
    );

    public record OrderItemDto(
        string ServiceId,
        int Quantity,
        decimal UnitPrice
    );

    public record OrderResponseDto(
        string OrderId,
        string OrderCode,
        decimal TotalAmount,
        string Status,
        DateTime CreatedAt,
        string? PaymentUrl = null
    );

    public record MoMoPaymentRequestDto(
        string OrderId,
        string OrderCode,
        decimal Amount,
        string OrderInfo,
        string CustomerName,
        string CustomerPhone,
        string CustomerEmail,
        string? PromotionCode = null,
        decimal? DiscountAmount = null
    );

    public record MoMoPaymentResponseDto(
        string OrderId,
        string PaymentUrl,
        string PaymentId,
        string Status,
        string Message
    );

    public record PaymentCallbackDto(
        string OrderId,
        string PaymentId,
        string Status,
        string Message,
        string Signature
    );

    // ✅ DTO để cập nhật số tiền giảm trong đơn hàng
    public record UpdateOrderDiscountDto(
        decimal DiscountAmount
    );
} 