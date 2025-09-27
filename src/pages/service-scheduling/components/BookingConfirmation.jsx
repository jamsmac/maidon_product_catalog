import React from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingConfirmation = ({ 
  selectedEquipment, 
  selectedPackage, 
  selectedSlot, 
  selectedDate, 
  serviceDetails,
  onConfirm,
  onEdit,
  isConfirming 
}) => {
  
  const formatDate = (date) => {
    return date ? date?.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Активен':
        return 'bg-success/10 text-success';
      case 'Требует обслуживания':
        return 'bg-warning/10 text-warning';
      case 'В ремонте':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-error';
      case 'urgent':
        return 'text-error font-semibold';
      default:
        return 'text-muted-foreground';
    }
  };
  
  const priorityLabels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    urgent: 'Срочный'
  };
  
  const conditionLabels = {
    excellent: 'Отличное',
    good: 'Хорошее',
    fair: 'Удовлетворительное',
    poor: 'Плохое',
    critical: 'Критическое'
  };
  
  const isComplete = selectedEquipment && selectedPackage && selectedSlot && selectedDate;
  
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Подтверждение записи
        </h3>
        {isComplete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Icon name="Edit" size={16} className="mr-2" />
            Изменить
          </Button>
        )}
      </div>
      {!isComplete ? (
        <div className="text-center py-12">
          <Icon name="ClipboardList" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h4 className="text-base font-body font-medium text-foreground mb-2">
            Заполните все поля для подтверждения
          </h4>
          <p className="text-sm font-caption text-muted-foreground">
            Выберите оборудование, пакет обслуживания и время для продолжения
          </p>
          
          <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
            <div className={`flex items-center space-x-2 text-sm font-caption ${selectedEquipment ? 'text-success' : 'text-muted-foreground'}`}>
              <Icon name={selectedEquipment ? "CheckCircle" : "Circle"} size={16} />
              <span>Оборудование выбрано</span>
            </div>
            <div className={`flex items-center space-x-2 text-sm font-caption ${selectedPackage ? 'text-success' : 'text-muted-foreground'}`}>
              <Icon name={selectedPackage ? "CheckCircle" : "Circle"} size={16} />
              <span>Пакет обслуживания выбран</span>
            </div>
            <div className={`flex items-center space-x-2 text-sm font-caption ${selectedDate && selectedSlot ? 'text-success' : 'text-muted-foreground'}`}>
              <Icon name={selectedDate && selectedSlot ? "CheckCircle" : "Circle"} size={16} />
              <span>Дата и время выбраны</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Equipment Summary */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Truck" size={16} className="text-primary" />
              <span className="text-sm font-body font-medium text-foreground">
                Оборудование
              </span>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={selectedEquipment?.image}
                  alt={selectedEquipment?.model}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-body font-semibold text-foreground">
                      {selectedEquipment?.model}
                    </h4>
                    <p className="text-xs font-caption text-muted-foreground">
                      VIN: {selectedEquipment?.vin}
                    </p>
                  </div>
                  <span className={`text-xs font-caption px-2 py-1 rounded-full ${getStatusColor(selectedEquipment?.status)}`}>
                    {selectedEquipment?.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-caption text-muted-foreground">
                  <div>Тип: {selectedEquipment?.type}</div>
                  <div>Местоположение: {selectedEquipment?.location}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Service Package Summary */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Settings" size={16} className="text-primary" />
              <span className="text-sm font-body font-medium text-foreground">
                Пакет обслуживания
              </span>
            </div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-body font-semibold text-foreground mb-1">
                  {selectedPackage?.name}
                </h4>
                <p className="text-xs font-caption text-muted-foreground mb-2">
                  {selectedPackage?.description}
                </p>
                <div className="text-xs font-caption text-muted-foreground">
                  Продолжительность: {selectedPackage?.duration}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-body font-semibold text-foreground">
                  {typeof selectedPackage?.price === 'number' 
                    ? `${selectedPackage?.price?.toLocaleString('uz-UZ')} UZS`
                    : selectedPackage?.price
                  }
                </div>
              </div>
            </div>
          </div>
          
          {/* Schedule Summary */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="text-sm font-body font-medium text-foreground">
                Дата и время
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-caption text-muted-foreground mb-1">Дата:</div>
                <div className="text-sm font-body text-foreground capitalize">
                  {formatDate(selectedDate)}
                </div>
              </div>
              <div>
                <div className="text-xs font-caption text-muted-foreground mb-1">Время:</div>
                <div className="text-sm font-body text-foreground">
                  {selectedSlot?.time}
                </div>
              </div>
              <div>
                <div className="text-xs font-caption text-muted-foreground mb-1">Специалист:</div>
                <div className="text-sm font-body text-foreground">
                  {selectedSlot?.technician}
                </div>
              </div>
              <div>
                <div className="text-xs font-caption text-muted-foreground mb-1">Тип обслуживания:</div>
                <div className={`
                  text-xs font-caption px-2 py-1 rounded-full inline-block
                  ${selectedSlot?.type === 'mobile' ?'bg-accent/10 text-accent' :'bg-secondary/10 text-secondary'
                  }
                `}>
                  {selectedSlot?.type === 'mobile' ? 'Выездной сервис' : 'В сервисном центре'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Service Details Summary */}
          {(serviceDetails?.condition || serviceDetails?.priority || serviceDetails?.issues) && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="FileText" size={16} className="text-primary" />
                <span className="text-sm font-body font-medium text-foreground">
                  Детали обслуживания
                </span>
              </div>
              
              <div className="space-y-3">
                {(serviceDetails?.condition || serviceDetails?.priority) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-caption">
                    {serviceDetails?.condition && (
                      <div>
                        <span className="text-muted-foreground">Состояние:</span>
                        <span className="ml-2 text-foreground">
                          {conditionLabels?.[serviceDetails?.condition]}
                        </span>
                      </div>
                    )}
                    {serviceDetails?.priority && (
                      <div>
                        <span className="text-muted-foreground">Приоритет:</span>
                        <span className={`ml-2 ${getPriorityColor(serviceDetails?.priority)}`}>
                          {priorityLabels?.[serviceDetails?.priority]}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {serviceDetails?.issues && (
                  <div>
                    <div className="text-xs font-caption text-muted-foreground mb-1">
                      Описание проблем:
                    </div>
                    <div className="text-sm font-body text-foreground bg-background/50 p-2 rounded border">
                      {serviceDetails?.issues}
                    </div>
                  </div>
                )}
                
                {serviceDetails?.contactPerson && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-caption">
                    <div>
                      <span className="text-muted-foreground">Контактное лицо:</span>
                      <span className="ml-2 text-foreground">{serviceDetails?.contactPerson}</span>
                    </div>
                    {serviceDetails?.contactPhone && (
                      <div>
                        <span className="text-muted-foreground">Телефон:</span>
                        <span className="ml-2 text-foreground">{serviceDetails?.contactPhone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              onClick={onConfirm}
              loading={isConfirming}
              className="flex-1"
            >
              <Icon name="Check" size={16} className="mr-2" />
              Подтвердить запись
            </Button>
            
            <Button
              variant="outline"
              onClick={onEdit}
              disabled={isConfirming}
              className="sm:w-auto"
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Изменить
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs font-caption text-primary">
                <p className="font-medium mb-1">Важная информация:</p>
                <ul className="space-y-1 text-primary/80">
                  <li>• После подтверждения вы получите SMS с деталями записи</li>
                  <li>• Специалист свяжется с вами за день до обслуживания</li>
                  <li>• Отменить или перенести запись можно за 24 часа</li>
                  {selectedSlot?.type === 'mobile' && (
                    <li>• Для выездного сервиса требуется подготовить рабочее место</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmation;