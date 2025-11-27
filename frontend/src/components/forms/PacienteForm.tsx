import { Form, Input } from "antd";
import type { Paciente } from "../../types/Paciente";

type Props = {
  initial?: Partial<Paciente>;
};

export default function PacienteForm({ initial }: Props) {
  return (
    <>
      <Form.Item
        name="nome"
        label="Nome"
        initialValue={initial?.nome}
        rules={[{ required: true, message: "Informe o nome" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        initialValue={initial?.email}
        rules={[{ type: "email", required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="telefone"
        label="Telefone"
        initialValue={initial?.telefone}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
