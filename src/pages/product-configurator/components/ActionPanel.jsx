import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionPanel = ({ 
  configuration, 
  totalPrice, 
  onSaveConfiguration, 
  onAddToComparison 
}) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingToComparison, setIsAddingToComparison] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    try {
      await onSaveConfiguration(configuration);
      // Show success message or notification
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToComparison = async () => {
    setIsAddingToComparison(true);
    try {
      await onAddToComparison(configuration);
      // Show success message or notification
    } catch (error) {
      console.error('Error adding to comparison:', error);
    } finally {
      setIsAddingToComparison(false);
    }
  };

  const handleRequestQuote = () => {
    // Pass configuration data to quote request page
    navigate('/quote-request', { 
      state: { 
        configuration,
        totalPrice,
        productType: 'forklift'
      }
    });
  };

  const handleBackToProduct = () => {
    navigate('/product-detail');
  };

  const getConfigurationCode = () => {
    // Generate a unique configuration code
    const code = Object.values(configuration)?.join('-')?.toUpperCase();
    return `CFG-${code?.substring(0, 8)}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm sticky top-4">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Действия
          </h2>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Код конфигурации
            </p>
            <p className="text-sm font-data font-medium text-foreground">
              {getConfigurationCode()}
            </p>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Итоговая стоимость конфигурации
          </p>
          <p className="text-2xl font-heading font-bold text-primary">
            {formatPrice(totalPrice)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            НДС включен
          </p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="p-4 space-y-3">
        <Button
          variant="default"
          fullWidth
          onClick={handleRequestQuote}
          iconName="FileText"
          iconPosition="left"
          iconSize={18}
          className="h-12"
        >
          Запросить коммерческое предложение
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={handleSaveConfiguration}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
            disabled={isSaving}
          >
            Сохранить
          </Button>

          <Button
            variant="outline"
            onClick={handleAddToComparison}
            loading={isAddingToComparison}
            iconName="GitCompare"
            iconPosition="left"
            iconSize={16}
            disabled={isAddingToComparison}
          >
            Сравнить
          </Button>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="border-t border-border p-4 space-y-2">
        <Button
          variant="ghost"
          fullWidth
          onClick={() => navigate('/service-scheduling')}
          iconName="Calendar"
          iconPosition="left"
          iconSize={16}
        >
          Запланировать демонстрацию
        </Button>

        <Button
          variant="ghost"
          fullWidth
          onClick={() => navigate('/parts-catalog')}
          iconName="Cog"
          iconPosition="left"
          iconSize={16}
        >
          Посмотреть запчасти
        </Button>

        <Button
          variant="ghost"
          fullWidth
          onClick={handleBackToProduct}
          iconName="ArrowLeft"
          iconPosition="left"
          iconSize={16}
        >
          Вернуться к продукту
        </Button>
      </div>

      {/* Additional Information */}
      <div className="border-t border-border p-4 bg-muted/10">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="Truck" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Доставка и установка
              </p>
              <p className="text-xs text-muted-foreground">
                Бесплатная доставка по Москве и области
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Гарантия 24 месяца
              </p>
              <p className="text-xs text-muted-foreground">
                Полная гарантия производителя
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="Headphones" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Техническая поддержка
              </p>
              <p className="text-xs text-muted-foreground">
                24/7 консультации специалистов
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t border-border p-4 bg-primary/5">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground mb-2">
            Нужна консультация?
          </p>
          <div className="space-y-1">
            <p className="text-sm font-data text-primary">
              +7 (495) 123-45-67
            </p>
            <p className="text-xs text-muted-foreground">
              Пн-Пт: 9:00-18:00, Сб: 10:00-16:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;