import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkOrderForm = ({ selectedParts = [], onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    deliveryDate: '',
    paymentTerms: '',
    specialRequirements: '',
    needsInstallation: false,
    needsTraining: false,
    urgentDelivery: false
  });

  const [quantities, setQuantities] = useState(
    selectedParts?.reduce((acc, part) => ({ ...acc, [part?.id]: 1 }), {})
  );

  const paymentOptions = [
    { value: '', label: 'Выберите условия оплаты' },
    { value: 'prepayment-100', label: '100% предоплата' },
    { value: 'prepayment-50', label: '50% предоплата, 50% при получении' },
    { value: 'postpayment', label: 'Оплата по факту поставки' },
    { value: 'credit-30', label: 'Отсрочка платежа 30 дней' },
    { value: 'credit-60', label: 'Отсрочка платежа 60 дней' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (partId, quantity) => {
    setQuantities(prev => ({ ...prev, [partId]: Math.max(1, parseInt(quantity) || 1) }));
  };

  const calculateTotal = () => {
    return selectedParts?.reduce((total, part) => {
      const quantity = quantities?.[part?.id] || 1;
      const unitPrice = part?.price;
      const discount = getQuantityDiscount(quantity);
      const discountedPrice = unitPrice * (1 - discount / 100);
      return total + (discountedPrice * quantity);
    }, 0);
  };

  const getQuantityDiscount = (quantity) => {
    if (quantity >= 100) return 15;
    if (quantity >= 50) return 10;
    if (quantity >= 20) return 7;
    if (quantity >= 10) return 5;
    return 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const orderData = {
      ...formData,
      parts: selectedParts?.map(part => ({
        ...part,
        quantity: quantities?.[part?.id],
        unitPrice: part?.price,
        discount: getQuantityDiscount(quantities?.[part?.id]),
        totalPrice: part?.price * quantities?.[part?.id] * (1 - getQuantityDiscount(quantities?.[part?.id]) / 100)
      })),
      totalAmount: calculateTotal(),
      orderDate: new Date()?.toISOString()
    };
    
    onSubmit(orderData);
  };

  const isFormValid = formData?.companyName && formData?.contactPerson && 
    formData?.email && formData?.phone && formData?.deliveryAddress;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <Icon name="ShoppingCart" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground">
                Оптовый заказ запчастей
              </h2>
              <p className="text-sm text-muted-foreground">
                Заказ {selectedParts?.length} позиций с количественными скидками
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Информация о компании
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Название компании"
                  type="text"
                  placeholder="ООО 'Логистика Плюс'"
                  value={formData?.companyName}
                  onChange={(e) => handleInputChange('companyName', e?.target?.value)}
                  required
                />
                <Input
                  label="Контактное лицо"
                  type="text"
                  placeholder="Иванов Иван Иванович"
                  value={formData?.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="zakaz@company.ru"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  required
                />
                <Input
                  label="Телефон"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  required
                />
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Доставка и оплата
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Адрес доставки"
                  type="text"
                  placeholder="г. Москва, ул. Складская, д. 15"
                  value={formData?.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e?.target?.value)}
                  required
                />
                <Input
                  label="Желаемая дата доставки"
                  type="date"
                  value={formData?.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e?.target?.value)}
                  min={new Date()?.toISOString()?.split('T')?.[0]}
                />
              </div>
              <Select
                label="Условия оплаты"
                options={paymentOptions}
                value={formData?.paymentTerms}
                onChange={(value) => handleInputChange('paymentTerms', value)}
              />
            </div>

            {/* Parts List */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Состав заказа
              </h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-5">Запчасть</div>
                  <div className="col-span-2 text-center">Количество</div>
                  <div className="col-span-2 text-center">Цена за ед.</div>
                  <div className="col-span-1 text-center">Скидка</div>
                  <div className="col-span-2 text-right">Сумма</div>
                </div>
                {selectedParts?.map((part) => {
                  const quantity = quantities?.[part?.id] || 1;
                  const discount = getQuantityDiscount(quantity);
                  const unitPrice = part?.price;
                  const discountedPrice = unitPrice * (1 - discount / 100);
                  const totalPrice = discountedPrice * quantity;

                  return (
                    <div key={part?.id} className="px-4 py-3 border-t border-border grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <p className="font-medium text-foreground">{part?.name}</p>
                        <p className="text-sm text-muted-foreground font-data">{part?.partNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(part?.id, e?.target?.value)}
                          className="text-center"
                        />
                      </div>
                      <div className="col-span-2 text-center">
                        <p className="font-medium">{formatPrice(unitPrice)}</p>
                      </div>
                      <div className="col-span-1 text-center">
                        {discount > 0 && (
                          <span className="text-success font-medium">-{discount}%</span>
                        )}
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="font-bold text-foreground">{formatPrice(totalPrice)}</p>
                        {discount > 0 && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(unitPrice * quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="px-4 py-3 border-t border-border bg-muted/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-heading font-semibold text-foreground">
                      Итого к оплате:
                    </span>
                    <span className="text-xl font-heading font-bold text-primary">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Дополнительные услуги
              </h3>
              <div className="space-y-3">
                <Checkbox
                  label="Требуется установка запчастей"
                  description="Наши специалисты выполнят монтаж на вашей территории"
                  checked={formData?.needsInstallation}
                  onChange={(e) => handleInputChange('needsInstallation', e?.target?.checked)}
                />
                <Checkbox
                  label="Требуется обучение персонала"
                  description="Проведем инструктаж по эксплуатации и обслуживанию"
                  checked={formData?.needsTraining}
                  onChange={(e) => handleInputChange('needsTraining', e?.target?.checked)}
                />
                <Checkbox
                  label="Срочная доставка"
                  description="Доставка в течение 24 часов (+15% к стоимости)"
                  checked={formData?.urgentDelivery}
                  onChange={(e) => handleInputChange('urgentDelivery', e?.target?.checked)}
                />
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <Input
                label="Особые требования"
                type="text"
                placeholder="Укажите дополнительные пожелания к заказу"
                value={formData?.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
                description="Время доставки, упаковка, документооборот и т.д."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Отменить
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={!isFormValid}
                iconName="Send"
                iconPosition="left"
                className="flex-1"
              >
                Отправить заказ
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderForm;