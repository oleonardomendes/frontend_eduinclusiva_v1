import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import DialogForm from '../../../components/ui/DialogForm';

const StudentCard = ({ student }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/v1/ai/historico/${student.id}`);
      if (!res.ok) throw new Error('Erro ao buscar histórico');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenHistory = async () => {
    await fetchHistory();
    setIsHistoryOpen(true);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-educational p-4 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={student.avatar}
          alt={student.avatarAlt}
          className="w-16 h-16 rounded-full object-cover border border-border"
        />
        <div>
          <h3 className="font-semibold text-lg text-foreground">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.grade}</p>
          <p className="text-xs text-muted-foreground">
            Última atualização: {student.lastUpdate}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Progresso: {student.progress}%</p>
        <div className="w-full bg-muted h-2 rounded-full">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${student.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleOpenHistory}
          className="text-sm text-primary hover:underline"
        >
          Ver histórico de planos
        </button>

        <Icon
          name={student.specialNeeds ? 'Heart' : 'User'}
          className="text-secondary"
          size={18}
        />
      </div>

      {/* Modal de Histórico */}
      <DialogForm
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title={`Histórico de planos - ${student.name}`}
      >
        {loading ? (
          <div className="text-center text-muted-foreground py-4">Carregando histórico...</div>
        ) : history.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {history.map((plano, index) => (
              <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground text-base">
                  {plano.titulo || 'Plano sem título'}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Gerado em: {new Date(plano.criado_em).toLocaleString('pt-BR')}
                </p>

                <div className="mt-2">
                  <h5 className="font-medium text-sm text-primary">Atividades:</h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {Array.isArray(plano.atividades) ? (
                      plano.atividades.map((a, i) => (
                        <li key={i}>
                          <span className="font-medium">{a.tipo || 'Atividade'}:</span>{' '}
                          {a.descricao || ''}
                        </li>
                      ))
                    ) : (
                      <li>Atividades indisponíveis</li>
                    )}
                  </ul>
                </div>

                {Array.isArray(plano.recomendacoes) && plano.recomendacoes.length > 0 && (
                  <div className="mt-2">
                    <h5 className="font-medium text-sm text-accent">Recomendações:</h5>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {plano.recomendacoes.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            Nenhum plano gerado ainda para este aluno.
          </div>
        )}
      </DialogForm>
    </div>
  );
};

export default StudentCard;
