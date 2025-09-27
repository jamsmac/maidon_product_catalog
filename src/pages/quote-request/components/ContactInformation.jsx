import React from 'react';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ContactInformation = ({ formData, updateFormData, errors }) => {
  const handleInputChange = (field, value) => {
    updateFormData('contactInfo', { ...formData?.contactInfo, [field]: value });
  };

  const titleOptions = [
    { value: 'mr', label: 'Господин' },
    { value: 'mrs', label: 'Госпожа' },
    { value: 'ms', label: 'Мисс' },
    { value: 'dr', label: 'Доктор' },
    { value: 'prof', label: 'Профессор' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <span className="text-primary-foreground font-heading font-semibold text-sm">1</span>
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Контактная информация
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Обращение"
          options={titleOptions}
          value={formData?.contactInfo?.title}
          onChange={(value) => handleInputChange('title', value)}
          placeholder="Выберите обращение"
          className="md:col-span-1"
        />

        <div className="md:col-span-1"></div>

        <Input
          label="Имя"
          type="text"
          placeholder="Введите ваше имя"
          value={formData?.contactInfo?.firstName}
          onChange={(e) => handleInputChange('firstName', e?.target?.value)}
          error={errors?.firstName}
          required
        />

        <Input
          label="Фамилия"
          type="text"
          placeholder="Введите вашу фамилию"
          value={formData?.contactInfo?.lastName}
          onChange={(e) => handleInputChange('lastName', e?.target?.value)}
          error={errors?.lastName}
          required
        />

        <Input
          label="Должность"
          type="text"
          placeholder="Ваша должность в компании"
          value={formData?.contactInfo?.position}
          onChange={(e) => handleInputChange('position', e?.target?.value)}
          error={errors?.position}
        />

        <Input
          label="Отдел"
          type="text"
          placeholder="Отдел или подразделение"
          value={formData?.contactInfo?.department}
          onChange={(e) => handleInputChange('department', e?.target?.value)}
        />

        <Input
          label="Рабочий телефон"
          type="tel"
          placeholder="+7 (XXX) XXX-XX-XX"
          value={formData?.contactInfo?.workPhone}
          onChange={(e) => handleInputChange('workPhone', e?.target?.value)}
          error={errors?.workPhone}
          required
        />

        <Input
          label="Мобильный телефон"
          type="tel"
          placeholder="+7 (XXX) XXX-XX-XX"
          value={formData?.contactInfo?.mobilePhone}
          onChange={(e) => handleInputChange('mobilePhone', e?.target?.value)}
        />

        <Input
          label="Рабочий email"
          type="email"
          placeholder="email@company.ru"
          value={formData?.contactInfo?.workEmail}
          onChange={(e) => handleInputChange('workEmail', e?.target?.value)}
          error={errors?.workEmail}
          required
          className="md:col-span-2"
        />
      </div>
    </div>
  );
};

export default ContactInformation;