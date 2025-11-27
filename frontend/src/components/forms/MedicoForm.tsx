import { Form, Input } from "antd";
import type { Medico } from "../../types/Medico";

export default function MedicoForm({ initial }: { initial?: Partial<Medico> }) {
  return (
    <>
      <Form.Item
        name="nome"
        label="Nome"
        initialValue={initial?.nome}
        rules={[{ required: true, message: "Informe o nome do médico" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="especialidade"
        label="Especialidade"
        initialValue={initial?.especialidade}
        rules={[{ required: true, message: "Informe a especialidade" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="crm"
        label="CRM"
        initialValue={initial?.crm}
        rules={[{ required: true, message: "Informe o CRM" }]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
