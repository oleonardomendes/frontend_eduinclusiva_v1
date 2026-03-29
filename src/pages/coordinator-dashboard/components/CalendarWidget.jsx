import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const CalendarWidget = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 23)); // October 2025

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(day);
    }
    
    return days;
  };

  const hasEvent = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate?.getFullYear()}-${String(currentDate?.getMonth() + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    return events?.some(event => event?.date === dateStr);
  };

  const getEventForDay = (day) => {
    if (!day) return null;
    const dateStr = `${currentDate?.getFullYear()}-${String(currentDate?.getMonth() + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    return events?.find(event => event?.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setMonth(currentDate?.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (day === today?.getDate() &&
    currentDate?.getMonth() === today?.getMonth() && currentDate?.getFullYear() === today?.getFullYear());
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          {monthNames?.[currentDate?.getMonth()]} {currentDate?.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(-1)}
            iconName="ChevronLeft"
            className="w-8 h-8"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(1)}
            iconName="ChevronRight"
            className="w-8 h-8"
          />
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays?.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days?.map((day, index) => (
            <div
              key={index}
              className={`
                relative aspect-square flex items-center justify-center text-sm rounded-md cursor-pointer transition-educational
                ${day ? 'hover:bg-muted' : ''}
                ${isToday(day) ? 'bg-primary text-primary-foreground font-semibold' : ''}
                ${hasEvent(day) && !isToday(day) ? 'bg-accent/10 text-accent font-medium' : ''}
                ${!day ? 'cursor-default' : ''}
              `}
            >
              {day && (
                <>
                  <span>{day}</span>
                  {hasEvent(day) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full" />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Upcoming Events */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Próximos Eventos</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {events?.slice(0, 3)?.map((event, index) => (
            <div key={index} className="flex items-center space-x-3 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                event?.type === 'assessment' ? 'bg-primary' :
                event?.type === 'meeting' ? 'bg-secondary' :
                event?.type === 'deadline' ? 'bg-destructive' : 'bg-accent'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-foreground truncate">{event?.title}</p>
                <p className="text-muted-foreground text-xs">{event?.formattedDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;