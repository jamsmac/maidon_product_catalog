import { AlertTriangle, Calendar, Wrench, Bell, Clock } from 'lucide-react';
import React from 'react';

const MaintenanceAlerts = ({ equipment }) => {
  const getMaintenanceAlerts = () => {
    const alerts = [];
    
    equipment?.forEach(item => {
      // Check for overdue maintenance
      const nextMaintenanceDate = new Date(item.nextMaintenance);
      const today = new Date();
      const daysUntilMaintenance = Math.ceil((nextMaintenanceDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilMaintenance <= 7 && daysUntilMaintenance >= 0) {
        alerts?.push({
          id: `maintenance-${item?.id}`,
          type: 'maintenance-due',
          equipment: item?.name,
          message: `Плановое ТО через ${daysUntilMaintenance} дн.`,
          priority: daysUntilMaintenance <= 3 ? 'high' : 'medium',
          date: item?.nextMaintenance,
          icon: <Calendar className="w-4 h-4" />
        });
      } else if (daysUntilMaintenance < 0) {
        alerts?.push({
          id: `overdue-${item?.id}`,
          type: 'overdue',
          equipment: item?.name,
          message: `Просрочено ТО на ${Math.abs(daysUntilMaintenance)} дн.`,
          priority: 'critical',
          date: item?.nextMaintenance,
          icon: <AlertTriangle className="w-4 h-4" />
        });
      }
      
      // Add existing alerts from equipment
      item?.alerts?.forEach((alert, index) => {
        alerts?.push({
          id: `alert-${item?.id}-${index}`,
          type: 'operational',
          equipment: item?.name,
          message: alert,
          priority: alert?.includes('топлив') ? 'high' : 'medium',
          icon: <Bell className="w-4 h-4" />
        });
      });
    });
    
    return alerts?.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder?.[a?.priority] - priorityOrder?.[b?.priority];
    });
  };

  const alerts = getMaintenanceAlerts();
  const criticalCount = alerts?.filter(alert => alert?.priority === 'critical')?.length;
  const highCount = alerts?.filter(alert => alert?.priority === 'high')?.length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical':
        return 'Критично';
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      default:
        return 'Низкий';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Уведомления и ТО</h2>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
              {criticalCount} критич.
            </span>
          )}
          <Wrench className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-gray-600">Критично: {criticalCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-gray-600">Высокий: {highCount}</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts?.length > 0 ? (
          alerts?.slice(0, 10)?.map((alert) => (
            <div 
              key={alert?.id}
              className={`p-3 rounded-lg border ${getPriorityColor(alert?.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {alert?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium uppercase tracking-wide">
                      {getPriorityLabel(alert?.priority)}
                    </span>
                    {alert?.date && (
                      <span className="text-xs text-gray-500">
                        {new Date(alert.date)?.toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                  <div className="font-medium text-sm truncate">{alert?.equipment}</div>
                  <div className="text-sm mt-1">{alert?.message}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <div className="text-sm text-gray-500">Нет активных уведомлений</div>
            <div className="text-xs text-gray-400 mt-1">Все системы работают нормально</div>
          </div>
        )}
        
        {alerts?.length > 10 && (
          <div className="text-center pt-3 border-t">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Показать еще {alerts?.length - 10} уведомлений
            </button>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      {(criticalCount > 0 || highCount > 0) && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors">
              Запланировать ТО
            </button>
            <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors">
              Уведомить операторов
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceAlerts;