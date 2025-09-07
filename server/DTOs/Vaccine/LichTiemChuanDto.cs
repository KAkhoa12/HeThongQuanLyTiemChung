namespace server.DTOs.Vaccine;

public record LichTiemChuanDto(
    string MaLichTiemChuan,
    string MaVaccine,
    string TenVaccine,
    int MuiThu,
    int? TuoiThangToiThieu,
    int? TuoiThangToiDa,
    int? SoNgaySauMuiTruoc,
    string? GhiChu,
    bool IsActive,
    DateTime? NgayTao
);

public record LichTiemChuanCreateDto(
    string MaVaccine,
    int MuiThu,
    int? TuoiThangToiThieu = null,
    int? TuoiThangToiDa = null,
    int? SoNgaySauMuiTruoc = null,
    string? GhiChu = null
);

public record LichTiemChuanUpdateDto(
    int? MuiThu = null,
    int? TuoiThangToiThieu = null,
    int? TuoiThangToiDa = null,
    int? SoNgaySauMuiTruoc = null,
    string? GhiChu = null,
    bool? IsActive = null
);

public record LichTiemChuanBatchCreateDto(
    string MaVaccine,
    List<LichTiemChuanCreateDto> LichTiemChuans
);

public record LichTiemChuanByVaccineDto(
    string MaVaccine,
    string TenVaccine,
    List<LichTiemChuanDto> LichTiemChuans
); 