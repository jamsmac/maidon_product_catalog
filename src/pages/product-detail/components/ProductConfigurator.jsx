import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ProductConfigurator = ({ baseProduct, onConfigurationChange }) => {
  const [configuration, setConfiguration] = useState({
    mast: null,
    forks: null,
    wheels: null,
    battery: null,
    attachments: [],
    cabin: null
  });
  
  const [totalPrice, setTotalPrice] = useState(baseProduct?.basePrice);
  const [isCalculating, setIsCalculating] = useState(false);

  const configurationOptions = {
    mast: [
      { value: 'standard', label: 'Стандартная мачта', price: 0, description: 'Высота подъема до 3м' },
      { value: 'duplex', label: 'Дуплекс мачта', price: 150000, description: 'Высота подъема до 4.5м' },
      { value: 'triplex', label: 'Триплекс мачта', price: 280000, description: 'Высота подъема до 6м' },
      { value: 'quad', label: 'Квадруплекс мачта', price: 420000, description: 'Высота подъема до 8м' }
    ],
    forks: [
      { value: 'standard', label: 'Стандартные вилы 1200мм', price: 0, description: 'Грузоподъемность до 2т' },
      { value: 'extended', label: 'Удлиненные вилы 1500мм', price: 35000, description: 'Для длинных грузов' },
      { value: 'adjustable', label: 'Регулируемые вилы', price: 85000, description: 'Гидравлическая регулировка' },
      { value: 'rotating', label: 'Поворотные вилы', price: 125000, description: 'Поворот на 360°' }
    ],
    wheels: [
      { value: 'pneumatic', label: 'Пневматические шины', price: 0, description: 'Для работы на улице' },
      { value: 'solid', label: 'Цельнолитые шины', price: 45000, description: 'Повышенная износостойкость' },
      { value: 'cushion', label: 'Бандажные шины', price: 25000, description: 'Для работы в помещении' },
      { value: 'non-marking', label: 'Не оставляющие следов', price: 65000, description: 'Для чистых помещений' }
    ],
    battery: [
      { value: 'lead-acid', label: 'Свинцово-кислотная 48В', price: 0, description: '6-8 часов работы' },
      { value: 'lithium', label: 'Литий-ионная 48В', price: 350000, description: '8-10 часов работы' },
      { value: 'lithium-extended', label: 'Литий-ионная 80В', price: 520000, description: '10-12 часов работы' }
    ],
    attachments: [
      { value: 'side-shift', label: 'Боковой сдвиг', price: 95000, description: 'Точное позиционирование' },
      { value: 'clamp', label: 'Зажим для рулонов', price: 180000, description: 'Для работы с рулонами' },
      { value: 'rotator', label: 'Ротатор', price: 220000, description: 'Поворот груза' },
      { value: 'scale', label: 'Весы', price: 145000, description: 'Встроенная система взвешивания' },
      { value: 'camera', label: 'Камера заднего вида', price: 75000, description: 'Улучшенная видимость' }
    ],
    cabin: [
      { value: 'open', label: 'Открытая кабина', price: 0, description: 'Стандартная защита' },
      { value: 'enclosed', label: 'Закрытая кабина', price: 280000, description: 'Защита от погоды' },
      { value: 'heated', label: 'Отапливаемая кабина', price: 380000, description: 'С системой отопления' },
      { value: 'ac', label: 'Кабина с кондиционером', price: 450000, description: 'Климат-контроль' }
    ]
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [configuration]);

  const calculateTotalPrice = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      let price = baseProduct?.basePrice;
      
      Object.keys(configuration)?.forEach(category => {
        if (category === 'attachments') {
          configuration?.[category]?.forEach(attachmentValue => {
            const attachment = configurationOptions?.[category]?.find(opt => opt?.value === attachmentValue);
            if (attachment) price += attachment?.price;
          });
        } else if (configuration?.[category]) {
          const option = configurationOptions?.[category]?.find(opt => opt?.value === configuration?.[category]);
          if (option) price += option?.price;
        }
      });
      
      setTotalPrice(price);
      setIsCalculating(false);
      onConfigurationChange?.(configuration, price);
    }, 500);
  };

  const handleOptionChange = (category, value) => {
    setConfiguration(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleAttachmentToggle = (attachmentValue) => {
    setConfiguration(prev => ({
      ...prev,
      attachments: prev?.attachments?.includes(attachmentValue)
        ? prev?.attachments?.filter(a => a !== attachmentValue)
        : [...prev?.attachments, attachmentValue]
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const resetConfiguration = () => {
    setConfiguration({
      mast: null,
      forks: null,
      wheels: null,
      battery: null,
      attachments: [],
      cabin: null
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Конфигуратор оборудования
        </h2>
        <Button variant="outline" size="sm" onClick={resetConfiguration}>
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Сбросить
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Options */}
        <div className="space-y-6">
          {/* Mast Configuration */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="ArrowUp" size={18} className="text-primary" />
              Мачта
            </h3>
            <Select
              options={configurationOptions?.mast?.map(opt => ({
                value: opt?.value,
                label: `${opt?.label} ${opt?.price > 0 ? `(+${formatPrice(opt?.price)})` : ''}`,
                description: opt?.description
              }))}
              value={configuration?.mast}
              onChange={(value) => handleOptionChange('mast', value)}
              placeholder="Выберите тип мачты"
            />
          </div>

          {/* Forks Configuration */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="GitBranch" size={18} className="text-primary" />
              Вилы
            </h3>
            <Select
              options={configurationOptions?.forks?.map(opt => ({
                value: opt?.value,
                label: `${opt?.label} ${opt?.price > 0 ? `(+${formatPrice(opt?.price)})` : ''}`,
                description: opt?.description
              }))}
              value={configuration?.forks}
              onChange={(value) => handleOptionChange('forks', value)}
              placeholder="Выберите тип вил"
            />
          </div>

          {/* Wheels Configuration */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Circle" size={18} className="text-primary" />
              Колеса
            </h3>
            <Select
              options={configurationOptions?.wheels?.map(opt => ({
                value: opt?.value,
                label: `${opt?.label} ${opt?.price > 0 ? `(+${formatPrice(opt?.price)})` : ''}`,
                description: opt?.description
              }))}
              value={configuration?.wheels}
              onChange={(value) => handleOptionChange('wheels', value)}
              placeholder="Выберите тип колес"
            />
          </div>

          {/* Battery Configuration */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Battery" size={18} className="text-primary" />
              Батарея
            </h3>
            <Select
              options={configurationOptions?.battery?.map(opt => ({
                value: opt?.value,
                label: `${opt?.label} ${opt?.price > 0 ? `(+${formatPrice(opt?.price)})` : ''}`,
                description: opt?.description
              }))}
              value={configuration?.battery}
              onChange={(value) => handleOptionChange('battery', value)}
              placeholder="Выберите тип батареи"
            />
          </div>

          {/* Cabin Configuration */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Home" size={18} className="text-primary" />
              Кабина
            </h3>
            <Select
              options={configurationOptions?.cabin?.map(opt => ({
                value: opt?.value,
                label: `${opt?.label} ${opt?.price > 0 ? `(+${formatPrice(opt?.price)})` : ''}`,
                description: opt?.description
              }))}
              value={configuration?.cabin}
              onChange={(value) => handleOptionChange('cabin', value)}
              placeholder="Выберите тип кабины"
            />
          </div>
        </div>

        {/* Attachments and Summary */}
        <div className="space-y-6">
          {/* Attachments */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Wrench" size={18} className="text-primary" />
              Дополнительное оборудование
            </h3>
            <div className="space-y-3">
              {configurationOptions?.attachments?.map((attachment) => (
                <div
                  key={attachment?.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    configuration?.attachments?.includes(attachment?.value)
                      ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground'
                  }`}
                  onClick={() => handleAttachmentToggle(attachment?.value)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        configuration?.attachments?.includes(attachment?.value)
                          ? 'border-primary bg-primary' :'border-muted-foreground'
                      }`}>
                        {configuration?.attachments?.includes(attachment?.value) && (
                          <Icon name="Check" size={12} className="text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {attachment?.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {attachment?.description}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium text-foreground">
                      +{formatPrice(attachment?.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Итоговая стоимость
            </h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Базовая модель:</span>
                <span className="text-foreground">{formatPrice(baseProduct?.basePrice)}</span>
              </div>
              
              {Object.keys(configuration)?.map(category => {
                if (category === 'attachments') {
                  return configuration?.[category]?.map(attachmentValue => {
                    const attachment = configurationOptions?.[category]?.find(opt => opt?.value === attachmentValue);
                    return attachment && (
                      <div key={attachmentValue} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{attachment?.label}:</span>
                        <span className="text-foreground">+{formatPrice(attachment?.price)}</span>
                      </div>
                    );
                  });
                } else if (configuration?.[category]) {
                  const option = configurationOptions?.[category]?.find(opt => opt?.value === configuration?.[category]);
                  return option && option?.price > 0 && (
                    <div key={category} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{option?.label}:</span>
                      <span className="text-foreground">+{formatPrice(option?.price)}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center">
                <span className="font-heading font-semibold text-foreground">
                  Общая стоимость:
                </span>
                <span className="text-xl font-heading font-bold text-primary">
                  {isCalculating ? (
                    <div className="flex items-center gap-2">
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      Расчет...
                    </div>
                  ) : (
                    formatPrice(totalPrice)
                  )}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="default" fullWidth>
                <Icon name="ShoppingCart" size={16} className="mr-2" />
                Добавить в корзину
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductConfigurator;