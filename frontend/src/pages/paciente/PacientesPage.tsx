import { useState } from "react";
import type { Paciente } from "../../types/Paciente";
import { Button, Modal, Form, Table, Popconfirm, Tooltip, FloatButton, Empty } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import { usePacientes } from "../../hooks/usePacientes";
import PacienteForm from "../../components/forms/PacienteForm";

export default function PacientesPage() {
  const { pacientes, loading, criar, atualizar, deletar } = usePacientes();
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Paciente | null>(null);
  const [form] = Form.useForm();

  function abrirNovo() {
    setEditando(null);
    form.resetFields();
    setOpen(true);
  }

  function abrirEditar(record: Paciente) {
    setEditando(record);
    form.setFieldsValue(record);
    setOpen(true);
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
    <div className="p-4 sm:p-8 bg-white rounded-xl shadow-md relative min-h-[60vh]">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
      </div>

      <Table
        dataSource={pacientes}
        loading={loading}
        rowKey="id"
        size="middle"
        locale={{ emptyText: <Empty description="Nenhum paciente cadastrado" /> }}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        columns={[
          { title: "Nome", dataIndex: "nome", sorter: (a, b) => a.nome.localeCompare(b.nome) },
          { title: "Email", dataIndex: "email" },
          { title: "Telefone", dataIndex: "telefone" },
          {
            title: "",
            align: "right" as const,
            width: 100,
            render: (_, record) => (
              <div className="flex gap-2 justify-end">
                <Tooltip title="Editar">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => abrirEditar(record)}
                  />
                </Tooltip>
                <Popconfirm
                  title="Excluir paciente?"
                  onConfirm={() => deletar(record.id)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Tooltip title="Excluir">
                    <Button icon={<DeleteOutlined />} size="small" danger />
                  </Tooltip>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        tooltip={<div>Novo Paciente</div>}
        onClick={abrirNovo}
        style={{ right: 32, bottom: 32 }}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSalvar}
        title={editando ? "Editar Paciente" : "Novo Paciente"}
        centered
        okText={editando ? "Salvar" : "Criar"}
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <PacienteForm initial={editando ?? undefined} />
        </Form>
      </Modal>
    </div>
  );
}
