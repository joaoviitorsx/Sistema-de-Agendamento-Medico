import { create } from 'zustand';
import { SlotsMap, SlotStatus } from '@/types';
import { agendaApi } from '@/api/agendaApi';
import toast from 'react-hot-toast';

interface AgendaStore {
  slots: SlotsMap;
  loading: boolean;
  error: string | null;
  selectedSlot: { medicoId: string; datetime: string } | null;
  eventSource: EventSource | null;
  fetchSlots: (days?: number) => Promise<void>;
  getSlotStatus: (medicoId: string, datetime: string) => SlotStatus;
  reservarSlot: (medicoId: string, datetime: string) => Promise<boolean>;
  liberarSlot: (medicoId: string, datetime: string) => Promise<boolean>;
  setSelectedSlot: (medicoId: string, datetime: string) => void;
  clearSelectedSlot: () => void;
  connectSSE: () => void;
  disconnectSSE: () => void;
  updateSlotStatus: (medicoId: string, datetime: string, status: SlotStatus) => void;
}

export const useAgendaStore = create<AgendaStore>((set, get) => ({
  slots: {},
  loading: false,
  error: null,
  selectedSlot: null,
  eventSource: null,

  fetchSlots: async (days = 7) => {
    set({ loading: true, error: null });
    try {
      const slots = await agendaApi.getSlots(days);
      set({ slots, loading: false });
    } catch (error) {
      const message = 'Erro ao carregar horários disponíveis';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  getSlotStatus: (medicoId: string, datetime: string) => {
    const { slots } = get();
    return slots[medicoId]?.[datetime] || 'ocupado';
  },

  reservarSlot: async (medicoId: string, datetime: string) => {
    try {
      await agendaApi.reservar({ medico_id: medicoId, slot: datetime });
      
      // NÃO atualiza o status local aqui - deixa o selectedSlot controlar
      // O SSE vai notificar outros usuários, mas para este usuário
      // o slot aparece como selecionado (verde) via selectedSlot
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao reservar horário';
      toast.error(message);
      return false;
    }
  },

  liberarSlot: async (medicoId: string, datetime: string) => {
    try {
      await agendaApi.liberar({ medico_id: medicoId, slot: datetime });
      
      // Atualiza localmente o status para "disponivel"
      set((state) => ({
        slots: {
          ...state.slots,
          [medicoId]: {
            ...state.slots[medicoId],
            [datetime]: 'disponivel',
          },
        },
      }));
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao liberar horário';
      toast.error(message);
      return false;
    }
  },

  setSelectedSlot: (medicoId: string, datetime: string) => {
    set({ selectedSlot: { medicoId, datetime } });
  },

  clearSelectedSlot: () => {
    set({ selectedSlot: null });
  },

  updateSlotStatus: (medicoId: string, datetime: string, status: SlotStatus) => {
    set((state) => ({
      slots: {
        ...state.slots,
        [medicoId]: {
          ...state.slots[medicoId],
          [datetime]: status,
        },
      },
    }));
  },

  connectSSE: () => {
    const { eventSource } = get();
    
    // Evita múltiplas conexões
    if (eventSource) {
      return;
    }

    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const es = new EventSource(`${baseURL}/sistema/agenda/stream`);
    
    es.onmessage = (event) => {
      try {
        console.log('📨 SSE Raw Event Data:', event.data);
        
        // O event.data pode conter múltiplos JSONs concatenados
        // Precisamos processar apenas o primeiro JSON válido
        const dataStr = event.data.trim();
        
        // Tenta encontrar o primeiro objeto JSON completo
        let firstJsonEnd = dataStr.indexOf('}');
        if (firstJsonEnd === -1) {
          console.warn('⚠️ No closing brace found in SSE data');
          return;
        }
        
        const firstJson = dataStr.substring(0, firstJsonEnd + 1);
        console.log('🔍 Extracted JSON:', firstJson);
        
        const data = JSON.parse(firstJson);
        console.log('✅ Parsed SSE Data:', data);
        
        const { tipo, dados } = data;
        
        // Verifica se dados existe e tem as propriedades necessárias
        if (!dados || !dados.medico_id || !dados.slot) {
          console.warn('⚠️ Invalid SSE data structure:', data);
          return;
        }
        
        const { selectedSlot } = get();
        console.log('🎯 Current selectedSlot:', selectedSlot);
        console.log('📍 Event dados:', dados);
        
        // Ignora eventos do próprio slot selecionado
        const isOwnSlot = selectedSlot && 
                          selectedSlot.medicoId === dados.medico_id && 
                          selectedSlot.datetime === dados.slot;
        
        console.log('🔎 Is own slot?', isOwnSlot, {
          'selectedSlot.medicoId': selectedSlot?.medicoId,
          'dados.medico_id': dados.medico_id,
          'selectedSlot.datetime': selectedSlot?.datetime,
          'dados.slot': dados.slot
        });
        
        if (isOwnSlot) {
          console.log('⏭️ Ignoring own slot event');
          return; // Não atualiza o próprio slot selecionado
        }
        
        console.log(`🔄 Processing event type: ${tipo}`);
        
        if (tipo === 'horario_reservado') {
          console.log(`🟡 Setting slot to RESERVADO: ${dados.slot}`);
          get().updateSlotStatus(dados.medico_id, dados.slot, 'reservado');
        } else if (tipo === 'horario_liberado') {
          console.log(`🟢 Setting slot to DISPONIVEL (liberado): ${dados.slot}`);
          get().updateSlotStatus(dados.medico_id, dados.slot, 'disponivel');
        } else if (tipo === 'horario_ocupado') {
          console.log(`🔴 Setting slot to OCUPADO: ${dados.slot}`);
          get().updateSlotStatus(dados.medico_id, dados.slot, 'ocupado');
        } else if (tipo === 'horario_disponivel') {
          console.log(`🟢 Setting slot to DISPONIVEL: ${dados.slot}`);
          get().updateSlotStatus(dados.medico_id, dados.slot, 'disponivel');
        }
      } catch (error) {
        console.error('❌ SSE Parse Error:', error);
        console.error('Raw event data:', event.data);
      }
    };
    
    es.onerror = () => {
      console.error('Erro na conexão SSE. Reconectando...');
      es.close();
      set({ eventSource: null });
      
      // Reconectar após 3 segundos
      setTimeout(() => {
        get().connectSSE();
      }, 3000);
    };
    
    set({ eventSource: es });
  },

  disconnectSSE: () => {
    const { eventSource } = get();
    if (eventSource) {
      eventSource.close();
      set({ eventSource: null });
    }
  },
}));
