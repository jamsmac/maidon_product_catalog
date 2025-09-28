import React from 'react';
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  Wrench, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const FleetOverview = ({ equipment }) => {
  const stats = equipment?.reduce((acc, item) => {
    acc.total++;
    acc[item.status] = (acc?.[item?.status] || 0) + 1;
    acc.totalUtilization += item?.utilizationRate || 0;
    acc.totalProductivity += item?.productivity || 0;
    return acc;
  }, {
    total: 0,
    active: 0,
    idle: 0,
    maintenance: 0,
    warning: 0,
    totalUtilization: 0,
    totalProductivity: 0
  }) || {
    total: 0,
    active: 0,
    idle: 0,
    maintenance: 0,
    warning: 0,
    totalUtilization: 0,
    totalProductivity: 0
  };

  const avgUtilization = stats?.total > 0 ? (stats?.totalUtilization / stats?.total)?.toFixed(1) : 0;
  const avgProductivity = stats?.total > 0 ? (stats?.totalProductivity / stats?.total)?.toFixed(0) : 0;

  const statusCards = [
    {
      label: 'Работает',
      value: stats?.active,
      color: 'text-green-600 bg-green-100',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      label: 'Простой',
      value: stats?.idle,
      color: 'text-yellow-600 bg-yellow-100',
      icon: <Clock className="w-5 h-5" />
    },
    {
      label: 'ТО',
      value: stats?.maintenance,
      color: 'text-blue-600 bg-blue-100',
      icon: <Wrench className="w-5 h-5" />
    },
    {
      label: 'Внимание',
      value: stats?.warning,
      color: 'text-red-600 bg-red-100',
      icon: <AlertTriangle className="w-5 h-5" />
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Обзор парка</h2>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-2">{stats?.total}</div>
        <div className="text-sm text-gray-500">Единиц техники</div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {statusCards?.map((card, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${card?.color}`}>
              {card?.icon}
            </div>
            <div className="font-semibold text-gray-900">{card?.value}</div>
            <div className="text-xs text-gray-500">{card?.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Средняя загрузка</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{avgUtilization}%</span>
            {avgUtilization > 80 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Средняя продуктивность</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{avgProductivity}</span>
            {avgProductivity > 100 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(avgUtilization, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;