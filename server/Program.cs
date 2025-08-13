using server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSession(options => 
{ 
    options.IdleTimeout = TimeSpan.FromHours(2); 
    options.Cookie.HttpOnly = true; 
    options.Cookie.IsEssential = true; 
});

builder.Services.AddDbContext<HeThongQuanLyTiemChungContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("QuanLyTiemChungSuperSecretKey2023!@"))
    };
});
builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddCors(op =>
{
    op.AddPolicy("AllowSpecificOrigin",
                builder =>
                {
                    builder
            .WithOrigins("http://localhost:5173", "https://localhost:5173","http://localhost:5174", "https://localhost:5174", "https://gmp-project.vercel.app") 
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});
var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowSpecificOrigin");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseSession();
app.Run();
