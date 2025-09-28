import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VinSearchForm from './components/VinSearchForm';
import PartsSearchFilters from './components/PartsSearchFilters';
import PartsGrid from './components/PartsGrid';
import InteractivePartsDiagram from './components/InteractivePartsDiagram';
import MaintenanceKits from './components/MaintenanceKits';
import BulkOrderForm from './components/BulkOrderForm';

const PartsCatalog = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const [showBulkOrder, setShowBulkOrder] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Mock parts data
  const mockParts = [
    {
      id: 'part-001',
      name: 'Фильтр масляный двигателя',
      partNumber: 'FL-OIL-001',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      price: 2500,
      oldPrice: 3000,
      discount: 17,
      availability: 'in-stock',
      quality: 'oem',
      compatibility: ['FL-3000', 'FL-5000', 'RT-2500'],
      category: 'filters',
      description: 'Оригинальный масляный фильтр для двигателей серии FL'
    },
    {
      id: 'part-002',
      name: 'Гидроцилиндр подъема мачты',
      partNumber: 'HY-CYL-002',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      price: 85000,
      availability: 'order',
      quality: 'oem',
      compatibility: ['FL-3000', 'FL-5000'],
      category: 'hydraulics',
      description: 'Гидроцилиндр основного подъема для погрузчиков'
    },
    {
      id: 'part-003',
      name: 'Комплект тормозных колодок',
      partNumber: 'BR-PAD-003',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      price: 12000,
      oldPrice: 15000,
      discount: 20,
      availability: 'in-stock',
      quality: 'premium',
      compatibility: ['FL-3000', 'FL-5000', 'RT-2500', 'PT-1500'],
      category: 'brakes',
      description: 'Премиальные тормозные колодки с увеличенным ресурсом'
    },
    {
      id: 'part-004',
      name: 'Аккумуляторная батарея 48V',
      partNumber: 'BAT-48V-004',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      price: 180000,
      availability: 'fast-delivery',
      quality: 'oem',
      compatibility: ['EL-3000', 'EL-5000'],
      category: 'electrical',
      description: 'Литий-ионная батарея повышенной емкости'
    },
    {
      id: 'part-005',
      name: 'Шина пневматическая 250-15',
      partNumber: 'TR-250-005',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      price: 18000,
      availability: 'in-stock',
      quality: 'standard',
      compatibility: ['FL-3000', 'FL-5000', 'RT-2500'],
      category: 'tires',
      description: 'Промышленная шина для интенсивной эксплуатации'
    },
    {
      id: 'part-006',
      name: 'Фара светодиодная рабочая',
      partNumber: 'LT-LED-006',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      price: 8500,
      oldPrice: 10000,
      discount: 15,
      availability: 'in-stock',
      quality: 'premium',
      compatibility: ['FL-3000', 'FL-5000', 'RT-2500', 'PT-1500'],
      category: 'electrical',
      description: 'LED фара с увеличенной яркостью и долговечностью'
    }
  ];

  const handleVinSearch = async (searchValue, searchType) => {
    setIsSearching(true);
    setSearchPerformed(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock search results based on VIN/Serial
      const results = mockParts?.filter(part => 
        Math.random() > 0.3 // Randomly show some parts as compatible
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 2000);
  };

  const handleFiltersChange = (filters) => {
    if (!searchPerformed) return;
    
    let filteredResults = [...mockParts];
    
    if (filters?.category) {
      filteredResults = filteredResults?.filter(part => part?.category === filters?.category);
    }
    
    if (filters?.brand) {
      filteredResults = filteredResults?.filter(part => part?.quality === filters?.brand);
    }
    
    if (filters?.availability?.length > 0) {
      filteredResults = filteredResults?.filter(part => 
        filters?.availability?.includes(part?.availability)
      );
    }
    
    if (filters?.priceRange?.min) {
      filteredResults = filteredResults?.filter(part => 
        part?.price >= parseInt(filters?.priceRange?.min)
      );
    }
    
    if (filters?.priceRange?.max) {
      filteredResults = filteredResults?.filter(part => 
        part?.price <= parseInt(filters?.priceRange?.max)
      );
    }
    
    setSearchResults(filteredResults);
  };

  const handleAddToCart = (part) => {
    console.log('Adding to cart:', part);
    // Add to cart logic here
  };

  const handleRequestQuote = (part) => {
    console.log('Requesting quote for:', part);
    // Quote request logic here
  };

  const handleViewDetails = (part) => {
    console.log('Viewing details for:', part);
    // Navigate to part details
  };

  const handlePartSelect = (part) => {
    console.log('Part selected from diagram:', part);
    // Handle part selection from interactive diagram
  };

  const handleKitSelect = (kit) => {
    console.log('Maintenance kit selected:', kit);
    // Handle kit selection
  };

  const handleAddKitToCart = (kit) => {
    console.log('Adding kit to cart:', kit);
    // Add kit to cart logic
  };

  const handleBulkOrderSubmit = (orderData) => {
    console.log('Bulk order submitted:', orderData);
    setShowBulkOrder(false);
    // Handle bulk order submission
  };

  const togglePartSelection = (part) => {
    setSelectedParts(prev => {
      const isSelected = prev?.find(p => p?.id === part?.id);
      if (isSelected) {
        return prev?.filter(p => p?.id !== part?.id);
      } else {
        return [...prev, part];
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Каталог запчастей - Maidon Industrial Equipment</title>
        <meta name="description" content="Найдите оригинальные запчасти для промышленного оборудования по VIN номеру. Интерактивные схемы, комплекты ТО, оптовые заказы." />
        <meta name="keywords" content="запчасти, погрузчик, VIN поиск, техническое обслуживание, оригинальные детали" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                  Каталог запчастей
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Найдите оригинальные запчасти для вашего оборудования по VIN номеру или воспользуйтесь интерактивными схемами
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                <div className="bg-card rounded-lg p-1 border border-border shadow-sm">
                  <button
                    onClick={() => setActiveTab('search')}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'search' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name="Search" size={16} className="inline mr-2" />
                    Поиск запчастей
                  </button>
                  <button
                    onClick={() => setActiveTab('diagram')}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'diagram' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name="Layers" size={16} className="inline mr-2" />
                    Интерактивная схема
                  </button>
                  <button
                    onClick={() => setActiveTab('kits')}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'kits' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name="Package" size={16} className="inline mr-2" />
                    Комплекты ТО
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-6">
              {activeTab === 'search' && (
                <div className="space-y-8">
                  {/* Search Form */}
                  <div className="max-w-2xl mx-auto">
                    <VinSearchForm 
                      onSearch={handleVinSearch}
                      isLoading={isSearching}
                    />
                  </div>

                  {/* Search Results */}
                  {searchPerformed && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                      {/* Filters */}
                      <div className="lg:col-span-1">
                        <PartsSearchFilters 
                          onFiltersChange={handleFiltersChange}
                          resultsCount={searchResults?.length}
                        />
                      </div>

                      {/* Results */}
                      <div className="lg:col-span-3">
                        {/* Bulk Actions */}
                        {selectedParts?.length > 0 && (
                          <div className="bg-card rounded-lg border border-border p-4 mb-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Icon name="CheckSquare" size={20} className="text-primary" />
                                <span className="font-medium text-foreground">
                                  Выбrano {selectedParts?.length} позиций
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedParts([])}
                                  iconName="X"
                                  iconPosition="left"
                                >
                                  Очистить
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => setShowBulkOrder(true)}
                                  iconName="ShoppingCart"
                                  iconPosition="left"
                                >
                                  Оптовый заказ
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        <PartsGrid 
                          parts={searchResults}
                          onAddToCart={handleAddToCart}
                          onRequestQuote={handleRequestQuote}
                          onViewDetails={handleViewDetails}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'diagram' && (
                <div className="max-w-5xl mx-auto">
                  <InteractivePartsDiagram 
                    selectedEquipment="Погрузчик FL-3000"
                    onPartSelect={handlePartSelect}
                  />
                </div>
              )}

              {activeTab === 'kits' && (
                <MaintenanceKits 
                  onKitSelect={handleKitSelect}
                  onAddToCart={handleAddKitToCart}
                />
              )}
            </div>
          </section>

          {/* Support Section */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                    <Icon name="Headphones" size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    Техническая поддержка
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Помощь в подборе запчастей и консультации по совместимости
                  </p>
                  <Button variant="outline" size="sm">
                    +7 (495) 123-45-67
                  </Button>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4">
                    <Icon name="Truck" size={32} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    Быстрая доставка
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Доставка по Узбекистану в течение 1-3 дней, срочная доставка за 24 часа
                  </p>
                  <Button variant="outline" size="sm">
                    Рассчитать стоимость
                  </Button>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
                    <Icon name="Shield" size={32} className="text-success" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    Гарантия качества
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Только оригинальные запчасти с официальной гарантией производителя
                  </p>
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Bulk Order Modal */}
        {showBulkOrder && (
          <BulkOrderForm
            selectedParts={selectedParts}
            onSubmit={handleBulkOrderSubmit}
            onClose={() => setShowBulkOrder(false)}
          />
        )}
      </div>
    </>
  );
};

export default PartsCatalog;