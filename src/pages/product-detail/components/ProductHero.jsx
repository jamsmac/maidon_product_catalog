import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductHero = ({ product, onWishlistToggle, onCompareToggle }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    onWishlistToggle?.(!isWishlisted);
  };

  const handleCompareClick = () => {
    setIsCompared(!isCompared);
    onCompareToggle?.(!isCompared);
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={16} className="text-warning fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Image */}
        <div className="lg:w-1/3">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={product?.image}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
            {product?.badges?.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {product?.badges?.map((badge, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      badge?.type === 'new' ? 'bg-success text-success-foreground' :
                      badge?.type === 'top-seller' ? 'bg-warning text-warning-foreground' :
                      badge?.type === 'promotion' ? 'bg-error text-error-foreground' :
                      'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {badge?.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-2/3 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                {product?.name}
              </h1>
              <p className="text-muted-foreground font-body mb-3">
                Модель: {product?.modelCode}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {renderRatingStars(product?.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product?.rating} ({product?.reviewCount} отзывов)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWishlistClick}
                className={isWishlisted ? 'text-error' : 'text-muted-foreground'}
              >
                <Icon 
                  name={isWishlisted ? "Heart" : "Heart"} 
                  size={20} 
                  className={isWishlisted ? 'fill-current' : ''} 
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCompareClick}
                className={isCompared ? 'text-secondary' : 'text-muted-foreground'}
              >
                <Icon name="GitCompare" size={20} />
              </Button>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {product?.keyFeatures?.map((feature, index) => (
              <div key={index} className="text-center p-3 bg-muted rounded-lg">
                <Icon 
                  name={feature?.icon} 
                  size={24} 
                  className="text-primary mx-auto mb-2" 
                />
                <div className="text-sm font-medium text-foreground">
                  {feature?.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {feature?.label}
                </div>
              </div>
            ))}
          </div>

          {/* Availability Status */}
          <div className="flex items-center gap-2">
            <Icon 
              name={product?.availability?.inStock ? "CheckCircle" : "XCircle"} 
              size={16} 
              className={product?.availability?.inStock ? 'text-success' : 'text-error'} 
            />
            <span className={`text-sm font-medium ${
              product?.availability?.inStock ? 'text-success' : 'text-error'
            }`}>
              {product?.availability?.status}
            </span>
            {product?.availability?.deliveryTime && (
              <span className="text-sm text-muted-foreground">
                • Доставка: {product?.availability?.deliveryTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;