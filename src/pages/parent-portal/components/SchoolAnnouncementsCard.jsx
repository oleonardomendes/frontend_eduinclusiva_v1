import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SchoolAnnouncementsCard = ({ announcements }) => {
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);

  const toggleExpanded = (id) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-educational p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Megaphone" size={24} className="text-primary" />
          <span>Comunicados da Escola</span>
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Atualizados hoje</span>
        </div>
      </div>
      <div className="space-y-4">
        {announcements?.map((announcement) => (
          <div key={announcement?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-educational">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getPriorityIcon(announcement?.priority)} 
                  size={20} 
                  className={getPriorityColor(announcement?.priority)} 
                />
                <div>
                  <h3 className="font-medium text-foreground">{announcement?.title}</h3>
                  <p className="text-sm text-muted-foreground">{announcement?.date}</p>
                </div>
              </div>
              <button
                onClick={() => toggleExpanded(announcement?.id)}
                className="text-muted-foreground hover:text-foreground transition-educational"
              >
                <Icon 
                  name={expandedAnnouncement === announcement?.id ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                />
              </button>
            </div>

            <p className="text-sm text-foreground mb-2">
              {expandedAnnouncement === announcement?.id 
                ? announcement?.fullContent 
                : announcement?.preview
              }
            </p>

            {announcement?.category && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {announcement?.category}
                </span>
                {announcement?.requiresResponse && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                    Resposta Necessária
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <button className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-educational text-sm font-medium">
          <Icon name="Archive" size={16} />
          <span>Ver Todos os Comunicados</span>
        </button>
      </div>
    </div>
  );
};

export default SchoolAnnouncementsCard;