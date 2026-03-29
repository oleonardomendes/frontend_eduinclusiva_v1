import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-educational border border-border">
          /images/logo-eduplus.svg
        </div>
      </div>

      {/* Title and Description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Edu+ Inclusiva
        </h1>
        <p className="text-lg text-muted-foreground">
          Educação Especial Municipal
        </p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Plataforma de gestão educacional para estudantes com necessidades educacionais especiais
        </p>
      </div>

      {/* Trust Signals */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={14} />
            <span>Sistema Seguro</span>
          </div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full" />
          <div className="flex items-center space-x-1">
            <Icon name="Award" size={14} />
            {/* ✅ removido o texto “Prefeitura de Iperó” para não confundir */}
            <span>Edu+ Inclusiva</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;