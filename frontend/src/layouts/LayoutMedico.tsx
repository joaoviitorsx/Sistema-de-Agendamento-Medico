import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface LayoutMedicoProps {
  children: React.ReactNode;
}

export const LayoutMedico = ({ children }: LayoutMedicoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    return stored ? JSON.parse(stored) : false;
  });

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const menuItems: MenuItem[] = [
    {
      key: '/medico/pacientes',
      icon: <UserOutlined />,
      label: 'Pacientes',
      onClick: () => navigate('/medico/pacientes'),
    },
    {
      key: '/medico/medicos',
      icon: <MedicineBoxOutlined />,
      label: 'Médicos',
      onClick: () => navigate('/medico/medicos'),
    },
    {
      key: '/medico/consultas',
      icon: <CalendarOutlined />,
      label: 'Consultas',
      onClick: () => navigate('/medico/consultas'),
    },
    {
      key: '/medico/horarios',
      icon: <ClockCircleOutlined />,
      label: 'Horários',
      onClick: () => navigate('/medico/horarios'),
    },
    {
      key: '/medico/logs',
      icon: <FileTextOutlined />,
      label: 'Logs',
      onClick: () => navigate('/medico/logs'),
    },
    {
      key: '/medico/dashboard',
      icon: <BarChartOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/medico/dashboard'),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        className="shadow-medical-lg"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#1565C0',
        }}
      >
        <div className="flex items-center justify-center h-16 text-white font-bold text-xl border-b border-white/10">
          {collapsed ? '🏥' : '🏥 Sistema Médico'}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="!bg-transparent !border-0 mt-4"
          theme="dark"
        />

        <div
          onClick={toggleCollapsed}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 border border-white/20"
          style={{ color: 'white' }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'margin-left 0.2s' }}>
        <Header className="!bg-white shadow-medical !px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-black m-0">
            Sistema de Agendamento Médico
          </h1>
        </Header>

        <Content className="p-6" style={{ background: '#E3F2FD' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
