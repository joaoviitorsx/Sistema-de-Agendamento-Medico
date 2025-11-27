import { Form, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import type { Paciente } from "../../types/Paciente";
import type { Medico } from "../../types/Medico";

type Props = {
  pacientes: Paciente[];
  medicos: Medico[];
  initial?: Partial<import("../../types/Consulta").Consulta>;
};

export default function ConsultaForm({ pacientes, medicos, initial }: Props) {
  return (
    <>
      <Form.Item
        name="paciente_id"
        label="Paciente"
        initialValue={initial?.paciente_id}
        rules={[{ required: true }]}
      >
        <Select
          options={pacientes.map((p) => ({
            value: p.id,
            label: p.nome,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="medico_id"
        label="Médico"
        initialValue={initial?.medico_id}
        rules={[{ required: true }]}
      >
        <Select
          options={medicos.map((m) => ({
            value: m.id,
            label: `${m.nome} (${m.especialidade})`,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="inicio"
        label="Início"
        initialValue={initial?.inicio ? dayjs(initial.inicio) : undefined}
        rules={[{ required: true }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>

      <Form.Item
        name="fim"
        label="Fim"
        initialValue={initial?.fim ? dayjs(initial.fim) : undefined}
        rules={[{ required: true }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>
    </>
  );
}
