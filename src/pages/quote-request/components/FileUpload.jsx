import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUpload = ({ formData, updateFormData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleChange = (e) => {
    e?.preventDefault();
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const newFiles = fileArray?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: file?.size,
      type: file?.type,
      file: file
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    updateFormData('attachments', { files: [...uploadedFiles, ...newFiles] });
  };

  const removeFile = (fileId) => {
    const updatedFiles = uploadedFiles?.filter(file => file?.id !== fileId);
    setUploadedFiles(updatedFiles);
    updateFormData('attachments', { files: updatedFiles });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) return 'Image';
    if (fileType?.includes('pdf')) return 'FileText';
    if (fileType?.includes('word') || fileType?.includes('document')) return 'FileText';
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return 'FileSpreadsheet';
    return 'File';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <span className="text-primary-foreground font-heading font-semibold text-sm">6</span>
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Дополнительные документы
        </h3>
      </div>
      <div className="space-y-6">
        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
            ${dragActive 
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full">
              <Icon name="Upload" size={24} className="text-muted-foreground" />
            </div>
            
            <div>
              <p className="font-body font-medium text-foreground mb-1">
                Перетащите файлы сюда или нажмите для выбора
              </p>
              <p className="text-sm text-muted-foreground">
                Поддерживаются: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (макс. 10 МБ)
              </p>
            </div>
            
            <Button variant="outline" size="sm">
              Выбрать файлы
            </Button>
          </div>
        </div>

        {/* File List */}
        {uploadedFiles?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-body font-medium text-foreground">
              Загруженные файлы ({uploadedFiles?.length})
            </h4>
            
            <div className="space-y-2">
              {uploadedFiles?.map((file) => (
                <div
                  key={file?.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getFileIcon(file?.type)} 
                      size={20} 
                      className="text-primary" 
                    />
                    <div>
                      <p className="font-body font-medium text-foreground text-sm">
                        {file?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-body font-medium text-foreground mb-3">
            Рекомендуемые документы:
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span>Техническое задание или спецификация</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span>План склада или рабочей зоны</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span>Документы на оборудование для trade-in</span>
            </li>
            <li className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span>Реквизиты компании</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;