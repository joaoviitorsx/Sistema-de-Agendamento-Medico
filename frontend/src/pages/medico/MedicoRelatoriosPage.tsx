
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Table,
  Space,
  message,
  Empty,
  Typography,
  Tooltip,
  Select,
  DatePicker,
  Form,
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { FilePdfOutlined, ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { RelatoriosAPI } from "../../api/relatorio";
import { MedicosAPI } from "../../api/medicos";
import type { Medico } from "../../types/Medico";

const { Text } = Typography;

interface RelatorioItem {
  nome: string;
}

interface FiltrosRelatorio {
  medico_id?: string;
  periodo?: [Dayjs, Dayjs];
}

export default function MedicoRelatoriosPage() {

  const [relatorios, setRelatorios] = useState<RelatorioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({});
  // Carrega médicos para o filtro
  useEffect(() => {
    MedicosAPI.listar().then(setMedicos);
  }, []);

  // Carrega a lista de relatórios
  const fetchRelatorios = async () => {
    try {
      setLoading(true);
      const arquivos = await RelatoriosAPI.listar();
      setRelatorios((arquivos || []).map((nome: string) => ({ nome })));
    } catch (err) {
      message.error("Erro ao carregar relatórios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorios();
  }, []);

  // Gera um novo relatório
  const gerarRelatorio = async () => {
    try {
      setGerando(true);
      if (!filtros.medico_id || !filtros.periodo) {
        message.warning("Selecione o médico e o período!");
        setGerando(false);
        return;
      }
      const [inicio, fim] = filtros.periodo;
      const payload = {
        medico_id: filtros.medico_id,
        periodo_inicio: inicio.startOf("day").toISOString(),
        periodo_fim: fim.endOf("day").toISOString(),
      };
      await RelatoriosAPI.gerar(payload);
      message.success("Relatório em processamento!");
      setTimeout(() => {
        fetchRelatorios();
      }, 2000);
    } catch (err) {
      message.error("Erro ao gerar relatório.");
    } finally {
      setGerando(false);
    }
  };

  // Download
  const baixarRelatorio = (nome: string) => {
    window.open(RelatoriosAPI.downloadUrl(nome), "_blank");
  };

  const columns = [
    {
      title: "Arquivo",
      dataIndex: "nome",
      key: "nome",
      render: (nome: string) => (
        <Space>
          <FilePdfOutlined style={{ fontSize: 18, color: "#c41d7f" }} />
          <Text>{nome}</Text>
        </Space>
      ),
    },
    {
      title: "Ações",
      key: "acoes",
      align: "right" as const,
      render: (_: any, record: RelatorioItem) => (
        <Space>
          <Tooltip title="Baixar PDF">
            <Button
              icon={<DownloadOutlined />}
              type="primary"
              onClick={() => baixarRelatorio(record.nome)}
            >
              Download
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Relatórios do Médico"
      className="max-w-4xl mx-auto mt-8"
      variant="borderless"
    >
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="Médico">
          <Select
            showSearch
            style={{ minWidth: 200 }}
            placeholder="Selecione o médico"
            value={filtros.medico_id}
            onChange={medico_id => setFiltros(f => ({ ...f, medico_id }))}
            optionFilterProp="children"
          >
            {medicos.map(m => (
              <Select.Option key={m.id} value={m.id}>{m.nome}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Período">
          <DatePicker.RangePicker
            value={filtros.periodo}
            onChange={periodo => setFiltros(f => ({ ...f, periodo: periodo as [Dayjs, Dayjs] }))}
            format="DD/MM/YYYY"
            allowClear={false}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={gerarRelatorio}
            loading={gerando}
          >
            Gerar novo relatório
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchRelatorios}
            loading={loading}
          >
            Atualizar
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={relatorios}
        columns={columns}
        rowKey="nome"
        loading={loading}
        locale={{
          emptyText: <Empty description="Nenhum relatório disponível." />,
        }}
        pagination={{ position: ["bottomCenter"] }}
      />
    </Card>
  );
}
