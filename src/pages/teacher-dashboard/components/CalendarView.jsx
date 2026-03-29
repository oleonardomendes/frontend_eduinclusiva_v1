import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const CalendarView = ({ events, onEventClick, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  const months = [
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
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate?.toDateString() === date?.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setMonth(currentDate?.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'aula': 'bg-primary text-primary-foreground',
      'avaliacao': 'bg-warning text-warning-foreground',
      'reuniao': 'bg-secondary text-secondary-foreground',
      'evento': 'bg-accent text-accent-foreground',
      'feriado': 'bg-destructive text-destructive-foreground'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground';
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-card border border-border rounded-lg shadow-educational">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Calendário Escolar</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Mês
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Semana
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
              iconName="ChevronLeft"
            />
            <h3 className="text-lg font-medium text-foreground">
              {months?.[currentDate?.getMonth()]} {currentDate?.getFullYear()}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
              iconName="ChevronRight"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoje
          </Button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="p-6">
        {viewMode === 'month' && (
          <>
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays?.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days?.map((date, index) => {
                const dayEvents = getEventsForDate(date);
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-border rounded-lg cursor-pointer transition-educational hover:bg-muted/50 ${
                      !date ? 'opacity-30' : ''
                    } ${isToday(date) ? 'bg-primary/10 border-primary' : ''}`}
                    onClick={() => date && onDateClick(date)}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday(date) ? 'text-primary' : 'text-foreground'
                        }`}>
                          {date?.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents?.slice(0, 3)?.map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={`text-xs p-1 rounded truncate cursor-pointer ${getEventTypeColor(event?.type)}`}
                              onClick={(e) => {
                                e?.stopPropagation();
                                onEventClick(event);
                              }}
                            >
                              {event?.title}
                            </div>
                          ))}
                          {dayEvents?.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents?.length - 3} mais
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {viewMode === 'week' && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Visualização semanal em desenvolvimento
            </p>
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-xs text-muted-foreground">Aulas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-xs text-muted-foreground">Avaliações</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-xs text-muted-foreground">Reuniões</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-xs text-muted-foreground">Eventos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span className="text-xs text-muted-foreground">Feriados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;