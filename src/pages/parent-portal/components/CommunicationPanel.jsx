import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommunicationPanel = ({ messages, teachers }) => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);

  const handleSendMessage = () => {
    if (newMessage?.trim() && selectedTeacher) {
      // In a real app, this would send the message
      console.log('Sending message to:', selectedTeacher?.name, 'Message:', newMessage);
      setNewMessage('');
      setShowMessageForm(false);
      setSelectedTeacher(null);
    }
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'behavior':
        return 'Heart';
      case 'academic':
        return 'BookOpen';
      case 'general':
        return 'MessageCircle';
      default:
        return 'Mail';
    }
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'behavior':
        return 'text-success';
      case 'academic':
        return 'text-primary';
      case 'general':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-educational p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="MessageSquare" size={24} className="text-primary" />
          <span>Comunicação com Professores</span>
        </h2>
        <Button
          size="sm"
          onClick={() => setShowMessageForm(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Nova Mensagem
        </Button>
      </div>
      {showMessageForm && (
        <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-medium text-foreground mb-4">Enviar Nova Mensagem</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Selecionar Professor:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teachers?.map((teacher) => (
                  <button
                    key={teacher?.id}
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`p-3 text-left border rounded-lg transition-educational ${
                      selectedTeacher?.id === teacher?.id
                        ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="font-medium text-foreground">{teacher?.name}</div>
                    <div className="text-sm text-muted-foreground">{teacher?.subject}</div>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Sua Mensagem"
              type="text"
              placeholder="Digite sua mensagem aqui..."
              value={newMessage}
              onChange={(e) => setNewMessage(e?.target?.value)}
              className="w-full"
            />

            <div className="flex items-center space-x-3">
              <Button
                onClick={handleSendMessage}
                disabled={!selectedTeacher || !newMessage?.trim()}
                iconName="Send"
                iconPosition="left"
              >
                Enviar Mensagem
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowMessageForm(false);
                  setSelectedTeacher(null);
                  setNewMessage('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Mensagens Recentes</h3>
        
        {messages?.map((message) => (
          <div key={message?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getMessageTypeIcon(message?.type)} 
                  size={20} 
                  className={getMessageTypeColor(message?.type)} 
                />
                <div>
                  <h4 className="font-medium text-foreground">{message?.subject}</h4>
                  <p className="text-sm text-muted-foreground">
                    De: {message?.sender} • {message?.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {message?.unread && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  message?.type === 'behavior' ? 'bg-success/10 text-success' :
                  message?.type === 'academic'? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {message?.type === 'behavior' ? 'Comportamento' :
                   message?.type === 'academic' ? 'Acadêmico' : 'Geral'}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-foreground mb-3">{message?.content}</p>
            
            {message?.requiresResponse && (
              <div className="flex items-center space-x-2 pt-2 border-t border-border">
                <Icon name="Reply" size={16} className="text-primary" />
                <span className="text-sm text-primary font-medium">Resposta necessária</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <button className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-educational text-sm font-medium">
          <Icon name="Archive" size={16} />
          <span>Ver Histórico Completo</span>
        </button>
      </div>
    </div>
  );
};

export default CommunicationPanel;