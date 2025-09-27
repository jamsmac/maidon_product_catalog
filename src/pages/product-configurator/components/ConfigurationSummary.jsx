import React from 'react';

import Icon from '../../../components/AppIcon';

const ConfigurationSummary = ({ configuration, pricing }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  const configurationDetails = [
    {
      section: 'Мачта',
      icon: 'ArrowUp',
      options: {
        standard: { name: 'Стандартная мачта', specs: 'До 3.5м', price: 0 },
        extended: { name: 'Удлиненная мачта', specs: 'До 5.0м', price: 85000 },
        triple: { name: 'Трехсекционная мачта', specs: 'До 6.5м', price: 165000 }
      }
    },
    {
      section: 'Вилы',
      icon: 'GitBranch',
      options: {
        standard_1200: { name: 'Стандартные вилы 1200мм', specs: '2т', price: 0 },
        extended_1500: { name: 'Удлиненные вилы 1500мм', specs: '2т', price: 25000 },
        heavy_duty: { name: 'Усиленные вилы', specs: '3т', price: 45000 }
      }
    },
    {
      section: 'Колеса',
      icon: 'Circle',
      options: {
        pneumatic: { name: 'Пневматические шины', specs: '28x9-15', price: 0 },
        solid: { name: 'Цельнолитые шины', specs: '28x9-15', price: 35000 },
        super_elastic: { name: 'Суперэластичные шины', specs: '28x9-15', price: 55000 }
      }
    },
    {
      section: 'Батарея',
      icon: 'Battery',
      options: {
        lead_acid: { name: 'Свинцово-кислотная', specs: '48В 500Ач', price: 0 },
        lithium_standard: { name: 'Литий-ионная', specs: '48В 400Ач', price: 180000 },
        lithium_extended: { name: 'Литий-ионная увеличенная', specs: '48В 600Ач', price: 250000 }
      }
    },
    {
      section: 'Навесное оборудование',
      icon: 'Wrench',
      options: {
        none: { name: 'Без навесного оборудования', specs: 'Базовая', price: 0 },
        side_shift: { name: 'Боковой сдвиг вил', specs: '±100мм', price: 95000 },
        rotator: { name: 'Ротатор вил', specs: '360°', price: 125000 },
        clamp: { name: 'Зажим для рулонов', specs: 'До 1500мм', price: 155000 }
      }
    },
    {
      section: 'Кабина',
      icon: 'Home',
      options: {
        open: { name: 'Открытая кабина', specs: 'ROPS/FOPS', price: 0 },
        enclosed: { name: 'Закрытая кабина', specs: 'С отоплением', price: 145000 },
        premium: { name: 'Премиум кабина', specs: 'Климат-контроль', price: 195000 }
      }
    }
  ];

  const getSelectedOptions = () => {
    return configurationDetails?.map(detail => {
      const sectionKey = detail?.section?.toLowerCase()?.replace(/\s+/g, '_')?.replace('навесное_оборудование', 'attachments')?.replace('кабина', 'cabin')?.replace('мачта', 'mast')?.replace('вилы', 'forks')?.replace('колеса', 'wheels')?.replace('батарея', 'battery');
      const selectedOptionKey = configuration?.[sectionKey] || Object.keys(detail?.options)?.[0];
      const selectedOption = detail?.options?.[selectedOptionKey];
      
      return {
        section: detail?.section,
        icon: detail?.icon,
        selected: selectedOption || detail?.options?.[Object.keys(detail?.options)?.[0]],
        key: selectedOptionKey
      };
    });
  };

  const selectedOptions = getSelectedOptions();
  const totalOptionsPrice = selectedOptions?.reduce((sum, option) => sum + (option?.selected?.price || 0), 0);

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Сводка конфигурации
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Детальный обзор выбранных опций
        </p>
      </div>
      {/* Configuration Items */}
      <div className="p-4 space-y-4">
        {selectedOptions?.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg">
            <div className="flex-shrink-0 mt-1">
              <Icon name={item?.icon} size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item?.section}
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    {item?.selected?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item?.selected?.specs}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <span className={`
                    text-sm font-medium
                    ${item?.selected?.price === 0 ? 'text-success' : 'text-foreground'}
                  `}>
                    {item?.selected?.price === 0 ? 'Включено' : formatPrice(item?.selected?.price || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Price Breakdown */}
      <div className="border-t border-border p-4 bg-muted/10">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Базовая модель:</span>
            <span className="font-medium text-foreground">
              {formatPrice(pricing?.basePrice || 1250000)}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Дополнительные опции:</span>
            <span className="font-medium text-foreground">
              {formatPrice(totalOptionsPrice)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">НДС (20%):</span>
            <span className="font-medium text-foreground">
              {formatPrice(((pricing?.basePrice || 1250000) + totalOptionsPrice) * 0.2)}
            </span>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex justify-between items-center">
              <span className="font-heading font-semibold text-foreground">
                Итого к оплате:
              </span>
              <span className="text-xl font-heading font-bold text-primary">
                {formatPrice(((pricing?.basePrice || 1250000) + totalOptionsPrice) * 1.2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Additional Information */}
      <div className="border-t border-border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={14} className="text-primary" />
              <span className="text-muted-foreground">Срок изготовления:</span>
            </div>
            <p className="font-medium text-foreground ml-6">
              14-21 рабочий день
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Truck" size={14} className="text-primary" />
              <span className="text-muted-foreground">Доставка:</span>
            </div>
            <p className="font-medium text-foreground ml-6">
              Бесплатно по Москве
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={14} className="text-primary" />
              <span className="text-muted-foreground">Гарантия:</span>
            </div>
            <p className="font-medium text-foreground ml-6">
              24 месяца
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Wrench" size={14} className="text-primary" />
              <span className="text-muted-foreground">Сервис:</span>
            </div>
            <p className="font-medium text-foreground ml-6">
              Включен на 1 год
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSummary;