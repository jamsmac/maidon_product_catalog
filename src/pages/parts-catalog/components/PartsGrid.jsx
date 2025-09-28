import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PartsGrid = ({ parts, onAddToCart, onRequestQuote, onViewDetails }) => {
  const [viewMode, setViewMode] = useState('grid');

  const getAvailabilityBadge = (status) => {
    const badges = {
      'in-stock': { text: 'В наличии', className: 'bg-success/10 text-success border-success/20' },
      'order': { text: 'Под заказ', className: 'bg-warning/10 text-warning border-warning/20' },
      'out-of-stock': { text: 'Нет в наличии', className: 'bg-error/10 text-error border-error/20' }
    };
    
    const badge = badges?.[status] || badges?.['order'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badge?.className}`}>
        {badge?.text}
      </span>
    );
  };

  const getQualityBadge = (type) => {
    const badges = {
      'oem': { text: 'OEM', className: 'bg-primary/10 text-primary border-primary/20' },
      'premium': { text: 'Премиум', className: 'bg-accent/10 text-accent border-accent/20' },
      'standard': { text: 'Стандарт', className: 'bg-muted text-muted-foreground border-border' }
    };
    
    const badge = badges?.[type] || badges?.['standard'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badge?.className}`}>
        {badge?.text}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  if (!parts || parts?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Package" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Запчасти не найдены
            </h3>
            <p className="text-muted-foreground">
              Попробуйте изменить параметры поиска или фильтры
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Показано {parts?.length} из {parts?.length} запчастей
        </p>
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md transition-all duration-200 ${
              viewMode === 'grid' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Grid3X3" size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md transition-all duration-200 ${
              viewMode === 'list' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="List" size={16} />
          </button>
        </div>
      </div>
      {/* Parts Grid/List */}
      <div className={
        viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :'space-y-4'
      }>
        {parts?.map((part) => (
          <div
            key={part?.id}
            className={`bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            {/* Image */}
            <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'} overflow-hidden ${viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg'}`}>
              <Image
                src={part?.image}
                alt={part?.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-1 line-clamp-2">
                    {part?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-data">
                    Артикул: {part?.partNumber}
                  </p>
                </div>
                <button
                  onClick={() => onViewDetails(part)}
                  className="ml-2 p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <Icon name="ExternalLink" size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {getAvailabilityBadge(part?.availability)}
                {getQualityBadge(part?.quality)}
              </div>

              {/* Compatibility */}
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Совместимость:</p>
                <p className="text-sm text-foreground">
                  {part?.compatibility?.join(', ')}
                </p>
              </div>

              {/* Price and Actions */}
              <div className={`${viewMode === 'list' ? 'mt-auto' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-lg font-heading font-bold text-foreground">
                      {formatPrice(part?.price)}
                    </p>
                    {part?.oldPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(part?.oldPrice)}
                      </p>
                    )}
                  </div>
                  {part?.discount && (
                    <span className="bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full">
                      -{part?.discount}%
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onAddToCart(part)}
                    iconName="ShoppingCart"
                    iconPosition="left"
                    className="flex-1"
                    disabled={part?.availability === 'out-of-stock'}
                  >
                    В корзину
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRequestQuote(part)}
                    iconName="FileText"
                    size="icon"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartsGrid;