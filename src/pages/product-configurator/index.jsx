import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';

import ActionPanel from './components/ActionPanel';
import ConfigurationPanel from './components/ConfigurationPanel';
import ConfigurationSummary from './components/ConfigurationSummary';
import ProductPreview from './components/ProductPreview';

const ProductConfigurator = () => {
  const [configuration, setConfiguration] = useState({
    mast: 'standard',
    forks: 'standard_1200',
    wheels: 'pneumatic',
    battery: 'lead_acid',
    attachments: 'none',
    cabin: 'open'
  });

  const [pricing, setPricing] = useState({
    basePrice: 1250000,
    totalPrice: 1250000
  });

  const [activeView, setActiveView] = useState('configurator');
  const [isMobile, setIsMobile] = useState(false);

  // Mock product data
  const productData = {
    id: 'forklift-ep-2000',
    name: 'Электропогрузчик EP-2000',
    model: 'EP-2000-STD',
    brand: 'Maidon Industrial',
    category: 'Электропогрузчики',
    description: `Надежный электропогрузчик грузоподъемностью 2 тонны для работы в складских помещениях.\nОснащен современной системой управления и эргономичной кабиной оператора.\nИдеально подходит для интенсивной работы в логистических центрах.`,
    specifications: {
      loadCapacity: '2000 кг',
      liftHeight: '3500 мм',
      batteryType: '48В',
      operatingTime: '8 часов',
      chargingTime: '8 часов',
      weight: '3200 кг'
    }
  };

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate pricing based on configuration
  useEffect(() => {
    const optionPrices = {
      mast: {
        standard: 0,
        extended: 85000,
        triple: 165000
      },
      forks: {
        standard_1200: 0,
        extended_1500: 25000,
        heavy_duty: 45000
      },
      wheels: {
        pneumatic: 0,
        solid: 35000,
        super_elastic: 55000
      },
      battery: {
        lead_acid: 0,
        lithium_standard: 180000,
        lithium_extended: 250000
      },
      attachments: {
        none: 0,
        side_shift: 95000,
        rotator: 125000,
        clamp: 155000
      },
      cabin: {
        open: 0,
        enclosed: 145000,
        premium: 195000
      }
    };

    let totalOptionsPrice = 0;
    Object.keys(configuration)?.forEach(section => {
      const optionPrice = optionPrices?.[section]?.[configuration?.[section]] || 0;
      totalOptionsPrice += optionPrice;
    });

    setPricing({
      basePrice: 1250000,
      totalPrice: 1250000 + totalOptionsPrice
    });
  }, [configuration]);

  const handleConfigurationChange = (sectionId, optionId) => {
    setConfiguration(prev => ({
      ...prev,
      [sectionId]: optionId
    }));
  };

  const handleSaveConfiguration = async (config) => {
    // Mock save functionality
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Configuration saved:', config);
        resolve();
      }, 1000);
    });
  };

  const handleAddToComparison = async (config) => {
    // Mock add to comparison functionality
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Added to comparison:', config);
        resolve();
      }, 1000);
    });
  };

  const mobileViews = [
    { id: 'configurator', name: 'Конфигурация', icon: 'Settings' },
    { id: 'preview', name: 'Предварительный просмотр', icon: 'Eye' },
    { id: 'summary', name: 'Сводка', icon: 'FileText' },
    { id: 'actions', name: 'Действия', icon: 'Zap' }
  ];

  return (
    <>
      <Helmet>
        <title>Конфигуратор продукта - {productData?.name} | Maidon Industrial</title>
        <meta 
          name="description" 
          content={`Настройте ${productData?.name} под ваши требования. Выберите мачту, вилы, колеса, батарею и другие опции с расчетом стоимости в реальном времени.`}
        />
        <meta name="keywords" content="конфигуратор погрузчика, настройка оборудования, промышленное оборудование, электропогрузчик" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Page Header */}
          <div className="bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon name="Settings" size={24} className="text-primary" />
                    <h1 className="text-2xl font-heading font-bold text-foreground">
                      Конфигуратор продукта
                    </h1>
                  </div>
                  <p className="text-muted-foreground">
                    {productData?.name} - настройте оборудование под ваши требования
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Текущая стоимость
                  </p>
                  <p className="text-xl font-heading font-bold text-primary">
                    {new Intl.NumberFormat('uz-UZ', {
                      style: 'currency',
                      currency: 'UZS',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })?.format(pricing?.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View Selector */}
          {isMobile && (
            <div className="bg-card border-b border-border px-4 py-3">
              <div className="flex space-x-2 overflow-x-auto">
                {mobileViews?.map((view) => (
                  <Button
                    key={view?.id}
                    variant={activeView === view?.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveView(view?.id)}
                    iconName={view?.icon}
                    iconPosition="left"
                    iconSize={16}
                    className="whitespace-nowrap"
                  >
                    {view?.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isMobile ? (
              // Mobile Layout - Tabbed Interface
              (<div className="space-y-6">
                {activeView === 'configurator' && (
                  <ConfigurationPanel
                    configuration={configuration}
                    onConfigurationChange={handleConfigurationChange}
                    basePrice={pricing?.basePrice}
                    totalPrice={pricing?.totalPrice}
                  />
                )}
                {activeView === 'preview' && (
                  <ProductPreview
                    configuration={configuration}
                    productData={productData}
                  />
                )}
                {activeView === 'summary' && (
                  <ConfigurationSummary
                    configuration={configuration}
                    pricing={pricing}
                  />
                )}
                {activeView === 'actions' && (
                  <ActionPanel
                    configuration={configuration}
                    totalPrice={pricing?.totalPrice}
                    onSaveConfiguration={handleSaveConfiguration}
                    onAddToComparison={handleAddToComparison}
                    productData={productData}
                  />
                )}
              </div>)
            ) : (
              // Desktop Layout - Split View
              (<div className="grid grid-cols-12 gap-8">
                {/* Left Column - Configuration */}
                <div className="col-span-4 space-y-6">
                  <ConfigurationPanel
                    configuration={configuration}
                    onConfigurationChange={handleConfigurationChange}
                    basePrice={pricing?.basePrice}
                    totalPrice={pricing?.totalPrice}
                  />
                  
                  <ConfigurationSummary
                    configuration={configuration}
                    pricing={pricing}
                  />
                </div>
                {/* Middle Column - Preview */}
                <div className="col-span-5">
                  <ProductPreview
                    configuration={configuration}
                    productData={productData}
                  />
                </div>
                {/* Right Column - Actions */}
                <div className="col-span-3">
                  <ActionPanel
                    configuration={configuration}
                    totalPrice={pricing?.totalPrice}
                    onSaveConfiguration={handleSaveConfiguration}
                    onAddToComparison={handleAddToComparison}
                    productData={productData}
                  />
                </div>
              </div>)
            )}
          </div>

          {/* Compatibility Warnings */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    Важная информация о совместимости
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Некоторые комбинации опций могут требовать дополнительного времени изготовления. 
                    Наши специалисты свяжутся с вами для уточнения деталей после отправки запроса.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductConfigurator;
