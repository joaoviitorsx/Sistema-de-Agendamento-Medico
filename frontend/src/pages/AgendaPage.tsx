import { useState } from "react";
import { message, Select } from "antd";
import { useAgenda } from "../hooks/useAgenda";
import { AgendaCalendar } from "../components/agenda/AgendaCalendar";
import { useMedicos } from "../hooks/useMedicos";

export default function AgendaPage() {
  const { medicos } = useMedicos();
  const [medicoId, setMedicoId] = useState<string>("");

  const { slots, reservarSlot } = useAgenda(medicoId);

  function selecionarSlot(slot: string) {
    reservarSlot({ medico_id: medicoId, slot })
      .then(() => {
        message.info("Horário enviado para reserva…");
      })
      .catch(() => {
        message.error("Falha ao reservar horário");
      });
  }

  return (
    <div className="p-6 bg-white rounded shadow">

      <h2 className="text-2xl font-semibold mb-4">Agenda Interativa</h2>

      <Select
        className="w-64"
        placeholder="Selecione o médico"
        onChange={setMedicoId}
        options={medicos.map((m) => ({
          label: `${m.nome} (${m.especialidade})`,
          value: m.id,
        }))}
      />

      {medicoId && (
        <AgendaCalendar
          slots={slots}
          onSelect={selecionarSlot}
        />
      )}
    </div>
  );
}
