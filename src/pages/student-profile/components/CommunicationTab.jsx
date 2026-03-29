import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CommunicationTab = ({ student, currentUser }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState('general');

  const canSendMessage = currentUser?.role === 'teacher' || currentUser?.role === 'coordinator';

  const communications = [
    {
      id: 1,
      type: 'message',
      sender: 'Prof. Ana Silva',
      senderRole: 'teacher',
      recipient: 'Maria Santos (Mãe)',
      subject: 'Progresso em Matemática',
      message: `Olá Maria! Gostaria de compartilhar que o João tem demonstrado excelente progresso em matemática. Esta semana ele conseguiu resolver todos os exercícios de adição até 50 com apenas uma ajuda. Estou muito orgulhosa do desenvolvimento dele!\n\nSugestão para casa: Continue praticando contagem com objetos do dia a dia. Isso tem ajudado muito no aprendizado.`,
      date: '2024-10-22',
      time: '14:30',
      status: 'sent',
      priority: 'normal'
    },
    {
      id: 2,
      type: 'response',
      sender: 'Maria Santos',
      senderRole: 'parent',
      recipient: 'Prof. Ana Silva',
      subject: 'Re: Progresso em Matemática',
      message: `Professora Ana, muito obrigada pelo feedback! Fico muito feliz em saber do progresso do João. Em casa ele tem mostrado mais interesse pelos números e sempre quer contar os brinquedos.\n\nTenho uma dúvida: como posso ajudá-lo com as atividades de subtração? Ele ainda tem dificuldade.`,
      date: '2024-10-22',
      time: '19:45',
      status: 'received',
      priority: 'normal'
    },
    {
      id: 3,
      type: 'notification',
      sender: 'Sistema Escolar',
      senderRole: 'system',
      recipient: 'Todos os Responsáveis',
      subject: 'Reunião de Pais - Novembro',
      message: `Informamos que a reunião de pais do 2º trimestre está agendada para o dia 15/11/2024, às 19h00, no auditório da escola.\n\nPauta:\n- Apresentação dos resultados do trimestre\n- Planejamento para o próximo período\n- Atividades de fim de ano\n\nContamos com sua presença!`,
      date: '2024-10-20',
      time: '10:00',
      status: 'sent',
      priority: 'high'
    },
    {
      id: 4,
      type: 'observation',
      sender: 'Prof. Carlos Santos',
      senderRole: 'teacher',
      recipient: 'Coordenação Pedagógica',
      subject: 'Observação Comportamental - João',
      message: `Durante a aula de artes hoje, observei que o João demonstrou maior autonomia e criatividade. Ele trabalhou de forma independente por 40 minutos, o que representa um avanço significativo em sua capacidade de concentração.\n\nRecomendo continuar com atividades que estimulem a expressão artística, pois ele mostra grande potencial nesta área.`,
      date: '2024-10-18',
      time: '16:20',
      status: 'sent',
      priority: 'normal'
    },
    {
      id: 5,
      type: 'alert',
      sender: 'Coordenação Pedagógica',
      senderRole: 'coordinator',
      recipient: 'Prof. Ana Silva',
      subject: 'Lembrete: Avaliação Trimestral',
      message: `Lembramos que a avaliação trimestral do João está agendada para a próxima semana (28/10 a 01/11).\n\nPor favor, prepare os materiais de avaliação adaptados conforme o plano individualizado. Qualquer dúvida, estou à disposição.`,
      date: '2024-10-17',
      time: '09:15',
      status: 'sent',
      priority: 'high'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todas as Comunicações' },
    { value: 'message', label: 'Mensagens' },
    { value: 'notification', label: 'Notificações' },
    { value: 'observation', label: 'Observações' },
    { value: 'alert', label: 'Alertas' }
  ];

  const messageTypeOptions = [
    { value: 'general', label: 'Mensagem Geral' },
    { value: 'progress', label: 'Relatório de Progresso' },
    { value: 'behavior', label: 'Observação Comportamental' },
    { value: 'suggestion', label: 'Sugestão para Casa' },
    { value: 'meeting', label: 'Solicitação de Reunião' }
  ];

  const getMessageIcon = (type) => {
    switch (type) {
      case 'message':
        return { icon: 'MessageCircle', color: 'text-primary' };
      case 'response':
        return { icon: 'Reply', color: 'text-secondary' };
      case 'notification':
        return { icon: 'Bell', color: 'text-accent' };
      case 'observation':
        return { icon: 'Eye', color: 'text-success' };
      case 'alert':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      default:
        return { icon: 'Mail', color: 'text-muted-foreground' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-destructive';
      case 'medium':
        return 'border-l-warning';
      default:
        return 'border-l-primary';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'teacher':
        return 'Professor(a)';
      case 'coordinator':
        return 'Coordenação';
      case 'parent':
        return 'Responsável';
      case 'system':
        return 'Sistema';
      default:
        return role;
    }
  };

  const filteredCommunications = communications?.filter(comm => 
    selectedFilter === 'all' || comm?.type === selectedFilter
  );

  const handleSendMessage = () => {
    // Here you would typically send the message to your backend
    console.log('Sending message:', { message: newMessage, type: messageType });
    setNewMessage('');
    setShowNewMessage(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">Comunicação e Observações</h3>
        {canSendMessage && (
          <Button
            variant="default"
            onClick={() => setShowNewMessage(true)}
            iconName="MessageSquare"
            iconPosition="left"
          >
            Nova Mensagem
          </Button>
        )}
      </div>
      {/* Filter */}
      <div className="w-full sm:w-64">
        <Select
          options={filterOptions}
          value={selectedFilter}
          onChange={setSelectedFilter}
          placeholder="Filtrar comunicações"
        />
      </div>
      {/* Communications List */}
      <div className="space-y-4">
        {filteredCommunications?.map((comm) => {
          const messageInfo = getMessageIcon(comm?.type);
          return (
            <div 
              key={comm?.id} 
              className={`bg-card border border-border rounded-lg p-6 border-l-4 ${getPriorityColor(comm?.priority)} hover:shadow-educational transition-educational`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-muted`}>
                  <Icon name={messageInfo?.icon} size={20} className={messageInfo?.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="text-md font-semibold text-foreground">{comm?.subject}</h4>
                      <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Icon name="User" size={14} />
                          <span>{comm?.sender}</span>
                          <span className="text-xs">({getRoleLabel(comm?.senderRole)})</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Calendar" size={14} />
                          <span>{comm?.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} />
                          <span>{comm?.time}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {comm?.priority === 'high' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                          Prioridade Alta
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        comm?.status === 'sent' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                      }`}>
                        {comm?.status === 'sent' ? 'Enviado' : 'Recebido'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-foreground whitespace-pre-line">{comm?.message}</p>
                  </div>

                  {comm?.recipient && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Para: {comm?.recipient}
                    </div>
                  )}

                  {canSendMessage && comm?.senderRole === 'parent' && (
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" iconName="Reply">
                        Responder
                      </Button>
                      <Button variant="ghost" size="sm" iconName="Forward">
                        Encaminhar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredCommunications?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">Nenhuma comunicação encontrada</h4>
          <p className="text-muted-foreground">
            Não há comunicações para o filtro selecionado.
          </p>
        </div>
      )}
      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Nova Mensagem</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNewMessage(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                label="Destinatário"
                type="text"
                value="Maria Santos (Responsável)"
                disabled
              />

              <Select
                label="Tipo de Mensagem"
                options={messageTypeOptions}
                value={messageType}
                onChange={setMessageType}
                required
              />

              <Input
                label="Assunto"
                type="text"
                placeholder="Digite o assunto da mensagem"
                required
              />

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Mensagem</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  rows={8}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e?.target?.value)}
                  placeholder="Digite sua mensagem aqui..."
                />
              </div>

              <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={16} className="text-accent mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Dicas para uma boa comunicação:</p>
                    <ul className="mt-1 text-muted-foreground space-y-1">
                      <li>• Seja claro e objetivo na mensagem</li>
                      <li>• Inclua exemplos específicos quando relevante</li>
                      <li>• Mantenha um tom respeitoso e colaborativo</li>
                      <li>• Sugira ações práticas quando apropriado</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowNewMessage(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleSendMessage}
                iconName="Send"
                iconPosition="left"
                disabled={!newMessage?.trim()}
              >
                Enviar Mensagem
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Communication Statistics */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <h4 className="text-md font-medium text-foreground mb-4">Resumo de Comunicações</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{communications?.filter(c => c?.type === 'message')?.length}</div>
            <div className="text-sm text-muted-foreground">Mensagens</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{communications?.filter(c => c?.type === 'observation')?.length}</div>
            <div className="text-sm text-muted-foreground">Observações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{communications?.filter(c => c?.type === 'notification')?.length}</div>
            <div className="text-sm text-muted-foreground">Notificações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{communications?.filter(c => c?.priority === 'high')?.length}</div>
            <div className="text-sm text-muted-foreground">Alta Prioridade</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationTab;