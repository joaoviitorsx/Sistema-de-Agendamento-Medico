import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './LayoutMedico.css';

interface LayoutMedicoProps {
  children: ReactNode;
}

export const LayoutMedico = ({ children }: LayoutMedicoProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    { path: '/medico/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/medico/pacientes', label: 'Pacientes', icon: Users },
    { path: '/medico/medicos', label: 'Médicos', icon: Stethoscope },
    { path: '/medico/consultas', label: 'Consultas', icon: Calendar },
    { path: '/medico/horarios', label: 'Horários', icon: Clock },
    { path: '/medico/logs', label: 'Logs', icon: FileText },
  ];

  return (
    <div className="layout-medico">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Stethoscope size={28} className="brand-icon" />
            {sidebarOpen && <span className="brand-text">MediCare Admin</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={20} className="link-icon" />
                {sidebarOpen && <span className="link-text">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? 'Recolher menu' : 'Expandir menu'}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </aside>

      <div className={`main-wrapper ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="header-medico">
          <h1 className="header-title">Sistema de Agendamento Médico</h1>
        </header>

        <main className="main-medico">
          {children}
        </main>
      </div>
    </div>
  );
};
