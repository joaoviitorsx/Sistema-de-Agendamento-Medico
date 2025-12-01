import { ReactNode } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { User, Calendar, Home } from 'lucide-react';
import './LayoutPaciente.css';

interface LayoutPacienteProps {
  children: ReactNode;
}

export const LayoutPaciente = ({ children }: LayoutPacienteProps) => {
  const location = useLocation();
  const { pacienteId } = useParams<{ pacienteId: string }>();

  const isActive = (path: string) => location.pathname === `/paciente/${pacienteId}/${path}`;

  return (
    <div className="layout-paciente">
      <nav className="nav-paciente">
        <div className="nav-container">
          <Link to={`/paciente/${pacienteId}/home`} className="nav-brand">
            <Calendar size={28} />
            <span>Sistema de Agendamento Médico</span>
          </Link>
          
          <div className="nav-links">
            <Link
              to={`/paciente/${pacienteId}/home`}
              className={`nav-link ${isActive('home') ? 'active' : ''}`}
            >
              <Home size={20} />
              <span>Início</span>
            </Link>
            
            <Link
              to={`/paciente/${pacienteId}/agendar`}
              className={`nav-link ${isActive('agendar') ? 'active' : ''}`}
            >
              <Calendar size={20} />
              <span>Agendar</span>
            </Link>
            
            <Link
              to={`/paciente/${pacienteId}/consultas`}
              className={`nav-link ${isActive('consultas') ? 'active' : ''}`}
            >
              <User size={20} />
              <span>Minhas Consultas</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-paciente">
        {children}
      </main>

      <footer className="footer-paciente">
        <p>&copy; 2025 Sistema de Agendamento Médico - Projeto SO</p>
      </footer>
    </div>
  );
};
