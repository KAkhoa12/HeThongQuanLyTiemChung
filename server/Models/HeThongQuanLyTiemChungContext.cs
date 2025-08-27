using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

public partial class HeThongQuanLyTiemChungContext : DbContext
{
    public HeThongQuanLyTiemChungContext()
    {
    }

    public HeThongQuanLyTiemChungContext(DbContextOptions<HeThongQuanLyTiemChungContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AnhDiaDiem> AnhDiaDiems { get; set; }

    public virtual DbSet<AnhDichVu> AnhDichVus { get; set; }

    public virtual DbSet<AnhNhaCungCap> AnhNhaCungCaps { get; set; }

    public virtual DbSet<AnhVaccine> AnhVaccines { get; set; }

    public virtual DbSet<BacSi> BacSis { get; set; }

    public virtual DbSet<ChiTietNhap> ChiTietNhaps { get; set; }

    public virtual DbSet<ChiTietThanhLy> ChiTietThanhLies { get; set; }

    public virtual DbSet<ChiTietXuat> ChiTietXuats { get; set; }

    public virtual DbSet<DiaDiem> DiaDiems { get; set; }

    public virtual DbSet<DichVu> DichVus { get; set; }

    public virtual DbSet<DichVuVaccine> DichVuVaccines { get; set; }

    public virtual DbSet<DonHang> DonHangs { get; set; }

    public virtual DbSet<DonHangChiTiet> DonHangChiTiets { get; set; }

    public virtual DbSet<DonHangKhuyenMai> DonHangKhuyenMais { get; set; }

    public virtual DbSet<KhuyenMai> KhuyenMais { get; set; }

    public virtual DbSet<LichHen> LichHens { get; set; }

    public virtual DbSet<LichLamViec> LichLamViecs { get; set; }

    public virtual DbSet<LichTiemChuan> LichTiemChuans { get; set; }

    public virtual DbSet<LoVaccine> LoVaccines { get; set; }

    public virtual DbSet<LoaiDichVu> LoaiDichVus { get; set; }

    public virtual DbSet<LoaiKhuyenMai> LoaiKhuyenMais { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NguoiDungQuyen> NguoiDungQuyens { get; set; }

    public virtual DbSet<NguonAnh> NguonAnhs { get; set; }

    public virtual DbSet<NhaCungCap> NhaCungCaps { get; set; }

    public virtual DbSet<NhanAnh> NhanAnhs { get; set; }

    public virtual DbSet<PhienDangNhap> PhienDangNhaps { get; set; }

    public virtual DbSet<PhieuNhap> PhieuNhaps { get; set; }

    public virtual DbSet<PhieuThanhLy> PhieuThanhLies { get; set; }

    public virtual DbSet<PhieuTiem> PhieuTiems { get; set; }

    public virtual DbSet<PhieuXuat> PhieuXuats { get; set; }

    public virtual DbSet<PhieuDangKyLichTiem> PhieuDangKyLichTiems { get; set; }

    public virtual DbSet<QuanLy> QuanLies { get; set; }

    public virtual DbSet<Quyen> Quyens { get; set; }

    public virtual DbSet<ThongTinNguoiDung> ThongTinNguoiDungs { get; set; }

    public virtual DbSet<TonKhoLo> TonKhoLos { get; set; }

    public virtual DbSet<Vaccine> Vaccines { get; set; }

    public virtual DbSet<VaiTro> VaiTros { get; set; }

    public virtual DbSet<VaiTroQuyen> VaiTroQuyens { get; set; }

    public virtual DbSet<YeuCauDoiLich> YeuCauDoiLiches { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.EnableSensitiveDataLogging();
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AnhDiaDiem>(entity =>
        {
            entity.HasKey(e => e.MaAnhDiaDiem).HasName("PK__AnhDiaDi__11AFA013741D3687");

            entity.ToTable("AnhDiaDiem");

            entity.Property(e => e.MaAnhDiaDiem)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnhDiaDiem");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.LaAnhChinh).HasColumnName("laAnhChinh");
            entity.Property(e => e.MaAnh)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnh");
            entity.Property(e => e.MaDiaDiem)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDiaDiem");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.ThuTuHienThi).HasColumnName("thuTuHienThi");

            entity.HasOne(d => d.MaAnhNavigation).WithMany(p => p.AnhDiaDiems)
                .HasForeignKey(d => d.MaAnh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AnhDiaDie__maAnh__66603565");

            entity.HasOne(d => d.MaDiaDiemNavigation).WithMany(p => p.AnhDiaDiems)
                .HasForeignKey(d => d.MaDiaDiem)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AnhDiaDie__maDia__656C112C");
        });

        modelBuilder.Entity<AnhDichVu>(entity =>
        {
            entity.HasKey(e => e.MaAnhDichVu).HasName("PK__AnhDichV__07C3CE77BFF61503");

            entity.ToTable("AnhDichVu");

            entity.Property(e => e.MaAnhDichVu)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnhDichVu");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.LaAnhChinh).HasColumnName("laAnhChinh");
            entity.Property(e => e.MaAnh)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnh");
            entity.Property(e => e.MaDichVu)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDichVu");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.ThuTuHienThi).HasColumnName("thuTuHienThi");

            entity.HasOne(d => d.MaAnhNavigation).WithMany(p => p.AnhDichVus)
                .HasForeignKey(d => d.MaAnh)
                .HasConstraintName("FK__AnhDichVu__maAnh__07C12930");

            entity.HasOne(d => d.MaDichVuNavigation).WithMany(p => p.AnhDichVus)
                .HasForeignKey(d => d.MaDichVu)
                .HasConstraintName("FK__AnhDichVu__maDic__06CD04F7");
        });

        modelBuilder.Entity<AnhNhaCungCap>(entity =>
        {
            entity.HasKey(e => e.MaAnhNhaCungCap).HasName("PK__AnhNhaCu__F4360067F9154EE9");

            entity.ToTable("AnhNhaCungCap");

            entity.Property(e => e.MaAnhNhaCungCap)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnhNhaCungCap");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaAnh)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnh");
            entity.Property(e => e.MaNhaCungCap)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNhaCungCap");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.ThuTuHienThi).HasColumnName("thuTuHienThi");

            entity.HasOne(d => d.MaAnhNavigation).WithMany(p => p.AnhNhaCungCaps)
                .HasForeignKey(d => d.MaAnh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AnhNhaCun__maAnh__18EBB532");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.AnhNhaCungCaps)
                .HasForeignKey(d => d.MaNhaCungCap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AnhNhaCun__maNha__17F790F9");
        });

        modelBuilder.Entity<AnhVaccine>(entity =>
        {
            entity.HasKey(e => e.MaAnhVaccine).HasName("PK__AnhVacci__9BF0A5842EB0BEB6");

            entity.ToTable("AnhVaccine");

            entity.Property(e => e.MaAnhVaccine)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnhVaccine");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.LaAnhChinh).HasColumnName("laAnhChinh");
            entity.Property(e => e.MaAnh)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnh");
            entity.Property(e => e.MaVaccine)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaccine");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.ThuTuHienThi).HasColumnName("thuTuHienThi");

            entity.HasOne(d => d.MaAnhNavigation).WithMany(p => p.AnhVaccines)
                .HasForeignKey(d => d.MaAnh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AnhVaccin__maAnh__0B91BA14");

            entity.HasOne(d => d.MaVaccineNavigation).WithMany(p => p.AnhVaccines)
                .HasForeignKey(d => d.MaVaccine)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AnhVaccin__maVac__0A9D95DB");
        });

        modelBuilder.Entity<BacSi>(entity =>
        {
            entity.HasKey(e => e.MaBacSi).HasName("PK__BacSi__F48AA2377FD9FA0E");

            entity.ToTable("BacSi");

            entity.HasIndex(e => e.MaNguoiDung, "UQ__BacSi__446439EBDE1365ED").IsUnique();

            entity.Property(e => e.MaBacSi)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maBacSi");
            entity.Property(e => e.ChuyenMon)
                .HasMaxLength(100)
                .HasColumnName("chuyenMon");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaNguoiDung)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoGiayPhep)
                .HasMaxLength(50)
                .HasColumnName("soGiayPhep");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.BacSi)
                .HasForeignKey<BacSi>(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BacSi__maNguoiDu__5CD6CB2B");
        });

        modelBuilder.Entity<ChiTietNhap>(entity =>
        {
            entity.HasKey(e => e.MaChiTiet).HasName("PK__ChiTietN__99964888BEA3827A");

            entity.ToTable("ChiTietNhap");

            entity.Property(e => e.MaChiTiet)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maChiTiet");
            entity.Property(e => e.Gia)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("gia");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaLo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLo");
            entity.Property(e => e.MaPhieuNhap)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maPhieuNhap");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoLuong).HasColumnName("soLuong");

            entity.HasOne(d => d.MaLoNavigation).WithMany(p => p.ChiTietNhaps)
                .HasForeignKey(d => d.MaLo)
                .HasConstraintName("FK__ChiTietNha__maLo__236943A5");

            entity.HasOne(d => d.MaPhieuNhapNavigation).WithMany(p => p.ChiTietNhaps)
                .HasForeignKey(d => d.MaPhieuNhap)
                .HasConstraintName("FK__ChiTietNh__maPhi__22751F6C");
        });

        modelBuilder.Entity<ChiTietThanhLy>(entity =>
        {
            entity.HasKey(e => e.MaChiTiet).HasName("PK__ChiTietT__99964888EF363A6A");

            entity.ToTable("ChiTietThanhLy");

            entity.Property(e => e.MaChiTiet)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maChiTiet");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.LyDo)
                .HasMaxLength(255)
                .HasColumnName("lyDo");
            entity.Property(e => e.MaLo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLo");
            entity.Property(e => e.MaPhieuThanhLy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maPhieuThanhLy");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoLuong).HasColumnName("soLuong");

            entity.HasOne(d => d.MaLoNavigation).WithMany(p => p.ChiTietThanhLies)
                .HasForeignKey(d => d.MaLo)
                .HasConstraintName("FK__ChiTietTha__maLo__31B762FC");

            entity.HasOne(d => d.MaPhieuThanhLyNavigation).WithMany(p => p.ChiTietThanhLies)
                .HasForeignKey(d => d.MaPhieuThanhLy)
                .HasConstraintName("FK__ChiTietTh__maPhi__30C33EC3");
        });

        modelBuilder.Entity<ChiTietXuat>(entity =>
        {
            entity.HasKey(e => e.MaChiTiet).HasName("PK__ChiTietX__99964888FAFBED70");

            entity.ToTable("ChiTietXuat");

            entity.Property(e => e.MaChiTiet)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maChiTiet");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaLo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLo");
            entity.Property(e => e.MaPhieuXuat)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maPhieuXuat");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoLuong).HasColumnName("soLuong");

            entity.HasOne(d => d.MaLoNavigation).WithMany(p => p.ChiTietXuats)
                .HasForeignKey(d => d.MaLo)
                .HasConstraintName("FK__ChiTietXua__maLo__2B0A656D");

            entity.HasOne(d => d.MaPhieuXuatNavigation).WithMany(p => p.ChiTietXuats)
                .HasForeignKey(d => d.MaPhieuXuat)
                .HasConstraintName("FK__ChiTietXu__maPhi__2A164134");
        });

        modelBuilder.Entity<DiaDiem>(entity =>
        {
            entity.HasKey(e => e.MaDiaDiem).HasName("PK__DiaDiem__1C7F9DAF1C9956CF");

            entity.ToTable("DiaDiem");

            entity.Property(e => e.MaDiaDiem)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDiaDiem");
            entity.Property(e => e.DiaChi)
                .HasMaxLength(255)
                .HasColumnName("diaChi");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.GioMoCua)
                .HasMaxLength(100)
                .HasColumnName("gioMoCua");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.LoaiDiaDiem)
                .HasMaxLength(20)
                .HasColumnName("loaiDiaDiem");
            entity.Property(e => e.MoTa).HasColumnName("moTa");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .HasColumnName("soDienThoai");
            entity.Property(e => e.SucChua).HasColumnName("sucChua");
            entity.Property(e => e.Ten)
                .HasMaxLength(100)
                .HasColumnName("ten");
        });

        modelBuilder.Entity<DichVu>(entity =>
        {
            entity.HasKey(e => e.MaDichVu).HasName("PK__DichVu__80F48B0989ADE15A");

            entity.ToTable("DichVu");

            entity.Property(e => e.MaDichVu)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDichVu");
            entity.Property(e => e.Gia)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("gia");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaLoaiDichVu)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLoaiDichVu");
            entity.Property(e => e.MoTa).HasColumnName("moTa");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.Ten)
                .HasMaxLength(100)
                .HasColumnName("ten");

            entity.HasOne(d => d.MaLoaiDichVuNavigation).WithMany(p => p.DichVus)
                .HasForeignKey(d => d.MaLoaiDichVu)
                .HasConstraintName("FK__DichVu__maLoaiDi__03F0984C");
        });

        modelBuilder.Entity<DichVuVaccine>(entity =>
        {
            entity.HasKey(e => e.MaDichVuVaccine).HasName("PK__DichVuVa__EC4E1E7164275528");

            entity.ToTable("DichVuVaccine");

            entity.Property(e => e.MaDichVuVaccine)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDichVuVaccine");
            entity.Property(e => e.GhiChu).HasColumnName("ghiChu");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaDichVu)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDichVu");
            entity.Property(e => e.MaVaccine)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaccine");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoMuiChuan).HasColumnName("soMuiChuan");

            entity.HasOne(d => d.MaDichVuNavigation).WithMany(p => p.DichVuVaccines)
                .HasForeignKey(d => d.MaDichVu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DichVuVac__maDic__0E6E26BF");

            entity.HasOne(d => d.MaVaccineNavigation).WithMany(p => p.DichVuVaccines)
                .HasForeignKey(d => d.MaVaccine)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DichVuVac__maVac__0F624AF8");
        });

        modelBuilder.Entity<DonHang>(entity =>
        {
            entity.HasKey(e => e.MaDonHang).HasName("PK__DonHang__871D381917A744E7");

            entity.ToTable("DonHang");

            entity.Property(e => e.MaDonHang)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDonHang");
            entity.Property(e => e.GhiChu).HasColumnName("ghiChu");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaDiaDiemYeuThich)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDiaDiemYeuThich");
            entity.Property(e => e.MaNguoiDung)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayDat)
                .HasColumnType("datetime")
                .HasColumnName("ngayDat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TongTienGoc)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("tongTienGoc");
            entity.Property(e => e.TongTienThanhToan)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("tongTienThanhToan");
            entity.Property(e => e.TrangThaiDon)
                .HasMaxLength(30)
                .HasColumnName("trangThaiDon");

            entity.HasOne(d => d.MaDiaDiemYeuThichNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaDiaDiemYeuThich)
                .HasConstraintName("FK__DonHang__maDiaDi__395884C4");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.DonHangs)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHang__maNguoi__3864608B");
        });

        modelBuilder.Entity<DonHangChiTiet>(entity =>
        {
            entity.HasKey(e => e.MaDonHangChiTiet).HasName("PK__DonHangC__7212B475698B2C68");

            entity.ToTable("DonHangChiTiet");

            entity.Property(e => e.MaDonHangChiTiet)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDonHangChiTiet");
            entity.Property(e => e.DonGiaMui)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("donGiaMui");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaDonHang)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDonHang");
            entity.Property(e => e.MaDichVu)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("MaDichVu");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.SoMuiChuan).HasColumnName("soMuiChuan");
            entity.Property(e => e.ThanhTien)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("thanhTien");

            entity.HasOne(d => d.MaDonHangNavigation).WithMany(p => p.DonHangChiTiets)
                .HasForeignKey(d => d.MaDonHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHangCh__maDon__3C34F16F");

            entity.HasOne(d => d.MaDichVuNavigation).WithMany()
                .HasForeignKey(d => d.MaDichVu)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<DonHangKhuyenMai>(entity =>
        {
            entity.HasKey(e => e.MaDonHangKhuyenMai).HasName("PK__DonHangK__67C32372730B7070");

            entity.ToTable("DonHangKhuyenMai");

            entity.Property(e => e.MaDonHangKhuyenMai)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDonHangKhuyenMai");
            entity.Property(e => e.GiamGiaGoc)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("giamGiaGoc");
            entity.Property(e => e.GiamGiaThucTe)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("giamGiaThucTe");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaDonHang)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDonHang");
            entity.Property(e => e.MaKhuyenMai)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maKhuyenMai");
            entity.Property(e => e.NgayApDung)
                .HasColumnType("datetime")
                .HasColumnName("ngayApDung");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");

            entity.HasOne(d => d.MaDonHangNavigation).WithMany(p => p.DonHangKhuyenMais)
                .HasForeignKey(d => d.MaDonHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHangKh__maDon__45BE5BA9");

            entity.HasOne(d => d.MaKhuyenMaiNavigation).WithMany(p => p.DonHangKhuyenMais)
                .HasForeignKey(d => d.MaKhuyenMai)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DonHangKh__maKhu__46B27FE2");
        });

        modelBuilder.Entity<KhuyenMai>(entity =>
        {
            entity.HasKey(e => e.MaKhuyenMai).HasName("PK__KhuyenMa__87BEDDE9B125734B");

            entity.ToTable("KhuyenMai");

            entity.Property(e => e.MaKhuyenMai)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maKhuyenMai");
            entity.Property(e => e.DieuKienToiThieu)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("dieuKienToiThieu");
            entity.Property(e => e.GiaTriGiam)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("giaTriGiam");
            entity.Property(e => e.GiamToiDa)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("giamToiDa");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.LoaiGiam)
                .HasMaxLength(20)
                .HasColumnName("loaiGiam");
            entity.Property(e => e.MaLoaiKhuyenMai)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLoaiKhuyenMai");
            entity.Property(e => e.NgayBatDau).HasColumnName("ngayBatDau");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayKetThuc).HasColumnName("ngayKetThuc");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoLuotDaDung)
                .HasDefaultValue(0)
                .HasColumnName("soLuotDaDung");
            entity.Property(e => e.SoLuotDung).HasColumnName("soLuotDung");
            entity.Property(e => e.TenKhuyenMai)
                .HasMaxLength(255)
                .HasColumnName("tenKhuyenMai");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaLoaiKhuyenMaiNavigation).WithMany(p => p.KhuyenMais)
                .HasForeignKey(d => d.MaLoaiKhuyenMai)
                .HasConstraintName("FK__KhuyenMai__maLoa__42E1EEFE");
        });

        modelBuilder.Entity<LichHen>(entity =>
        {
            entity.HasKey(e => e.MaLichHen).HasName("PK__LichHen__FBFE3223EFA716D4");

            entity.ToTable("LichHen");

            entity.Property(e => e.MaLichHen)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLichHen");
            entity.Property(e => e.GhiChu).HasColumnName("ghiChu");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaDonHang)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDonHang");
            entity.Property(e => e.MaLichLamViec)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLichLamViec");
            entity.Property(e => e.MaVaccine)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaccine");
            entity.Property(e => e.MuiThu).HasColumnName("muiThu");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayHen)
                .HasColumnType("datetime")
                .HasColumnName("ngayHen");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaDonHangNavigation).WithMany(p => p.LichHens)
                .HasForeignKey(d => d.MaDonHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichHen__maDonHa__503BEA1C");

            entity.HasOne(d => d.MaLichLamViecNavigation).WithMany(p => p.LichHens)
                .HasForeignKey(d => d.MaLichLamViec)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichHen__maLichL__51300E55");

            entity.HasOne(d => d.MaVaccineNavigation).WithMany(p => p.LichHens)
                .HasForeignKey(d => d.MaVaccine)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichHen__maVacci__5224328E");
        });

        modelBuilder.Entity<LichLamViec>(entity =>
        {
            entity.HasKey(e => e.MaLichLamViec).HasName("PK__LichLamV__7D0410EFF30DFC6B");

            entity.ToTable("LichLamViec");

            entity.Property(e => e.MaLichLamViec)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLichLamViec");
            entity.Property(e => e.DaDat)
                .HasDefaultValue(0)
                .HasColumnName("daDat");
            entity.Property(e => e.GioBatDau).HasColumnName("gioBatDau");
            entity.Property(e => e.GioKetThuc).HasColumnName("gioKetThuc");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaBacSi)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maBacSi");
            entity.Property(e => e.MaDiaDiem)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDiaDiem");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayLam).HasColumnName("ngayLam");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoLuongCho).HasColumnName("soLuongCho");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaBacSiNavigation).WithMany(p => p.LichLamViecs)
                .HasForeignKey(d => d.MaBacSi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichLamVi__maBac__4A8310C6");

            entity.HasOne(d => d.MaDiaDiemNavigation).WithMany(p => p.LichLamViecs)
                .HasForeignKey(d => d.MaDiaDiem)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichLamVi__maDia__4B7734FF");
        });

        modelBuilder.Entity<LichTiemChuan>(entity =>
        {
            entity.HasKey(e => e.MaLichTiemChuan).HasName("PK__LichTiem__6B09F439B057333C");

            entity.ToTable("LichTiemChuan");

            entity.Property(e => e.MaLichTiemChuan)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLichTiemChuan");
            entity.Property(e => e.GhiChu).HasColumnName("ghiChu");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaVaccine)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaccine");
            entity.Property(e => e.MuiThu).HasColumnName("muiThu");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoNgaySauMuiTruoc).HasColumnName("soNgaySauMuiTruoc");
            entity.Property(e => e.TuoiThangToiDa).HasColumnName("tuoiThangToiDa");
            entity.Property(e => e.TuoiThangToiThieu).HasColumnName("tuoiThangToiThieu");

            entity.HasOne(d => d.MaVaccineNavigation).WithMany(p => p.LichTiemChuans)
                .HasForeignKey(d => d.MaVaccine)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichTiemC__maVac__00200768");
        });

        modelBuilder.Entity<LoVaccine>(entity =>
        {
            entity.HasKey(e => e.MaLo).HasName("PK__LoVaccin__7A3EB73C86F7BDC2");

            entity.ToTable("LoVaccine");

            entity.Property(e => e.MaLo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLo");
            entity.Property(e => e.GiaNhap)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("giaNhap");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaNhaCungCap)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNhaCungCap");
            entity.Property(e => e.MaVaccine)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaccine");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayHetHan).HasColumnName("ngayHetHan");
            entity.Property(e => e.NgaySanXuat).HasColumnName("ngaySanXuat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoLo)
                .HasMaxLength(50)
                .HasColumnName("soLo");
            entity.Property(e => e.SoLuongHienTai).HasColumnName("soLuongHienTai");
            entity.Property(e => e.SoLuongNhap).HasColumnName("soLuongNhap");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.LoVaccines)
                .HasForeignKey(d => d.MaNhaCungCap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LoVaccine__maNha__1CBC4616");

            entity.HasOne(d => d.MaVaccineNavigation).WithMany(p => p.LoVaccines)
                .HasForeignKey(d => d.MaVaccine)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LoVaccine__maVac__1BC821DD");
        });

        modelBuilder.Entity<LoaiDichVu>(entity =>
        {
            entity.HasKey(e => e.MaLoaiDichVu).HasName("PK__LoaiDich__9A9DA689CEE5B89C");

            entity.ToTable("LoaiDichVu");

            entity.Property(e => e.MaLoaiDichVu)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLoaiDichVu");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TenLoai)
                .HasMaxLength(100)
                .HasColumnName("tenLoai");
        });

        modelBuilder.Entity<LoaiKhuyenMai>(entity =>
        {
            entity.HasKey(e => e.MaLoaiKhuyenMai).HasName("PK__LoaiKhuy__08E7B55315812EBE");

            entity.ToTable("LoaiKhuyenMai");

            entity.Property(e => e.MaLoaiKhuyenMai)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLoaiKhuyenMai");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .HasColumnName("moTa");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TenLoai)
                .HasMaxLength(100)
                .HasColumnName("tenLoai");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PK__NguoiDun__446439EA70F6DD99");

            entity.ToTable("NguoiDung");

            entity.Property(e => e.MaNguoiDung)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.DiaChi)
                .HasMaxLength(200)
                .HasColumnName("diaChi");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaAnh)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnh");
            entity.Property(e => e.MaVaiTro)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaiTro");
            entity.Property(e => e.MatKhau)
                .HasMaxLength(100)
                .HasColumnName("matKhau");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgaySinh).HasColumnName("ngaySinh");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .HasColumnName("soDienThoai");
            entity.Property(e => e.Ten)
                .HasMaxLength(100)
                .HasColumnName("ten");

            entity.HasOne(d => d.MaAnhNavigation).WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaAnh)
                .HasConstraintName("FK__NguoiDung__maAnh__4F7CD00D");

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaVaiTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NguoiDung__maAnh__4E88ABD4");
        });

        modelBuilder.Entity<NguoiDungQuyen>(entity =>
        {
            entity.HasKey(e => new { e.MaNguoiDung, e.MaQuyen }).HasName("PK__NguoiDun__6D143830CA7CAD0C");

            entity.ToTable("NguoiDungQuyen");

            entity.Property(e => e.MaNguoiDung)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.MaQuyen)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maQuyen");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.NguoiDungQuyens)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NguoiDung__maNgu__52593CB8");

            entity.HasOne(d => d.MaQuyenNavigation).WithMany(p => p.NguoiDungQuyens)
                .HasForeignKey(d => d.MaQuyen)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NguoiDung__maQuy__534D60F1");
        });

        modelBuilder.Entity<NguonAnh>(entity =>
        {
            entity.HasKey(e => e.MaAnh).HasName("PK__NguonAnh__184D7736282309AD");

            entity.ToTable("NguonAnh");

            entity.Property(e => e.MaAnh)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnh");
            entity.Property(e => e.AltText)
                .HasMaxLength(100)
                .HasColumnName("altText");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaNhan)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNhan");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NguoiTai)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nguoiTai");
            entity.Property(e => e.UrlAnh)
                .HasMaxLength(255)
                .HasColumnName("urlAnh");

            entity.HasOne(d => d.MaNhanNavigation).WithMany(p => p.NguonAnhs)
                .HasForeignKey(d => d.MaNhan)
                .HasConstraintName("FK__NguonAnh__maNhan__3E52440B");
        });

        modelBuilder.Entity<NhaCungCap>(entity =>
        {
            entity.HasKey(e => e.MaNhaCungCap).HasName("PK__NhaCungC__D0B4D6DE9EA7702A");

            entity.ToTable("NhaCungCap");

            entity.Property(e => e.MaNhaCungCap)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNhaCungCap");
            entity.Property(e => e.DiaChi)
                .HasMaxLength(200)
                .HasColumnName("diaChi");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaAnh)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maAnh");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NguoiLienHe)
                .HasMaxLength(100)
                .HasColumnName("nguoiLienHe");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .HasColumnName("soDienThoai");
            entity.Property(e => e.Ten)
                .HasMaxLength(100)
                .HasColumnName("ten");

            entity.HasOne(d => d.MaAnhNavigation).WithMany(p => p.NhaCungCaps)
                .HasForeignKey(d => d.MaAnh)
                .HasConstraintName("FK__NhaCungCa__maAnh__151B244E");
        });

        modelBuilder.Entity<NhanAnh>(entity =>
        {
            entity.HasKey(e => e.MaNhan).HasName("PK__NhanAnh__83085ED087E4C8BC");

            entity.ToTable("NhanAnh");

            entity.Property(e => e.MaNhan)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNhan");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .HasColumnName("moTa");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TenNhan)
                .HasMaxLength(100)
                .HasColumnName("tenNhan");
        });

        modelBuilder.Entity<PhienDangNhap>(entity =>
        {
            entity.HasKey(e => e.MaPhien).HasName("PK__PhienDan__49A5B118D2384D7A");

            entity.ToTable("PhienDangNhap");

            entity.Property(e => e.MaPhien)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maPhien");
            entity.Property(e => e.AccessToken)
                .HasMaxLength(255)
                .HasColumnName("accessToken");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaNguoiDung)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.RefreshToken)
                .HasMaxLength(255)
                .HasColumnName("refreshToken");
            entity.Property(e => e.ThoiHan)
                .HasColumnType("datetime")
                .HasColumnName("thoiHan");
            entity.Property(e => e.ThoiHanRefresh)
                .HasColumnType("datetime")
                .HasColumnName("thoiHanRefresh");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.PhienDangNhaps)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhienDang__maNgu__5629CD9C");
        });

        modelBuilder.Entity<PhieuNhap>(entity =>
        {
            entity.HasKey(e => e.MaPhieuNhap).HasName("PK__PhieuNha__E27639346EBA01D5");

            entity.ToTable("PhieuNhap");

            entity.Property(e => e.MaPhieuNhap)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maPhieuNhap");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaNhaCungCap)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNhaCungCap");
            entity.Property(e => e.MaQuanLy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maQuanLy");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayNhap)
                .HasColumnType("datetime")
                .HasColumnName("ngayNhap");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TongTien)
                .HasColumnType("decimal(12, 2)")
                .HasColumnName("tongTien");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.PhieuNhaps)
                .HasForeignKey(d => d.MaNhaCungCap)
                .HasConstraintName("FK__PhieuNhap__maNha__1F98B2C1");

            entity.HasOne(d => d.MaQuanLyNavigation).WithMany()
                .HasForeignKey(d => d.MaQuanLy)
                .HasConstraintName("FK__PhieuNhap__MaQua__NewConstraint4");
        });

        modelBuilder.Entity<PhieuThanhLy>(entity =>
        {
            entity.HasKey(e => e.MaPhieuThanhLy).HasName("PK__PhieuTha__4DB6029553C3A6EE");

            entity.ToTable("PhieuThanhLy");

            entity.Property(e => e.MaPhieuThanhLy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maPhieuThanhLy");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaDiaDiem)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDiaDiem");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NgayThanhLy)
                .HasColumnType("datetime")
                .HasColumnName("ngayThanhLy");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaDiaDiemNavigation).WithMany(p => p.PhieuThanhLies)
                .HasForeignKey(d => d.MaDiaDiem)
                .HasConstraintName("FK__PhieuThan__maDia__2DE6D218");
        });

        modelBuilder.Entity<PhieuTiem>(entity =>
        {
            entity.HasKey(e => e.MaPhieuTiem).HasName("PK__PhieuTie__4BEEAEF35F4FAF1E");

            entity.ToTable("PhieuTiem");

            entity.Property(e => e.MaPhieuTiem)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maPhieuTiem");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaBacSi)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maBacSi");
            entity.Property(e => e.MaLichHen)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLichHen");
            entity.Property(e => e.MaLo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLo");
            entity.Property(e => e.MaVaccine)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaccine");
            entity.Property(e => e.MoTaPhanUng).HasColumnName("moTaPhanUng");
            entity.Property(e => e.MuiThuThucTe).HasColumnName("muiThuThucTe");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NgayTiem)
                .HasColumnType("datetime")
                .HasColumnName("ngayTiem");
            entity.Property(e => e.PhanUng)
                .HasMaxLength(20)
                .HasColumnName("phanUng");

            entity.HasOne(d => d.MaBacSiNavigation).WithMany(p => p.PhieuTiems)
                .HasForeignKey(d => d.MaBacSi)
                .HasConstraintName("FK__PhieuTiem__maBac__5AB9788F");

            entity.HasOne(d => d.MaLichHenNavigation).WithMany(p => p.PhieuTiems)
                .HasForeignKey(d => d.MaLichHen)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhieuTiem__maLic__57DD0BE4");

            entity.HasOne(d => d.MaLoNavigation).WithMany(p => p.PhieuTiems)
                .HasForeignKey(d => d.MaLo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhieuTiem__maLo__59C55456");

            entity.HasOne(d => d.MaVaccineNavigation).WithMany(p => p.PhieuTiems)
                .HasForeignKey(d => d.MaVaccine)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhieuTiem__maVac__58D1301D");
        });

        modelBuilder.Entity<PhieuXuat>(entity =>
        {
            entity.HasKey(e => e.MaPhieuXuat).HasName("PK__PhieuXua__2A661240486A4DD4");

            entity.ToTable("PhieuXuat");

            entity.Property(e => e.MaPhieuXuat)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maPhieuXuat");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.LoaiXuat)
                .HasMaxLength(20)
                .HasColumnName("loaiXuat");
            entity.Property(e => e.MaDiaDiemNhap)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDiaDiemNhap");
            entity.Property(e => e.MaDiaDiemXuat)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDiaDiemXuat");
            entity.Property(e => e.MaQuanLy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maQuanLy");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NgayXuat)
                .HasColumnType("datetime")
                .HasColumnName("ngayXuat");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaDiaDiemNhapNavigation).WithMany(p => p.PhieuXuatMaDiaDiemNhapNavigations)
                .HasForeignKey(d => d.MaDiaDiemNhap)
                .HasConstraintName("FK__PhieuXuat__maDia__2739D489");

            entity.HasOne(d => d.MaDiaDiemXuatNavigation).WithMany(p => p.PhieuXuatMaDiaDiemXuatNavigations)
                .HasForeignKey(d => d.MaDiaDiemXuat)
                .HasConstraintName("FK__PhieuXuat__maDia__2645B050");

            entity.HasOne(d => d.MaQuanLyNavigation).WithMany()
                .HasForeignKey(d => d.MaQuanLy)
                .HasConstraintName("FK__PhieuXuat__MaQua__NewConstraint");
        });

        modelBuilder.Entity<PhieuDangKyLichTiem>(entity =>
        {
            entity.HasKey(e => e.MaPhieuDangKy).HasName("PK__PhieuDan__NewKey");

            entity.ToTable("PhieuDangKyLichTiem");

            entity.Property(e => e.MaPhieuDangKy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maPhieuDangKy");
            entity.Property(e => e.MaKhachHang)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maKhachHang");
            entity.Property(e => e.MaDichVu)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDichVu");
            entity.Property(e => e.MaBacSi)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maBacSi");
            entity.Property(e => e.NgayDangKy)
                .HasColumnType("datetime")
                .HasColumnName("ngayDangKy");
            entity.Property(e => e.NgayHenTiem)
                .HasColumnType("datetime")
                .HasColumnName("ngayHenTiem");
            entity.Property(e => e.GioHenTiem)
                .HasMaxLength(10)
                .HasColumnName("gioHenTiem");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");
            entity.Property(e => e.LyDoTuChoi)
                .HasMaxLength(500)
                .HasColumnName("lyDoTuChoi");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(500)
                .HasColumnName("ghiChu");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");

            entity.HasOne(d => d.MaKhachHangNavigation).WithMany()
                .HasForeignKey(d => d.MaKhachHang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhieuDan__maKha__NewConstraint1");

            entity.HasOne(d => d.MaDichVuNavigation).WithMany()
                .HasForeignKey(d => d.MaDichVu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhieuDan__maDic__NewConstraint2");

            entity.HasOne(d => d.MaBacSiNavigation).WithMany()
                .HasForeignKey(d => d.MaBacSi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhieuDan__maBac__NewConstraint3");
        });

        modelBuilder.Entity<QuanLy>(entity =>
        {
            entity.HasKey(e => e.MaQuanLy).HasName("PK__QuanLy__449603AD29CA2479");

            entity.ToTable("QuanLy");

            entity.HasIndex(e => e.MaNguoiDung, "UQ__QuanLy__446439EB297BE629").IsUnique();

            entity.Property(e => e.MaQuanLy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maQuanLy");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaNguoiDung)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.QuanLy)
                .HasForeignKey<QuanLy>(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuanLy__maNguoiD__60A75C0F");
        });

        modelBuilder.Entity<Quyen>(entity =>
        {
            entity.HasKey(e => e.MaQuyen).HasName("PK__Quyen__97001DA3065B48CB");

            entity.ToTable("Quyen");

            entity.Property(e => e.MaQuyen)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maQuyen");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .HasColumnName("moTa");
            entity.Property(e => e.Module)
                .HasMaxLength(50)
                .HasColumnName("module");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TenQuyen)
                .HasMaxLength(100)
                .HasColumnName("tenQuyen");
        });

        modelBuilder.Entity<ThongTinNguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaThongTin).HasName("PK__ThongTin__63FCB54AD367D815");

            entity.ToTable("ThongTinNguoiDung");

            entity.Property(e => e.MaThongTin)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maThongTin");
            entity.Property(e => e.BenhNen).HasColumnName("benhNen");
            entity.Property(e => e.Bmi)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("bmi");
            entity.Property(e => e.CanNang)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("canNang");
            entity.Property(e => e.ChieuCao)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("chieuCao");
            entity.Property(e => e.DiUng).HasColumnName("diUng");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaNguoiDung)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayKhamGanNhat).HasColumnName("ngayKhamGanNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NhomMau)
                .HasMaxLength(10)
                .HasColumnName("nhomMau");
            entity.Property(e => e.ThuocDangDung).HasColumnName("thuocDangDung");
            entity.Property(e => e.TinhTrangMangThai).HasColumnName("tinhTrangMangThai");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.ThongTinNguoiDungs)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ThongTinN__maNgu__59063A47");
        });

        modelBuilder.Entity<TonKhoLo>(entity =>
        {
            entity.HasKey(e => e.MaTonKho).HasName("PK__TonKhoLo__C3E0BF615ACA4846");

            entity.ToTable("TonKhoLo");

            entity.Property(e => e.MaTonKho)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maTonKho");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MaDiaDiem)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maDiaDiem");
            entity.Property(e => e.MaLo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLo");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoLuong).HasColumnName("soLuong");

            entity.HasOne(d => d.MaDiaDiemNavigation).WithMany(p => p.TonKhoLos)
                .HasForeignKey(d => d.MaDiaDiem)
                .HasConstraintName("FK__TonKhoLo__maDiaD__3493CFA7");

            entity.HasOne(d => d.MaLoNavigation).WithMany(p => p.TonKhoLos)
                .HasForeignKey(d => d.MaLo)
                .HasConstraintName("FK__TonKhoLo__maLo__3587F3E0");
        });

        modelBuilder.Entity<Vaccine>(entity =>
        {
            entity.HasKey(e => e.MaVaccine).HasName("PK__Vaccine__C3084F9ECBF53FB9");

            entity.ToTable("Vaccine");

            entity.Property(e => e.MaVaccine)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaccine");
            entity.Property(e => e.HuongDanSuDung).HasColumnName("huongDanSuDung");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NhaSanXuat)
                .HasMaxLength(100)
                .HasColumnName("nhaSanXuat");
            entity.Property(e => e.PhongNgua).HasColumnName("phongNgua");
            entity.Property(e => e.Ten)
                .HasMaxLength(100)
                .HasColumnName("ten");
            entity.Property(e => e.TuoiBatDauTiem).HasColumnName("tuoiBatDauTiem");
            entity.Property(e => e.TuoiKetThucTiem).HasColumnName("tuoiKetThucTiem");
        });

        modelBuilder.Entity<VaiTro>(entity =>
        {
            entity.HasKey(e => e.MaVaiTro).HasName("PK__VaiTro__BFC88AB70B5A0A5F");

            entity.ToTable("VaiTro");

            entity.Property(e => e.MaVaiTro)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaiTro");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .HasColumnName("moTa");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TenVaiTro)
                .HasMaxLength(50)
                .HasColumnName("tenVaiTro");
        });

        modelBuilder.Entity<VaiTroQuyen>(entity =>
        {
            entity.HasKey(e => new { e.MaVaiTro, e.MaQuyen }).HasName("PK__VaiTroQu__96B88B6D1839DB06");

            entity.ToTable("VaiTroQuyen");

            entity.Property(e => e.MaVaiTro)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maVaiTro");
            entity.Property(e => e.MaQuyen)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maQuyen");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");

            entity.HasOne(d => d.MaQuyenNavigation).WithMany(p => p.VaiTroQuyens)
                .HasForeignKey(d => d.MaQuyen)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VaiTroQuy__maQuy__4BAC3F29");

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.VaiTroQuyens)
                .HasForeignKey(d => d.MaVaiTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VaiTroQuy__maVai__4AB81AF0");
        });

        modelBuilder.Entity<YeuCauDoiLich>(entity =>
        {
            entity.HasKey(e => e.MaYeuCau).HasName("PK__YeuCauDo__765F6DD63B02AAE0");

            entity.ToTable("YeuCauDoiLich");

            entity.Property(e => e.MaYeuCau)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maYeuCau");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsDelete).HasColumnName("isDelete");
            entity.Property(e => e.LyDo).HasColumnName("lyDo");
            entity.Property(e => e.MaLichHen)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("maLichHen");
            entity.Property(e => e.NgayCapNhat)
                .HasColumnType("datetime")
                .HasColumnName("ngayCapNhat");
            entity.Property(e => e.NgayHenMoi)
                .HasColumnType("datetime")
                .HasColumnName("ngayHenMoi");
            entity.Property(e => e.NgayTao)
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaLichHenNavigation).WithMany(p => p.YeuCauDoiLiches)
                .HasForeignKey(d => d.MaLichHen)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauDoi__maLic__55009F39");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
