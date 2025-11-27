import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";


import PacientesPage from "../pages/paciente/PacientesPage";
import PacienteAgendarPage from "../pages/paciente/PacienteAgendarPage";
import PacienteHistoricoPage from "../pages/paciente/PacienteHistoricoPage";

import MedicosPage from "../pages/medico/MedicoPage";
import MedicoHorariosPage from "../pages/medico/MedicoHorariosPage";
import MedicoConsultasPage from "../pages/medico/MedicoConsultasPage";
import MedicoRelatoriosPage from "../pages/medico/MedicoRelatoriosPage";
import MedicoLogsPage from "../pages/medico/MedicoLogsPage";
import MedicoBackupPage from "../pages/medico/MedicoBackupPage";

import NotFound from "../pages/notFound";


export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/paciente" element={<PacientesPage />} />
        <Route path="/paciente/agendar" element={<PacienteAgendarPage />} />
        <Route path="/paciente/historico" element={<PacienteHistoricoPage />} />

        <Route path="/medico" element={<MedicosPage />} />
        <Route path="/medico/horarios" element={<MedicoHorariosPage />} />
        <Route path="/medico/consultas" element={<MedicoConsultasPage />} />
        <Route path="/medico/relatorios" element={<MedicoRelatoriosPage />} />
        <Route path="/medico/logs" element={<MedicoLogsPage />} />
        <Route path="/medico/backup" element={<MedicoBackupPage />} />

        <Route path="/" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
