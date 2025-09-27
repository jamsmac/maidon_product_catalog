import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const InteractivePartsDiagram = ({ selectedEquipment, onPartSelect }) => {
  const [selectedView, setSelectedView] = useState('front');
  const [hoveredPart, setHoveredPart] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);

  // Mock diagram data
  const diagramViews = {
    front: {
      name: 'Вид спереди',
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg',
      hotspots: [
        { id: 'headlight', x: 25, y: 30, partNumber: 'HL-001', name: 'Фара передняя', price: 15000 },
        { id: 'fork', x: 50, y: 70, partNumber: 'FK-002', name: 'Вилы погрузочные', price: 45000 },
        { id: 'tire-front', x: 20, y: 85, partNumber: 'TR-003', name: 'Шина передняя', price: 12000 },
        { id: 'mast', x: 50, y: 45, partNumber: 'MS-004', name: 'Мачта подъема', price: 120000 }
      ]
    },
    side: {
      name: 'Вид сбоку',
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg',
      hotspots: [
        { id: 'cabin', x: 75, y: 35, partNumber: 'CB-005', name: 'Кабина оператора', price: 250000 },
        { id: 'engine', x: 85, y: 60, partNumber: 'EN-006', name: 'Двигатель', price: 350000 },
        { id: 'hydraulic', x: 60, y: 50, partNumber: 'HY-007', name: 'Гидроцилиндр', price: 85000 },
        { id: 'tire-rear', x: 80, y: 85, partNumber: 'TR-008', name: 'Шина задняя', price: 14000 }
      ]
    },
    top: {
      name: 'Вид сверху',
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg',
      hotspots: [
        { id: 'roof', x: 50, y: 40, partNumber: 'RF-009', name: 'Крыша кабины', price: 45000 },
        { id: 'counterweight', x: 50, y: 80, partNumber: 'CW-010', name: 'Противовес', price: 180000 }
      ]
    }
  };

  const currentView = diagramViews?.[selectedView];

  const handleHotspotClick = (hotspot) => {
    setSelectedPart(hotspot);
    onPartSelect && onPartSelect(hotspot);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Layers" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">
              Интерактивная схема
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedEquipment || 'Погрузчик 3т - Модель FL-3000'}
            </p>
          </div>
        </div>
      </div>
      {/* View Selector */}
      <div className="p-4 border-b border-border">
        <div className="flex space-x-2">
          {Object.entries(diagramViews)?.map(([key, view]) => (
            <Button
              key={key}
              variant={selectedView === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView(key)}
            >
              {view?.name}
            </Button>
          ))}
        </div>
      </div>
      {/* Interactive Diagram */}
      <div className="p-4">
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
          {/* Background Image */}
          <Image
            src={currentView?.image}
            alt={`${currentView?.name} схема`}
            className="w-full h-full object-cover"
          />

          {/* Hotspots */}
          {currentView?.hotspots?.map((hotspot) => (
            <button
              key={hotspot?.id}
              className={`absolute w-6 h-6 rounded-full border-2 transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                selectedPart?.id === hotspot?.id
                  ? 'bg-primary border-primary-foreground scale-125 shadow-lg'
                  : hoveredPart === hotspot?.id
                  ? 'bg-accent border-accent-foreground scale-110 shadow-md'
                  : 'bg-card border-primary hover:scale-110 hover:shadow-md'
              }`}
              style={{
                left: `${hotspot?.x}%`,
                top: `${hotspot?.y}%`
              }}
              onClick={() => handleHotspotClick(hotspot)}
              onMouseEnter={() => setHoveredPart(hotspot?.id)}
              onMouseLeave={() => setHoveredPart(null)}
              title={hotspot?.name}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${
                  selectedPart?.id === hotspot?.id || hoveredPart === hotspot?.id
                    ? 'bg-white' :'bg-primary'
                }`} />
              </div>
            </button>
          ))}

          {/* Tooltip */}
          {hoveredPart && (
            <div
              className="absolute z-10 bg-card border border-border rounded-lg shadow-lg p-3 pointer-events-none"
              style={{
                left: `${currentView?.hotspots?.find(h => h?.id === hoveredPart)?.x}%`,
                top: `${(currentView?.hotspots?.find(h => h?.id === hoveredPart)?.y || 0) - 10}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {currentView?.hotspots?.find(h => h?.id === hoveredPart)?.name}
                </p>
                <p className="text-muted-foreground font-data">
                  {currentView?.hotspots?.find(h => h?.id === hoveredPart)?.partNumber}
                </p>
                <p className="font-semibold text-primary">
                  {formatPrice(currentView?.hotspots?.find(h => h?.id === hoveredPart)?.price || 0)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Доступные запчасти</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>Выбранная деталь</span>
            </div>
          </div>
        </div>
      </div>
      {/* Selected Part Details */}
      {selectedPart && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-semibold text-foreground">
                {selectedPart?.name}
              </h4>
              <p className="text-sm text-muted-foreground font-data">
                Артикул: {selectedPart?.partNumber}
              </p>
              <p className="text-lg font-bold text-primary">
                {formatPrice(selectedPart?.price)}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
              >
                Подробнее
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="ShoppingCart"
                iconPosition="left"
              >
                В корзину
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractivePartsDiagram;