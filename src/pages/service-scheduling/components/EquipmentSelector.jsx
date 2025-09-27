import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EquipmentSelector = ({ selectedEquipment, onEquipmentSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Mock equipment data
  const mockEquipment = [
    {
      id: 'VIN001',
      vin: 'MAID2024001',
      model: 'Maidon FLT-3000',
      type: 'Электропогрузчик',
      capacity: '3000 кг',
      year: 2023,
      location: 'Склад А, Зона 1',
      status: 'Активен',
      lastService: '2024-08-15',
      nextService: '2024-12-15',
      hours: 1247,
      image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=400',
      serviceHistory: [
        { date: '2024-08-15', type: 'Плановое ТО', status: 'Завершено' },
        { date: '2024-05-20', type: 'Ремонт гидравлики', status: 'Завершено' },
        { date: '2024-02-10', type: 'Замена масла', status: 'Завершено' }
      ],
      recommendations: [
        'Замена тормозных колодок',
        'Проверка гидравлической системы',
        'Диагностика электроники'
      ]
    },
    {
      id: 'VIN002',
      vin: 'MAID2024002',
      model: 'Maidon FLT-5000',
      type: 'Дизельный погрузчик',
      capacity: '5000 кг',
      year: 2022,
      location: 'Склад Б, Зона 3',
      status: 'Требует обслуживания',
      lastService: '2024-06-10',
      nextService: '2024-10-10',
      hours: 2156,
      image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=400',
      serviceHistory: [
        { date: '2024-06-10', type: 'Плановое ТО', status: 'Завершено' },
        { date: '2024-03-15', type: 'Замена фильтров', status: 'Завершено' }
      ],
      recommendations: [
        'Замена моторного масла',
        'Проверка топливной системы',
        'Калибровка весов'
      ]
    },
    {
      id: 'VIN003',
      vin: 'MAID2023001',
      model: 'Maidon FLT-2500',
      type: 'Электропогрузчик',
      capacity: '2500 кг',
      year: 2023,
      location: 'Склад А, Зона 2',
      status: 'Активен',
      lastService: '2024-09-01',
      nextService: '2025-01-01',
      hours: 892,
      image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=400',
      serviceHistory: [
        { date: '2024-09-01', type: 'Плановое ТО', status: 'Завершено' },
        { date: '2024-06-15', type: 'Замена батареи', status: 'Завершено' }
      ],
      recommendations: [
        'Проверка зарядного устройства',
        'Диагностика мачты',
        'Калибровка датчиков'
      ]
    }
  ];
  
  const handleSearch = (value) => {
    setSearchTerm(value);
    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      if (value?.trim()) {
        const results = mockEquipment?.filter(equipment =>
          equipment?.vin?.toLowerCase()?.includes(value?.toLowerCase()) ||
          equipment?.model?.toLowerCase()?.includes(value?.toLowerCase()) ||
          equipment?.type?.toLowerCase()?.includes(value?.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 500);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Активен':
        return 'bg-success/10 text-success';
      case 'Требует обслуживания':
        return 'bg-warning/10 text-warning';
      case 'В ремонте':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Выбор оборудования
        </h3>
        {selectedEquipment && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEquipmentSelect(null)}
          >
            <Icon name="X" size={16} className="mr-2" />
            Очистить
          </Button>
        )}
      </div>
      <div className="space-y-4">
        <Input
          type="search"
          placeholder="Поиск по VIN, модели или типу оборудования..."
          value={searchTerm}
          onChange={(e) => handleSearch(e?.target?.value)}
          className="w-full"
        />
        
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="ml-2 text-sm font-caption text-muted-foreground">Поиск...</span>
          </div>
        )}
        
        {!selectedEquipment && searchResults?.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {searchResults?.map((equipment) => (
              <button
                key={equipment?.id}
                onClick={() => onEquipmentSelect(equipment)}
                className="w-full p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={equipment?.image}
                      alt={equipment?.model}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-body font-semibold text-foreground">
                          {equipment?.model}
                        </h4>
                        <p className="text-xs font-caption text-muted-foreground">
                          VIN: {equipment?.vin}
                        </p>
                      </div>
                      <span className={`text-xs font-caption px-2 py-1 rounded-full ${getStatusColor(equipment?.status)}`}>
                        {equipment?.status}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-caption text-muted-foreground">
                      <div>Тип: {equipment?.type}</div>
                      <div>Грузоподъемность: {equipment?.capacity}</div>
                      <div>Местоположение: {equipment?.location}</div>
                      <div>Моточасы: {equipment?.hours?.toLocaleString('uz-UZ')}</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {selectedEquipment && (
          <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={selectedEquipment?.image}
                  alt={selectedEquipment?.model}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-base font-body font-semibold text-foreground">
                      {selectedEquipment?.model}
                    </h4>
                    <p className="text-sm font-caption text-muted-foreground">
                      VIN: {selectedEquipment?.vin}
                    </p>
                  </div>
                  <span className={`text-xs font-caption px-2 py-1 rounded-full ${getStatusColor(selectedEquipment?.status)}`}>
                    {selectedEquipment?.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm font-caption">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Тип:</div>
                    <div className="text-foreground">{selectedEquipment?.type}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Грузоподъемность:</div>
                    <div className="text-foreground">{selectedEquipment?.capacity}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Местоположение:</div>
                    <div className="text-foreground">{selectedEquipment?.location}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Моточасы:</div>
                    <div className="text-foreground">{selectedEquipment?.hours?.toLocaleString('uz-UZ')}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Последнее ТО:</div>
                    <div className="text-foreground">{new Date(selectedEquipment.lastService)?.toLocaleDateString('ru-RU')}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Следующее ТО:</div>
                    <div className="text-foreground">{new Date(selectedEquipment.nextService)?.toLocaleDateString('ru-RU')}</div>
                  </div>
                </div>
                
                {selectedEquipment?.recommendations?.length > 0 && (
                  <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="AlertTriangle" size={16} className="text-warning" />
                      <span className="text-sm font-body font-medium text-warning">
                        Рекомендации по обслуживанию
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {selectedEquipment?.recommendations?.map((recommendation, index) => (
                        <li key={index} className="text-xs font-caption text-muted-foreground flex items-center space-x-2">
                          <Icon name="ChevronRight" size={12} />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {searchTerm && !isSearching && searchResults?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Search" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm font-caption">Оборудование не найдено</p>
            <p className="text-xs font-caption mt-1">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentSelector;