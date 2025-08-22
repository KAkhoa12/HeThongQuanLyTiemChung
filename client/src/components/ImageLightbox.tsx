import React, { useState, useEffect } from 'react';
import { Image } from '../services/image.service';
import API_CONFIG from '../config/api.config';

interface ImageLightboxProps {
  images: Image[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90" >
      {/* Modal container */}
      <div className="relative w-[90vw] h-[90vh] max-w-6xl max-h-[90vh] bg-black rounded-lg overflow-hidden" >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75 transition-all"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black bg-opacity-50 p-3 text-white hover:bg-opacity-75 transition-all"
            >
              <i className="ri-arrow-left-s-line text-2xl"></i>
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black bg-opacity-50 p-3 text-white hover:bg-opacity-75 transition-all"
            >
              <i className="ri-arrow-right-s-line text-2xl"></i>
            </button>
          </>
        )}

        {/* Image container */}
        <div className="relative max-h-[80%] max-w-[80%] mx-auto mt-8 flex items-center justify-center h-full">
          <img
            src={`${API_CONFIG.BASE_URL}${currentImage.urlAnh}`}
            alt={currentImage.altText || 'Image'}
            className="h-full object-cover"
          />
          
          {/* Image info */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4 text-white rounded-b-lg">
            <div className="text-center">
              <p className="font-medium">
                {currentImage.altText || 'Không có mô tả'}
              </p>
              <p className="text-sm text-gray-300">
                Nhãn: {currentImage.tenNhan || 'Không có nhãn'} | 
                {new Date(currentImage.ngayTao).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-sm text-gray-300">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((image, index) => (
              <button
                key={image.maAnh}
                onClick={() => setCurrentIndex(index)}
                className={`h-12 w-12 rounded border-2 transition-all ${
                  index === currentIndex
                    ? 'border-primary'
                    : 'border-white border-opacity-50 hover:border-opacity-75'
                }`}
              >
                <img
                  src={`${API_CONFIG.BASE_URL}${image.urlAnh}`}
                  alt={image.altText || 'Thumbnail'}
                  className="h-full w-full rounded object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox; 