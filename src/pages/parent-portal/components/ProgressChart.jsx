import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProgressChart = ({ progressData, chartType = 'line' }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-educational-lg">
          <p className="text-sm font-medium text-popover-foreground">{`${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-educational p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="TrendingUp" size={24} className="text-primary" />
          <span>Evolução do Aprendizado</span>
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>Últimos 6 meses</span>
        </div>
      </div>

      <div className="h-80 w-full mb-6" aria-label="Gráfico de Evolução do Aprendizado">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="português" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="matemática" 
                stroke="var(--color-secondary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-secondary)', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="ciências" 
                stroke="var(--color-accent)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="português" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="matemática" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ciências" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
          <div className="w-4 h-4 bg-primary rounded-full" />
          <div>
            <p className="text-sm font-medium text-foreground">Português</p>
            <p className="text-xs text-muted-foreground">Leitura e Escrita</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-secondary/5 rounded-lg">
          <div className="w-4 h-4 bg-secondary rounded-full" />
          <div>
            <p className="text-sm font-medium text-foreground">Matemática</p>
            <p className="text-xs text-muted-foreground">Números e Operações</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-accent/5 rounded-lg">
          <div className="w-4 h-4 bg-accent rounded-full" />
          <div>
            <p className="text-sm font-medium text-foreground">Ciências</p>
            <p className="text-xs text-muted-foreground">Natureza e Sociedade</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-success" />
              <span className="text-sm text-foreground">3 Conquistas este mês</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-sm text-foreground">2 Metas atingidas</span>
            </div>
          </div>
          <button className="text-primary hover:text-primary/80 transition-educational text-sm font-medium">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;