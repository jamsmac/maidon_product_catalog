import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Calculator } from 'lucide-react';

const FinancialTracking = ({ equipment, timeRange }) => {
  const [activeView, setActiveView] = useState('overview');

  const calculateFinancials = () => {
    if (!equipment?.length) return {
      totalDailyCost: 0,
      totalDepreciation: 0,
      totalMaintenance: 0,
      totalFuel: 0,
      avgCostPerUnit: 0,
      costTrend: 0,
      utilizationCost: 0
    };

    const totals = equipment?.reduce((acc, item) => {
      const financials = item?.financials || {};
      acc.dailyCost += financials?.dailyCost || 0;
      acc.depreciation += financials?.depreciation || 0;
      acc.maintenance += financials?.maintenance || 0;
      acc.fuel += financials?.fuel || 0;
      return acc;
    }, {
      dailyCost: 0,
      depreciation: 0,
      maintenance: 0,
      fuel: 0
    });

    const avgCostPerUnit = (totals?.dailyCost / equipment?.length)?.toFixed(0);
    const costTrend = -2.3; // Mock trend data
    const utilizationCost = totals?.dailyCost / equipment?.length / 100; // Cost per utilization point

    return {
      totalDailyCost: totals?.dailyCost,
      totalDepreciation: totals?.depreciation,
      totalMaintenance: totals?.maintenance,
      totalFuel: totals?.fuel,
      avgCostPerUnit,
      costTrend,
      utilizationCost: utilizationCost?.toFixed(0)
    };
  };

  const financials = calculateFinancials();

  const costBreakdown = [
    {
      category: 'Амортизация',
      amount: financials?.totalDepreciation,
      percentage: financials?.totalDailyCost > 0 ? (financials?.totalDepreciation / financials?.totalDailyCost * 100)?.toFixed(1) : 0,
      color: '#3b82f6',
      icon: <Calculator className="w-4 h-4" />
    },
    {
      category: 'Топливо',
      amount: financials?.totalFuel,
      percentage: financials?.totalDailyCost > 0 ? (financials?.totalFuel / financials?.totalDailyCost * 100)?.toFixed(1) : 0,
      color: '#f59e0b',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      category: 'Обслуживание',
      amount: financials?.totalMaintenance,
      percentage: financials?.totalDailyCost > 0 ? (financials?.totalMaintenance / financials?.totalDailyCost * 100)?.toFixed(1) : 0,
      color: '#10b981',
      icon: <TrendingDown className="w-4 h-4" />
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const viewOptions = [
    { key: 'overview', label: 'Обзор' },
    { key: 'breakdown', label: 'Детализация' },
    { key: 'trends', label: 'Тренды' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Финансовое отслеживание</h2>
        <DollarSign className="w-5 h-5 text-gray-400" />
      </div>
      {/* View Selector */}
      <div className="flex gap-2 mb-6">
        {viewOptions?.map((option) => (
          <button
            key={option?.key}
            onClick={() => setActiveView(option?.key)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeView === option?.key
                ? 'bg-blue-100 text-blue-700' :'text-gray-600 hover:text-gray-900'
            }`}
          >
            {option?.label}
          </button>
        ))}
      </div>
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Total Daily Cost */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Общие ежедневные расходы</span>
              <div className="flex items-center gap-1">
                {financials?.costTrend < 0 ? (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  financials?.costTrend < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {financials?.costTrend}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(financials?.totalDailyCost)}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">
                {formatCurrency(financials?.avgCostPerUnit)}
              </div>
              <div className="text-xs text-gray-500">Средняя стоимость единицы</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">
                {formatCurrency(financials?.utilizationCost)}
              </div>
              <div className="text-xs text-gray-500">Стоимость за % загрузки</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">
                {formatCurrency(financials?.totalDailyCost * 30)}
              </div>
              <div className="text-xs text-gray-500">Прогноз на месяц</div>
            </div>
          </div>
        </div>
      )}
      {activeView === 'breakdown' && (
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Структура расходов</h3>
            <div className="space-y-4">
              {costBreakdown?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item?.color }}
                    />
                    <div className="flex items-center gap-2">
                      {item?.icon}
                      <span className="text-sm text-gray-600">{item?.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(item?.amount)}
                    </div>
                    <div className="text-xs text-gray-500">{item?.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost per Equipment */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Расходы по технике</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {equipment?.slice(0, 5)?.map((item) => (
                <div key={item?.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-900 truncate">
                    {item?.name?.split(' ')?.slice(0, 2)?.join(' ')}
                  </div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(item?.financials?.dailyCost || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeView === 'trends' && (
        <div className="space-y-6">
          {/* Trends Chart Placeholder */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Динамика расходов</h3>
            <div className="h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500">График трендов расходов</div>
                <div className="text-xs text-gray-400">За последние {timeRange} дней</div>
              </div>
            </div>
          </div>

          {/* Cost Optimization Suggestions */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Рекомендации по оптимизации</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Экономия топлива</span>
                </div>
                <div className="text-sm text-green-700">
                  Оптимизация маршрутов может сэкономить до 15% расходов на топливо
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Плановое ТО</span>
                </div>
                <div className="text-sm text-blue-700">
                  Своевременное обслуживание снизит внеплановые ремонты на 25%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ROI and Efficiency */}
      <div className="mt-6 pt-4 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">ROI текущего периода</div>
            <div className="text-lg font-semibold text-gray-900">18.5%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Эффективность затрат</div>
            <div className="text-lg font-semibold text-gray-900">92%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialTracking;