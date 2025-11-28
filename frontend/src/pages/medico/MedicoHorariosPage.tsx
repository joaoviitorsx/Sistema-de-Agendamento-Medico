import { useState } from "react";
import { Card, Select, Button, Table, Modal, Form, TimePicker, message, Popconfirm, Tag, Empty, Space, Typography, Divider } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useMedicos } from "../../hooks/useMedicos";
import { useHorarios } from "../../hooks/useHorarios";
import type { HorarioCreate } from "../../api/horarios";
import type { Horario } from "../../api/horarios";

const diasSemana = [
    { label: "Segunda", value: "segunda" },
    { label: "Terça", value: "terca" },
    { label: "Quarta", value: "quarta" },
    { label: "Quinta", value: "quinta" },
    { label: "Sexta", value: "sexta" },
    { label: "Sábado", value: "sabado" },
    { label: "Domingo", value: "domingo" },
];

export default function MedicoHorariosPage() {
    const [medicoId, setMedicoId] = useState<string | undefined>();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Horario | null>(null);
    const [form] = Form.useForm();

    const { medicos, loading: loadingMedicos } = useMedicos();
    const { horarios, isLoading, create, update, remove } = useHorarios(medicoId);

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record: Horario) => {
        setEditing(record);
        form.setFieldsValue({
            dia_semana: record.dia_semana,
            hora_inicio: dayjs(record.hora_inicio, "HH:mm"),
            hora_fim: dayjs(record.hora_fim, "HH:mm"),
        });
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await remove(id);
            message.success("Horário removido com sucesso");
        } catch {
            message.error("Erro ao remover horário");
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (values.hora_inicio.isAfter(values.hora_fim)) {
                message.error("Hora de início deve ser antes da hora de fim");
                return;
            }
            const horario: HorarioCreate = {
                dia_semana: values.dia_semana,
                hora_inicio: values.hora_inicio.format("HH:mm"),
                hora_fim: values.hora_fim.format("HH:mm"),
            };
            if (editing) {
                await update({ horarioId: editing.id, horario });
                message.success("Horário atualizado");
            } else {
                if (!medicoId) return;
                await create({ medicoId, horario });
                message.success("Horário criado");
            }
            setModalOpen(false);
        } catch {
            // validation error
        }
    };

    const columns = [
        {
            title: "Dia da Semana",
            dataIndex: "dia_semana",
            key: "dia_semana",
            render: (dia: string) => {
                const found = diasSemana.find((d) => d.value === dia);
                return <Tag color="blue">{found?.label || dia}</Tag>;
            },
        },
        {
            title: "Início",
            dataIndex: "hora_inicio",
            key: "hora_inicio",
            render: (hora: string) => (
                <Tag icon={<ClockCircleOutlined />} color="green">
                    {hora}
                </Tag>
            ),
        },
        {
            title: "Fim",
            dataIndex: "hora_fim",
            key: "hora_fim",
            render: (hora: string) => (
                <Tag icon={<ClockCircleOutlined />} color="red">
                    {hora}
                </Tag>
            ),
        },
        {
            title: "Ações",
            key: "acoes",
            render: (_: unknown, record: Horario) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="Tem certeza que deseja remover?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>
                            Remover
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title={
                <Space>
                    <UserOutlined />
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Horários dos Médicos
                    </Typography.Title>
                </Space>
            }
            style={{ maxWidth: 1600, margin: "32px auto", boxShadow: "0 2px 8px #f0f1f2" }}
        >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Space>
                    <span>Selecione o médico:</span>
                    <Select
                        style={{ width: 250 }}
                        loading={loadingMedicos}
                        value={medicoId}
                        onChange={setMedicoId}
                        placeholder="Selecione um médico"
                        options={medicos.map((m) => ({ label: m.nome, value: m.id }))}
                        showSearch
                        optionFilterProp="label"
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        disabled={!medicoId}
                    >
                        Novo Horário
                    </Button>
                </Space>
                <Divider style={{ margin: 0 }} />
                <Table
                    dataSource={horarios}
                    columns={columns}
                    rowKey="id"
                    loading={isLoading}
                    locale={{
                        emptyText: medicoId ? (
                            <Empty
                                description="Nenhum horário cadastrado."
                                imageStyle={{ height: 60 }}
                            />
                        ) : (
                            <Empty
                                description="Selecione um médico"
                                imageStyle={{ height: 60 }}
                            />
                        ),
                    }}
                    pagination={{ placement: ["bottomCenter"] }}
                    bordered
                    size="middle"
                />
            </Space>
            <Modal
                title={editing ? "Editar Horário" : "Novo Horário"}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={() => setModalOpen(false)}
                destroyOnClose
                okText={editing ? "Salvar" : "Criar"}
                cancelText="Cancelar"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Dia da Semana"
                        name="dia_semana"
                        rules={[{ required: true, message: "Selecione o dia da semana" }]}
                    >
                        <Select options={diasSemana} placeholder="Selecione" />
                    </Form.Item>
                    <Form.Item
                        label="Hora de Início"
                        name="hora_inicio"
                        rules={[{ required: true, message: "Informe a hora de início" }]}
                    >
                        <TimePicker format="HH:mm" minuteStep={15} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Hora de Fim"
                        name="hora_fim"
                        rules={[{ required: true, message: "Informe a hora de fim" }]}
                    >
                        <TimePicker format="HH:mm" minuteStep={15} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
