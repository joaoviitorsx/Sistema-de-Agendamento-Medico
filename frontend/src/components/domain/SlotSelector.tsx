import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAgendaStore } from '@/store/useAgendaStore';
import { SlotStatus } from '@/types';
import './SlotSelector.css';

interface SlotSelectorProps {
  medicoId: string;
  onSelectSlot: (datetime: string) => void;
  selectedSlot?: string;
}

export const SlotSelector = ({ medicoId, onSelectSlot, selectedSlot }: SlotSelectorProps) => {
  const { slots, fetchSlots, getSlotStatus, connectSSE, disconnectSSE } = useAgendaStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlots();
    // Conecta ao SSE para receber atualizações em tempo real
    connectSSE();
    
    return () => {
      // Desconecta ao desmontar o componente
      disconnectSSE();
    };
  }, [medicoId]);

  const loadSlots = async () => {
    setLoading(true);
    await fetchSlots(7); // 7 dias
    setLoading(false);
  };

  const medicoSlots = slots[medicoId] || {};
  const sortedDates = Object.keys(medicoSlots).sort();

  const getStatusInfo = (status: SlotStatus) => {
    switch (status) {
      case 'disponivel':
        return {
          label: 'Disponível',
          icon: CheckCircle,
          className: 'slot-disponivel',
          disabled: false,
        };
      case 'reservado':
        return {
          label: 'Sendo agendado',
          icon: Loader,
          className: 'slot-reservado animate-pulse',
          disabled: true,
        };
      case 'ocupado':
        return {
          label: 'Ocupado',
          icon: XCircle,
          className: 'slot-ocupado',
          disabled: true,
        };
    }
  };

  if (loading) {
    return (
      <div className="slot-selector-loading">
        <Loader className="animate-spin" size={32} />
        <p>Carregando horários disponíveis...</p>
      </div>
    );
  }

  if (sortedDates.length === 0) {
    return (
      <div className="slot-selector-empty">
        <Clock size={48} />
        <p>Nenhum horário disponível para este médico nos próximos dias.</p>
      </div>
    );
  }

  // Agrupa slots por data
  const slotsByDate = sortedDates.reduce((acc, datetime) => {
    const date = datetime.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(datetime);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="slot-selector">
      <div className="slot-legend">
        <div className="legend-item">
          <div className="legend-dot disponivel"></div>
          <span>Disponível</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot reservado"></div>
          <span>Sendo agendado por outro paciente</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot ocupado"></div>
          <span>Ocupado</span>
        </div>
      </div>

      {Object.entries(slotsByDate).map(([date, datetimes]) => (
        <div key={date} className="slot-date-group">
          <h4 className="slot-date-title">
            {format(parseISO(date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h4>
          
          <div className="slot-grid">
            {datetimes.map((datetime) => {
              const status = getSlotStatus(medicoId, datetime);
              const isSelected = selectedSlot === datetime;
              
              // Se o usuário selecionou este slot, sempre mostra como disponível (verde)
              // ignorando o status do backend/SSE
              let effectiveStatus: SlotStatus;
              if (isSelected) {
                effectiveStatus = 'disponivel';
              } else {
                effectiveStatus = status;
              }
              
              const info = getStatusInfo(effectiveStatus);
              const Icon = info.icon;

              return (
                <button
                  key={datetime}
                  className={`slot-button ${info.className} ${isSelected ? 'selected' : ''}`}
                  onClick={() => !info.disabled && onSelectSlot(datetime)}
                  disabled={info.disabled && !isSelected}
                  title={isSelected ? 'Selecionado' : info.label}
                >
                  <Icon size={18} />
                  <span className="slot-time">
                    {format(parseISO(datetime), 'HH:mm')}
                  </span>
                  {status === 'reservado' && !isSelected && (
                    <span className="slot-status-text">Aguarde...</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
