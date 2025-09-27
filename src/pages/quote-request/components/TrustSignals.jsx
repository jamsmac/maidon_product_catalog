import React from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Авторизованный дилер',
      description: 'Официальный партнер ведущих производителей промышленного оборудования'
    },
    {
      icon: 'Award',
      title: 'Гарантия качества',
      description: 'Расширенная гарантия до 3 лет на все оборудование'
    },
    {
      icon: 'Wrench',
      title: 'Сервисная поддержка',
      description: '24/7 техническая поддержка и мобильный сервис'
    },
    {
      icon: 'Users',
      title: 'Опытная команда',
      description: 'Более 15 лет опыта в промышленном оборудовании'
    }
  ];

  const certifications = [
    {
      name: 'ISO 9001:2015',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      description: 'Система менеджмента качества'
    },
    {
      name: 'ISO 14001:2015',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop',
      description: 'Экологический менеджмент'
    },
    {
      name: 'OHSAS 18001',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      description: 'Охрана труда и безопасность'
    }
  ];

  const testimonials = [
    {
      company: 'ООО "Логистик Центр"',
      text: `Отличное качество оборудования и профессиональный подход. Все сроки соблюдены, техническая поддержка на высоте.`,
      author: 'Михаил Петров',
      position: 'Директор по логистике',
      rating: 5
    },
    {
      company: 'АО "Промышленные решения"',
      text: `Сотрудничаем уже 3 года. Надежный партнер с конкурентными ценами и качественным сервисом.`,
      author: 'Елена Сидорова',
      position: 'Главный инженер',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        className={i < rating ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Trust Features */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
          Почему выбирают нас
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trustFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name={feature?.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-body font-semibold text-foreground mb-1">
                  {feature?.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Certifications */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
          Сертификаты и лицензии
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {certifications?.map((cert, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={cert?.image}
                  alt={cert?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-body font-semibold text-foreground text-sm mb-1">
                {cert?.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {cert?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Customer Testimonials */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
          Отзывы клиентов
        </h3>
        
        <div className="space-y-6">
          {testimonials?.map((testimonial, index) => (
            <div key={index} className="bg-muted rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-body font-semibold text-foreground text-sm">
                    {testimonial?.company}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial?.author}, {testimonial?.position}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(testimonial?.rating)}
                </div>
              </div>
              <p className="text-sm text-foreground italic">
                "{testimonial?.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Contact Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
          Контактная информация
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon name="Phone" size={18} className="text-primary" />
              <div>
                <p className="font-body font-medium text-foreground">+7 (495) 123-45-67</p>
                <p className="text-xs text-muted-foreground">Горячая линия 24/7</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Icon name="Mail" size={18} className="text-primary" />
              <div>
                <p className="font-body font-medium text-foreground">sales@maidon.ru</p>
                <p className="text-xs text-muted-foreground">Отдел продаж</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Icon name="MapPin" size={18} className="text-primary" />
              <div>
                <p className="font-body font-medium text-foreground">г. Москва, ул. Промышленная, 15</p>
                <p className="text-xs text-muted-foreground">Головной офис</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={18} className="text-primary" />
              <div>
                <p className="font-body font-medium text-foreground">Пн-Пт: 9:00-18:00</p>
                <p className="text-xs text-muted-foreground">Время работы офиса</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Icon name="Headphones" size={18} className="text-primary" />
              <div>
                <p className="font-body font-medium text-foreground">24/7 техподдержка</p>
                <p className="text-xs text-muted-foreground">Круглосуточная поддержка</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Icon name="Truck" size={18} className="text-primary" />
              <div>
                <p className="font-body font-medium text-foreground">По всей России</p>
                <p className="text-xs text-muted-foreground">География поставок</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;