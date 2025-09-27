import React, { useState, useEffect } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StickyCTAPanel = ({ product, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = 600; // Approximate hero section height
      setIsVisible(scrollPosition > heroHeight);
    };

    checkMobile();
    handleScroll();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const ctaButtons = [
    {
      id: 'buy',
      label: 'Купить',
      icon: 'ShoppingCart',
      variant: 'default',
      primary: true
    },
    {
      id: 'lease',
      label: 'Лизинг',
      icon: 'CreditCard',
      variant: 'outline'
    },
    {
      id: 'quote',
      label: 'КП',
      icon: 'FileText',
      variant: 'outline'
    },
    {
      id: 'demo',
      label: 'Демо',
      icon: 'Calendar',
      variant: 'outline'
    },
    {
      id: 'contact',
      label: 'Связаться',
      icon: 'Phone',
      variant: 'ghost'
    }
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop Sticky Panel */}
      {!isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Product Summary */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-sm">
                    {product?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {product?.modelCode}
                  </p>
                </div>
                <div className="text-lg font-heading font-bold text-foreground">
                  {formatPrice(product?.pricing?.retail)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {ctaButtons?.map((button) => (
                  <Button
                    key={button?.id}
                    variant={button?.variant}
                    size={button?.primary ? 'default' : 'sm'}
                    iconName={button?.icon}
                    iconPosition="left"
                    onClick={() => onAction?.(button?.id)}
                    className={button?.primary ? 'px-6' : ''}
                  >
                    {button?.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Sticky Panel */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg">
          <div className="p-4">
            {/* Price and Product Info */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-lg font-heading font-bold text-foreground">
                  {formatPrice(product?.pricing?.retail)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {product?.name}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAction?.('wishlist')}
                >
                  <Icon name="Heart" size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAction?.('share')}
                >
                  <Icon name="Share2" size={18} />
                </Button>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Button
                variant="default"
                fullWidth
                iconName="ShoppingCart"
                iconPosition="left"
                onClick={() => onAction?.('buy')}
              >
                Купить
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="FileText"
                iconPosition="left"
                onClick={() => onAction?.('quote')}
              >
                Запрос КП
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                iconName="CreditCard"
                iconPosition="left"
                onClick={() => onAction?.('lease')}
              >
                Лизинг
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                iconName="Calendar"
                iconPosition="left"
                onClick={() => onAction?.('demo')}
              >
                Демо
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                iconName="Phone"
                iconPosition="left"
                onClick={() => onAction?.('contact')}
              >
                Звонок
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Spacer to prevent content overlap */}
      <div className={`${isMobile ? 'h-32' : 'h-20'}`} />
    </>
  );
};

export default StickyCTAPanel;