import { Play, Maximize2, RotateCcw, Box } from 'lucide-react';
import React, { useState } from 'react';

const MediaGallery = ({ media = [], onMediaInteraction }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedMedia = media?.[selectedIndex];

  const handleMediaClick = (mediaItem, index) => {
    setSelectedIndex(index);
    
    // Track media interaction
    if (onMediaInteraction) {
      onMediaInteraction(mediaItem?.type, mediaItem?.url);
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    
    // Track fullscreen interaction
    if (onMediaInteraction) {
      onMediaInteraction('fullscreen', selectedMedia?.url);
    }
  };

  const renderMediaContent = (mediaItem) => {
    switch (mediaItem?.type) {
      case 'video':
        return (
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
            <img
              src={mediaItem?.thumbnail}
              alt={mediaItem?.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => handleMediaClick(mediaItem, selectedIndex)}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label={`Воспроизвести видео: ${mediaItem?.alt}`}
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </button>
            </div>
          </div>
        );
      
      case '360':
        return (
          <div className="relative w-full h-full">
            <img
              src={mediaItem?.thumbnail}
              alt={mediaItem?.alt}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">360°</span>
            </div>
          </div>
        );
      
      case '3d':
        return (
          <div className="relative w-full h-full">
            <img
              src={mediaItem?.thumbnail}
              alt={mediaItem?.alt}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
              <Box className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">3D</span>
            </div>
          </div>
        );
      
      default:
        return (
          <img
            src={mediaItem?.url}
            alt={mediaItem?.alt}
            className="w-full h-full object-cover rounded-lg"
            loading={selectedIndex === 0 ? "eager" : "lazy"}
          />
        );
    }
  };

  if (!media || media?.length === 0) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Изображения не найдены</p>
      </div>
    );
  }

  return (
    <section className="space-y-4" aria-label="Галерея изображений товара">
      {/* Main Media Display */}
      <div className="relative">
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted rounded-lg">
          {renderMediaContent(selectedMedia)}
        </div>
        
        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreenToggle}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
          aria-label="Открыть в полноэкранном режиме"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </button>

        {/* Media Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm font-medium">
            {selectedIndex + 1} / {media?.length}
          </span>
        </div>
      </div>
      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-5 gap-2 md:grid-cols-6 lg:grid-cols-5">
        {media?.map((mediaItem, index) => (
          <button
            key={index}
            onClick={() => handleMediaClick(mediaItem, index)}
            className={`
              relative aspect-square rounded-lg overflow-hidden border-2 transition-all
              ${index === selectedIndex 
                ? 'border-primary shadow-lg' 
                : 'border-transparent hover:border-muted-foreground/50'
              }
            `}
            aria-label={`Изображение ${index + 1}: ${mediaItem?.alt}`}
          >
            <img
              src={mediaItem?.type === 'video' ? mediaItem?.thumbnail : mediaItem?.url}
              alt={mediaItem?.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Media Type Indicator */}
            {mediaItem?.type !== 'image' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                {mediaItem?.type === 'video' && <Play className="w-4 h-4 text-white" />}
                {mediaItem?.type === '360' && <RotateCcw className="w-4 h-4 text-white" />}
                {mediaItem?.type === '3d' && <Box className="w-4 h-4 text-white" />}
              </div>
            )}
          </button>
        ))}
      </div>
      {/* Media Description */}
      {selectedMedia?.description && (
        <p className="text-sm text-muted-foreground text-center">
          {selectedMedia?.description}
        </p>
      )}
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={handleFullscreenToggle}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Закрыть полноэкранный режим"
            >
              <span className="text-xl">✕</span>
            </button>
            <div className="max-w-full max-h-[90vh]">
              {renderMediaContent(selectedMedia)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaGallery;