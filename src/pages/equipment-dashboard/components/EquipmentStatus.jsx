import { PieChart } from 'lucide-react';
import React from 'react';

const EquipmentStatus = ({ equipment }) => {
  const statusData = equipment?.reduce((acc, item) => {
    acc[item.status] = (acc?.[item?.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const total = equipment?.length || 0;

  const chartData = [
    { label: 'Работает', value: statusData?.active || 0, color: '#10b981', percentage: total > 0 ? ((statusData?.active || 0) / total * 100)?.toFixed(1) : 0 },
    { label: 'Простой', value: statusData?.idle || 0, color: '#f59e0b', percentage: total > 0 ? ((statusData?.idle || 0) / total * 100)?.toFixed(1) : 0 },
    { label: 'ТО', value: statusData?.maintenance || 0, color: '#3b82f6', percentage: total > 0 ? ((statusData?.maintenance || 0) / total * 100)?.toFixed(1) : 0 },
    { label: 'Внимание', value: statusData?.warning || 0, color: '#ef4444', percentage: total > 0 ? ((statusData?.warning || 0) / total * 100)?.toFixed(1) : 0 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Статус техники</h2>
        <PieChart className="w-5 h-5 text-gray-400" />
      </div>
      {/* Simple Chart Representation */}
      <div className="mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          {/* This would be replaced with an actual chart library like recharts */}
          <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  ${chartData?.[0]?.color} 0deg ${chartData?.[0]?.percentage * 3.6}deg,
                  ${chartData?.[1]?.color} ${chartData?.[0]?.percentage * 3.6}deg ${(chartData?.[0]?.percentage + chartData?.[1]?.percentage) * 3.6}deg,
                  ${chartData?.[2]?.color} ${(chartData?.[0]?.percentage + chartData?.[1]?.percentage) * 3.6}deg ${(chartData?.[0]?.percentage + chartData?.[1]?.percentage + chartData?.[2]?.percentage) * 3.6}deg,
                  ${chartData?.[3]?.color} ${(chartData?.[0]?.percentage + chartData?.[1]?.percentage + chartData?.[2]?.percentage) * 3.6}deg 360deg
                )`
              }}
            />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{total}</div>
                <div className="text-xs text-gray-500">Всего</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {chartData?.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item?.color }}
              />
              <span className="text-sm text-gray-600">{item?.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{item?.value}</span>
              <span className="text-xs text-gray-500">({item?.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
      {/* Operational Efficiency */}
      <div className="mt-6 pt-4 border-t">
        <div className="text-sm text-gray-600 mb-2">Операционная эффективность</div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Активно работает</span>
          <span className="font-medium text-green-600">
            {chartData?.[0]?.percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default EquipmentStatus;