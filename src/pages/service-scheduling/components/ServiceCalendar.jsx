import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceCalendar = ({ selectedDate, onDateSelect, availableSlots, onSlotSelect, selectedSlot }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = (firstDay?.getDay() + 6) % 7; // Adjust for Monday start
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date && date?.toDateString() === today?.toDateString();
  };
  
  const isSelected = (date) => {
    return date && selectedDate && date?.toDateString() === selectedDate?.toDateString();
  };
  
  const hasAvailableSlots = (date) => {
    if (!date) return false;
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return availableSlots?.some(slot => slot?.date === dateStr);
  };
  
  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const days = getDaysInMonth(currentMonth);
  
  const timeSlots = selectedDate ? availableSlots?.filter(slot => 
    slot?.date === selectedDate?.toISOString()?.split('T')?.[0]
  ) : [];
  
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Выбор даты и времени
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth(-1)}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <span className="text-sm font-body font-medium text-foreground min-w-[120px] text-center">
            {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth(1)}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
        {/* Calendar */}
        <div className="col-span-2 lg:col-span-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays?.map(day => (
              <div key={day} className="p-2 text-center text-xs font-body font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days?.map((date, index) => (
              <button
                key={index}
                onClick={() => date && !isPastDate(date) && onDateSelect(date)}
                disabled={!date || isPastDate(date) || !hasAvailableSlots(date)}
                className={`
                  p-2 text-sm font-body rounded-md transition-all duration-200
                  ${!date ? 'invisible' : ''}
                  ${isPastDate(date) || !hasAvailableSlots(date) 
                    ? 'text-muted-foreground cursor-not-allowed opacity-50' 
                    : 'hover:bg-muted cursor-pointer'
                  }
                  ${isSelected(date) ? 'bg-primary text-primary-foreground' : ''}
                  ${isToday(date) && !isSelected(date) ? 'bg-accent/10 text-accent font-semibold' : ''}
                  ${hasAvailableSlots(date) && !isSelected(date) && !isToday(date) 
                    ? 'text-foreground' 
                    : ''
                  }
                `}
              >
                {date ? date?.getDate() : ''}
                {hasAvailableSlots(date) && !isSelected(date) && (
                  <div className="w-1 h-1 bg-success rounded-full mx-auto mt-1"></div>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs font-caption text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Доступно</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Сегодня</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Выбрано</span>
            </div>
          </div>
        </div>
        
        {/* Time Slots */}
        <div className="col-span-2 lg:col-span-3">
          <h4 className="text-sm font-body font-medium text-foreground mb-3">
            Доступное время
          </h4>
          
          {!selectedDate ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-caption">Выберите дату для просмотра доступного времени</p>
            </div>
          ) : timeSlots?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Clock" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-caption">На выбранную дату нет доступных слотов</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {timeSlots?.map((slot) => (
                <button
                  key={slot?.id}
                  onClick={() => onSlotSelect(slot)}
                  className={`
                    w-full p-3 rounded-md border text-left transition-all duration-200
                    ${selectedSlot?.id === slot?.id
                      ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 hover:bg-muted'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-body font-medium">
                        {slot?.time}
                      </div>
                      <div className="text-xs font-caption text-muted-foreground">
                        {slot?.technician}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`
                        text-xs font-caption px-2 py-1 rounded-full
                        ${slot?.type === 'mobile' ?'bg-accent/10 text-accent' :'bg-secondary/10 text-secondary'
                        }
                      `}>
                        {slot?.type === 'mobile' ? 'Выездной' : 'В сервисе'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCalendar;