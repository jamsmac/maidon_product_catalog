import React from 'react';

import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, completedFields, totalFields }) => {
  const steps = [
    { id: 1, title: 'Контакты', icon: 'User' },
    { id: 2, title: 'Компания', icon: 'Building' },
    { id: 3, title: 'Оборудование', icon: 'Package' },
    { id: 4, title: 'Финансы', icon: 'CreditCard' },
    { id: 5, title: 'Доставка', icon: 'Truck' },
    { id: 6, title: 'Документы', icon: 'FileText' }
  ];

  const progressPercentage = Math.round((completedFields / totalFields) * 100);

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
      <div className="space-y-6">
        {/* Progress Header */}
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
            Прогресс заполнения
          </h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Заполнено полей: {completedFields} из {totalFields}
            </span>
            <span className="font-medium text-primary">
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps?.map((step, index) => {
            const status = getStepStatus(step?.id);
            const isLast = index === steps?.length - 1;

            return (
              <div key={step?.id} className="relative">
                <div className="flex items-center space-x-3">
                  {/* Step Icon */}
                  <div
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200
                      ${status === 'completed'
                        ? 'bg-success border-success text-success-foreground'
                        : status === 'current' ?'bg-primary border-primary text-primary-foreground' :'bg-background border-border text-muted-foreground'
                      }
                    `}
                  >
                    {status === 'completed' ? (
                      <Icon name="Check" size={16} strokeWidth={2.5} />
                    ) : (
                      <Icon name={step?.icon} size={16} strokeWidth={2} />
                    )}
                  </div>

                  {/* Step Title */}
                  <span
                    className={`
                      font-body font-medium text-sm transition-colors duration-200
                      ${status === 'current' ?'text-foreground'
                        : status === 'completed' ?'text-success' :'text-muted-foreground'
                      }
                    `}
                  >
                    {step?.title}
                  </span>

                  {/* Status Indicator */}
                  {status === 'current' && (
                    <div className="flex items-center space-x-1 ml-auto">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-xs text-primary font-medium">Текущий</span>
                    </div>
                  )}
                </div>
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`
                      absolute left-4 top-8 w-0.5 h-6 transition-colors duration-200
                      ${status === 'completed' ? 'bg-success' : 'bg-border'}
                    `}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {progressPercentage >= 80 && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
              <div>
                <h4 className="font-body font-semibold text-success text-sm mb-1">
                  Почти готово!
                </h4>
                <p className="text-xs text-success/80">
                  Форма заполнена на {progressPercentage}%. Проверьте данные и отправьте запрос.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="HelpCircle" size={18} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-body font-semibold text-foreground text-sm mb-2">
                Нужна помощь?
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Наши специалисты помогут подобрать оптимальное решение
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={14} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={14} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">sales@maidon.ru</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;