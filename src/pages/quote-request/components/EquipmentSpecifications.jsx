import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const EquipmentSpecifications = ({ formData, updateFormData, errors }) => {
  const handleInputChange = (field, value) => {
    updateFormData('equipmentSpecs', { ...formData?.equipmentSpecs, [field]: value });
  };

  const equipmentTypeOptions = [
    { value: 'forklift-electric', label: 'Электропогрузчик' },
    { value: 'forklift-gas', label: 'Газовый погрузчик' },
    { value: 'forklift-diesel', label: 'Дизельный погрузчик' },
    { value: 'reach-truck', label: 'Ричтрак' },
    { value: 'order-picker', label: 'Комплектовщик заказов' },
    { value: 'pallet-truck', label: 'Электротележка' },
    { value: 'stacker', label: 'Штабелер' }
  ];

  const loadCapacityOptions = [
    { value: '1000', label: '1,0 тонна' },
    { value: '1500', label: '1,5 тонны' },
    { value: '2000', label: '2,0 тонны' },
    { value: '2500', label: '2,5 тонны' },
    { value: '3000', label: '3,0 тонны' },
    { value: '3500', label: '3,5 тонны' },
    { value: '5000', label: '5,0 тонн' },
    { value: 'custom', label: 'Другая грузоподъемность' }
  ];

  const liftHeightOptions = [
    { value: '3000', label: '3,0 метра' },
    { value: '4000', label: '4,0 метра' },
    { value: '5000', label: '5,0 метров' },
    { value: '6000', label: '6,0 метров' },
    { value: '7000', label: '7,0 метров' },
    { value: '8000', label: '8,0 метров' },
    { value: 'custom', label: 'Другая высота подъема' }
  ];

  const usageIntensityOptions = [
    { value: 'light', label: 'Легкая (до 4 часов в день)' },
    { value: 'medium', label: 'Средняя (4-8 часов в день)' },
    { value: 'heavy', label: 'Интенсивная (8+ часов в день)' },
    { value: 'continuous', label: 'Непрерывная (24/7)' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <span className="text-primary-foreground font-heading font-semibold text-sm">3</span>
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Технические требования
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Тип оборудования"
          options={equipmentTypeOptions}
          value={formData?.equipmentSpecs?.equipmentType}
          onChange={(value) => handleInputChange('equipmentType', value)}
          placeholder="Выберите тип оборудования"
          error={errors?.equipmentType}
          required
          className="md:col-span-2"
        />

        <Select
          label="Грузоподъемность"
          options={loadCapacityOptions}
          value={formData?.equipmentSpecs?.loadCapacity}
          onChange={(value) => handleInputChange('loadCapacity', value)}
          placeholder="Выберите грузоподъемность"
          error={errors?.loadCapacity}
          required
        />

        <Select
          label="Высота подъема"
          options={liftHeightOptions}
          value={formData?.equipmentSpecs?.liftHeight}
          onChange={(value) => handleInputChange('liftHeight', value)}
          placeholder="Выберите высоту подъема"
          error={errors?.liftHeight}
          required
        />

        <Input
          label="Количество единиц"
          type="number"
          placeholder="1"
          value={formData?.equipmentSpecs?.quantity}
          onChange={(e) => handleInputChange('quantity', e?.target?.value)}
          error={errors?.quantity}
          required
          min="1"
        />

        <Select
          label="Интенсивность использования"
          options={usageIntensityOptions}
          value={formData?.equipmentSpecs?.usageIntensity}
          onChange={(value) => handleInputChange('usageIntensity', value)}
          placeholder="Выберите интенсивность"
          required
        />

        <Input
          label="Ширина проходов (мм)"
          type="number"
          placeholder="2500"
          value={formData?.equipmentSpecs?.aisleWidth}
          onChange={(e) => handleInputChange('aisleWidth', e?.target?.value)}
          description="Минимальная ширина проходов на складе"
        />

        <Input
          label="Тип напольного покрытия"
          type="text"
          placeholder="Бетон, асфальт, плитка"
          value={formData?.equipmentSpecs?.floorType}
          onChange={(e) => handleInputChange('floorType', e?.target?.value)}
        />

        <div className="md:col-span-2">
          <Input
            label="Дополнительные требования"
            type="text"
            placeholder="Опишите специальные требования к оборудованию"
            value={formData?.equipmentSpecs?.additionalRequirements}
            onChange={(e) => handleInputChange('additionalRequirements', e?.target?.value)}
            description="Кабина, боковой сдвиг, дополнительные опции и т.д."
          />
        </div>

        {/* Pre-selected product info display */}
        {formData?.equipmentSpecs?.preSelectedModel && (
          <div className="md:col-span-2 bg-muted rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Package" size={20} className="text-primary mt-1" />
              <div>
                <h4 className="font-body font-semibold text-foreground mb-2">
                  Предварительно выбранная модель
                </h4>
                <p className="text-sm text-muted-foreground mb-1">
                  {formData?.equipmentSpecs?.preSelectedModel}
                </p>
                <p className="text-xs text-muted-foreground">
                  Конфигурация: {formData?.equipmentSpecs?.preSelectedConfig || 'Стандартная'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentSpecifications;