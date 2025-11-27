import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import AgendaPage from "../pages/AgendaPage";
import LogsPage from "../pages/LogsPage";
import PacientesPage from "../pages/PacientesPage";
import MedicosPage from "../pages/MedicosPage";
import ConsultasPage from "../pages/ConsultasPage";
import RelatorioPage from "../pages/RelatorioPage";
import BackupPage from "../pages/BackupPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/" element={<PacientesPage />} />
        <Route path="/medicos" element={<MedicosPage />} />
        <Route path="/consultas" element={<ConsultasPage />} />
        <Route path="/relatorios" element={<RelatorioPage />} />
        <Route path="/backup" element={<BackupPage />} />
      </Route>
    </Routes>
  );
}
