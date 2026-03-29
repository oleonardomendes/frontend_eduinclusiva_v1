import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AnnouncementPanel = ({ announcements, onCreateAnnouncement }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'normal'
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (newAnnouncement?.title?.trim() && newAnnouncement?.content?.trim()) {
      onCreateAnnouncement({
        ...newAnnouncement,
        id: Date.now(),
        author: 'Coordenadora Maria Silva',
        date: new Date()?.toLocaleDateString('pt-BR'),
        time: new Date()?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
      setNewAnnouncement({ title: '', content: '', priority: 'normal' });
      setIsCreating(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-destructive bg-destructive/5';
      case 'medium':
        return 'border-l-warning bg-warning/5';
      default:
        return 'border-l-primary bg-primary/5';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertCircle';
      default:
        return 'Info';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Comunicados</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
          iconName={isCreating ? "X" : "Plus"}
        >
          {isCreating ? 'Cancelar' : 'Novo Comunicado'}
        </Button>
      </div>
      {/* Create Announcement Form */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="space-y-4">
            <Input
              label="Título do Comunicado"
              type="text"
              placeholder="Digite o título..."
              value={newAnnouncement?.title}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e?.target?.value }))}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Conteúdo
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows="3"
                placeholder="Digite o conteúdo do comunicado..."
                value={newAnnouncement?.content}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e?.target?.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prioridade
              </label>
              <div className="flex space-x-2">
                {[
                  { value: 'normal', label: 'Normal', color: 'primary' },
                  { value: 'medium', label: 'Média', color: 'warning' },
                  { value: 'high', label: 'Alta', color: 'destructive' }
                ]?.map((priority) => (
                  <button
                    key={priority?.value}
                    type="button"
                    onClick={() => setNewAnnouncement(prev => ({ ...prev, priority: priority?.value }))}
                    className={`px-3 py-1 text-xs rounded-md border transition-educational ${
                      newAnnouncement?.priority === priority?.value
                        ? `bg-${priority?.color} text-${priority?.color}-foreground border-${priority?.color}`
                        : 'bg-background text-muted-foreground border-border hover:border-muted-foreground'
                    }`}
                  >
                    {priority?.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" size="sm" iconName="Send">
                Publicar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCreating(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      )}
      {/* Announcements List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {announcements?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="MessageSquare" size={32} className="mx-auto mb-2 opacity-50" />
            <p>Nenhum comunicado publicado</p>
          </div>
        ) : (
          announcements?.map((announcement) => (
            <div
              key={announcement?.id}
              className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(announcement?.priority)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getPriorityIcon(announcement?.priority)} 
                    size={16} 
                    className={
                      announcement?.priority === 'high' ? 'text-destructive' :
                      announcement?.priority === 'medium' ? 'text-warning' : 'text-primary'
                    }
                  />
                  <h4 className="font-medium text-foreground">{announcement?.title}</h4>
                </div>
                <div className="text-xs text-muted-foreground">
                  {announcement?.date} às {announcement?.time}
                </div>
              </div>
              
              <p className="text-sm text-foreground mb-2 leading-relaxed">
                {announcement?.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Por: {announcement?.author}</span>
                <div className="flex items-center space-x-3">
                  <button className="hover:text-foreground transition-educational">
                    <Icon name="Edit2" size={14} />
                  </button>
                  <button className="hover:text-destructive transition-educational">
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementPanel;