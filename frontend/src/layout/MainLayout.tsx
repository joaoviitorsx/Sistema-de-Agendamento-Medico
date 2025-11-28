import { Layout, Menu, Avatar, Typography } from "antd";
import {  UserOutlined,  TeamOutlined,  UserSwitchOutlined } from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function MainLayout() {
  const location = useLocation();

  const selectedKey =
    location.pathname === "/" ? "/paciente" : location.pathname;

  const pacienteMenu = [
    {
      key: "/paciente",
      icon: <TeamOutlined />,
      label: <Link to="/paciente">Pacientes</Link>,
    },
    {
      key: "/paciente/agendar",
      icon: <UserOutlined />,
      label: <Link to="/paciente/agendar">Agendar Consulta</Link>,
    },
    {
      key: "/paciente/historico",
      icon: <UserSwitchOutlined />,
      label: <Link to="/paciente/historico">Histórico de Consultas</Link>,
    }
  ];

  const medicoMenu = [
    {
      key: "/medico",
      icon: <UserSwitchOutlined />,
      label: <Link to="/medico">Médicos</Link>,
    },
    {
      key: "/medico/horarios",
      icon: <TeamOutlined />,
      label: <Link to="/medico/horarios">Horários</Link>,
    },
    {
      key: "/medico/consultas",
      icon: <UserOutlined />,
      label: <Link to="/medico/consultas">Consultas</Link>,
    },
    {
      key: "/medico/relatorios",
      icon: <UserSwitchOutlined />,
      label: <Link to="/medico/relatorios">Relatórios</Link>,
    },
    {
      key: "/medico/logs",
      icon: <TeamOutlined />,
      label: <Link to="/medico/logs">Logs</Link>,
    }
  ];

  const isPaciente = location.pathname.startsWith("/paciente");
  const isMedico = location.pathname.startsWith("/medico");

  // escolher qual sidebar usar
  const sidebarMenu = isPaciente ? pacienteMenu : medicoMenu;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        style={{
          background: "#fff",
          boxShadow: "2px 0 8px #f0f1f2",
          minHeight: "100vh",
        }}
      >
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, borderBottom: "1px solid #f0f0f0",}}>
         <div>
          <Title level={4} style={{ margin: 0 }}>
            Sistema
          </Title>
         </div>
        </div>
        <Menu mode="inline" selectedKeys={[selectedKey]} items={sidebarMenu} style={{ borderRight: 0, fontSize: 16, background: "transparent",}}/>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            boxShadow: "0 2px 8px #f0f1f2",
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
            height: 64,
          }}
        >
            <Title level={3} style={{ margin: 0, flex: 1 }}>
            {isPaciente
              ? "Sistema de Agendamento - Paciente"
              : isMedico
              ? "Sistema de Agendamento - Médico"
              : "Sistema de Agendamento"}
            </Title>
          <Avatar style={{ background: "#1890ff" }} icon={<UserOutlined />} />
        </Header>

        <Content style={{ padding: 32, background: "#e7e9ecff" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              minHeight: 360,
              boxShadow: "0 1px 4px rgba(0,21,41,.08)",
              padding: 24,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
