import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Search, Filter, Download, AlertTriangle, CheckCircle, Clock, MapPin, Wrench, Activity, Fuel, Calendar, Users, FileText, BarChart3, PieChart, MoreVertical, Eye, Edit, Bell, Gauge } from 'lucide-react';
import FleetOverview from './components/FleetOverview';
import EquipmentStatus from './components/EquipmentStatus';
import MaintenanceAlerts from './components/MaintenanceAlerts';
import PerformanceMetrics from './components/PerformanceMetrics';
import FinancialTracking from './components/FinancialTracking';
import LocationTracking from './components/LocationTracking';

const EquipmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [dashboardLayout, setDashboardLayout] = useState('grid');
  const [notifications, setNotifications] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Mock data for equipment fleet
  const mockEquipmentData = [
    {
      id: 1,
      name: 'Экскаватор CAT 320D #001',
      type: 'excavator',
      status: 'active',
      location: 'Стройплощадка А',
      coordinates: [55.7558, 37.6173],
      operatorName: 'Иванов И.И.',
      workingHours: 8.5,
      fuelLevel: 85,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-02-15',
      utilizationRate: 92,
      productivity: 156,
      alerts: ['Превышение нормы расхода топлива'],
      financials: {
        dailyCost: 12500,
        depreciation: 2500,
        maintenance: 1200,
        fuel: 3800
      }
    },
    {
      id: 2,
      name: 'Погрузчик JCB 540-180 #002',
      type: 'loader',
      status: 'maintenance',
      location: 'Сервисный центр',
      coordinates: [55.7658, 37.6273],
      operatorName: 'Петров П.П.',
      workingHours: 0,
      fuelLevel: 45,
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-01-25',
      utilizationRate: 0,
      productivity: 0,
      alerts: ['Плановое ТО', 'Замена гидравлической жидкости'],
      financials: {
        dailyCost: 8500,
        depreciation: 1800,
        maintenance: 4200,
        fuel: 0
      }
    },
    {
      id: 3,
      name: 'Бульдозер CAT D6T #003',
      type: 'bulldozer',
      status: 'idle',
      location: 'Стройплощадка Б',
      coordinates: [55.7458, 37.6073],
      operatorName: 'Сидоров С.С.',
      workingHours: 2.5,
      fuelLevel: 65,
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      utilizationRate: 25,
      productivity: 45,
      alerts: [],
      financials: {
        dailyCost: 15000,
        depreciation: 3200,
        maintenance: 800,
        fuel: 1500
      }
    },
    {
      id: 4,
      name: 'Экскаватор Komatsu PC210 #004',
      type: 'excavator',
      status: 'warning',
      location: 'Стройплощадка А',
      coordinates: [55.7568, 37.6183],
      operatorName: 'Козлов К.К.',
      workingHours: 7.2,
      fuelLevel: 25,
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-01-30',
      utilizationRate: 88,
      productivity: 142,
      alerts: ['Низкий уровень топлива', 'Требуется диагностика двигателя'],
      financials: {
        dailyCost: 11800,
        depreciation: 2200,
        maintenance: 1500,
        fuel: 3100
      }
    },
    {
      id: 5,
      name: 'Автокран Liebherr LTM #005',
      type: 'crane',
      status: 'active',
      location: 'Стройплощадка В',
      coordinates: [55.7358, 37.5973],
      operatorName: 'Морозов М.М.',
      workingHours: 6.8,
      fuelLevel: 78,
      lastMaintenance: '2024-01-18',
      nextMaintenance: '2024-02-18',
      utilizationRate: 85,
      productivity: 125,
      alerts: [],
      financials: {
        dailyCost: 18500,
        depreciation: 4200,
        maintenance: 2100,
        fuel: 5200
      }
    },
    {
      id: 6,
      name: 'Самосвал KAMAZ-65115 #006',
      type: 'truck',
      status: 'active',
      location: 'В пути',
      coordinates: [55.7668, 37.6283],
      operatorName: 'Новиков Н.Н.',
      workingHours: 9.2,
      fuelLevel: 55,
      lastMaintenance: '2024-01-12',
      nextMaintenance: '2024-02-12',
      utilizationRate: 95,
      productivity: 180,
      alerts: ['Превышение скорости'],
      financials: {
        dailyCost: 9500,
        depreciation: 1500,
        maintenance: 900,
        fuel: 4100
      }
    }
  ];

  const statusColors = {
    active: 'text-green-600 bg-green-100',
    idle: 'text-yellow-600 bg-yellow-100',
    maintenance: 'text-blue-600 bg-blue-100',
    warning: 'text-red-600 bg-red-100',
    offline: 'text-gray-600 bg-gray-100'
  };

  const statusLabels = {
    active: 'Работает',
    idle: 'Простой',
    maintenance: 'ТО',
    warning: 'Внимание',
    offline: 'Офлайн'
  };

  const typeLabels = {
    excavator: 'Экскаватор',
    loader: 'Погрузчик',
    bulldozer: 'Бульдозер',
    crane: 'Автокран',
    truck: 'Самосвал'
  };

  useEffect(() => {
    setEquipmentData(mockEquipmentData);
    
    // Mock notifications
    setNotifications([
      { id: 1, type: 'maintenance', message: 'Погрузчик JCB 540-180 #002 требует планового ТО', time: '10:30' },
      { id: 2, type: 'fuel', message: 'Экскаватор Komatsu PC210 #004 - низкий уровень топлива', time: '11:15' },
      { id: 3, type: 'speed', message: 'Самосвал KAMAZ-65115 #006 - превышение скорости', time: '12:00' }
    ]);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredEquipment = equipmentData?.filter(equipment => {
    const matchesSearch = equipment?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         equipment?.operatorName?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesType = filterType === 'all' || equipment?.type === filterType;
    const matchesStatus = filterStatus === 'all' || equipment?.status === filterStatus;
    const matchesLocation = selectedLocation === 'all' || equipment?.location === selectedLocation;
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'idle':
        return <Clock className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const generateReport = () => {
    alert('Генерация отчета будет реализована');
  };

  const scheduleMaintenanceAll = () => {
    alert('Массовое планирование ТО будет реализовано');
  };

  const exportData = () => {
    alert('Экспорт данных будет реализован');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Панель управления техникой</h1>
              <p className="text-gray-600 mt-1">Мониторинг и управление парком промышленной техники</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {notifications?.length > 0 && (
                <div className="relative">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Уведомления
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications?.length}
                    </span>
                  </Button>
                </div>
              )}
              
              <Button onClick={generateReport} variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Отчет
              </Button>
              
              <Button onClick={scheduleMaintenanceAll} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4" />
                Планирование ТО
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Поиск по названию техники или оператору..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e?.target?.value)}
                  className="sm:w-40"
                >
                  <option value="all">Все типы</option>
                  <option value="excavator">Экскаваторы</option>
                  <option value="loader">Погрузчики</option>
                  <option value="bulldozer">Бульдозеры</option>
                  <option value="crane">Автокраны</option>
                  <option value="truck">Самосвалы</option>
                </Select>
                
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e?.target?.value)}
                  className="sm:w-40"
                >
                  <option value="all">Все статусы</option>
                  <option value="active">Работает</option>
                  <option value="idle">Простой</option>
                  <option value="maintenance">ТО</option>
                  <option value="warning">Внимание</option>
                </Select>
                
                <Select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e?.target?.value)}
                  className="sm:w-32"
                >
                  <option value="1">Сегодня</option>
                  <option value="7">7 дней</option>
                  <option value="30">30 дней</option>
                  <option value="90">3 месяца</option>
                </Select>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Фильтры
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <FleetOverview equipment={filteredEquipment} />
          <EquipmentStatus equipment={filteredEquipment} />
          <MaintenanceAlerts equipment={filteredEquipment} />
        </div>

        {/* Performance and Financial Tracking */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <PerformanceMetrics equipment={filteredEquipment} timeRange={selectedTimeRange} />
          <FinancialTracking equipment={filteredEquipment} timeRange={selectedTimeRange} />
        </div>

        {/* Location Tracking */}
        <LocationTracking equipment={filteredEquipment} />

        {/* Equipment List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Список техники ({filteredEquipment?.length})
              </h2>
              
              <div className="flex items-center gap-3">
                <Button
                  variant={dashboardLayout === 'grid' ? 'solid' : 'outline'}
                  size="sm"
                  onClick={() => setDashboardLayout('grid')}
                >
                  <PieChart className="w-4 h-4" />
                </Button>
                <Button
                  variant={dashboardLayout === 'list' ? 'solid' : 'outline'}
                  size="sm"
                  onClick={() => setDashboardLayout('list')}
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <Button onClick={exportData} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>

            {/* Desktop Table View */}
            {!isMobile && dashboardLayout === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-4 font-medium text-gray-600">Техника</th>
                      <th className="pb-4 font-medium text-gray-600">Статус</th>
                      <th className="pb-4 font-medium text-gray-600">Локация</th>
                      <th className="pb-4 font-medium text-gray-600">Оператор</th>
                      <th className="pb-4 font-medium text-gray-600">Часы работы</th>
                      <th className="pb-4 font-medium text-gray-600">Топливо</th>
                      <th className="pb-4 font-medium text-gray-600">Загрузка</th>
                      <th className="pb-4 font-medium text-gray-600">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEquipment?.map((equipment) => (
                      <tr key={equipment?.id} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div>
                            <div className="font-medium text-gray-900">{equipment?.name}</div>
                            <div className="text-sm text-gray-500">{typeLabels?.[equipment?.type]}</div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors?.[equipment?.status]}`}>
                            {getStatusIcon(equipment?.status)}
                            {statusLabels?.[equipment?.status]}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{equipment?.location}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{equipment?.operatorName}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{equipment?.workingHours}ч</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Fuel className="w-4 h-4 text-gray-400" />
                            <span className={equipment?.fuelLevel < 30 ? 'text-red-600 font-medium' : 'text-gray-700'}>
                              {equipment?.fuelLevel}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{equipment?.utilizationRate}%</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Card Grid View */
              (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEquipment?.map((equipment) => (
                  <motion.div
                    key={equipment?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{equipment?.name}</h3>
                        <p className="text-sm text-gray-500">{typeLabels?.[equipment?.type]}</p>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors?.[equipment?.status]}`}>
                        {getStatusIcon(equipment?.status)}
                        {statusLabels?.[equipment?.status]}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Локация:</span>
                        </div>
                        <span className="text-gray-900">{equipment?.location}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Оператор:</span>
                        </div>
                        <span className="text-gray-900">{equipment?.operatorName}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Часы работы:</span>
                        </div>
                        <span className="text-gray-900">{equipment?.workingHours}ч</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Топливо:</span>
                        </div>
                        <span className={equipment?.fuelLevel < 30 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                          {equipment?.fuelLevel}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Загрузка:</span>
                        </div>
                        <span className="text-gray-900">{equipment?.utilizationRate}%</span>
                      </div>

                      {equipment?.alerts?.length > 0 && (
                        <div className="pt-3 border-t">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-red-700">Предупреждения:</span>
                          </div>
                          <ul className="text-sm text-red-600 space-y-1">
                            {equipment?.alerts?.map((alert, index) => (
                              <li key={index}>• {alert}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-6 pt-4 border-t">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-2" />
                        Детали
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>)
            )}

            {filteredEquipment?.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Техника не найдена</h3>
                <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDashboard;