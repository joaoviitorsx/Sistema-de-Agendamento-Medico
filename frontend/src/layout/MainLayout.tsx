import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const location = useLocation();

  return (
    <Layout className="min-h-screen">
      <Sider collapsible>
        <div className="text-center text-white py-5 font-bold text-xl">
          Sistema SO
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            { key: "/agenda", label: <Link to="/agenda">Agenda</Link> },
            { key: "/pacientes", label: <Link to="/pacientes">Pacientes</Link> },
            { key: "/medicos", label: <Link to="/medicos">Médicos</Link> },
            { key: "/consultas", label: <Link to="/consultas">Consultas</Link> },
            { key: "/logs", label: <Link to="/logs">Logs</Link> },
            { key: "/relatorios", label: <Link to="/relatorios">Relatórios</Link> },
            { key: "/backup", label: <Link to="/backup">Backup</Link> },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm px-6 text-lg font-semibold">
          Sistema de Agendamento – SO
        </Header>

        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
