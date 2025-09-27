import React from 'react';

import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FinancingPreferences = ({ formData, updateFormData, errors }) => {
  const handleInputChange = (field, value) => {
    updateFormData('financingPrefs', { ...formData?.financingPrefs, [field]: value });
  };

  const handleCheckboxChange = (field, checked) => {
    updateFormData('financingPrefs', { ...formData?.financingPrefs, [field]: checked });
  };

  const purchaseTypeOptions = [
    { value: 'purchase', label: 'Покупка' },
    { value: 'lease', label: 'Лизинг' },
    { value: 'rental', label: 'Аренда' },
    { value: 'rent-to-own', label: 'Аренда с правом выкупа' }
  ];

  const leasingTermOptions = [
    { value: '12', label: '12 месяцев' },
    { value: '24', label: '24 месяца' },
    { value: '36', label: '36 месяцев' },
    { value: '48', label: '48 месяцев' },
    { value: '60', label: '60 месяцев' }
  ];

  const paymentMethodOptions = [
    { value: 'bank-transfer', label: 'Банковский перевод' },
    { value: 'cash', label: 'Наличные' },
    { value: 'installments', label: 'Рассрочка' },
    { value: 'credit', label: 'Кредит' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <span className="text-primary-foreground font-heading font-semibold text-sm">4</span>
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Условия финансирования
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Тип приобретения"
          options={purchaseTypeOptions}
          value={formData?.financingPrefs?.purchaseType}
          onChange={(value) => handleInputChange('purchaseType', value)}
          placeholder="Выберите тип приобретения"
          error={errors?.purchaseType}
          required
          className="md:col-span-2"
        />

        {formData?.financingPrefs?.purchaseType === 'lease' && (
          <Select
            label="Срок лизинга"
            options={leasingTermOptions}
            value={formData?.financingPrefs?.leasingTerm}
            onChange={(value) => handleInputChange('leasingTerm', value)}
            placeholder="Выберите срок лизинга"
            required
          />
        )}

        <Select
          label="Способ оплаты"
          options={paymentMethodOptions}
          value={formData?.financingPrefs?.paymentMethod}
          onChange={(value) => handleInputChange('paymentMethod', value)}
          placeholder="Выберите способ оплаты"
          required
        />

        <Input
          label="Бюджет (₽)"
          type="number"
          placeholder="1 000 000"
          value={formData?.financingPrefs?.budget}
          onChange={(e) => handleInputChange('budget', e?.target?.value)}
          description="Ориентировочный бюджет на единицу оборудования"
        />

        <Input
          label="Первоначальный взнос (%)"
          type="number"
          placeholder="20"
          value={formData?.financingPrefs?.downPayment}
          onChange={(e) => handleInputChange('downPayment', e?.target?.value)}
          min="0"
          max="100"
        />

        <div className="md:col-span-2 space-y-4">
          <h4 className="font-body font-medium text-foreground">
            Дополнительные услуги
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Страхование оборудования"
              checked={formData?.financingPrefs?.includeInsurance}
              onChange={(e) => handleCheckboxChange('includeInsurance', e?.target?.checked)}
            />

            <Checkbox
              label="Сервисное обслуживание"
              checked={formData?.financingPrefs?.includeMaintenance}
              onChange={(e) => handleCheckboxChange('includeMaintenance', e?.target?.checked)}
            />

            <Checkbox
              label="Обучение операторов"
              checked={formData?.financingPrefs?.includeTraining}
              onChange={(e) => handleCheckboxChange('includeTraining', e?.target?.checked)}
            />

            <Checkbox
              label="Доставка и установка"
              checked={formData?.financingPrefs?.includeDelivery}
              onChange={(e) => handleCheckboxChange('includeDelivery', e?.target?.checked)}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <Checkbox
            label="Рассмотреть б/у оборудование"
            description="Включить в предложение варианты восстановленного оборудования"
            checked={formData?.financingPrefs?.considerUsed}
            onChange={(e) => handleCheckboxChange('considerUsed', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancingPreferences;