import { Button, Table } from "antd";
import { useRelatorios } from "../hooks/useRelatorios";
import { RelatoriosAPI } from "../api/relatorio";

export default function RelatoriosPage() {
  const { arquivos, loading, gerarRelatorio } = useRelatorios();

  return (
    <div className="p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Relatórios PDF</h2>

        <Button type="primary" onClick={() => gerarRelatorio({ periodo: "hoje" })}>
          Gerar Relatório de Hoje
        </Button>
      </div>

      <Table
        loading={loading}
        rowKey={(nome) => nome}
        dataSource={arquivos}
        columns={[
          {
            title: "Arquivo",
            dataIndex: "nome",
            render: (_, nome) => <span>{nome}</span>,
          },
          {
            title: "Ações",
            render: (nome) => (
              <a
                href={RelatoriosAPI.downloadUrl(nome)}
                className="text-blue-600 underline"
                download
              >
                Baixar
              </a>
            ),
          },
        ]}
      />
    </div>
  );
}
