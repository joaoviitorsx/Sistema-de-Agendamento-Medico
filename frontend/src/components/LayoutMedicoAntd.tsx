import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Tooltip} from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, MedicineBoxOutlined, CalendarOutlined, ClockCircleOutlined, FileTextOutlined, DashboardOutlined, SaveOutlined, FileSearchOutlined } from '@ant-design/icons';
import './LayoutMedicoAntd.css';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export const LayoutMedico = () => {
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
            key: '/medico/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/medico/dashboard'),
        },
        { key: 'divider-1', type: 'divider' },
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
        { key: 'divider-2', type: 'divider' },
        {
            key: '/medico/relatorios',
            icon: <FileSearchOutlined />,
            label: 'Relatórios',
            onClick: () => navigate('/medico/relatorios'),
        },
        {
            key: '/medico/logs',
            icon: <FileTextOutlined />,
            label: 'Logs do Sistema',
            onClick: () => navigate('/medico/logs'),
        },
        {
            key: '/medico/backup',
            icon: <SaveOutlined />,
            label: 'Backup',
            onClick: () => navigate('/medico/backup'),
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={240}
                className="shadow-medical-lg"
                style={{
                    overflow: 'hidden',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div
                    className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20"
                    style={{ height: 'calc(100vh - 0px)' }}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        className="!bg-transparent !border-0"
                        theme="dark"
                        style={{
                            backgroundColor: 'transparent',
                            padding: collapsed ? '8px 4px' : '8px 12px',
                        }}
                        inlineIndent={collapsed ? 0 : 20}
                    />
                </div>
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <Header
                    className="!bg-white shadow-sm !px-6 flex items-center justify-between sticky top-0 z-10 border-b border-gray-200"
                    style={{ borderBottom: '1px solid #f0f0f0', minHeight: 56 }}
                >
                    <div className="flex items-center w-full gap-4">
                        <Tooltip title={collapsed ? 'Expandir menu' : 'Recolher menu'} placement="right">
                            <button
                                onClick={toggleCollapsed}
                                className="w-10 h-10 flex items-center justify-center rounded transition-colors"
                                style={{ fontSize: 22, border: 'none', outline: 'none', boxShadow: 'none', background: 'none' }}
                                aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
                                type="button"
                            >
                                {collapsed ? (
                                    // Lucide: Menu icon (open)
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="4" y1="6" x2="20" y2="6" />
                                        <line x1="4" y1="12" x2="20" y2="12" />
                                        <line x1="4" y1="18" x2="20" y2="18" />
                                    </svg>
                                ) : (
                                    // Lucide: PanelLeftClose icon (close)
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="18" x="3" y="3" rx="2" />
                                        <path d="M9 3v18" />
                                        <path d="m16 15-3-3 3-3" />
                                    </svg>
                                )}
                            </button>
                        </Tooltip>
                        <div className="flex-1 flex justify-center">
                            <span className="text-xl font-bold text-[#1976d2] tracking-wide select-none ml-4">
                                Sistema de Agendamento Médico
                            </span>
                        </div>
                    </div>
                </Header>

                <Content className="p-5 bg-gray-50 min-h-[calc(100vh-56px)]">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};
