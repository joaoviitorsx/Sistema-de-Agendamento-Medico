import { Form, Input, Select } from "antd";
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
        <Select placeholder="Selecione a especialidade">
          <Select.Option value="Cardiologia">Cardiologia</Select.Option>
          <Select.Option value="Dermatologia">Dermatologia</Select.Option>
          <Select.Option value="Endocrinologia">Endocrinologia</Select.Option>
          <Select.Option value="Gastroenterologia">Gastroenterologia</Select.Option>
          <Select.Option value="Geriatria">Geriatria</Select.Option>
          <Select.Option value="Ginecologia">Ginecologia</Select.Option>
          <Select.Option value="Hematologia">Hematologia</Select.Option>
          <Select.Option value="Infectologia">Infectologia</Select.Option>
          <Select.Option value="Nefrologia">Nefrologia</Select.Option>
          <Select.Option value="Neurologia">Neurologia</Select.Option>
          <Select.Option value="Oftalmologia">Oftalmologia</Select.Option>
          <Select.Option value="Oncologia">Oncologia</Select.Option>
          <Select.Option value="Ortopedia">Ortopedia</Select.Option>
          <Select.Option value="Otorrinolaringologia">Otorrinolaringologia</Select.Option>
          <Select.Option value="Pediatria">Pediatria</Select.Option>
          <Select.Option value="Psiquiatria">Psiquiatria</Select.Option>
          <Select.Option value="Reumatologia">Reumatologia</Select.Option>
          <Select.Option value="Urologia">Urologia</Select.Option>
          <Select.Option value="Outros">Outros</Select.Option>
        </Select>
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
