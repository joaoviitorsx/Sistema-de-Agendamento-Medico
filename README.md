# 🏥 Sistema de Agendamento de Consultas Médicas
### Projeto Fullstack Integrado com Conceitos de Sistemas Operacionais (SO)

---

## 📌 Visão Geral

Este projeto implementa um **sistema completo de agendamento médico** com arquitetura fullstack, utilizando:

### 🔷 Backend (FastAPI + Python 3.12)
- **Arquitetura MVC / Modular**
- **Persistência utilizando arquivos JSON com locks**
- **Fila de tarefas + worker em thread (concorrência)**
- **Atualizações em tempo real via SSE (Server-Sent Events)**
- **Backup automático e manual do sistema (ZIP)**
- **Geração de relatórios em PDF**
- **Sistema de gerenciamento de horários e agenda**
- **Controle de estado de slots (disponível/reservado/ocupado)**
- **Logs estruturados com streaming**

### 🔷 Frontend (React + TypeScript + Vite)
- **React 18.2** com TypeScript strict mode
- **Gerenciamento de estado com Zustand**
- **React Router** para navegação multi-paciente
- **Ant Design** + componentes customizados
- **Real-time updates** via SSE (EventSource API)
- **UI responsiva** com Tailwind CSS
- **Axios** para comunicação com API
- **Date-fns** para manipulação de datas
- **React Hot Toast** para notificações

### 🔷 Conceitos de Sistemas Operacionais Aplicados
- Processos e Threads (Worker dedicado)
- Concorrência e Race Conditions (Locks e sincronização)
- Escalonamento e Fila Producer/Consumer
- Sistema de Arquivos (JSON persistence com locks)
- Chamadas de Sistema (syscalls: open, write, read, fsync)
- I/O Bound vs CPU Bound (PDF/Backup assíncrono)
- Gerência de Memória (Cache e otimização)
- Sincronização (RLock, Queue, file locks)

---

## 📂 Estrutura de Diretórios

```text
Sistema-de-Agendamento-Medico/
│
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   │   ├── agenda_controller.py       ← Gerenciamento de slots e reservas
│   │   │   ├── backup_controller.py       ← Backup manual do sistema
│   │   │   ├── consulta_controller.py     ← CRUD de consultas
│   │   │   ├── horario_controller.py      ← Gerenciamento de horários
│   │   │   ├── medico_controller.py       ← CRUD de médicos
│   │   │   ├── paciente_controller.py     ← CRUD de pacientes
│   │   │   ├── report_controller.py       ← Geração e download de PDFs
│   │   │   └── sistema_controller.py      ← Logs e SSE streams
│   │   │
│   │   ├── core/
│   │   │   ├── config.py                  ← Configurações globais
│   │   │   └── log.py                     ← Sistema de logging
│   │   │
│   │   ├── infra/
│   │   │   ├── file_locks.py              ← Lock de arquivos (Windows/Linux)
│   │   │   ├── file_storage.py            ← Persistência JSON
│   │   │   ├── schedule_state.py          ← Estado da agenda (RLock)
│   │   │   ├── sse.py                     ← Broker SSE
│   │   │   └── task_queue.py              ← Fila de tarefas + worker
│   │   │
│   │   ├── models/
│   │   │   ├── consulta_model.py
│   │   │   ├── horario_model.py
│   │   │   ├── medico_model.py
│   │   │   └── paciente_model.py
│   │   │
│   │   ├── repositories/
│   │   │   ├── consulta_repository.py
│   │   │   ├── horario_repository.py
│   │   │   ├── medico_repository.py
│   │   │   └── paciente_repository.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── consulta_schema.py
│   │   │   ├── horario_schema.py
│   │   │   ├── medico_schema.py
│   │   │   ├── paciente_schema.py
│   │   │   └── task_schema.py
│   │   │
│   │   ├── services/
│   │   │   ├── backup_service.py          ← Backup ZIP
│   │   │   ├── consulta_service.py        ← Lógica de consultas
│   │   │   ├── event_service.py           ← Publicação SSE
│   │   │   ├── horario_service.py         ← Lógica de horários
│   │   │   ├── log_service.py             ← Serviço de logs
│   │   │   ├── medico_service.py          ← Lógica de médicos
│   │   │   ├── paciente_service.py        ← Lógica de pacientes
│   │   │   ├── relatorio_service.py       ← Geração de PDF
│   │   │   └── task_service.py            ← Processamento de tarefas
│   │   │
│   │   ├── seeds/
│   │   │   └── data.py                    ← Dados iniciais
│   │   │
│   │   ├── banco/
│   │   │   ├── consultas.json
│   │   │   ├── horarios.json
│   │   │   ├── medicos.json
│   │   │   └── pacientes.json
│   │   │
│   │   ├── logs/                          ← Logs do sistema
│   │   ├── reports/                       ← PDFs gerados
│   │   └── main.py                        ← Entry point FastAPI
│   │
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── agendaApi.ts               ← Chamadas de agenda/slots
    │   │   ├── axios.ts                   ← Configuração Axios
    │   │   ├── consultasApi.ts
    │   │   ├── horariosApi.ts
    │   │   ├── logsApi.ts
    │   │   ├── medicosApi.ts
    │   │   └── pacientesApi.ts
    │   │
    │   ├── components/
    │   │   ├── domain/
    │   │   │   ├── SlotSelector.tsx       ← Seletor visual de horários
    │   │   │   └── SlotSelector.css
    │   │   └── ui/
    │   │       ├── Button.tsx
    │   │       ├── Card.tsx
    │   │       ├── Input.tsx
    │   │       ├── Modal.tsx
    │   │       ├── Select.tsx
    │   │       └── Table.tsx
    │   │
    │   ├── layouts/
    │   │   ├── LayoutMedico.tsx
    │   │   └── LayoutPaciente.tsx
    │   │
    │   ├── pages/
    │   │   ├── medico/
    │   │   │   ├── Backup.tsx
    │   │   │   ├── Consultas.tsx
    │   │   │   ├── DashboardMedico.tsx
    │   │   │   ├── HorarioForm.tsx
    │   │   │   ├── Horarios.tsx
    │   │   │   ├── Logs.tsx
    │   │   │   ├── MedicoForm.tsx
    │   │   │   ├── Medicos.tsx
    │   │   │   ├── PacienteForm.tsx
    │   │   │   ├── Pacientes.tsx
    │   │   │   └── Relatorios.tsx
    │   │   └── paciente/
    │   │       ├── AgendarConsulta.tsx    ← Fluxo de agendamento
    │   │       ├── ConsultasPaciente.tsx  ← Minhas consultas
    │   │       └── HomePaciente.tsx
    │   │
    │   ├── routes/
    │   │   └── AppRoutes.tsx              ← Rotas + params dinâmicos
    │   │
    │   ├── store/
    │   │   ├── useAgendaStore.ts          ← State + SSE connection
    │   │   ├── useConsultaStore.ts
    │   │   ├── useHorarioStore.ts
    │   │   ├── useMedicoStore.ts
    │   │   └── usePacienteStore.ts
    │   │
    │   ├── styles/
    │   │   └── global.css
    │   │
    │   ├── theme/
    │   │   └── antdTheme.ts               ← Tema customizado Ant Design
    │   │
    │   ├── types/
    │   │   └── index.ts                   ← TypeScript types
    │   │
    │   └── main.tsx
    │
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── tailwind.config.js
```

---

## 🚀 Como Executar o Backend

1️⃣ **Criar ambiente virtual**

```bash
python -m venv venv
```

2️⃣ **Ativar ambiente**

- **Windows (PowerShell):**
    ```powershell
    venv\Scripts\activate
    ```
- **Linux/macOS (Bash):**
    ```bash
    source venv/bin/activate
    ```

3️⃣ **Instalar dependências**

```bash
pip install -r requirements.txt
```

4️⃣ **Rodar servidor FastAPI**

```bash
uvicorn app.main:app --reload
```

5️⃣ **Acessar documentação Swagger**

Abra no navegador: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔧 Arquitetura (MVC + Modularização)

| Camada         | Função                                         |
| -------------- | ---------------------------------------------- |
| Controllers    | Endpoints/rotas HTTP                           |
| Services       | Regras de negócio e lógica                     |
| Repositories   | Persistência (JSON)                            |
| Infra          | Locks, fila, SSE, filesystem                   |
| Core           | Configurações globais e logs                   |
| Schemas        | Validação de dados (Pydantic)                  |
| Seeds          | Dados iniciais                                 |

---

## 🧠 Conceitos de Sistemas Operacionais Implementados

1️⃣ **Threads, Processos e Concorrência**  
Worker em thread dedicado processa tarefas no background.  
Padrão Producer/Consumer com `Queue()`.  
Evita race conditions no agendamento.  
Arquivo: `infra/task_queue.py`

2️⃣ **Race Conditions e Sincronização**  
Implementação de `RLock()`.  
Controle seguro de estado da agenda (disponível/reservado/ocupado).  
Arquivo: `infra/schedule_state.py`

3️⃣ **Locks de Arquivos (File Lock)**  
Lock compatível com Windows e Linux.  
Evita corrupção de arquivos ao escrever JSON simultaneamente.  
Arquivo: `infra/file_lock.py`

4️⃣ **Sistema de Arquivos (Filesystem)**  
Persistência em JSON.  
Criação dinâmica de diretórios (`/banco`, `/backups`, `/reports`).  
Uso de `pathlib` + caminhos dependentes de SO.  
Arquivo: `core/config.py`

5️⃣ **I/O Bound – PDF e Backup**  
Geração de PDFs (relatório).  
Criação de ZIP (backup automático/manualmente).  
Executados como tarefas assíncronas via fila.  
Arquivos:  
- `services/relatorio_service.py`  
- `services/backup_service.py`

6️⃣ **Gerência de Memória**  
Cache leve para consultas.  
Liberação explícita de estruturas.  
Evita acumulação de dados em SSE.  
Arquivo: `consulta_service.py`

7️⃣ **Chamadas de Sistema (Syscalls)**  
O projeto utiliza diversas chamadas de sistema:
- `open()`, `write()`, `read()`
- `mkdir()`, `rename()`, `unlink()`
- `fsync()`
- `make_archive()` (ZIP)

Isso demonstra o pipeline completo de I/O controlado.

---

## 📡 Atualizações em Tempo Real — SSE

O sistema envia notificações automáticas:
- `horario_reservado`
- `horario_ocupado`
- `horario_disponivel`

Usado para atualizar o frontend em tempo real (agenda visual).

Arquivos:
- `infra/sse_broker.py`
- `services/event_service.py`
- `controllers/sistema_controller.py`

---

## 🗂 Fila de Tarefas (Task Queue)

Implementação de um worker concorrente usando thread dedicada.

| Tarefa            | Descrição                                      |
| ----------------- | ---------------------------------------------- |
| agendar_consulta  | Agendamento real com verificação de conflito   |
| backup            | Backup ZIP do banco                            |
| gerar_relatorio   | Relatório PDF pela FPDF                        |

---

## 📄 Endpoints Principais

### 👨‍⚕️ Médicos

| Método | Endpoint           |
| ------ | ------------------ |
| GET    | /medicos           |
| POST   | /medicos           |
| PUT    | /medicos/{id}      |
| DELETE | /medicos/{id}      |

### 🧑 Pacientes

| Método | Endpoint           |
| ------ | ------------------ |
| GET    | /pacientes         |
| POST   | /pacientes         |
| PUT    | /pacientes/{id}    |
| DELETE | /pacientes/{id}    |

### 📅 Consultas

| Método | Endpoint                   |
| ------ | -------------------------- |
| GET    | /consultas                 |
| POST   | /consultas/agendar         |  ← agendamento real (fila + reserva) |

### ⚙️ Sistema

| Método | Endpoint                   |
| ------ | -------------------------- |
| GET    | /sistema/logs              |
| GET    | /sistema/logs/stream       |
| GET    | /sistema/agenda/stream     |
| POST   | /sistema/tasks/backup      |
| POST   | /sistema/tasks/relatorio   |

---

## 📊 Fluxo Completo do Agendamento

1. Usuário solicita agendamento.
2. Sistema marca horário como reservado (SSE envia ao frontend).
3. Tarefa entra na fila.
4. Worker valida conflito e persiste no JSON.
5. Horário passa a ocupado.
6. Se falhar, volta a disponível.
7. Médico vê tudo em tempo real no painel SSE.

---

## 🧩 Justificativa Técnica para Banca (Resumo)

- FastAPI facilita assíncrono e modularização.
- Fila de tarefas demonstra concorrência real (SO).
- Locks evitam race conditions.
- JSON simula DB baseado em filesystem.
- Geração de PDF e backup representam I/O bound.
- SSE demonstra comunicação reativa contínua.
- Arquitetura MVC deixa o sistema claro e sustentável.
- Uso explícito de estruturas de sincronização (`Queue`, `RLock`).

## ✔️ Conclusão

Este backend:
- Atende 100% dos requisitos funcionais.
- Implementa todos os conceitos fundamentais de Sistemas Operacionais.
- É modular, limpo e pronto para extensão.
- Suporta escalabilidade via fila de tarefas.
- Fornece streaming em tempo real via SSE.
- Faz backup, gera relatórios e controla concorrência corretamente.

---

## 🎓 Autor

Desenvolvido por **João Vitor**  
Disciplina: Sistemas Operacionais  
Curso: Engenharia da Computação
