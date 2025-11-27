import { useState } from "react";
import { Button, Form, Modal, Popconfirm, Space, Table } from "antd";
import { useMedicos } from "../hooks/useMedicos";
import MedicoForm from "../components/forms/MedicoForm";
import type { Medico } from "../types/Medico";

export default function MedicosPage() {
  const { medicos, loading, criar, atualizar, deletar } = useMedicos();

  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Medico | null>(null);

  const [form] = Form.useForm();

  function novo() {
    setEditando(null);
    form.resetFields();
    setOpen(true);
  }

  function editar(record: Medico) {
    setEditando(record);
    form.setFieldsValue(record);
    setOpen(true);
  }

  function salvar() {
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
        <h2 className="text-xl font-semibold">Médicos</h2>
        <Button type="primary" onClick={novo}>
          Novo Médico
        </Button>
      </div>

      <Table
        dataSource={medicos}
        loading={loading}
        rowKey="id"
        columns={[
          { title: "Nome", dataIndex: "nome" },
          { title: "Especialidade", dataIndex: "especialidade" },
          { title: "CRM", dataIndex: "crm" },
          {
            title: "Ações",
            render: (_, record) => (
              <Space>
                <Button onClick={() => editar(record)}>Editar</Button>

                <Popconfirm
                  title="Excluir médico?"
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
        onOk={salvar}
        title={editando ? "Editar Médico" : "Novo Médico"}
      >
        <Form form={form} layout="vertical">
          <MedicoForm initial={editando ?? undefined} />
        </Form>
      </Modal>
    </div>
  );
}
