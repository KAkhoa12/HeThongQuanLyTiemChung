import React, { memo } from 'react';
import LazyImage from './LazyImage';
import API_CONFIG from '../config/api.config';

interface Image {
  maAnh: string;
  urlAnh: string;
  altText?: string;
  tenNhan?: string;
  ngayTao: string;
}

interface ImageCardProps {
  image: Image;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (image: Image) => void;
  onImageClick: (index: number) => void;
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = memo(({
  image,
  isSelected,
  onToggleSelect,
  onEdit,
  onImageClick,
  index
}) => {
  const handleImageClick = () => {
    onImageClick(index);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(image);
  };

  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleSelect(image.maAnh);
  };

  return (
    <div
      className={`group relative rounded-lg border border-stroke bg-white p-4 transition-all hover:shadow-lg dark:border-strokedark dark:bg-boxdark ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxClick}
          className="rounded border-stroke cursor-pointer"
        />
        <div className="flex gap-1">
          <button
            onClick={handleEditClick}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
            aria-label="Chỉnh sửa ảnh"
          >
            <i className="ri-edit-line"></i>
          </button>
        </div>
      </div>

      <div className="mb-3 aspect-square overflow-hidden rounded-lg">
        <LazyImage
          src={`${API_CONFIG.BASE_URL}${image.urlAnh}`}
          alt={image.altText || 'Image'}
          className="h-full w-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
          onClick={handleImageClick}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-black dark:text-white line-clamp-2">
          {image.altText || 'Không có mô tả'}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">
          Nhãn: {image.tenNhan || 'Không có nhãn'}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(image.ngayTao).toLocaleDateString('vi-VN')}
        </p>
      </div>
    </div>
  );
});

ImageCard.displayName = 'ImageCard';

export default ImageCard;