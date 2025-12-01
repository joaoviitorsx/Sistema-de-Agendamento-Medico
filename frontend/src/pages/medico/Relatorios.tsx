import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileSearchOutlined, DownloadOutlined, CalendarOutlined, UserOutlined, MedicineBoxOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './CrudPages.css';

export const Relatorios = () => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipoRelatorio, setTipoRelatorio] = useState('consultas');

  return (
    <div className="crud-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1>Relatórios</h1>
          <p className="text-neutral-medium mt-1">Gere relatórios detalhados do sistema</p>
        </div>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      {/* Relatório de Consultas */}
      <Card className="transition-transform hover:scale-105 hover:shadow-xl border border-neutral-light">
        <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
            <CalendarOutlined className="text-2xl text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-black">Consultas</h3>
            <p className="text-xs text-neutral-medium">Relatório completo</p>
          </div>
        </div>
        <p className="text-sm text-neutral-dark mb-6 flex-1">
          Todas as consultas com status, médicos e pacientes.
        </p>
        <Button variant="primary" className="w-full font-semibold py-2">
          <DownloadOutlined className="mr-2" />
          Gerar
        </Button>
        </div>
      </Card>

      {/* Relatório de Pacientes */}
      <Card className="transition-transform hover:scale-105 hover:shadow-xl border border-neutral-light">
        <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-success to-green-700 flex items-center justify-center shadow-md">
            <UserOutlined className="text-2xl text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-black">Pacientes</h3>
            <p className="text-xs text-neutral-medium">Lista completa</p>
          </div>
        </div>
        <p className="text-sm text-neutral-dark mb-6 flex-1">
          Todos os pacientes cadastrados com detalhes.
        </p>
        <Button variant="success" className="w-full font-semibold py-2">
          <DownloadOutlined className="mr-2" />
          Gerar
        </Button>
        </div>
      </Card>

      {/* Relatório de Médicos */}
      <Card className="transition-transform hover:scale-105 hover:shadow-xl border border-neutral-light">
        <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-info to-blue-700 flex items-center justify-center shadow-md">
            <MedicineBoxOutlined className="text-2xl text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-black">Médicos</h3>
            <p className="text-xs text-neutral-medium">Corpo clínico</p>
          </div>
        </div>
        <p className="text-sm text-neutral-dark mb-6 flex-1">
          Médicos, especialidades e horários.
        </p>
        <Button
          variant="primary"
          className="w-full font-semibold py-2"
          style={{ backgroundColor: '#0288D1', borderColor: '#0288D1' }}
        >
          <DownloadOutlined className="mr-2" />
          Gerar
        </Button>
        </div>
      </Card>

      {/* Relatório de Horários */}
      <Card className="transition-transform hover:scale-105 hover:shadow-xl border border-neutral-light">
        <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning to-yellow-600 flex items-center justify-center shadow-md">
            <ClockCircleOutlined className="text-2xl text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-black">Horários</h3>
            <p className="text-xs text-neutral-medium">Agenda médica</p>
          </div>
        </div>
        <p className="text-sm text-neutral-dark mb-6 flex-1">
          Horários disponíveis por médico.
        </p>
        <Button variant="warning" className="w-full font-semibold py-2">
          <DownloadOutlined className="mr-2" />
          Gerar
        </Button>
        </div>
      </Card>
    </div>

      {/* Card de Relatório Personalizado */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <FileSearchOutlined className="text-2xl text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-black">Relatório Personalizado</h2>
              <p className="text-neutral-medium">Configure filtros e gere relatórios customizados</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Tipo de Relatório
              </label>
              <select 
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
              >
                <option value="consultas">Consultas</option>
                <option value="pacientes">Pacientes</option>
                <option value="medicos">Médicos</option>
                <option value="horarios">Horários</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Data Inicial
              </label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Data Final
              </label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" className="flex-1">
              <DownloadOutlined className="mr-2" />
              Gerar Relatório PDF
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
