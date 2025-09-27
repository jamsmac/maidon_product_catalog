import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ServiceDetails = ({ serviceDetails, onDetailsChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const priorityOptions = [
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' },
    { value: 'urgent', label: 'Срочный' }
  ];
  
  const conditionOptions = [
    { value: 'excellent', label: 'Отличное' },
    { value: 'good', label: 'Хорошее' },
    { value: 'fair', label: 'Удовлетворительное' },
    { value: 'poor', label: 'Плохое' },
    { value: 'critical', label: 'Критическое' }
  ];
  
  const handleInputChange = (field, value) => {
    onDetailsChange({
      ...serviceDetails,
      [field]: value
    });
  };
  
  const handleFileUpload = (event) => {
    const files = Array.from(event?.target?.files);
    const newFiles = files?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: file?.size,
      type: file?.type,
      url: URL.createObjectURL(file)
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    handleInputChange('attachments', [...(serviceDetails?.attachments || []), ...newFiles]);
  };
  
  const removeFile = (fileId) => {
    const updatedFiles = uploadedFiles?.filter(file => file?.id !== fileId);
    setUploadedFiles(updatedFiles);
    handleInputChange('attachments', updatedFiles);
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
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
  
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
        Детали обслуживания
      </h3>
      <div className="space-y-6">
        {/* Equipment Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Состояние оборудования"
            placeholder="Выберите состояние"
            options={conditionOptions}
            value={serviceDetails?.condition || ''}
            onChange={(value) => handleInputChange('condition', value)}
          />
          
          <Select
            label="Приоритет обслуживания"
            placeholder="Выберите приоритет"
            options={priorityOptions}
            value={serviceDetails?.priority || ''}
            onChange={(value) => handleInputChange('priority', value)}
          />
        </div>
        
        {/* Issues Description */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Описание проблем или особых требований
          </label>
          <textarea
            value={serviceDetails?.issues || ''}
            onChange={(e) => handleInputChange('issues', e?.target?.value)}
            placeholder="Опишите обнаруженные неисправности, особые требования к обслуживанию или другие важные детали..."
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-md text-sm font-body text-foreground placeholder-muted-foreground bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Контактное лицо"
            type="text"
            placeholder="Имя ответственного сотрудника"
            value={serviceDetails?.contactPerson || ''}
            onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
          />
          
          <Input
            label="Телефон для связи"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={serviceDetails?.contactPhone || ''}
            onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
          />
        </div>
        
        {/* Location Details for Mobile Service */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Адрес для выездного обслуживания
          </label>
          <textarea
            value={serviceDetails?.serviceLocation || ''}
            onChange={(e) => handleInputChange('serviceLocation', e?.target?.value)}
            placeholder="Укажите точный адрес, особенности проезда, контактные данные охраны и другую важную информацию для выездной бригады..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md text-sm font-body text-foreground placeholder-muted-foreground bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>
        
        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-3">
            Дополнительные требования
          </label>
          <div className="space-y-2">
            <Checkbox
              label="Требуется сертификат о выполненных работах"
              checked={serviceDetails?.requiresCertificate || false}
              onChange={(e) => handleInputChange('requiresCertificate', e?.target?.checked)}
            />
            <Checkbox
              label="Необходимо согласование времени простоя"
              checked={serviceDetails?.requiresDowntimeApproval || false}
              onChange={(e) => handleInputChange('requiresDowntimeApproval', e?.target?.checked)}
            />
            <Checkbox
              label="Требуется присутствие представителя заказчика"
              checked={serviceDetails?.requiresClientPresence || false}
              onChange={(e) => handleInputChange('requiresClientPresence', e?.target?.checked)}
            />
            <Checkbox
              label="Необходима предварительная диагностика"
              checked={serviceDetails?.requiresDiagnostics || false}
              onChange={(e) => handleInputChange('requiresDiagnostics', e?.target?.checked)}
            />
          </div>
        </div>
        
        {/* File Upload */}
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-2">
            Фотографии и документы
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-200">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Icon name="Upload" size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-body text-foreground mb-1">
                Загрузите фотографии проблем или документы
              </p>
              <p className="text-xs font-caption text-muted-foreground">
                Поддерживаются: JPG, PNG, PDF, DOC, DOCX (макс. 10 МБ)
              </p>
            </label>
          </div>
          
          {uploadedFiles?.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles?.map((file) => (
                <div key={file?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <Icon 
                        name={file?.type?.startsWith('image/') ? 'Image' : 'FileText'} 
                        size={16} 
                        className="text-primary" 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-body text-foreground">{file?.name}</p>
                      <p className="text-xs font-caption text-muted-foreground">
                        {formatFileSize(file?.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file?.id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Summary */}
        {(serviceDetails?.condition || serviceDetails?.priority) && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-body font-medium text-foreground">
                Сводка по обслуживанию
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-caption">
              {serviceDetails?.condition && (
                <div>
                  <span className="text-muted-foreground">Состояние оборудования:</span>
                  <span className="ml-2 text-foreground">
                    {conditionOptions?.find(opt => opt?.value === serviceDetails?.condition)?.label}
                  </span>
                </div>
              )}
              {serviceDetails?.priority && (
                <div>
                  <span className="text-muted-foreground">Приоритет:</span>
                  <span className={`ml-2 ${getPriorityColor(serviceDetails?.priority)}`}>
                    {priorityOptions?.find(opt => opt?.value === serviceDetails?.priority)?.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;