import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { api } from '../../services/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';

// Import components
import CompanyDetails from './components/CompanyDetails';
import ContactInformation from './components/ContactInformation';
import DeliveryCalculator from './components/DeliveryCalculator';
import EquipmentSpecifications from './components/EquipmentSpecifications';
import FileUpload from './components/FileUpload';
import FinancingPreferences from './components/FinancingPreferences';
import ProgressIndicator from './components/ProgressIndicator';
import TrustSignals from './components/TrustSignals';

const QuoteRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    contactInfo: {
      title: '',
      firstName: '',
      lastName: '',
      position: '',
      department: '',
      workPhone: '',
      mobilePhone: '',
      workEmail: ''
    },
    companyDetails: {
      companyName: '',
      inn: '',
      kpp: '',
      companySize: '',
      industry: '',
      website: '',
      annualRevenue: '',
      legalAddress: '',
      actualAddress: ''
    },
    equipmentSpecs: {
      equipmentType: '',
      loadCapacity: '',
      liftHeight: '',
      quantity: '1',
      usageIntensity: '',
      aisleWidth: '',
      floorType: '',
      additionalRequirements: '',
      preSelectedModel: 'Maidon EFG 2.5T',
      preSelectedConfig: 'Стандартная конфигурация с литий-ионной батареей'
    },
    financingPrefs: {
      purchaseType: '',
      leasingTerm: '',
      paymentMethod: '',
      budget: '',
      downPayment: '',
      includeInsurance: false,
      includeMaintenance: false,
      includeTraining: false,
      includeDelivery: true,
      considerUsed: false
    },
    deliveryInfo: {
      region: '',
      city: '',
      address: '',
      deliveryType: 'standard',
      preferredDate: '',
      specialRequirements: ''
    },
    attachments: {
      files: []
    }
  });

  // Pre-populate from previous selections
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const model = searchParams?.get('model');
    const config = searchParams?.get('config');
    
    if (model || config) {
      setFormData(prev => ({
        ...prev,
        equipmentSpecs: {
          ...prev?.equipmentSpecs,
          preSelectedModel: model || prev?.equipmentSpecs?.preSelectedModel,
          preSelectedConfig: config || prev?.equipmentSpecs?.preSelectedConfig
        }
      }));
    }
  }, [location?.search]);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
    
    // Clear errors for updated fields
    const updatedErrors = { ...errors };
    Object.keys(data)?.forEach(key => {
      delete updatedErrors?.[key];
    });
    setErrors(updatedErrors);
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Contact Information
        if (!formData?.contactInfo?.firstName?.trim()) newErrors.firstName = 'Имя обязательно для заполнения';
        if (!formData?.contactInfo?.lastName?.trim()) newErrors.lastName = 'Фамилия обязательна для заполнения';
        if (!formData?.contactInfo?.workPhone?.trim()) newErrors.workPhone = 'Рабочий телефон обязателен';
        if (!formData?.contactInfo?.workEmail?.trim()) newErrors.workEmail = 'Email обязателен для заполнения';
        if (formData?.contactInfo?.workEmail && !/\S+@\S+\.\S+/?.test(formData?.contactInfo?.workEmail)) {
          newErrors.workEmail = 'Введите корректный email адрес';
        }
        break;

      case 2: // Company Details
        if (!formData?.companyDetails?.companyName?.trim()) newErrors.companyName = 'Название компании обязательно';
        if (!formData?.companyDetails?.inn?.trim()) newErrors.inn = 'ИНН обязателен для заполнения';
        if (!formData?.companyDetails?.legalAddress?.trim()) newErrors.legalAddress = 'Юридический адрес обязателен';
        break;

      case 3: // Equipment Specifications
        if (!formData?.equipmentSpecs?.equipmentType) newErrors.equipmentType = 'Выберите тип оборудования';
        if (!formData?.equipmentSpecs?.loadCapacity) newErrors.loadCapacity = 'Выберите грузоподъемность';
        if (!formData?.equipmentSpecs?.liftHeight) newErrors.liftHeight = 'Выберите высоту подъема';
        if (!formData?.equipmentSpecs?.quantity || formData?.equipmentSpecs?.quantity < 1) {
          newErrors.quantity = 'Количество должно быть больше 0';
        }
        break;

      case 4: // Financing Preferences
        if (!formData?.financingPrefs?.purchaseType) newErrors.purchaseType = 'Выберите тип приобретения';
        break;

      case 5: // Delivery Information
        if (!formData?.deliveryInfo?.region) newErrors.region = 'Выберите регион доставки';
        if (!formData?.deliveryInfo?.city?.trim()) newErrors.city = 'Введите город доставки';
        if (!formData?.deliveryInfo?.address?.trim()) newErrors.address = 'Введите адрес доставки';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const calculateCompletedFields = () => {
    let completed = 0;
    let total = 0;

    // Contact Info (8 fields, 4 required)
    total += 8;
    if (formData?.contactInfo?.firstName) completed++;
    if (formData?.contactInfo?.lastName) completed++;
    if (formData?.contactInfo?.position) completed++;
    if (formData?.contactInfo?.department) completed++;
    if (formData?.contactInfo?.workPhone) completed++;
    if (formData?.contactInfo?.mobilePhone) completed++;
    if (formData?.contactInfo?.workEmail) completed++;
    if (formData?.contactInfo?.title) completed++;

    // Company Details (9 fields, 3 required)
    total += 9;
    if (formData?.companyDetails?.companyName) completed++;
    if (formData?.companyDetails?.inn) completed++;
    if (formData?.companyDetails?.kpp) completed++;
    if (formData?.companyDetails?.companySize) completed++;
    if (formData?.companyDetails?.industry) completed++;
    if (formData?.companyDetails?.website) completed++;
    if (formData?.companyDetails?.annualRevenue) completed++;
    if (formData?.companyDetails?.legalAddress) completed++;
    if (formData?.companyDetails?.actualAddress) completed++;

    // Equipment Specs (8 fields, 4 required)
    total += 8;
    if (formData?.equipmentSpecs?.equipmentType) completed++;
    if (formData?.equipmentSpecs?.loadCapacity) completed++;
    if (formData?.equipmentSpecs?.liftHeight) completed++;
    if (formData?.equipmentSpecs?.quantity) completed++;
    if (formData?.equipmentSpecs?.usageIntensity) completed++;
    if (formData?.equipmentSpecs?.aisleWidth) completed++;
    if (formData?.equipmentSpecs?.floorType) completed++;
    if (formData?.equipmentSpecs?.additionalRequirements) completed++;

    // Financing Prefs (4 fields, 1 required)
    total += 4;
    if (formData?.financingPrefs?.purchaseType) completed++;
    if (formData?.financingPrefs?.paymentMethod) completed++;
    if (formData?.financingPrefs?.budget) completed++;
    if (formData?.financingPrefs?.downPayment) completed++;

    // Delivery Info (6 fields, 3 required)
    total += 6;
    if (formData?.deliveryInfo?.region) completed++;
    if (formData?.deliveryInfo?.city) completed++;
    if (formData?.deliveryInfo?.address) completed++;
    if (formData?.deliveryInfo?.deliveryType) completed++;
    if (formData?.deliveryInfo?.preferredDate) completed++;
    if (formData?.deliveryInfo?.specialRequirements) completed++;

    return { completed, total };
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Validate all steps
    let allValid = true;
    for (let step = 1; step <= 5; step++) {
      if (!validateStep(step)) {
        allValid = false;
      }
    }

    if (!allValid) {
      setCurrentStep(1); // Go to first step with errors
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.createQuote(formData);
      if (response.success !== false) { // API may return success or just data
        setShowSuccessModal(true);
        // Очистить форму
        setFormData({
          contactInfo: {
            title: '',
            firstName: '',
            lastName: '',
            position: '',
            department: '',
            workPhone: '',
            mobilePhone: '',
            workEmail: ''
          },
          companyDetails: {
            companyName: '',
            inn: '',
            kpp: '',
            companySize: '',
            industry: '',
            website: '',
            annualRevenue: '',
            legalAddress: '',
            actualAddress: ''
          },
          equipmentSpecs: {
            equipmentType: '',
            loadCapacity: '',
            liftHeight: '',
            quantity: '1',
            usageIntensity: '',
            aisleWidth: '',
            floorType: '',
            additionalRequirements: '',
            preSelectedModel: 'Maidon EFG 2.5T',
            preSelectedConfig: 'Стандартная конфигурация с литий-ионной батареей'
          },
          financingPrefs: {
            purchaseType: '',
            leasingTerm: '',
            paymentMethod: '',
            budget: '',
            downPayment: '',
            includeInsurance: false,
            includeMaintenance: false,
            includeTraining: false,
            includeDelivery: true,
            considerUsed: false
          },
          deliveryInfo: {
            region: '',
            city: '',
            address: '',
            deliveryType: 'standard',
            preferredDate: '',
            specialRequirements: ''
          },
          attachments: {
            files: []
          }
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
      alert('Ошибка отправки заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('quoteRequestDraft', JSON.stringify(formData));
    // Show toast notification (would implement with toast library)
    alert('Черновик сохранен');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ContactInformation
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <CompanyDetails
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <EquipmentSpecifications
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <FinancingPreferences
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 5:
        return (
          <DeliveryCalculator
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 6:
        return (
          <FileUpload
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  const { completed, total } = calculateCompletedFields();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <h1 className="font-heading font-bold text-3xl lg:text-4xl mb-4">
                Запрос коммерческого предложения
              </h1>
              <p className="text-lg opacity-90 mb-6">
                Получите персональное предложение на промышленное оборудование с учетом ваших требований и условий работы
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} />
                  <span>Ответ в течение 2 часов</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} />
                  <span>Конфиденциальность гарантирована</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Award" size={16} />
                  <span>Лучшие цены на рынке</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Form Content */}
            <div className="lg:col-span-3 space-y-8">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-4">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      iconName="ChevronLeft"
                      iconPosition="left"
                    >
                      Назад
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    onClick={handleSaveDraft}
                    iconName="Save"
                    iconPosition="left"
                  >
                    Сохранить черновик
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  {currentStep < 6 ? (
                    <Button
                      variant="default"
                      onClick={handleNextStep}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Далее
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={handleSubmit}
                      loading={isSubmitting}
                      iconName="Send"
                      iconPosition="left"
                    >
                      {isSubmitting ? 'Отправка...' : 'Отправить запрос'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={6}
                completedFields={completed}
                totalFields={total}
              />
              
              <TrustSignals />
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg border border-border p-8 max-w-md w-full">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto">
                  <Icon name="CheckCircle" size={32} className="text-success" />
                </div>
                
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                    Запрос успешно отправлен!
                  </h3>
                  <p className="text-muted-foreground">
                    Ваш запрос №QR-{Date.now()?.toString()?.slice(-6)} принят в обработку. 
                    Наш специалист свяжется с вами в течение 2 часов.
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 text-left">
                  <h4 className="font-body font-semibold text-foreground mb-2">
                    Что дальше?
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Анализ ваших требований</li>
                    <li>• Подготовка персонального предложения</li>
                    <li>• Звонок менеджера для уточнения деталей</li>
                    <li>• Отправка коммерческого предложения</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="default"
                    onClick={() => navigate('/product-detail')}
                    fullWidth
                  >
                    К каталогу
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSuccessModal(false)}
                    fullWidth
                  >
                    Закрыть
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuoteRequest;
