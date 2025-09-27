import { motion } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  Download, 
  Star, 
  Trophy, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Filter,
  Search,
  ArrowRight,
  BarChart3,
  Zap
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ProductComparison = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Mock products data
  const availableProducts = [
    {
      id: 1,
      name: 'Экскаватор CAT 320D',
      image: '/assets/images/no_image.png',
      price: 8500000,
      category: 'excavator',
      manufacturer: 'Caterpillar',
      year: 2024,
      specs: {
        power: '122 л.с.',
        weight: '20.3 т',
        bucketCapacity: '1.2 м³',
        maxDigDepth: '6.5 м',
        warranty: '3 года',
        fuelConsumption: '18 л/ч',
        availability: 'В наличии'
      }
    },
    {
      id: 2,
      name: 'Экскаватор Komatsu PC210',
      image: '/assets/images/no_image.png',
      price: 7800000,
      category: 'excavator',
      manufacturer: 'Komatsu',
      year: 2024,
      specs: {
        power: '115 л.с.',
        weight: '21.5 т',
        bucketCapacity: '1.0 м³',
        maxDigDepth: '6.8 м',
        warranty: '2 года',
        fuelConsumption: '16 л/ч',
        availability: 'Под заказ'
      }
    },
    {
      id: 3,
      name: 'Погрузчик JCB 540-180',
      image: '/assets/images/no_image.png',
      price: 4200000,
      category: 'loader',
      manufacturer: 'JCB',
      year: 2024,
      specs: {
        power: '145 л.с.',
        weight: '12.8 т',
        bucketCapacity: '2.5 м³',
        maxDigDepth: '4.2 м',
        warranty: '2 года',
        fuelConsumption: '12 л/ч',
        availability: 'В наличии'
      }
    },
    {
      id: 4,
      name: 'Бульдозер CAT D6T',
      image: '/assets/images/no_image.png',
      price: 12500000,
      category: 'bulldozer',
      manufacturer: 'Caterpillar',
      year: 2024,
      specs: {
        power: '215 л.с.',
        weight: '18.9 т',
        bucketCapacity: 'N/A',
        maxDigDepth: 'N/A',
        warranty: '3 года',
        fuelConsumption: '22 л/ч',
        availability: 'В наличии'
      }
    }
  ];

  const specificationCategories = [
    { key: 'power', name: 'Мощность', unit: '' },
    { key: 'weight', name: 'Вес', unit: '' },
    { key: 'bucketCapacity', name: 'Объем ковша', unit: '' },
    { key: 'maxDigDepth', name: 'Макс. глубина копания', unit: '' },
    { key: 'warranty', name: 'Гарантия', unit: '' },
    { key: 'fuelConsumption', name: 'Расход топлива', unit: '' },
    { key: 'availability', name: 'Доступность', unit: '' }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const addProduct = (product) => {
    if (selectedProducts?.length < 4 && !selectedProducts?.find(p => p?.id === product?.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts?.filter(p => p?.id !== productId));
  };

  const filteredProducts = availableProducts?.filter(product => {
    const matchesSearch = product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product?.category === filterCategory;
    return matchesSearch && matchesCategory && !selectedProducts?.find(p => p?.id === product?.id);
  });

  const getBestValue = (spec, products) => {
    if (!products?.length) return null;
    
    const values = products?.map(p => {
      const value = p?.specs?.[spec];
      if (spec === 'price') return p?.price;
      if (spec === 'power') return parseInt(value) || 0;
      if (spec === 'weight') return parseFloat(value) || 0;
      if (spec === 'bucketCapacity') return parseFloat(value) || 0;
      if (spec === 'maxDigDepth') return parseFloat(value) || 0;
      if (spec === 'fuelConsumption') return parseInt(value) || 999;
      return value;
    });

    if (spec === 'fuelConsumption') {
      return Math.min(...values?.filter(v => v > 0));
    }
    
    return Math.max(...values?.filter(v => v > 0));
  };

  const getValueIndicator = (spec, value, products) => {
    if (!products?.length || spec === 'availability' || spec === 'warranty') return null;
    
    const bestValue = getBestValue(spec, products);
    let numericValue;
    
    if (spec === 'price') numericValue = value;
    else if (spec === 'power') numericValue = parseInt(products?.find(p => p?.price === value || p?.specs?.[spec] === value)?.specs?.[spec]) || 0;
    else if (['weight', 'bucketCapacity', 'maxDigDepth']?.includes(spec)) {
      numericValue = parseFloat(products?.find(p => p?.specs?.[spec] === value)?.specs?.[spec]) || 0;
    } else if (spec === 'fuelConsumption') {
      numericValue = parseInt(products?.find(p => p?.specs?.[spec] === value)?.specs?.[spec]) || 0;
    }
    
    if (spec === 'fuelConsumption') {
      if (numericValue === bestValue) return <Trophy className="w-4 h-4 text-green-500" />;
      if (numericValue <= bestValue * 1.1) return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      if (numericValue === bestValue) return <Trophy className="w-4 h-4 text-green-500" />;
      if (numericValue >= bestValue * 0.9) return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const exportToPDF = () => {
    // Mock PDF export functionality
    alert('Функция экспорта в PDF будет реализована');
  };

  const requestQuotes = () => {
    // Navigate to quote request with selected products
    window.location.href = '/quote-request';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Сравнение товаров</h1>
              <p className="text-gray-600 mt-1">Сравните до 4 единиц техники для принятия решения</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={exportToPDF}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Экспорт PDF
              </Button>
              <Button 
                onClick={requestQuotes}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                disabled={selectedProducts?.length === 0}
              >
                <ArrowRight className="w-4 h-4" />
                Запросить коммерческие предложения
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Selection */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Выберите товары для сравнения ({selectedProducts?.length}/4)
            </h2>
            
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Поиск техники..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e?.target?.value)}
                className="lg:w-48"
              >
                <option value="all">Все категории</option>
                <option value="excavator">Экскаваторы</option>
                <option value="loader">Погрузчики</option>
                <option value="bulldozer">Бульдозеры</option>
              </Select>
            </div>

            {/* Available Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts?.map((product) => (
                <motion.div
                  key={product?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-gray-900 mb-1">{product?.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product?.manufacturer}</p>
                  <p className="text-lg font-semibold text-blue-600 mb-3">
                    {product?.price?.toLocaleString('uz-UZ')} UZS
                  </p>
                  <Button
                    onClick={() => addProduct(product)}
                    size="sm"
                    className="w-full"
                    disabled={selectedProducts?.length >= 4}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить к сравнению
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        {selectedProducts?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Сравнение характеристик
                </h2>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={showDifferencesOnly}
                      onChange={(e) => setShowDifferencesOnly(e?.target?.checked)}
                    />
                    <span className="text-sm text-gray-600">Показать только различия</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Фильтры</span>
                  </div>
                </div>
              </div>

              {/* Desktop Comparison Table */}
              {!isMobile ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 w-1/4">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                            <span>Характеристики</span>
                          </div>
                        </th>
                        {selectedProducts?.map((product) => (
                          <th key={product?.id} className="p-4 text-center">
                            <div className="relative">
                              <button
                                onClick={() => removeProduct(product?.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <img
                                src={product?.image}
                                alt={product?.name}
                                className="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
                              />
                              <h3 className="font-medium text-gray-900 text-sm">{product?.name}</h3>
                              <p className="text-xs text-gray-500">{product?.manufacturer}</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Price Row */}
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900">Цена</td>
                        {selectedProducts?.map((product) => (
                          <td key={product?.id} className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-blue-600">
                                {product?.price?.toLocaleString('uz-UZ')} UZS
                              </span>
                              {getValueIndicator('price', product?.price, selectedProducts)}
                            </div>
                          </td>
                        ))}
                      </tr>
                      
                      {/* Specification Rows */}
                      {specificationCategories?.map((category) => (
                        <tr key={category?.key} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{category?.name}</td>
                          {selectedProducts?.map((product) => (
                            <td key={product?.id} className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span>{product?.specs?.[category?.key] || 'N/A'}</span>
                                {getValueIndicator(category?.key, product?.specs?.[category?.key], selectedProducts)}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Mobile Comparison Cards */
                (<div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {currentProductIndex + 1} из {selectedProducts?.length}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentProductIndex(Math.max(0, currentProductIndex - 1))}
                        disabled={currentProductIndex === 0}
                      >
                        ←
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentProductIndex(Math.min(selectedProducts?.length - 1, currentProductIndex + 1))}
                        disabled={currentProductIndex === selectedProducts?.length - 1}
                      >
                        →
                      </Button>
                    </div>
                  </div>
                  {selectedProducts?.[currentProductIndex] && (
                    <motion.div
                      key={currentProductIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50 rounded-lg p-6"
                    >
                      <div className="text-center mb-6">
                        <button
                          onClick={() => removeProduct(selectedProducts?.[currentProductIndex]?.id)}
                          className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <img
                          src={selectedProducts?.[currentProductIndex]?.image}
                          alt={selectedProducts?.[currentProductIndex]?.name}
                          className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                        />
                        <h3 className="font-semibold text-gray-900">
                          {selectedProducts?.[currentProductIndex]?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedProducts?.[currentProductIndex]?.manufacturer}
                        </p>
                        <p className="text-xl font-bold text-blue-600 mt-2">
                          {selectedProducts?.[currentProductIndex]?.price?.toLocaleString('uz-UZ')} UZS
                        </p>
                      </div>

                      <div className="space-y-4">
                        {specificationCategories?.map((category) => (
                          <div key={category?.key} className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="font-medium text-gray-900">{category?.name}</span>
                            <div className="flex items-center gap-2">
                              <span>{selectedProducts?.[currentProductIndex]?.specs?.[category?.key] || 'N/A'}</span>
                              {getValueIndicator(
                                category?.key, 
                                selectedProducts?.[currentProductIndex]?.specs?.[category?.key], 
                                selectedProducts
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>)
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                <Button variant="outline" className="flex-1">
                  <Star className="w-4 h-4 mr-2" />
                  Сохранить сравнение
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Перейти к конфигурации
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Запросить предложения
                </Button>
              </div>

              {/* Legend */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Легенда:</h4>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-green-500" />
                    <span>Лучший показатель</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-500" />
                    <span>Хороший показатель</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Слабый показатель</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedProducts?.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет товаров для сравнения
            </h3>
            <p className="text-gray-500">
              Выберите товары выше для начала сравнения характеристик
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductComparison;