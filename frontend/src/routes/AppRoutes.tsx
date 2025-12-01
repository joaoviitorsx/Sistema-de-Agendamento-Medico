import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutPaciente } from '@/layouts/LayoutPaciente';
import { LayoutMedico } from '@/components/LayoutMedicoAntd';

// Páginas Paciente
import { SelecionarPaciente } from '@/pages/paciente/SelecionarPaciente';
import { HomePaciente } from '@/pages/paciente/HomePaciente';
import { AgendarConsulta } from '@/pages/paciente/AgendarConsulta';
import { ConsultasPaciente } from '@/pages/paciente/ConsultasPaciente';

// Páginas Médico/Admin
import { DashboardMedico } from '@/pages/medico/DashboardMedico';
import { Pacientes, NovoPaciente, EditarPaciente } from '@/pages/medico/Pacientes';
import { Medicos } from '@/pages/medico/Medicos';
import { NovoMedico, EditarMedico } from '@/pages/medico/MedicoForm';
import { Consultas } from '@/pages/medico/Consultas';
import { Horarios, NovoHorario, EditarHorario } from '@/pages/medico/Horarios';
import { Logs } from '@/pages/medico/Logs';
import { Relatorios } from '@/pages/medico/Relatorios';
import { Backup } from '@/pages/medico/Backup';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect raiz para seleção de paciente */}
        <Route path="/" element={<SelecionarPaciente />} />

        {/* Rotas Paciente */}
        <Route
          path="/paciente/:pacienteId/*"
          element={
            <LayoutPaciente>
              <Routes>
                <Route path="home" element={<HomePaciente />} />
                <Route path="agendar" element={<AgendarConsulta />} />
                <Route path="consultas" element={<ConsultasPaciente />} />
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </LayoutPaciente>
          }
        />

        {/* Rotas Médico/Admin */}
        <Route path="/medico" element={<LayoutMedico />}>
          <Route index element={<Navigate to="/medico/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardMedico />} />
          
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="pacientes/novo" element={<NovoPaciente />} />
          <Route path="pacientes/editar/:id" element={<EditarPaciente />} />
          
          <Route path="medicos" element={<Medicos />} />
          <Route path="medicos/novo" element={<NovoMedico />} />
          <Route path="medicos/editar/:id" element={<EditarMedico />} />
          
          <Route path="consultas" element={<Consultas />} />
          
          <Route path="horarios" element={<Horarios />} />
          <Route path="horarios/novo" element={<NovoHorario />} />
          <Route path="horarios/editar/:id" element={<EditarHorario />} />
          
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="logs" element={<Logs />} />
          <Route path="backup" element={<Backup />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/paciente/1/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
