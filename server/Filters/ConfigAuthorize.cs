using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using server.Helpers;

namespace server.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class ConfigAuthorizeAttribute : Attribute, IAuthorizationFilter   // ← thêm : Attribute
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (!context.HttpContext.User.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new JsonResult(new
            {
                status = "error",
                code = 401,
                message = "Bạn cần đăng nhập."
            })
            {
                StatusCode = 401
            };
            return;
        }

        // Kiểm tra thêm quyền (tuỳ chọn)
        // if (!context.HttpContext.User.HasClaim(c => c.Type == "Permission"))
        // {
        //     context.Result = new JsonResult(new { status = "error", code = 403, message = "Bạn không có quyền." })
        //     { StatusCode = 403 };
        // }
    }
}