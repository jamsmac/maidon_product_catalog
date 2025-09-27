import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ServiceCalendar from './components/ServiceCalendar';
import EquipmentSelector from './components/EquipmentSelector';
import ServicePackages from './components/ServicePackages';
import ServiceDetails from './components/ServiceDetails';
import BookingConfirmation from './components/BookingConfirmation';

const ServiceScheduling = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [serviceDetails, setServiceDetails] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Mock available slots data
  const availableSlots = [
    // Today + 1
    {
      id: 'slot1',
      date: new Date(Date.now() + 86400000)?.toISOString()?.split('T')?.[0],
      time: '09:00 - 13:00',
      technician: 'Иванов А.С.',
      type: 'workshop'
    },
    {
      id: 'slot2',
      date: new Date(Date.now() + 86400000)?.toISOString()?.split('T')?.[0],
      time: '14:00 - 18:00',
      technician: 'Петров В.М.',
      type: 'mobile'
    },
    // Today + 2
    {
      id: 'slot3',
      date: new Date(Date.now() + 172800000)?.toISOString()?.split('T')?.[0],
      time: '08:00 - 12:00',
      technician: 'Сидоров К.П.',
      type: 'workshop'
    },
    {
      id: 'slot4',
      date: new Date(Date.now() + 172800000)?.toISOString()?.split('T')?.[0],
      time: '13:00 - 17:00',
      technician: 'Козлов Д.А.',
      type: 'mobile'
    },
    // Today + 3
    {
      id: 'slot5',
      date: new Date(Date.now() + 259200000)?.toISOString()?.split('T')?.[0],
      time: '10:00 - 14:00',
      technician: 'Морозов Е.И.',
      type: 'workshop'
    },
    // Today + 5
    {
      id: 'slot6',
      date: new Date(Date.now() + 432000000)?.toISOString()?.split('T')?.[0],
      time: '09:00 - 13:00',
      technician: 'Волков С.Н.',
      type: 'mobile'
    },
    {
      id: 'slot7',
      date: new Date(Date.now() + 432000000)?.toISOString()?.split('T')?.[0],
      time: '15:00 - 19:00',
      technician: 'Лебедев М.Р.',
      type: 'workshop'
    }
  ];
  
  const steps = [
    { id: 1, name: 'Оборудование', icon: 'Truck' },
    { id: 2, name: 'Услуги', icon: 'Settings' },
    { id: 3, name: 'Расписание', icon: 'Calendar' },
    { id: 4, name: 'Детали', icon: 'FileText' },
    { id: 5, name: 'Подтверждение', icon: 'Check' }
  ];
  
  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStepClick = (stepId) => {
    // Allow navigation to previous steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };
  
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedEquipment !== null;
      case 2:
        return selectedPackage !== null;
      case 3:
        return selectedDate !== null && selectedSlot !== null;
      case 4:
        return true; // Details are optional
      case 5:
        return selectedEquipment && selectedPackage && selectedDate && selectedSlot;
      default:
        return false;
    }
  };
  
  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConfirming(false);
    setShowSuccessModal(true);
  };
  
  const handleEditBooking = () => {
    setCurrentStep(1);
  };
  
  const resetBooking = () => {
    setSelectedEquipment(null);
    setSelectedPackage(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setServiceDetails({});
    setCurrentStep(1);
    setShowSuccessModal(false);
  };
  
  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Планирование обслуживания
              </h1>
              <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
                Запланируйте техническое обслуживание вашего оборудования с нашими сертифицированными специалистами
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {steps?.map((step, index) => (
                <React.Fragment key={step?.id}>
                  <button
                    onClick={() => handleStepClick(step?.id)}
                    disabled={step?.id > currentStep}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                      ${getStepStatus(step?.id) === 'completed' 
                        ? 'bg-success/10 text-success cursor-pointer hover:bg-success/20' 
                        : getStepStatus(step?.id) === 'current' ?'bg-primary/10 text-primary' :'text-muted-foreground cursor-not-allowed'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${getStepStatus(step?.id) === 'completed' 
                        ? 'bg-success text-white' 
                        : getStepStatus(step?.id) === 'current' ?'bg-primary text-white' :'bg-muted text-muted-foreground'
                      }
                    `}>
                      {getStepStatus(step?.id) === 'completed' ? (
                        <Icon name="Check" size={16} />
                      ) : (
                        <Icon name={step?.icon} size={16} />
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-body font-medium">
                      {step?.name}
                    </span>
                  </button>
                  
                  {index < steps?.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-2
                      ${step?.id < currentStep ? 'bg-success' : 'bg-border'}
                    `} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Step 1: Equipment Selection */}
            {currentStep === 1 && (
              <EquipmentSelector
                selectedEquipment={selectedEquipment}
                onEquipmentSelect={setSelectedEquipment}
              />
            )}
            
            {/* Step 2: Service Packages */}
            {currentStep === 2 && (
              <ServicePackages
                selectedPackage={selectedPackage}
                onPackageSelect={setSelectedPackage}
              />
            )}
            
            {/* Step 3: Calendar & Scheduling */}
            {currentStep === 3 && (
              <ServiceCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                availableSlots={availableSlots}
                onSlotSelect={setSelectedSlot}
                selectedSlot={selectedSlot}
              />
            )}
            
            {/* Step 4: Service Details */}
            {currentStep === 4 && (
              <ServiceDetails
                serviceDetails={serviceDetails}
                onDetailsChange={setServiceDetails}
              />
            )}
            
            {/* Step 5: Booking Confirmation */}
            {currentStep === 5 && (
              <BookingConfirmation
                selectedEquipment={selectedEquipment}
                selectedPackage={selectedPackage}
                selectedSlot={selectedSlot}
                selectedDate={selectedDate}
                serviceDetails={serviceDetails}
                onConfirm={handleConfirmBooking}
                onEdit={handleEditBooking}
                isConfirming={isConfirming}
              />
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                <Icon name="ChevronLeft" size={16} className="mr-2" />
                Назад
              </Button>
              
              <div className="flex items-center space-x-2 text-sm font-caption text-muted-foreground">
                <span>Шаг {currentStep} из {steps?.length}</span>
              </div>
              
              {currentStep < 5 ? (
                <Button
                  variant="default"
                  onClick={handleNextStep}
                  disabled={!canProceedToNext()}
                >
                  Далее
                  <Icon name="ChevronRight" size={16} className="ml-2" />
                </Button>
              ) : (
                (<div className="w-24"></div>) // Spacer to maintain layout
              )}
            </div>
          </div>
        </div>
        
        {/* Emergency Contact */}
        <div className="bg-error/5 border-t border-error/20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={20} className="text-error" />
                <div>
                  <div className="text-sm font-body font-medium text-foreground">
                    Экстренная служба
                  </div>
                  <div className="text-xs font-caption text-muted-foreground">
                    24/7 техподдержка
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Icon name="Phone" size={16} className="mr-2" />
                +7 (800) 555-0199
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Запись подтверждена!
              </h3>
              
              <p className="text-sm font-body text-muted-foreground mb-6">
                Ваша заявка на обслуживание принята. Номер заявки: <strong>SRV-{Date.now()?.toString()?.slice(-6)}</strong>
              </p>
              
              <div className="space-y-3">
                <Button
                  variant="default"
                  onClick={resetBooking}
                  className="w-full"
                >
                  Создать новую запись
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full"
                >
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceScheduling;