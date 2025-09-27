import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MaintenanceKits = ({ onKitSelect, onAddToCart }) => {
  const [selectedKit, setSelectedKit] = useState(null);

  // Mock maintenance kits data
  const maintenanceKits = [
    {
      id: 'kit-500h',
      name: 'Комплект ТО-1 (500 моточасов)',
      description: 'Базовое техническое обслуживание для поддержания работоспособности',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      price: 25000,
      originalPrice: 32000,
      discount: 22,
      duration: '2-3 часа',
      difficulty: 'Простое',
      parts: [
        { name: 'Масло моторное 5W-30', quantity: '5л', partNumber: 'OIL-001' },
        { name: 'Фильтр масляный', quantity: '1шт', partNumber: 'FLT-002' },
        { name: 'Фильтр воздушный', quantity: '1шт', partNumber: 'FLT-003' },
        { name: 'Фильтр топливный', quantity: '1шт', partNumber: 'FLT-004' }
      ],
      tools: ['Ключи гаечные', 'Съемник фильтров', 'Воронка'],
      benefits: [
        'Продление срока службы двигателя',
        'Снижение расхода топлива',
        'Предотвращение поломок'
      ]
    },
    {
      id: 'kit-1000h',
      name: 'Комплект ТО-2 (1000 моточасов)',
      description: 'Расширенное обслуживание гидравлической системы и трансмиссии',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      price: 45000,
      originalPrice: 55000,
      discount: 18,
      duration: '4-6 часов',
      difficulty: 'Средняя',
      parts: [
        { name: 'Масло гидравлическое', quantity: '20л', partNumber: 'HYD-001' },
        { name: 'Фильтр гидравлический', quantity: '2шт', partNumber: 'FLT-005' },
        { name: 'Масло трансмиссионное', quantity: '8л', partNumber: 'TRN-001' },
        { name: 'Прокладки комплект', quantity: '1комп', partNumber: 'GSK-001' },
        { name: 'Свечи накаливания', quantity: '4шт', partNumber: 'PLG-001' }
      ],
      tools: ['Домкрат', 'Ключи торцевые', 'Манометр', 'Емкости для слива'],
      benefits: [
        'Оптимальная работа гидравлики',
        'Плавное переключение передач',
        'Предупреждение дорогостоящих ремонтов'
      ]
    },
    {
      id: 'kit-2000h',
      name: 'Комплект ТО-3 (2000 моточасов)',
      description: 'Капитальное обслуживание всех систем погрузчика',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      price: 85000,
      originalPrice: 105000,
      discount: 19,
      duration: '8-12 часов',
      difficulty: 'Сложная',
      parts: [
        { name: 'Комплект поршневых колец', quantity: '1комп', partNumber: 'ENG-001' },
        { name: 'Подшипники ступичные', quantity: '4шт', partNumber: 'BRG-001' },
        { name: 'Тормозные колодки', quantity: '1комп', partNumber: 'BRK-001' },
        { name: 'Ремень приводной', quantity: '2шт', partNumber: 'BLT-001' },
        { name: 'Антифриз', quantity: '10л', partNumber: 'CLT-001' }
      ],
      tools: ['Подъемник', 'Специальный инструмент', 'Диагностическое оборудование'],
      benefits: [
        'Восстановление заводских характеристик',
        'Максимальная надежность',
        'Продление срока службы на 5000+ часов'
      ]
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Простое': 'text-success',
      'Средняя': 'text-warning',
      'Сложная': 'text-error'
    };
    return colors?.[difficulty] || 'text-muted-foreground';
  };

  const handleKitSelect = (kit) => {
    setSelectedKit(selectedKit?.id === kit?.id ? null : kit);
    onKitSelect && onKitSelect(kit);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
          <Icon name="Package" size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Комплекты для ТО
          </h2>
          <p className="text-sm text-muted-foreground">
            Готовые наборы запчастей для планового обслуживания
          </p>
        </div>
      </div>
      {/* Kits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {maintenanceKits?.map((kit) => (
          <div
            key={kit?.id}
            className={`bg-card rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md ${
              selectedKit?.id === kit?.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
            }`}
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={kit?.image}
                alt={kit?.name}
                className="w-full h-full object-cover"
              />
              {kit?.discount && (
                <div className="absolute top-3 right-3 bg-error text-error-foreground text-xs font-bold px-2 py-1 rounded-full">
                  -{kit?.discount}%
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Header */}
              <div className="mb-3">
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  {kit?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {kit?.description}
                </p>
              </div>

              {/* Info Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  <Icon name="Clock" size={12} className="mr-1" />
                  {kit?.duration}
                </span>
                <span className={`inline-flex items-center px-2 py-1 bg-muted text-xs rounded-full ${getDifficultyColor(kit?.difficulty)}`}>
                  <Icon name="Wrench" size={12} className="mr-1" />
                  {kit?.difficulty}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xl font-heading font-bold text-foreground">
                    {formatPrice(kit?.price)}
                  </p>
                  {kit?.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(kit?.originalPrice)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Экономия:</p>
                  <p className="text-sm font-semibold text-success">
                    {formatPrice(kit?.originalPrice - kit?.price)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mb-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAddToCart(kit)}
                  iconName="ShoppingCart"
                  iconPosition="left"
                  className="flex-1"
                >
                  В корзину
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleKitSelect(kit)}
                  iconName={selectedKit?.id === kit?.id ? "ChevronUp" : "ChevronDown"}
                  size="icon"
                />
              </div>

              {/* Expanded Details */}
              {selectedKit?.id === kit?.id && (
                <div className="border-t border-border pt-3 space-y-3">
                  {/* Parts List */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Состав комплекта:
                    </h4>
                    <div className="space-y-1">
                      {kit?.parts?.map((part, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{part?.name}</span>
                          <span className="text-foreground font-medium">{part?.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Преимущества:
                    </h4>
                    <ul className="space-y-1">
                      {kit?.benefits?.map((benefit, index) => (
                        <li key={index} className="flex items-start text-xs text-muted-foreground">
                          <Icon name="Check" size={12} className="text-success mr-1 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Bottom CTA */}
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Icon name="Phone" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-foreground">
            Нужна консультация?
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Наши специалисты помогут подобрать оптимальный комплект для вашей техники
        </p>
        <Button
          variant="outline"
          iconName="MessageCircle"
          iconPosition="left"
        >
          Получить консультацию
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceKits;
