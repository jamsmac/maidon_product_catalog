import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PartsSearchFilters = ({ onFiltersChange, resultsCount = 0 }) => {
  const [filters, setFilters] = useState({
    category: '',
    model: '',
    priceRange: { min: '', max: '' },
    availability: [],
    partType: '',
    brand: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { value: '', label: 'Все категории' },
    { value: 'engine', label: 'Двигатель и система питания' },
    { value: 'hydraulics', label: 'Гидравлическая система' },
    { value: 'transmission', label: 'Трансмиссия' },
    { value: 'brakes', label: 'Тормозная система' },
    { value: 'electrical', label: 'Электрооборудование' },
    { value: 'cabin', label: 'Кабина и комфорт' },
    { value: 'attachments', label: 'Навесное оборудование' },
    { value: 'filters', label: 'Фильтры и расходники' }
  ];

  const modelOptions = [
    { value: '', label: 'Все модели' },
    { value: 'forklift-3t', label: 'Погрузчик 3т' },
    { value: 'forklift-5t', label: 'Погрузчик 5т' },
    { value: 'reach-truck', label: 'Ричтрак' },
    { value: 'pallet-truck', label: 'Тележка паллетная' },
    { value: 'order-picker', label: 'Комплектовщик' }
  ];

  const brandOptions = [
    { value: '', label: 'Все бренды' },
    { value: 'oem', label: 'Оригинальные (OEM)' },
    { value: 'aftermarket', label: 'Аналоги' },
    { value: 'premium', label: 'Премиум качество' }
  ];

  const availabilityOptions = [
    { value: 'in-stock', label: 'В наличии' },
    { value: 'order', label: 'Под заказ' },
    { value: 'fast-delivery', label: 'Быстрая доставка' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (type, value) => {
    const newPriceRange = { ...filters?.priceRange, [type]: value };
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAvailabilityChange = (value, checked) => {
    const newAvailability = checked
      ? [...filters?.availability, value]
      : filters?.availability?.filter(item => item !== value);
    
    const newFilters = { ...filters, availability: newAvailability };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      model: '',
      priceRange: { min: '', max: '' },
      availability: [],
      partType: '',
      brand: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters?.category || filters?.model || filters?.brand || 
    filters?.priceRange?.min || filters?.priceRange?.max || filters?.availability?.length > 0;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <div>
            <h3 className="font-heading font-semibold text-foreground">Фильтры</h3>
            <p className="text-sm text-muted-foreground">
              Найдено: {resultsCount?.toLocaleString('uz-UZ')} запчастей
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Очистить
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>
      </div>
      {/* Filters Content */}
      <div className={`p-4 space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Category and Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Категория"
            options={categoryOptions}
            value={filters?.category}
            onChange={(value) => handleFilterChange('category', value)}
          />
          <Select
            label="Модель техники"
            options={modelOptions}
            value={filters?.model}
            onChange={(value) => handleFilterChange('model', value)}
          />
        </div>

        {/* Brand */}
        <Select
          label="Тип запчастей"
          options={brandOptions}
          value={filters?.brand}
          onChange={(value) => handleFilterChange('brand', value)}
        />

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Диапазон цен (UZS)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="От"
              value={filters?.priceRange?.min}
              onChange={(e) => handlePriceRangeChange('min', e?.target?.value)}
            />
            <Input
              type="number"
              placeholder="До"
              value={filters?.priceRange?.max}
              onChange={(e) => handlePriceRangeChange('max', e?.target?.value)}
            />
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Наличие
          </label>
          <div className="space-y-2">
            {availabilityOptions?.map((option) => (
              <Checkbox
                key={option?.value}
                label={option?.label}
                checked={filters?.availability?.includes(option?.value)}
                onChange={(e) => handleAvailabilityChange(option?.value, e?.target?.checked)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartsSearchFilters;