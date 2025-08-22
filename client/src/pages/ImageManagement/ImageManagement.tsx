import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../../hooks/useToast';
import imageService, { Image, ImageUpdateDto } from '../../services/image.service';
import imageLabelService, { ImageLabel, ImageLabelCreateDto, ImageLabelUpdateDto } from '../../services/imageLabel.service';
import API_CONFIG from '../../config/api.config';
import ImageLightbox from '../../components/ImageLightbox';
import ImageCard from '../../components/ImageCard';
import VirtualizedImageGrid from '../../components/VirtualizedImageGrid';

const ImageManagement: React.FC = () => {
  // State for images
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(50); // Cho phép thay đổi page size
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false); // Track image loading separately

  // State for labels
  const [labels, setLabels] = useState<ImageLabel[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [labelsLoaded, setLabelsLoaded] = useState(false); // Track if labels are loaded
  const isMountedRef = useRef(false); // Track if component is mounted

  // State for modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [editingLabel, setEditingLabel] = useState<ImageLabel | null>(null);

  // State for forms
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploadLabelId, setUploadLabelId] = useState('');
  const [editForm, setEditForm] = useState<ImageUpdateDto>({
    altText: '',
    maNhan: '',
    isActive: true
  });
  const [labelForm, setLabelForm] = useState<ImageLabelCreateDto>({
    tenNhan: '',
    moTa: ''
  });

  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { showSuccess, showError } = useToast();

  const loadLabels = useCallback(async () => {
    // Chỉ load labels nếu chưa load
    if (labelsLoaded) return;
    
    try {
      const labelsData = await imageLabelService.getAllLabels();
      setLabels(labelsData);
      setLabelsLoaded(true); // Mark as loaded
      if (labelsData.length > 0 && !uploadLabelId) {
        setUploadLabelId(labelsData[0].maNhan);
      }
    } catch (error) {
      showError('Lỗi', 'Không thể tải danh sách nhãn ảnh');
    }
  }, []); // Empty dependency array - chỉ chạy 1 lần

  const loadImages = useCallback(async () => {
    // Tránh gọi API nếu đang load
    if (isLoadingImages) return;
    
    try {
      setIsLoadingImages(true);
      let imagesData;
      
      if (selectedLabel === 'all') {
        imagesData = await imageService.getAllImages(currentPage, pageSize);
      } else {
        imagesData = await imageService.getImagesByLabel(selectedLabel, currentPage, pageSize);
      }
      
      setImages(imagesData.data);
      setTotalPages(imagesData.totalPages);
      setTotalCount(imagesData.totalCount);
    } catch (error) {
      showError('Lỗi', 'Không thể tải danh sách ảnh');
    } finally {
      setIsLoadingImages(false);
    }
  }, [currentPage, selectedLabel, pageSize, isLoadingImages]);

  // Load labels only once on component mount
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      loadLabels();
    }
  }, []); // Empty dependency array - chỉ chạy 1 lần

  // Load images when page, pageSize, or label changes
  useEffect(() => {
    if (isMountedRef.current) {
      loadImages();
    }
  }, [currentPage, pageSize, selectedLabel]); // Reload khi thay đổi page, pageSize hoặc label

  // Reload labels when labelsLoaded changes
  useEffect(() => {
    if (isMountedRef.current && !labelsLoaded) {
      loadLabels();
    }
  }, [labelsLoaded]); // Chỉ chạy khi labelsLoaded thay đổi

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup any pending operations if needed
    };
  }, []);

  // Handle label change without auto-reload
  const handleLabelChange = useCallback((newLabel: string) => {
    setSelectedLabel(newLabel);
    setCurrentPage(1); // Reset to first page when changing label
  }, []); // Empty dependency array

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files);
      setUploadFiles(fileArray);
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      showError('Lỗi', 'Vui lòng chọn ít nhất một file ảnh');
      return;
    }

    if (!uploadLabelId) {
      showError('Lỗi', 'Vui lòng chọn nhãn ảnh');
      return;
    }

    try {
      setIsLoading(true);
      await imageService.uploadImages(uploadFiles, uploadAltText, uploadLabelId);
      
      showSuccess('Thành công', 'Upload ảnh thành công!');
      setShowUploadModal(false);
      setUploadFiles([]);
      setUploadAltText('');
      setCurrentPage(1);
    } catch (error) {
      showError('Lỗi', 'Upload ảnh thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditImage = (image: Image) => {
    setEditingImage(image);
    setEditForm({
      altText: image.altText || '',
      maNhan: image.maNhan || '',
      isActive: true
    });
    setShowEditModal(true);
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    try {
      setIsLoading(true);
      await imageService.updateImage(editingImage.maAnh, editForm);
      
      showSuccess('Thành công', 'Cập nhật ảnh thành công!');
      setShowEditModal(false);
      setEditingImage(null);
      // Reload images by resetting page to trigger useEffect
      setCurrentPage(1);
    } catch (error) {
      showError('Lỗi', 'Cập nhật ảnh thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImages = async () => {
    if (selectedImages.length === 0) {
      showError('Lỗi', 'Vui lòng chọn ảnh để xóa');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedImages.length} ảnh đã chọn?`)) {
      return;
    }

    try {
      setIsLoading(true);
      await imageService.deleteImages(selectedImages);
      
      showSuccess('Thành công', 'Xóa ảnh thành công!');
      setSelectedImages([]);
      // Reload images by resetting page to trigger useEffect
      setCurrentPage(1);
    } catch (error) {
      showError('Lỗi', 'Xóa ảnh thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLabel = async () => {
    if (!labelForm.tenNhan.trim()) {
      showError('Lỗi', 'Vui lòng nhập tên nhãn');
      return;
    }

    try {
      setIsLoading(true);
      await imageLabelService.createLabel(labelForm);
      
      showSuccess('Thành công', 'Tạo nhãn ảnh thành công!');
      setShowLabelModal(false);
      setLabelForm({ tenNhan: '', moTa: '' });
      // Reset labels loaded state to trigger reload
      setLabelsLoaded(false);
    } catch (error) {
      showError('Lỗi', 'Tạo nhãn ảnh thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLabel = (label: ImageLabel) => {
    setEditingLabel(label);
    setLabelForm({
      tenNhan: label.tenNhan,
      moTa: label.moTa || ''
    });
    setShowLabelModal(true);
  };

  const handleUpdateLabel = async () => {
    if (!editingLabel) return;

    try {
      setIsLoading(true);
      await imageLabelService.updateLabel(editingLabel.maNhan, labelForm);
      
      showSuccess('Thành công', 'Cập nhật nhãn ảnh thành công!');
      setShowLabelModal(false);
      setEditingLabel(null);
      setLabelForm({ tenNhan: '', moTa: '' });
      // Reset labels loaded state to trigger reload
      setLabelsLoaded(false);
    } catch (error) {
      showError('Lỗi', 'Cập nhật nhãn ảnh thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhãn này?')) {
      return;
    }

    try {
      setIsLoading(true);
      await imageLabelService.deleteLabel(labelId);
      
      showSuccess('Thành công', 'Xóa nhãn ảnh thành công!');
      // Reset labels loaded state to trigger reload
      setLabelsLoaded(false);
      if (selectedLabel === labelId) {
        setSelectedLabel('all');
      }
    } catch (error) {
      showError('Lỗi', 'Xóa nhãn ảnh thất bại');
    } finally {
      setIsLoading(false);
    }
  };

    const toggleImageSelection = useCallback((imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img.maAnh));
    }
  }, [selectedImages.length, images]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Quản lý Ảnh
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLabelModal(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <i className="ri-add-line mr-2"></i>
            Thêm Nhãn
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <i className="ri-upload-line mr-2"></i>
            Upload Ảnh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-24 z-50 mb-6 rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Lọc theo nhãn:</label>
            <select
              value={selectedLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="rounded border border-stroke px-3 py-2 text-sm dark:border-strokedark dark:bg-boxdark"
            >
              <option value="all">Tất cả</option>
              {labels.map(label => (
                <option key={label.maNhan} value={label.maNhan}>
                  {label.tenNhan}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Số ảnh mỗi trang:</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded border border-stroke px-3 py-2 text-sm dark:border-strokedark dark:bg-boxdark"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          
          {/* Nút reload */}
          <button
            onClick={() => {
              setCurrentPage(1);
              loadImages();
            }}
            disabled={isLoadingImages}
            className="inline-flex items-center justify-center rounded-md bg-secondary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            title="Tải lại danh sách ảnh"
          >
            <i className="ri-refresh-line mr-2"></i>
            {isLoadingImages ? 'Đang tải...' : 'Tải lại'}
          </button>
            {selectedImages.length > 0 && (
            <button
                onClick={handleDeleteImages}
                className="inline-flex items-center justify-center rounded-md bg-danger py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
                <i className="ri-delete-bin-line mr-2"></i>
                Xóa {selectedImages.length} ảnh
            </button>
            )}
        </div>
        
      </div>

      {/* Images Grid */}
      {isLoadingImages ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedImages.length === images.length && images.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-stroke"
              />
              <span className="text-sm text-gray-600">
                Chọn tất cả ({selectedImages.length}/{images.length})
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Hiển thị: {images.length} / {totalCount} ảnh</span>
              <span>•</span>
              <span>Page size: {pageSize}</span>
            </div>
          </div>

          {/* Sử dụng VirtualizedGrid nếu có nhiều ảnh (>100), ngược lại dùng grid thường */}
          {images.length > 100 ? (
            <VirtualizedImageGrid
              images={images}
              selectedImages={selectedImages}
              onToggleSelect={toggleImageSelection}
              onEdit={handleEditImage}
              onImageClick={openLightbox}
              containerHeight={600}
              itemHeight={320}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {images.map((image, index) => (
                <ImageCard
                  key={image.maAnh}
                  image={image}
                  index={index}
                  isSelected={selectedImages.includes(image.maAnh)}
                  onToggleSelect={toggleImageSelection}
                  onEdit={handleEditImage}
                  onImageClick={openLightbox}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-4">
              {/* Page info */}
              <div className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages} • Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} / {totalCount} ảnh
              </div>
              
              {/* Page navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded border border-stroke px-3 py-2 text-sm disabled:opacity-50 dark:border-strokedark"
                >
                  Trước
                </button>
                
                {/* Show limited page numbers for better UX */}
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 7;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                  
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }
                  
                  // Add first page if not visible
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => setCurrentPage(1)}
                        className="rounded px-3 py-2 text-sm border border-stroke dark:border-strokedark"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(<span key="ellipsis1" className="px-2">...</span>);
                    }
                  }
                  
                  // Add visible pages
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`rounded px-3 py-2 text-sm ${
                          currentPage === i
                            ? 'bg-primary text-white'
                            : 'border border-stroke dark:border-strokedark'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  
                  // Add last page if not visible
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(<span key="ellipsis2" className="px-2">...</span>);
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className="rounded px-3 py-2 text-sm border border-stroke dark:border-strokedark"
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded border border-stroke px-3 py-2 text-sm disabled:opacity-50 dark:border-strokedark"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-lg font-semibold">Upload Ảnh</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Chọn ảnh:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-boxdark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả:</label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="Mô tả ảnh"
                  className="w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-boxdark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nhãn:</label>
                <select
                  value={uploadLabelId}
                  onChange={(e) => setUploadLabelId(e.target.value)}
                  className="w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-boxdark"
                >
                  {labels.map(label => (
                    <option key={label.maNhan} value={label.maNhan}>
                      {label.tenNhan}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 rounded border border-stroke px-4 py-2 text-sm dark:border-strokedark"
              >
                Hủy
              </button>
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="flex-1 rounded bg-primary px-4 py-2 text-sm text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {isLoading ? 'Đang upload...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {showEditModal && editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-lg font-semibold">Chỉnh sửa Ảnh</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả:</label>
                <input
                  type="text"
                  value={editForm.altText}
                  onChange={(e) => setEditForm(prev => ({ ...prev, altText: e.target.value }))}
                  className="w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-boxdark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nhãn:</label>
                <select
                  value={editForm.maNhan}
                  onChange={(e) => setEditForm(prev => ({ ...prev, maNhan: e.target.value }))}
                  className="w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-boxdark"
                >
                  {labels.map(label => (
                    <option key={label.maNhan} value={label.maNhan}>
                      {label.tenNhan}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 rounded border border-stroke px-4 py-2 text-sm dark:border-strokedark"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateImage}
                disabled={isLoading}
                className="flex-1 rounded bg-primary px-4 py-2 text-sm text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Label Modal */}
      {showLabelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-lg font-semibold">
              {editingLabel ? 'Chỉnh sửa Nhãn' : 'Thêm Nhãn Mới'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tên nhãn:</label>
                <input
                  type="text"
                  value={labelForm.tenNhan}
                  onChange={(e) => setLabelForm(prev => ({ ...prev, tenNhan: e.target.value }))}
                  placeholder="Nhập tên nhãn"
                  className="w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-boxdark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả:</label>
                <textarea
                  value={labelForm.moTa}
                  onChange={(e) => setLabelForm(prev => ({ ...prev, moTa: e.target.value }))}
                  placeholder="Mô tả nhãn (không bắt buộc)"
                  rows={3}
                  className="w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-boxdark"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setShowLabelModal(false);
                  setEditingLabel(null);
                  setLabelForm({ tenNhan: '', moTa: '' });
                }}
                className="flex-1 rounded border border-stroke px-4 py-2 text-sm dark:border-strokedark"
              >
                Hủy
              </button>
              <button
                onClick={editingLabel ? handleUpdateLabel : handleCreateLabel}
                disabled={isLoading}
                className="flex-1 rounded bg-primary px-4 py-2 text-sm text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : (editingLabel ? 'Cập nhật' : 'Tạo')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default ImageManagement; 