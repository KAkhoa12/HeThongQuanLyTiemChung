import React, { useState, useEffect, useRef, useMemo } from 'react';
import ImageCard from './ImageCard';

interface Image {
  maAnh: string;
  urlAnh: string;
  altText?: string;
  tenNhan?: string;
  ngayTao: string;
}

interface VirtualizedImageGridProps {
  images: Image[];
  selectedImages: string[];
  onToggleSelect: (id: string) => void;
  onEdit: (image: Image) => void;
  onImageClick: (index: number) => void;
  itemHeight?: number;
  containerHeight?: number;
}

const VirtualizedImageGrid: React.FC<VirtualizedImageGridProps> = ({
  images,
  selectedImages,
  onToggleSelect,
  onEdit,
  onImageClick,
  itemHeight = 300,
  containerHeight = 600
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tính toán số cột dựa trên container width
  const getColumnsCount = useMemo(() => {
    if (containerWidth < 640) return 1; // sm
    if (containerWidth < 1024) return 2; // lg
    if (containerWidth < 1280) return 3; // xl
    if (containerWidth < 1536) return 4; // 2xl
    return 5; // > 2xl
  }, [containerWidth]);

  // Tính toán các items hiển thị
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight) * getColumnsCount;
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) * getColumnsCount + getColumnsCount,
      images.length
    );
    
    return images.slice(startIndex, endIndex).map((image, index) => ({
      image,
      index: startIndex + index
    }));
  }, [scrollTop, itemHeight, getColumnsCount, containerHeight, images]);

  // Theo dõi container width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = Math.ceil(images.length / getColumnsCount) * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${getColumnsCount}, minmax(0, 1fr))`,
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map(({ image, index }) => (
            <div key={image.maAnh} style={{ height: itemHeight }}>
              <ImageCard
                image={image}
                index={index}
                isSelected={selectedImages.includes(image.maAnh)}
                onToggleSelect={onToggleSelect}
                onEdit={onEdit}
                onImageClick={onImageClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedImageGrid;