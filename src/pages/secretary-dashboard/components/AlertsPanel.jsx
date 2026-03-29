import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = ({ alerts }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return 'AlertCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} dias atrás`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-educational">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Bell" size={20} className="mr-2" />
            Alertas e Notificações
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {alerts?.filter(alert => !alert?.read)?.length} não lidos
            </span>
            <Button variant="ghost" size="sm" iconName="Settings">
              Configurar
            </Button>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {alerts?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-3" />
            <p className="text-muted-foreground">
              Nenhum alerta pendente
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {alerts?.map((alert) => (
              <div 
                key={alert?.id} 
                className={`p-4 hover:bg-muted transition-educational ${
                  !alert?.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${getAlertColor(alert?.type)}`}>
                    <Icon name={getAlertIcon(alert?.type)} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {alert?.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatTimeAgo(alert?.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert?.message}
                    </p>
                    
                    {alert?.school && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Escola: {alert?.school}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="xs" iconName="Eye">
                        Ver Detalhes
                      </Button>
                      {alert?.actionRequired && (
                        <Button variant="default" size="xs" iconName="ArrowRight">
                          Ação Necessária
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {!alert?.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {alerts?.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full" iconName="Archive">
            Ver Todos os Alertas
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;