// src/pages/teacher-dashboard/components/StudentCard.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Modal from '../../../components/ui/Modal';
import { api } from '../../../api/api';

const StudentCard = ({ student }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/ai/historico/${student.id}`);
      setHistory(Array.isArray(data) ? data : []);
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
    <div className="flex flex-col justify-between">
      <div className="flex items-center space-x-4">
        {student.avatar && (
          <img
            src={student.avatar}
            alt={student.avatarAlt || student.nome}
            className="w-16 h-16 rounded-full object-cover border border-border"
          />
        )}
        <div>
          {student.grade && <p className="text-sm text-muted-foreground">{student.grade}</p>}
          {student.lastUpdate && (
            <p className="text-xs text-muted-foreground">
              Última atualização: {student.lastUpdate}
            </p>
          )}
        </div>
      </div>

      {student.progress !== undefined && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Progresso: {student.progress}%</p>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${student.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={handleOpenHistory}
          className="text-sm text-primary hover:underline"
        >
          Ver histórico de planos
        </button>

        <Icon
          name={student.specialNeeds || student.necessidade ? 'Heart' : 'User'}
          className="text-secondary"
          size={18}
        />
      </div>

      {/* ✅ Modal correto para histórico */}
      <Modal
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title={`Histórico de planos — ${student.nome || student.name}`}
        size="md"
      >
        {loading ? (
          <div className="text-center text-muted-foreground py-4">
            Carregando histórico...
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((plano, index) => (
              <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground text-base">
                  {plano.titulo || 'Plano sem título'}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Gerado em: {new Date(plano.criado_em).toLocaleString('pt-BR')}
                </p>

                {Array.isArray(plano.atividades) && plano.atividades.length > 0 && (
                  <div className="mt-2">
                    <h5 className="font-medium text-sm text-primary mb-1">Atividades:</h5>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {plano.atividades.map((a, i) => (
                        <li key={i}>
                          <span className="font-medium">{a.tipo || 'Atividade'}:</span>{' '}
                          {a.descricao || ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(plano.recomendacoes) && plano.recomendacoes.length > 0 && (
                  <div className="mt-2">
                    <h5 className="font-medium text-sm text-accent mb-1">Recomendações:</h5>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
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
      </Modal>
    </div>
  );
};

export default StudentCard;
