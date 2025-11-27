import { useState } from "react";
import type { Medico } from "../../types/Medico";
import { Button, Modal, Form, Table, Popconfirm, Tooltip, FloatButton, Empty } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMedicos } from "../../hooks/useMedicos";
import MedicoForm from "../../components/forms/MedicoForm";

export default function MedicosPage() {
  const { medicos, loading, criar, atualizar, deletar } = useMedicos();
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Medico | null>(null);
  const [form] = Form.useForm();

  function abrirNovo() {
    setEditando(null);
    form.resetFields();
    setOpen(true);
  }

  function abrirEditar(record: Medico) {
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
        <h2 className="text-2xl font-bold tracking-tight">Médicos</h2>
      </div>

      <Table
        dataSource={medicos}
        loading={loading}
        rowKey="id"
        size="middle"
        locale={{ emptyText: <Empty description="Nenhum médico cadastrado" /> }}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        columns={[
          { title: "Nome", dataIndex: "nome", sorter: (a, b) => a.nome.localeCompare(b.nome) },
          { title: "Especialidade", dataIndex: "especialidade" },
          { title: "CRM", dataIndex: "crm" },
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
                  title="Excluir médico?"
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
        tooltip={<div>Novo Médico</div>}
        onClick={abrirNovo}
        style={{ right: 32, bottom: 32 }}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSalvar}
        title={editando ? "Editar Médico" : "Novo Médico"}
        centered
        okText={editando ? "Salvar" : "Criar"}
        cancelText="Cancelar"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <MedicoForm initial={editando ?? undefined} />
        </Form>
      </Modal>
    </div>
  );
}