import React, { useState, useRef } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductPreview = ({ configuration, productData }) => {
  const [currentView, setCurrentView] = useState('front');
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const previewRef = useRef(null);

  const views = [
    { id: 'front', name: 'Спереди', icon: 'Eye' },
    { id: 'side', name: 'Сбоку', icon: 'RotateCcw' },
    { id: 'back', name: 'Сзади', icon: 'ArrowLeft' },
    { id: '3d', name: '3D вид', icon: 'Box' }
  ];

  const getConfiguredImage = () => {
    // Mock image URLs based on configuration
    const baseImages = {
      front: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
      side: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
      back: 'https://images.pexels.com/photos/1267324/pexels-photo-1267324.jpeg?auto=compress&cs=tinysrgb&w=800',
      '3d': 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
    
    return baseImages?.[currentView] || baseImages?.front;
  };

  const handleRotate = (direction) => {
    const newRotation = direction === 'left' ? rotation - 90 : rotation + 90;
    setRotation(newRotation);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const getConfigurationSummary = () => {
    const summaryItems = [
      { label: 'Мачта', value: configuration?.mast || 'standard', icon: 'ArrowUp' },
      { label: 'Вилы', value: configuration?.forks || 'standard_1200', icon: 'GitBranch' },
      { label: 'Колеса', value: configuration?.wheels || 'pneumatic', icon: 'Circle' },
      { label: 'Батарея', value: configuration?.battery || 'lead_acid', icon: 'Battery' },
      { label: 'Навесное', value: configuration?.attachments || 'none', icon: 'Wrench' },
      { label: 'Кабина', value: configuration?.cabin || 'open', icon: 'Home' }
    ];

    return summaryItems;
  };

  const getOptionDisplayName = (sectionId, optionId) => {
    const displayNames = {
      mast: {
        standard: 'Стандартная',
        extended: 'Удлиненная',
        triple: 'Трехсекционная'
      },
      forks: {
        standard_1200: 'Стандартные 1200мм',
        extended_1500: 'Удлиненные 1500мм',
        heavy_duty: 'Усиленные'
      },
      wheels: {
        pneumatic: 'Пневматические',
        solid: 'Цельнолитые',
        super_elastic: 'Суперэластичные'
      },
      battery: {
        lead_acid: 'Свинцово-кислотная',
        lithium_standard: 'Литий-ионная',
        lithium_extended: 'Литий-ионная увеличенная'
      },
      attachments: {
        none: 'Отсутствует',
        side_shift: 'Боковой сдвиг',
        rotator: 'Ротатор',
        clamp: 'Зажим для рулонов'
      },
      cabin: {
        open: 'Открытая',
        enclosed: 'Закрытая',
        premium: 'Премиум'
      }
    };

    return displayNames?.[sectionId]?.[optionId] || optionId;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Предварительный просмотр
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleZoom}
              iconName={isZoomed ? "ZoomOut" : "ZoomIn"}
              iconPosition="left"
              iconSize={16}
            >
              {isZoomed ? 'Уменьшить' : 'Увеличить'}
            </Button>
          </div>
        </div>
      </div>
      {/* View Controls */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {views?.map((view) => (
            <Button
              key={view?.id}
              variant={currentView === view?.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView(view?.id)}
              iconName={view?.icon}
              iconPosition="left"
              iconSize={16}
            >
              {view?.name}
            </Button>
          ))}
        </div>
      </div>
      {/* Product Preview */}
      <div className="p-4">
        <div 
          ref={previewRef}
          className={`
            relative bg-muted/30 rounded-lg overflow-hidden
            ${isZoomed ? 'h-96' : 'h-64'}
            transition-all duration-300
          `}
        >
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <Image
              src={getConfiguredImage()}
              alt={`Погрузчик - ${currentView} вид`}
              className={`
                max-w-full max-h-full object-contain transition-transform duration-300
                ${isZoomed ? 'scale-125' : 'scale-100'}
              `}
            />
          </div>

          {/* 3D Controls */}
          {currentView === '3d' && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-lg p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRotate('left')}
                  iconName="RotateCcw"
                  iconSize={16}
                />
                <span className="text-xs text-muted-foreground px-2">
                  360° обзор
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRotate('right')}
                  iconName="RotateCw"
                  iconSize={16}
                />
              </div>
            </div>
          )}

          {/* Zoom Indicator */}
          {isZoomed && (
            <div className="absolute top-4 right-4">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-xs text-muted-foreground">
                  Увеличено
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Configuration Summary */}
        <div className="mt-6">
          <h3 className="text-base font-heading font-semibold text-foreground mb-3">
            Текущая конфигурация
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getConfigurationSummary()?.map((item) => (
              <div
                key={item?.label}
                className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    className="text-primary" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item?.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {getOptionDisplayName(item?.label?.toLowerCase(), item?.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg">
          <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
            Основные характеристики
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Грузоподъемность:</span>
              <span className="ml-2 font-medium text-foreground">2000 кг</span>
            </div>
            <div>
              <span className="text-muted-foreground">Высота подъема:</span>
              <span className="ml-2 font-medium text-foreground">3500 мм</span>
            </div>
            <div>
              <span className="text-muted-foreground">Тип двигателя:</span>
              <span className="ml-2 font-medium text-foreground">Электрический</span>
            </div>
            <div>
              <span className="text-muted-foreground">Время работы:</span>
              <span className="ml-2 font-medium text-foreground">8 часов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;