import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CompanyDetails = ({ formData, updateFormData, errors }) => {
  const handleInputChange = (field, value) => {
    updateFormData('companyDetails', { ...formData?.companyDetails, [field]: value });
  };

  const companySizeOptions = [
    { value: 'small', label: 'Малый бизнес (до 50 сотрудников)' },
    { value: 'medium', label: 'Средний бизнес (50-250 сотрудников)' },
    { value: 'large', label: 'Крупный бизнес (250+ сотрудников)' },
    { value: 'enterprise', label: 'Корпорация (1000+ сотрудников)' }
  ];

  const industryOptions = [
    { value: 'logistics', label: 'Логистика и складское хозяйство' },
    { value: 'manufacturing', label: 'Производство' },
    { value: 'retail', label: 'Розничная торговля' },
    { value: 'construction', label: 'Строительство' },
    { value: 'automotive', label: 'Автомобильная промышленность' },
    { value: 'food', label: 'Пищевая промышленность' },
    { value: 'pharmaceutical', label: 'Фармацевтика' },
    { value: 'other', label: 'Другое' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <span className="text-primary-foreground font-heading font-semibold text-sm">2</span>
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Информация о компании
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Название компании"
          type="text"
          placeholder="ООО 'Название компании'"
          value={formData?.companyDetails?.companyName}
          onChange={(e) => handleInputChange('companyName', e?.target?.value)}
          error={errors?.companyName}
          required
          className="md:col-span-2"
        />

        <Input
          label="ИНН"
          type="text"
          placeholder="1234567890"
          value={formData?.companyDetails?.inn}
          onChange={(e) => handleInputChange('inn', e?.target?.value)}
          error={errors?.inn}
          required
        />

        <Input
          label="КПП"
          type="text"
          placeholder="123456789"
          value={formData?.companyDetails?.kpp}
          onChange={(e) => handleInputChange('kpp', e?.target?.value)}
        />

        <Select
          label="Размер компании"
          options={companySizeOptions}
          value={formData?.companyDetails?.companySize}
          onChange={(value) => handleInputChange('companySize', value)}
          placeholder="Выберите размер компании"
          required
        />

        <Select
          label="Отрасль"
          options={industryOptions}
          value={formData?.companyDetails?.industry}
          onChange={(value) => handleInputChange('industry', value)}
          placeholder="Выберите отрасль"
          required
        />

        <Input
          label="Веб-сайт"
          type="url"
          placeholder="https://company.ru"
          value={formData?.companyDetails?.website}
          onChange={(e) => handleInputChange('website', e?.target?.value)}
        />

        <Input
          label="Годовой оборот (млн ₽)"
          type="number"
          placeholder="100"
          value={formData?.companyDetails?.annualRevenue}
          onChange={(e) => handleInputChange('annualRevenue', e?.target?.value)}
        />

        <Input
          label="Юридический адрес"
          type="text"
          placeholder="г. Ташкент, ул. Примерная, д. 1"
          value={formData?.companyDetails?.legalAddress}
          onChange={(e) => handleInputChange('legalAddress', e?.target?.value)}
          error={errors?.legalAddress}
          required
          className="md:col-span-2"
        />

        <Input
          label="Фактический адрес"
          type="text"
          placeholder="г. Ташкент, ул. Примерная, д. 1"
          value={formData?.companyDetails?.actualAddress}
          onChange={(e) => handleInputChange('actualAddress', e?.target?.value)}
          className="md:col-span-2"
        />
      </div>
    </div>
  );
};

export default CompanyDetails;