import { MapPin, Navigation, Maximize2, Filter, Eye } from 'lucide-react';
import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const LocationTracking = ({ equipment }) => {
  const [mapView, setMapView] = useState('grid');
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Group equipment by location
  const locationGroups = equipment?.reduce((acc, item) => {
    const location = item?.location || 'Неизвестно';
    if (!acc?.[location]) {
      acc[location] = [];
    }
    acc?.[location]?.push(item);
    return acc;
  }, {}) || {};

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'maintenance':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Работает';
      case 'idle':
        return 'Простой';
      case 'maintenance':
        return 'ТО';
      case 'warning':
        return 'Внимание';
      default:
        return 'Офлайн';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border mb-8">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">Отслеживание местоположения</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={mapView === 'grid' ? 'solid' : 'outline'}
              size="sm"
              onClick={() => setMapView('grid')}
            >
              Сетка
            </Button>
            <Button
              variant={mapView === 'map' ? 'solid' : 'outline'}
              size="sm"
              onClick={() => setMapView('map')}
            >
              Карта
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Фильтр
            </Button>
          </div>
        </div>

        {mapView === 'map' ? (
          /* Map View */
          (<div className="space-y-6">
            {/* Mock Map */}
            <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-600 mb-2">Интерактивная карта</div>
                  <div className="text-sm text-gray-500">Здесь будет отображаться карта с местоположением техники</div>
                </div>
              </div>

              {/* Mock Equipment Markers */}
              <div className="absolute top-4 left-4">
                <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div className="absolute top-12 right-8">
                <div className="bg-yellow-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div className="absolute bottom-8 left-12">
                <div className="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="bg-red-500 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="sm" variant="outline" className="bg-white">
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Map Legend */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Легенда карты</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Работает</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Простой</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Обслуживание</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Требует внимания</span>
                </div>
              </div>
            </div>
          </div>)
        ) : (
          /* Grid View */
          (<div className="space-y-6">
            {Object.entries(locationGroups)?.map(([location, equipmentList]) => (
              <div key={location} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <h3 className="font-medium text-gray-900">{location}</h3>
                    <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                      {equipmentList?.length} ед.
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Показать на карте
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipmentList?.map((item) => (
                    <div
                      key={item?.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedEquipment(selectedEquipment === item?.id ? null : item?.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {item?.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(item?.status)}`}></div>
                            <span className="text-xs text-gray-500">{getStatusLabel(item?.status)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Оператор:</span>
                          <span className="text-gray-900">{item?.operatorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Часы работы:</span>
                          <span className="text-gray-900">{item?.workingHours}ч</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Топливо:</span>
                          <span className={`${item?.fuelLevel < 30 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {item?.fuelLevel}%
                          </span>
                        </div>
                      </div>

                      {selectedEquipment === item?.id && (
                        <div className="mt-4 pt-3 border-t space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Загрузка:</span>
                            <span className="text-gray-900">{item?.utilizationRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Продуктивность:</span>
                            <span className="text-gray-900">{item?.productivity || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Координаты:</span>
                            <span className="text-gray-900">
                              {item?.coordinates ? `${item?.coordinates?.[0]}, ${item?.coordinates?.[1]}` : 'N/A'}
                            </span>
                          </div>
                          {item?.alerts && item?.alerts?.length > 0 && (
                            <div className="pt-2">
                              <div className="text-red-600 font-medium mb-1">Предупреждения:</div>
                              <ul className="text-red-600 space-y-1">
                                {item?.alerts?.map((alert, index) => (
                                  <li key={index}>• {alert}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(locationGroups)?.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет данных о местоположении</h3>
                <p className="text-gray-500">Местоположение техники будет отображено здесь</p>
              </div>
            )}
          </div>)
        )}

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{Object.keys(locationGroups)?.length}</div>
              <div className="text-sm text-gray-500">Активных локаций</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {equipment?.filter(item => item?.status === 'active')?.length || 0}
              </div>
              <div className="text-sm text-gray-500">В работе</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {equipment?.filter(item => item?.status === 'idle')?.length || 0}
              </div>
              <div className="text-sm text-gray-500">В простое</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {equipment?.filter(item => item?.status === 'warning')?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Требует внимания</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTracking;