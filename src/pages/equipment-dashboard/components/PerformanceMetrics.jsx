import { BarChart3, TrendingUp, TrendingDown, Activity, Gauge } from 'lucide-react';
import React, { useState } from 'react';

const PerformanceMetrics = ({ equipment, timeRange }) => {
  const [activeMetric, setActiveMetric] = useState('utilization');

  const calculateMetrics = () => {
    if (!equipment?.length) return {
      avgUtilization: 0,
      avgProductivity: 0,
      totalWorkingHours: 0,
      efficiencyTrend: 0,
      topPerformers: [],
      bottomPerformers: []
    };

    const totalUtilization = equipment?.reduce((sum, item) => sum + (item?.utilizationRate || 0), 0);
    const totalProductivity = equipment?.reduce((sum, item) => sum + (item?.productivity || 0), 0);
    const totalWorkingHours = equipment?.reduce((sum, item) => sum + (item?.workingHours || 0), 0);
    
    const avgUtilization = (totalUtilization / equipment?.length)?.toFixed(1);
    const avgProductivity = (totalProductivity / equipment?.length)?.toFixed(0);
    
    // Mock efficiency trend (would be calculated from historical data)
    const efficiencyTrend = 5.2; // +5.2% compared to previous period
    
    // Sort equipment by utilization for top/bottom performers
    const sortedByUtilization = [...equipment]?.sort((a, b) => b?.utilizationRate - a?.utilizationRate);
    const topPerformers = sortedByUtilization?.slice(0, 3);
    const bottomPerformers = sortedByUtilization?.slice(-3)?.reverse();

    return {
      avgUtilization,
      avgProductivity,
      totalWorkingHours: totalWorkingHours?.toFixed(1),
      efficiencyTrend,
      topPerformers,
      bottomPerformers
    };
  };

  const metrics = calculateMetrics();

  const metricCards = [
    {
      key: 'utilization',
      label: 'Средняя загрузка',
      value: `${metrics?.avgUtilization}%`,
      trend: metrics?.efficiencyTrend,
      icon: <Gauge className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      key: 'productivity',
      label: 'Продуктивность',
      value: metrics?.avgProductivity,
      trend: 3.8,
      icon: <Activity className="w-5 h-5" />,
      color: 'text-green-600 bg-green-100'
    },
    {
      key: 'hours',
      label: 'Общие часы работы',
      value: `${metrics?.totalWorkingHours}ч`,
      trend: -1.2,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const getPerformanceColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Метрики производительности</h2>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {metricCards?.map((card) => (
          <div
            key={card?.key}
            onClick={() => setActiveMetric(card?.key)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              activeMetric === card?.key 
                ? 'border-blue-300 bg-blue-50' :'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${card?.color}`}>
              {card?.icon}
            </div>
            <div className="font-semibold text-gray-900 text-lg">{card?.value}</div>
            <div className="text-sm text-gray-600 mb-2">{card?.label}</div>
            <div className="flex items-center gap-1">
              {card?.trend > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs font-medium ${
                card?.trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {card?.trend > 0 ? '+' : ''}{card?.trend}%
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Performance Chart Placeholder */}
      <div className="mb-6">
        <div className="h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-500">График производительности</div>
            <div className="text-xs text-gray-400">За последние {timeRange} дней</div>
          </div>
        </div>
      </div>
      {/* Top and Bottom Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Лучшие показатели
          </h3>
          <div className="space-y-2">
            {metrics?.topPerformers?.map((equipment, index) => (
              <div key={equipment?.id} className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-700">
                    {index + 1}
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {equipment?.name?.split(' ')?.slice(0, 2)?.join(' ')}
                  </div>
                </div>
                <div className={`text-sm font-medium ${getPerformanceColor(equipment?.utilizationRate)}`}>
                  {equipment?.utilizationRate}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Performers */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            Требуют внимания
          </h3>
          <div className="space-y-2">
            {metrics?.bottomPerformers?.map((equipment, index) => (
              <div key={equipment?.id} className="flex items-center justify-between p-2 rounded-lg bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-medium text-red-700">
                    {index + 1}
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {equipment?.name?.split(' ')?.slice(0, 2)?.join(' ')}
                  </div>
                </div>
                <div className={`text-sm font-medium ${getPerformanceColor(equipment?.utilizationRate)}`}>
                  {equipment?.utilizationRate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Performance Summary */}
      <div className="mt-6 pt-4 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
        <div className="text-sm text-gray-600 mb-2">Общая эффективность парка</div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Текущий период</span>
              <span className="text-sm font-medium text-gray-900">{metrics?.avgUtilization}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(metrics?.avgUtilization, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">+{metrics?.efficiencyTrend}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;