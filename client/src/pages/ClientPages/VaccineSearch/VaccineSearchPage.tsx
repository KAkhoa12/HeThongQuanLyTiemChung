import React, { useState, useEffect } from 'react';
import { useVaccines, useManufacturers } from '../../../hooks/useVaccine';
import { VaccineDto } from '../../../services/vaccine.service';

const VaccineSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  const {
    data: vaccinesData,
    loading: vaccinesLoading,
    error: vaccinesError,
    execute: loadVaccines
  } = useVaccines();

  const {
    data: manufacturers,
    loading: manufacturersLoading,
    execute: loadManufacturers
  } = useManufacturers();

  const vaccines = vaccinesData?.data || [];
  const totalPages = vaccinesData?.totalPages || 0;

  useEffect(() => {
    loadVaccines({
      page: currentPage,
      pageSize,
      searchTerm: searchTerm || undefined,
      manufacturer: selectedManufacturer || undefined,
      isActive: true
    });
  }, [currentPage, searchTerm, selectedManufacturer, loadVaccines]);

  useEffect(() => {
    loadManufacturers();
  }, [loadManufacturers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadVaccines({
      page: 1,
      pageSize,
      searchTerm: searchTerm || undefined,
      manufacturer: selectedManufacturer || undefined,
      isActive: true
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderVaccineCard = (vaccine: VaccineDto) => (
    <div key={vaccine.maVaccine} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{vaccine.ten}</h3>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Mã vaccine:</span> {vaccine.maVaccine}
        </p>
        {vaccine.nhaSanXuat && (
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Nhà sản xuất:</span> {vaccine.nhaSanXuat}
          </p>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {vaccine.tuoiBatDauTiem && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Độ tuổi tiêm:</span>
            <span>
              {vaccine.tuoiBatDauTiem} tháng
              {vaccine.tuoiKetThucTiem && ` - ${vaccine.tuoiKetThucTiem} tháng`}
            </span>
          </div>
        )}

        {vaccine.phongNgua && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Phòng ngừa:</span>
            <p className="mt-1 text-gray-700">{vaccine.phongNgua}</p>
          </div>
        )}

        {vaccine.huongDanSuDung && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Hướng dẫn sử dụng:</span>
            <p className="mt-1 text-gray-700 line-clamp-3">{vaccine.huongDanSuDung}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
          vaccine.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {vaccine.isActive ? 'Có sẵn' : 'Không có sẵn'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tra cứu thông tin Vaccine
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm và tra cứu thông tin chi tiết về các loại vaccine có sẵn trong hệ thống
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm vaccine
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên vaccine, nhà sản xuất hoặc bệnh phòng ngừa..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Manufacturer Filter */}
              <div>
                <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-2">
                  Nhà sản xuất
                </label>
                <select
                  id="manufacturer"
                  value={selectedManufacturer}
                  onChange={(e) => setSelectedManufacturer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả nhà sản xuất</option>
                  {manufacturersLoading ? (
                    <option disabled>Đang tải...</option>
                  ) : (
                    manufacturers?.map((manufacturer) => (
                      <option key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="mb-8">
          {vaccinesLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : vaccinesError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
              <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu vaccine. Vui lòng thử lại sau.</p>
            </div>
          ) : vaccines.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
              <p className="text-gray-600 text-lg">Không tìm thấy vaccine nào phù hợp với tiêu chí tìm kiếm.</p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Tìm thấy <span className="font-semibold">{vaccinesData?.totalCount || 0}</span> vaccine
                  {searchTerm && ` cho từ khóa "${searchTerm}"`}
                  {selectedManufacturer && ` của nhà sản xuất "${selectedManufacturer}"`}
                </p>
              </div>

              {/* Vaccine Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {vaccines.map(renderVaccineCard)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccineSearchPage;