import { useState } from "react";
import type { Paciente } from "../types/Paciente";
import { Button, Modal, Form, Table, Space, Popconfirm } from "antd";
import { usePacientes } from "../hooks/usePacientes";
import PacienteForm from "../components/forms/PacienteForm";

export default function PacientesPage() {
  const { pacientes, loading, criar, atualizar, deletar } = usePacientes();

  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Paciente | null>(null);

  const [form] = Form.useForm();

  function novoPaciente() {
    setEditando(null);
    form.resetFields();
  }

  function editarPaciente(record: Paciente) {
    setEditando(record);
    form.setFieldsValue(record);
  }

  function onSalvar() {
    form.validateFields().then((values) => {
      if (editando) {
        atualizar(editando.id, values);
      } else {
        criar(values);
      }
      setOpen(false);
    });
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pacientes</h2>
        <Button type="primary" onClick={novoPaciente}>
          Novo Paciente
        </Button>
      </div>

      <Table
        dataSource={pacientes}
        loading={loading}
        rowKey="id"
        columns={[
          { title: "Nome", dataIndex: "nome" },
          { title: "Email", dataIndex: "email" },
          { title: "Telefone", dataIndex: "telefone" },
          {
            title: "Ações",
            render: (_, record) => (
              <Space>
                <Button onClick={() => editarPaciente(record)}>Editar</Button>

                <Popconfirm
                  title="Excluir paciente?"
                  onConfirm={() => deletar(record.id)}
                >
                  <Button danger>Excluir</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSalvar}
        title={editando ? "Editar Paciente" : "Novo Paciente"}
      >
        <Form form={form} layout="vertical">
          <PacienteForm initial={editando ?? undefined} />
        </Form>
      </Modal>
    </div>
  );
}
