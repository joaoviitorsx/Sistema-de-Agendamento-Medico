import { Button, Table } from "antd";
import { useBackup } from "../hooks/useBackup";
import { BackupAPI } from "../api/backup";

export default function BackupPage() {
  const { arquivos, loading, executar } = useBackup();

  const columns = [
    {
      title: "Arquivo",
      dataIndex: "nome",
      key: "nome",
      render: (nome: string) => (
        <span className="font-medium">{nome}</span>
      ),
    },
    {
      title: "Download",
      key: "download",
      render: (nome: string) => (
        <a
          className="text-blue-600 hover:underline"
          href={BackupAPI.downloadUrl(nome)}
          download
        >
          Baixar
        </a>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Backups do Sistema</h2>

        <Button type="primary" onClick={executar}>
          Executar Backup Agora
        </Button>
      </div>

      <Table
        loading={loading}
        dataSource={arquivos}
        rowKey={(n) => n}
        columns={columns}
        pagination={false}
      />
    </div>
  );
}
