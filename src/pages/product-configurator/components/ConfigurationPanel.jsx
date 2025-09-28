import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfigurationPanel = ({ 
  configuration, 
  onConfigurationChange, 
  basePrice, 
  totalPrice 
}) => {
  const [activeSection, setActiveSection] = useState('mast');

  const configurationSections = [
    {
      id: 'mast',
      title: 'Мачта',
      icon: 'ArrowUp',
      options: [
        {
          id: 'standard',
          name: 'Стандартная мачта',
          description: 'Высота подъема до 3.5м',
          price: 0,
          specifications: 'Максимальная высота: 3500мм'
        },
        {
          id: 'extended',
          name: 'Удлиненная мачта',
          description: 'Высота подъема до 5.0м',
          price: 85000,
          specifications: 'Максимальная высота: 5000мм'
        },
        {
          id: 'triple',
          name: 'Трехсекционная мачта',
          description: 'Высота подъема до 6.5м',
          price: 165000,
          specifications: 'Максимальная высота: 6500мм'
        }
      ]
    },
    {
      id: 'forks',
      title: 'Вилы',
      icon: 'GitBranch',
      options: [
        {
          id: 'standard_1200',
          name: 'Стандартные вилы 1200мм',
          description: 'Длина 1200мм, грузоподъемность 2т',
          price: 0,
          specifications: 'Длина: 1200мм, Ширина: 100мм'
        },
        {
          id: 'extended_1500',
          name: 'Удлиненные вилы 1500мм',
          description: 'Длина 1500мм, грузоподъемность 2т',
          price: 25000,
          specifications: 'Длина: 1500мм, Ширина: 100мм'
        },
        {
          id: 'heavy_duty',
          name: 'Усиленные вилы',
          description: 'Длина 1200мм, грузоподъемность 3т',
          price: 45000,
          specifications: 'Длина: 1200мм, Ширина: 120мм'
        }
      ]
    },
    {
      id: 'wheels',
      title: 'Колеса',
      icon: 'Circle',
      options: [
        {
          id: 'pneumatic',
          name: 'Пневматические шины',
          description: 'Для работы на улице и неровных поверхностях',
          price: 0,
          specifications: 'Размер: 28x9-15, Тип: пневматические'
        },
        {
          id: 'solid',
          name: 'Цельнолитые шины',
          description: 'Для работы в помещении, устойчивы к проколам',
          price: 35000,
          specifications: 'Размер: 28x9-15, Тип: цельнолитые'
        },
        {
          id: 'super_elastic',
          name: 'Суперэластичные шины',
          description: 'Комбинированное использование, повышенный комфорт',
          price: 55000,
          specifications: 'Размер: 28x9-15, Тип: суперэластичные'
        }
      ]
    },
    {
      id: 'battery',
      title: 'Батарея и зарядка',
      icon: 'Battery',
      options: [
        {
          id: 'lead_acid',
          name: 'Свинцово-кислотная батарея',
          description: '48В, 500Ач, стандартное зарядное устройство',
          price: 0,
          specifications: 'Напряжение: 48В, Емкость: 500Ач'
        },
        {
          id: 'lithium_standard',
          name: 'Литий-ионная батарея',
          description: '48В, 400Ач, быстрая зарядка',
          price: 180000,
          specifications: 'Напряжение: 48В, Емкость: 400Ач'
        },
        {
          id: 'lithium_extended',
          name: 'Литий-ионная батарея увеличенной емкости',
          description: '48В, 600Ач, быстрая зарядка',
          price: 250000,
          specifications: 'Напряжение: 48В, Емкость: 600Ач'
        }
      ]
    },
    {
      id: 'attachments',
      title: 'Навесное оборудование',
      icon: 'Wrench',
      options: [
        {
          id: 'none',
          name: 'Без навесного оборудования',
          description: 'Стандартная конфигурация с вилами',
          price: 0,
          specifications: 'Базовая комплектация'
        },
        {
          id: 'side_shift',
          name: 'Боковой сдвиг вил',
          description: 'Гидравлический боковой сдвиг ±100мм',
          price: 95000,
          specifications: 'Ход сдвига: ±100мм'
        },
        {
          id: 'rotator',
          name: 'Ротатор вил',
          description: 'Поворот вил на 360°',
          price: 125000,
          specifications: 'Угол поворота: 360°'
        },
        {
          id: 'clamp',
          name: 'Зажим для рулонов',
          description: 'Специализированный зажим для работы с рулонами',
          price: 155000,
          specifications: 'Диаметр зажима: до 1500мм'
        }
      ]
    },
    {
      id: 'cabin',
      title: 'Кабина',
      icon: 'Home',
      options: [
        {
          id: 'open',
          name: 'Открытая кабина',
          description: 'Защитная рама без остекления',
          price: 0,
          specifications: 'Тип: открытая, ROPS/FOPS'
        },
        {
          id: 'enclosed',
          name: 'Закрытая кабина',
          description: 'Полностью остекленная кабина с отоплением',
          price: 145000,
          specifications: 'Тип: закрытая, отопление, кондиционер'
        },
        {
          id: 'premium',
          name: 'Премиум кабина',
          description: 'Закрытая кабина с кондиционером и подогревом сиденья',
          price: 195000,
          specifications: 'Тип: премиум, климат-контроль, подогрев сиденья'
        }
      ]
    }
  ];

  const handleOptionChange = (sectionId, optionId) => {
    onConfigurationChange(sectionId, optionId);
  };

  const getSelectedOption = (sectionId) => {
    return configuration?.[sectionId] || configurationSections?.find(s => s?.id === sectionId)?.options?.[0]?.id;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Section Navigation */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
          Конфигурация оборудования
        </h2>
        <div className="flex flex-wrap gap-2">
          {configurationSections?.map((section) => (
            <Button
              key={section?.id}
              variant={activeSection === section?.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section?.id)}
              iconName={section?.icon}
              iconPosition="left"
              iconSize={16}
              className="text-xs"
            >
              {section?.title}
            </Button>
          ))}
        </div>
      </div>
      {/* Configuration Options */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {configurationSections?.filter(section => section?.id === activeSection)?.map((section) => (
            <div key={section?.id} className="space-y-3">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name={section?.icon} size={20} className="text-primary" />
                <h3 className="text-base font-heading font-semibold text-foreground">
                  {section?.title}
                </h3>
              </div>

              {section?.options?.map((option) => {
                const isSelected = getSelectedOption(section?.id) === option?.id;
                return (
                  <div
                    key={option?.id}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }
                    `}
                    onClick={() => handleOptionChange(section?.id, option?.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className={`
                            w-4 h-4 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}
                          `}>
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <h4 className="font-body font-medium text-foreground">
                            {option?.name}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 ml-6">
                          {option?.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 ml-6 font-data">
                          {option?.specifications}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <span className={`
                          text-sm font-medium
                          ${option?.price === 0 ? 'text-success' : 'text-foreground'}
                        `}>
                          {option?.price === 0 ? 'Включено' : `+${formatPrice(option?.price)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
      {/* Price Summary */}
      <div className="border-t border-border p-4 bg-muted/30">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Базовая цена:</span>
            <span className="font-medium text-foreground">{formatPrice(basePrice)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Опции:</span>
            <span className="font-medium text-foreground">
              {formatPrice(totalPrice - basePrice)}
            </span>
          </div>
          <div className="border-t border-border pt-2">
            <div className="flex justify-between items-center">
              <span className="font-heading font-semibold text-foreground">
                Итого:
              </span>
              <span className="text-lg font-heading font-bold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;