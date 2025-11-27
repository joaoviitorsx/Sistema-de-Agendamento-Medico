import { useState } from "react";
import dayjs from "dayjs";
import { Button, Form, Modal, Table, Space, Popconfirm } from "antd";
import { useConsultas } from "../hooks/useConsultas";
import { usePacientes } from "../hooks/usePacientes";
import { useMedicos } from "../hooks/useMedicos";
import ConsultaForm from "../components/forms/ConsultaForm";
import type { Consulta } from "../types/Consulta";

export default function ConsultasPage() {
  const { consultas, loading, criar, atualizar, deletar, agendar } = useConsultas();
  const { pacientes } = usePacientes();
  const { medicos } = useMedicos();

  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Consulta | null>(null);

  const [form] = Form.useForm();

  function novaConsulta() {
    setEditando(null);
    form.resetFields();
    setOpen(true);
  }

  function editar(record: Consulta) {
    setEditando(record);
    form.setFieldsValue({
      ...record,
      inicio: dayjs(record.inicio),
      fim: dayjs(record.fim),
    });
    setOpen(true);
  }

  function salvar() {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        inicio: values.inicio.toISOString(),
        fim: values.fim.toISOString(),
      };

      if (editando) {
        atualizar(editando.id, payload);
      } else {
        criar(payload);
      }

      setOpen(false);
    });
  }

  async function agendarConsulta(record: Consulta) {
    await agendar({ ...record });
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Consultas</h2>
        <Button type="primary" onClick={novaConsulta}>
          Nova Consulta
        </Button>
      </div>

      <Table
        loading={loading}
        rowKey="id"
        dataSource={consultas}
        columns={[
          {
            title: "Paciente",
            dataIndex: "paciente_id",
            render: (id) => pacientes.find((p) => p.id === id)?.nome ?? id,
          },
          {
            title: "Médico",
            dataIndex: "medico_id",
            render: (id) => medicos.find((m) => m.id === id)?.nome ?? id,
          },
          {
            title: "Início",
            dataIndex: "inicio",
            render: (i) => dayjs(i).format("DD/MM/YYYY HH:mm"),
          },
          {
            title: "Fim",
            dataIndex: "fim",
            render: (i) => dayjs(i).format("DD/MM/YYYY HH:mm"),
          },
          {
            title: "Ações",
            render: (_, record) => (
              <Space>
                <Button onClick={() => editar(record)}>Editar</Button>

                {/* Botão de agendamento real (fila + SSE) */}
                <Button type="primary" onClick={() => agendarConsulta(record)}>
                  Agendar
                </Button>

                <Popconfirm
                  title="Excluir consulta?"
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
        onOk={salvar}
        onCancel={() => setOpen(false)}
        title={editando ? "Editar Consulta" : "Nova Consulta"}
      >
        <Form form={form} layout="vertical">
          <ConsultaForm pacientes={pacientes} medicos={medicos} initial={editando ?? undefined} />
        </Form>
      </Modal>
    </div>
  );
}
