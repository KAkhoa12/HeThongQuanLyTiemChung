using Microsoft.AspNetCore.Mvc;

namespace server.Helpers
{
    public static class ApiResponse
    {
        public static ObjectResult Success(string message, object data = null, int code = 200)
        {
            return new ObjectResult(new
            {
                status = "success",
                code = code,
                message = message,
                payload = data
            })
            {
                StatusCode = code
            };
        }

        public static ObjectResult Error(string message, int code = 400)
        {
            return new ObjectResult(new
            {
                status = "error",
                code = code,
                message = message,
                payload = (object)null
            })
            {
                StatusCode = code
            };
        }
    }
}
