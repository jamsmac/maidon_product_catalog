import React from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServicePackages = ({ selectedPackage, onPackageSelect }) => {
  const servicePackages = [
    {
      id: 'preventive',
      name: 'Плановое ТО',
      description: 'Комплексное техническое обслуживание согласно регламенту производителя',
      duration: '4-6 часов',
      price: 25000,
      includes: [
        'Замена масла и фильтров',
        'Проверка гидравлической системы',
        'Диагностика электроники',
        'Проверка тормозной системы',
        'Калибровка весов',
        'Общий технический осмотр'
      ],
      icon: 'Settings',
      color: 'primary',
      popular: true
    },
    {
      id: 'repair',
      name: 'Ремонт',
      description: 'Устранение неисправностей и замена вышедших из строя компонентов',
      duration: 'По диагностике',
      price: 'По запросу',
      includes: [
        'Диагностика неисправностей',
        'Замена неисправных деталей',
        'Настройка и калибровка',
        'Тестирование после ремонта',
        'Гарантия на выполненные работы'
      ],
      icon: 'Wrench',
      color: 'warning'
    },
    {
      id: 'inspection',
      name: 'Техосмотр',
      description: 'Проверка технического состояния оборудования и выдача заключения',
      duration: '2-3 часа',
      price: 8000,
      includes: [
        'Визуальный осмотр',
        'Проверка систем безопасности',
        'Тестирование функций',
        'Измерение параметров',
        'Выдача протокола осмотра'
      ],
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      id: 'mobile',
      name: 'Выездной сервис',
      description: 'Обслуживание и ремонт на территории заказчика',
      duration: 'По согласованию',
      price: 'Базовая стоимость + выезд',
      includes: [
        'Выезд специалиста на объект',
        'Диагностика на месте',
        'Мелкий ремонт и настройка',
        'Консультации по эксплуатации',
        'Рекомендации по обслуживанию'
      ],
      icon: 'Truck',
      color: 'accent',
      badge: 'Популярно'
    }
  ];
  
  const getColorClasses = (color, isSelected) => {
    const colors = {
      primary: isSelected 
        ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50',
      warning: isSelected 
        ? 'border-warning bg-warning/5 text-warning' :'border-border hover:border-warning/50',
      success: isSelected 
        ? 'border-success bg-success/5 text-success' :'border-border hover:border-success/50',
      accent: isSelected 
        ? 'border-accent bg-accent/5 text-accent' :'border-border hover:border-accent/50'
    };
    return colors?.[color] || colors?.primary;
  };
  
  const getIconColor = (color, isSelected) => {
    if (!isSelected) return 'text-muted-foreground';
    
    const colors = {
      primary: 'text-primary',
      warning: 'text-warning',
      success: 'text-success',
      accent: 'text-accent'
    };
    return colors?.[color] || colors?.primary;
  };
  
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Пакеты обслуживания
        </h3>
        {selectedPackage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPackageSelect(null)}
          >
            <Icon name="X" size={16} className="mr-2" />
            Очистить
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicePackages?.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg?.id;
          
          return (
            <button
              key={pkg?.id}
              onClick={() => onPackageSelect(pkg)}
              className={`
                relative p-4 rounded-lg border text-left transition-all duration-200
                ${getColorClasses(pkg?.color, isSelected)}
                hover:shadow-md
              `}
            >
              {/* Badge */}
              {(pkg?.popular || pkg?.badge) && (
                <div className="absolute -top-2 -right-2">
                  <span className={`
                    text-xs font-caption px-2 py-1 rounded-full
                    ${pkg?.color === 'primary' ? 'bg-primary text-primary-foreground' : ''}
                    ${pkg?.color === 'accent' ? 'bg-accent text-accent-foreground' : ''}
                  `}>
                    {pkg?.popular ? 'Популярно' : pkg?.badge}
                  </span>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${isSelected 
                    ? `bg-${pkg?.color}/10` 
                    : 'bg-muted'
                  }
                `}>
                  <Icon 
                    name={pkg?.icon} 
                    size={20} 
                    className={getIconColor(pkg?.color, isSelected)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-body font-semibold text-foreground">
                      {pkg?.name}
                    </h4>
                    <div className="text-right">
                      <div className="text-sm font-body font-semibold text-foreground">
                        {typeof pkg?.price === 'number' 
                          ? `${pkg?.price?.toLocaleString('ru-RU')} UZS`
                          : pkg?.price
                        }
                      </div>
                      <div className="text-xs font-caption text-muted-foreground">
                        {pkg?.duration}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs font-caption text-muted-foreground mb-3 line-clamp-2">
                    {pkg?.description}
                  </p>
                  
                  <div className="space-y-1">
                    <div className="text-xs font-caption font-medium text-foreground mb-1">
                      Включает:
                    </div>
                    <ul className="space-y-1">
                      {pkg?.includes?.slice(0, 3)?.map((item, index) => (
                        <li key={index} className="text-xs font-caption text-muted-foreground flex items-center space-x-2">
                          <Icon name="Check" size={12} className={getIconColor(pkg?.color, isSelected)} />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                      {pkg?.includes?.length > 3 && (
                        <li className="text-xs font-caption text-muted-foreground">
                          + еще {pkg?.includes?.length - 3} услуг
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className={`w-5 h-5 rounded-full bg-${pkg?.color} flex items-center justify-center`}>
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {selectedPackage && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="flex-1">
              <h5 className="text-sm font-body font-medium text-foreground mb-2">
                Детали выбранного пакета
              </h5>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-xs font-caption">
                  <div>
                    <span className="text-muted-foreground">Продолжительность:</span>
                    <span className="ml-2 text-foreground">{selectedPackage?.duration}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Стоимость:</span>
                    <span className="ml-2 text-foreground">
                      {typeof selectedPackage?.price === 'number' 
                        ? `${selectedPackage?.price?.toLocaleString('ru-RU')} UZS`
                        : selectedPackage?.price
                      }
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-caption text-muted-foreground mb-1">
                    Полный список услуг:
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {selectedPackage?.includes?.map((item, index) => (
                      <li key={index} className="text-xs font-caption text-foreground flex items-center space-x-2">
                        <Icon name="Check" size={10} className="text-success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackages;
