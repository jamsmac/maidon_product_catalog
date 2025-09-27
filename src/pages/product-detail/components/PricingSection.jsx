import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingSection = ({ pricing, onQuoteRequest }) => {
  const [selectedPriceType, setSelectedPriceType] = useState('retail');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const getCurrentPrice = () => {
    return selectedPriceType === 'wholesale' ? pricing?.wholesale : pricing?.retail;
  };

  const getSavingsAmount = () => {
    if (pricing?.discount && pricing?.discount?.amount > 0) {
      return pricing?.discount?.amount;
    }
    return 0;
  };

  const getOriginalPrice = () => {
    const currentPrice = getCurrentPrice();
    const savings = getSavingsAmount();
    return currentPrice + savings;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
        Цены и условия
      </h2>
      {/* Price Type Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setSelectedPriceType('retail')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              selectedPriceType === 'retail' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Розничная цена
          </button>
          <button
            onClick={() => setSelectedPriceType('wholesale')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              selectedPriceType === 'wholesale' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Оптовая цена
          </button>
        </div>
        {selectedPriceType === 'wholesale' && (
          <span className="text-xs text-muted-foreground">
            от {pricing?.wholesaleMinQty} шт.
          </span>
        )}
      </div>
      {/* Main Price Display */}
      <div className="flex items-baseline gap-3 mb-4">
        <div className="text-3xl font-heading font-bold text-foreground">
          {formatPrice(getCurrentPrice())}
        </div>
        {getSavingsAmount() > 0 && (
          <>
            <div className="text-lg text-muted-foreground line-through">
              {formatPrice(getOriginalPrice())}
            </div>
            <div className="bg-error text-error-foreground px-2 py-1 rounded-full text-sm font-medium">
              -{formatPrice(getSavingsAmount())}
            </div>
          </>
        )}
      </div>
      {/* Discount Information */}
      {pricing?.discount && pricing?.discount?.amount > 0 && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Tag" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              {pricing?.discount?.type === 'percentage' ? 'Скидка' : 'Экономия'}
            </span>
          </div>
          <p className="text-sm text-foreground">
            {pricing?.discount?.description}
          </p>
          {pricing?.discount?.validUntil && (
            <p className="text-xs text-muted-foreground mt-1">
              Действует до: {new Date(pricing.discount.validUntil)?.toLocaleDateString('ru-RU')}
            </p>
          )}
        </div>
      )}
      {/* Payment Options */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-medium text-foreground">Варианты оплаты:</h3>
        
        {pricing?.paymentOptions?.map((option, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name={option?.icon} size={20} className="text-primary" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {option?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {option?.description}
                </div>
              </div>
            </div>
            {option?.monthlyPayment && (
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  от {formatPrice(option?.monthlyPayment)}/мес
                </div>
                <div className="text-xs text-muted-foreground">
                  на {option?.term} мес.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Additional Costs */}
      {pricing?.additionalCosts && pricing?.additionalCosts?.length > 0 && (
        <div className="border-t border-border pt-4 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Дополнительные расходы:
          </h3>
          <div className="space-y-2">
            {pricing?.additionalCosts?.map((cost, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{cost?.name}</span>
                <span className="text-foreground font-medium">
                  {cost?.price ? formatPrice(cost?.price) : cost?.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          variant="default" 
          fullWidth
          iconName="ShoppingCart"
          iconPosition="left"
        >
          Купить сейчас
        </Button>
        <Button 
          variant="outline" 
          fullWidth
          iconName="FileText"
          iconPosition="left"
          onClick={onQuoteRequest}
        >
          Запросить КП
        </Button>
      </div>
      {/* Price Note */}
      <p className="text-xs text-muted-foreground mt-3 text-center">
        * Цены указаны без НДС. Окончательная стоимость может изменяться в зависимости от конфигурации и дополнительных опций.
      </p>
    </div>
  );
};

export default PricingSection;