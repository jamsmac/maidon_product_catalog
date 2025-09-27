import React, { useState, useEffect } from 'react';

import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DeliveryCalculator = ({ formData, updateFormData, errors }) => {
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const handleInputChange = (field, value) => {
    updateFormData('deliveryInfo', { ...formData?.deliveryInfo, [field]: value });
  };

  const regionOptions = [
    { value: 'moscow', label: 'Москва и Московская область' },
    { value: 'spb', label: 'Санкт-Петербург и Ленинградская область' },
    { value: 'central', label: 'Центральный федеральный округ' },
    { value: 'northwest', label: 'Северо-Западный федеральный округ' },
    { value: 'south', label: 'Южный федеральный округ' },
    { value: 'volga', label: 'Приволжский федеральный округ' },
    { value: 'ural', label: 'Уральский федеральный округ' },
    { value: 'siberian', label: 'Сибирский федеральный округ' },
    { value: 'far-east', label: 'Дальневосточный федеральный округ' }
  ];

  const deliveryTypeOptions = [
    { value: 'standard', label: 'Стандартная доставка' },
    { value: 'express', label: 'Экспресс доставка' },
    { value: 'scheduled', label: 'Доставка по расписанию' },
    { value: 'pickup', label: 'Самовывоз' }
  ];

  // Mock delivery calculation
  useEffect(() => {
    if (formData?.deliveryInfo?.region && formData?.deliveryInfo?.city && formData?.equipmentSpecs?.quantity) {
      setCalculating(true);
      
      setTimeout(() => {
        const basePrice = 15000;
        const regionMultiplier = {
          'moscow': 1.0,
          'spb': 1.2,
          'central': 1.5,
          'northwest': 1.8,
          'south': 2.0,
          'volga': 2.2,
          'ural': 2.5,
          'siberian': 3.0,
          'far-east': 3.5
        };

        const deliveryTypeMultiplier = {
          'standard': 1.0,
          'express': 1.5,
          'scheduled': 1.2,
          'pickup': 0
        };

        const quantity = parseInt(formData?.equipmentSpecs?.quantity) || 1;
        const regionMult = regionMultiplier?.[formData?.deliveryInfo?.region] || 1.0;
        const typeMult = deliveryTypeMultiplier?.[formData?.deliveryInfo?.deliveryType] || 1.0;
        
        const totalCost = basePrice * regionMult * typeMult * quantity;
        const deliveryDays = Math.ceil(regionMult * 3) + (formData?.deliveryInfo?.deliveryType === 'express' ? -1 : 0);

        setDeliveryEstimate({
          cost: totalCost,
          days: deliveryDays,
          freeDelivery: totalCost === 0
        });
        setCalculating(false);
      }, 1500);
    }
  }, [formData?.deliveryInfo?.region, formData?.deliveryInfo?.city, formData?.deliveryInfo?.deliveryType, formData?.equipmentSpecs?.quantity]);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <span className="text-primary-foreground font-heading font-semibold text-sm">5</span>
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Доставка и логистика
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Регион доставки"
          options={regionOptions}
          value={formData?.deliveryInfo?.region}
          onChange={(value) => handleInputChange('region', value)}
          placeholder="Выберите регион"
          error={errors?.region}
          required
        />

        <Input
          label="Город"
          type="text"
          placeholder="Введите название города"
          value={formData?.deliveryInfo?.city}
          onChange={(e) => handleInputChange('city', e?.target?.value)}
          error={errors?.city}
          required
        />

        <Input
          label="Адрес доставки"
          type="text"
          placeholder="Улица, дом, офис/склад"
          value={formData?.deliveryInfo?.address}
          onChange={(e) => handleInputChange('address', e?.target?.value)}
          error={errors?.address}
          required
          className="md:col-span-2"
        />

        <Select
          label="Тип доставки"
          options={deliveryTypeOptions}
          value={formData?.deliveryInfo?.deliveryType}
          onChange={(value) => handleInputChange('deliveryType', value)}
          placeholder="Выберите тип доставки"
          required
        />

        <Input
          label="Желаемая дата доставки"
          type="date"
          value={formData?.deliveryInfo?.preferredDate}
          onChange={(e) => handleInputChange('preferredDate', e?.target?.value)}
          min={new Date()?.toISOString()?.split('T')?.[0]}
        />

        <div className="md:col-span-2">
          <Input
            label="Особые требования к доставке"
            type="text"
            placeholder="Ограничения по времени, доступу, разгрузке и т.д."
            value={formData?.deliveryInfo?.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
            description="Укажите любые особенности места доставки"
          />
        </div>

        {/* Delivery Estimate */}
        {(calculating || deliveryEstimate) && (
          <div className="md:col-span-2 bg-muted rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Truck" size={20} className="text-primary mt-1" />
              <div className="flex-1">
                <h4 className="font-body font-semibold text-foreground mb-3">
                  Расчет доставки
                </h4>
                
                {calculating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm text-muted-foreground">Расчет стоимости доставки...</span>
                  </div>
                ) : deliveryEstimate && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Banknote" size={16} className="text-success" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {deliveryEstimate?.freeDelivery ? 'Бесплатно' : `${deliveryEstimate?.cost?.toLocaleString('uz-UZ')} UZS`}
                        </p>
                        <p className="text-xs text-muted-foreground">Стоимость доставки</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="Calendar" size={16} className="text-warning" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {deliveryEstimate?.days} {deliveryEstimate?.days === 1 ? 'день' : deliveryEstimate?.days < 5 ? 'дня' : 'дней'}
                        </p>
                        <p className="text-xs text-muted-foreground">Срок доставки</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryCalculator;