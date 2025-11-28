import { useState } from "react";
import type { Medico } from "../../types/Medico";
import { Button, Modal, Form, Table, Tooltip, FloatButton, Empty } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMedicos } from "../../hooks/useMedicos";
import MedicoForm from "../../components/forms/MedicoForm";

export default function MedicosPage() {
    const { medicos, loading, criar, atualizar, deletar } = useMedicos();
    const [open, setOpen] = useState(false);
    const [editando, setEditando] = useState<Medico | null>(null);
    const [form] = Form.useForm();

    // Novo estado para modal de exclusão
    const [excluirModalOpen, setExcluirModalOpen] = useState(false);
    const [medicoParaExcluir, setMedicoParaExcluir] = useState<Medico | null>(null);

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

    // Funções para exclusão
    function abrirExcluir(record: Medico) {
        setMedicoParaExcluir(record);
        setExcluirModalOpen(true);
    }

    function confirmarExcluir() {
        if (medicoParaExcluir) {
            deletar(medicoParaExcluir.id);
        }
        setExcluirModalOpen(false);
        setMedicoParaExcluir(null);
    }

    function cancelarExcluir() {
        setExcluirModalOpen(false);
        setMedicoParaExcluir(null);
    }

    return (
        <div className="p-4 sm:p-8 bg-white rounded-xl shadow-md relative min-h-[60vh]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-gray-800">Lista de Médicos</h2>
                    <p className="text-gray-500 text-sm">Gerencie todos os médicos cadastrados no sistema.</p>
                </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
                <Table
                    dataSource={medicos}
                    loading={loading}
                    rowKey="id"
                    size="middle"
                    locale={{
                        emptyText: (
                            <Empty
                                description={
                                    <span className="text-gray-500">
                                        Nenhum médico cadastrado
                                    </span>
                                }
                                imageStyle={{ height: 60 }}
                            />
                        ),
                    }}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        position: ["bottomCenter"],
                        className: "custom-pagination",
                    }}
                    bordered
                    className="medicos-table"
                    columns={[
                        {
                            title: <span className="font-semibold text-gray-700">Nome</span>,
                            dataIndex: "nome",
                            sorter: (a, b) => a.nome.localeCompare(b.nome),
                            render: (text: string) => (
                                <span className="font-medium text-gray-900">{text}</span>
                            ),
                        },
                        {
                            title: <span className="font-semibold text-gray-700">Especialidade</span>,
                            dataIndex: "especialidade",
                            render: (text: string) => (
                                <span className="text-gray-700">{text}</span>
                            ),
                        },
                        {
                            title: <span className="font-semibold text-gray-700">CRM</span>,
                            dataIndex: "crm",
                            render: (text: string) => (
                                <span className="text-gray-700">{text}</span>
                            ),
                        },
                        {
                            title: "",
                            align: "right" as const,
                            width: 220,
                            render: (_, record) => (
                                <div className="flex justify-end">
                                    <Tooltip title="Editar" placement="top">
                                        <Button
                                            icon={<EditOutlined />}
                                            size="small"
                                            type="default"
                                            className="!bg-blue-50 bg-blue-50 !border-blue-500 !text-blue-600 hover:!bg-blue-100 !w-8 !h-8 flex items-center justify-center mr-2"
                                            onClick={() => abrirEditar(record)}
                                            aria-label="Editar médico"
                                        />
                                    </Tooltip>
                                    <Tooltip title="Excluir" placement="top">
                                        <Button
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            danger
                                            className="hover:!bg-red-50 w-8 h-8 flex items-center justify-center"
                                            onClick={() => abrirExcluir(record)}
                                            aria-label="Excluir médico"
                                        />
                                    </Tooltip>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <FloatButton
                icon={<PlusOutlined />}
                type="primary"
                tooltip={<div>Novo Médico</div>}
                onClick={abrirNovo}
                style={{ right: 32, bottom: 32, zIndex: 100 }}
            />

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                onOk={onSalvar}
                title={editando ? "Editar Médico" : "Novo Médico"}
                centered
                okText={editando ? "Salvar" : "Criar"}
                cancelText="Cancelar"
                destroyOnClose
            >
                <Form form={form} layout="vertical" autoComplete="off">
                    <MedicoForm initial={editando ?? undefined} />
                </Form>
            </Modal>

            <Modal
                open={excluirModalOpen}
                onCancel={cancelarExcluir}
                onOk={confirmarExcluir}
                title="Excluir médico"
                okText="Excluir"
                okButtonProps={{ danger: true }}
                cancelText="Cancelar"
                centered
            >
                <p>
                    Tem certeza que deseja excluir o médico{" "}
                    <b>{medicoParaExcluir?.nome}</b>?
                </p>
            </Modal>
        </div>
    );
}
