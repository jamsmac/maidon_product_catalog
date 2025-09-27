import { ChevronDown, ChevronUp, Info, Zap, Maximize, Battery, Shield, User } from 'lucide-react';
import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';


const SpecificationsTable = ({ specifications = [], onTabOpen }) => {
  const [expandedCategories, setExpandedCategories] = useState(
    specifications?.reduce((acc, spec) => {
      acc[spec.category] = true; // Open all by default
      return acc;
    }, {})
  );

  const handleCategoryToggle = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev?.[category]
    }));
    
    // Track specs tab interaction
    if (onTabOpen) {
      onTabOpen(category);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      Info,
      Zap, 
      Maximize,
      Battery,
      Shield,
      User
    };
    const Icon = icons?.[iconName] || Info;
    return <Icon className="w-5 h-5" />;
  };

  const formatSpecValue = (spec) => {
    switch (spec?.type) {
      case 'boolean':
        return spec?.value ? '✓ Да' : '✗ Нет';
      case 'range':
        return `${spec?.value} ${spec?.unit || ''}`;
      case 'list':
        return spec?.values?.join(', ') || 'Не указано';
      case 'number':
        return `${spec?.value} ${spec?.unit || ''}`;
      default:
        return spec?.value || 'Не указано';
    }
  };

  if (!specifications || specifications?.length === 0) {
    return (
      <section className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
          Технические характеристики
        </h2>
        <p className="text-muted-foreground">Характеристики не найдены</p>
      </section>
    );
  }

  return (
    <section className="bg-card rounded-lg border border-border p-6" aria-label="Технические характеристики">
      <header className="mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Технические характеристики
        </h2>
        <p className="text-muted-foreground">
          Полный перечень технических параметров и возможностей оборудования
        </p>
      </header>
      <div className="space-y-6">
        {specifications?.map((category) => (
          <div key={category?.category} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => handleCategoryToggle(category?.category)}
              className="w-full p-4 bg-muted/50 hover:bg-muted transition-colors flex items-center justify-between text-left"
              aria-expanded={expandedCategories?.[category?.category]}
              aria-controls={`specs-${category?.category}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  {getIcon(category?.icon)}
                </div>
                <h3 className="font-heading font-semibold text-foreground">
                  {category?.name}
                </h3>
                <span className="text-sm text-muted-foreground">
                  ({category?.specs?.length || 0} параметров)
                </span>
              </div>
              
              <div className="text-muted-foreground">
                {expandedCategories?.[category?.category] ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {expandedCategories?.[category?.category] && (
              <div id={`specs-${category?.category}`} className="border-t border-border">
                <div className="divide-y divide-border">
                  {category?.specs?.map((spec, index) => (
                    <div 
                      key={index} 
                      className={`p-4 hover:bg-muted/30 transition-colors ${
                        spec?.important ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <dt className={`font-medium ${
                            spec?.important ? 'text-primary font-semibold' : 'text-foreground'
                          }`}>
                            {spec?.name}
                            {spec?.important && (
                              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                Ключевая
                              </span>
                            )}
                          </dt>
                          {spec?.note && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {spec?.note}
                            </p>
                          )}
                        </div>
                        
                        <dd className={`text-right font-semibold ${
                          spec?.important ? 'text-primary text-lg' : 'text-foreground'
                        }`}>
                          {formatSpecValue(spec)}
                        </dd>
                      </div>
                      
                      {/* Range visualization for numeric ranges */}
                      {spec?.type === 'range' && spec?.min && spec?.max && (
                        <div className="mt-3">
                          <div className="w-full bg-muted rounded-full h-2 relative">
                            <div 
                              className="bg-primary rounded-full h-2 relative"
                              style={{ 
                                width: `${((spec?.optimal || spec?.max) - spec?.min) / (spec?.max - spec?.min) * 100}%` 
                              }}
                            />
                            {spec?.optimal && (
                              <div 
                                className="absolute top-0 w-1 h-2 bg-primary-foreground rounded-full"
                                style={{ 
                                  left: `${(spec?.optimal - spec?.min) / (spec?.max - spec?.min) * 100}%` 
                                }}
                                title={`Оптимально: ${spec?.optimal} ${spec?.unit || ''}`}
                              />
                            )}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Мин: {spec?.min} {spec?.unit || ''}</span>
                            {spec?.optimal && (
                              <span>Опт: {spec?.optimal} {spec?.unit || ''}</span>
                            )}
                            <span>Макс: {spec?.max} {spec?.unit || ''}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Download specifications button */}
      <div className="mt-6 pt-6 border-t border-border">
        <button
          onClick={() => onTabOpen && onTabOpen('download_specs')}
          className="w-full md:w-auto px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span>📄</span>
          Скачать полный список характеристик (PDF)
        </button>
      </div>
    </section>
  );
};

export default SpecificationsTable;