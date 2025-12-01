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

## 🚀 Como Executar o Projeto

### 📦 Pré-requisitos

- **Python 3.12+**
- **Node.js 18+** e **npm**
- **Windows/Linux/macOS**

---

### 🔧 Backend (FastAPI)

1️⃣ **Navegar para o diretório backend**

```bash
cd backend
```

2️⃣ **Criar ambiente virtual**

```bash
python -m venv venv
```

3️⃣ **Ativar ambiente**

- **Windows (PowerShell):**
    ```powershell
    venv\Scripts\activate
    ```
- **Linux/macOS (Bash):**
    ```bash
    source venv/bin/activate
    ```

4️⃣ **Instalar dependências**

```bash
pip install -r requirements.txt
```

5️⃣ **Rodar servidor FastAPI**

```bash
uvicorn app.main:app --reload
```

6️⃣ **Acessar documentação Swagger**

Abra no navegador: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### ⚛️ Frontend (React + Vite)

1️⃣ **Navegar para o diretório frontend**

```bash
cd frontend
```

2️⃣ **Instalar dependências**

```bash
npm install
```

3️⃣ **Rodar servidor de desenvolvimento**

```bash
npm run dev
```

4️⃣ **Acessar aplicação**

Abra no navegador: [http://localhost:5173](http://localhost:5173)

---

### 🔀 Acessar diferentes pacientes (teste de concorrência)

- Paciente 1: `http://localhost:5173/paciente/1`
- Paciente 2: `http://localhost:5173/paciente/2`
- Paciente 3: `http://localhost:5173/paciente/3`

Abra em abas diferentes para testar sincronização em tempo real!

---

## 🔧 Arquitetura (MVC + Modularização)

### Backend (FastAPI)

| Camada         | Função                                         |
| -------------- | ---------------------------------------------- |
| **Controllers**    | Endpoints HTTP (rotas REST + SSE)          |
| **Services**       | Regras de negócio e orquestração           |
| **Repositories**   | Camada de persistência (JSON)              |
| **Models**         | Entidades do domínio                       |
| **Schemas**        | Validação Pydantic (In/Out/Update)         |
| **Infra**          | Locks, fila, SSE, file storage             |
| **Core**           | Configurações e logging centralizado       |
| **Seeds**          | Dados iniciais (médicos, horários, etc.)   |

### Frontend (React + TypeScript)

| Camada         | Função                                         |
| -------------- | ---------------------------------------------- |
| **Pages**          | Componentes de rota (telas)                |
| **Components**     | Componentes reutilizáveis (UI + Domain)    |
| **Store**          | Estado global Zustand + SSE                |
| **API**            | Camada de comunicação com backend          |
| **Routes**         | Configuração de rotas React Router         |
| **Types**          | Tipagens TypeScript centralizadas          |
| **Layouts**        | Templates de página (Médico/Paciente)      |

---

## 🧠 Conceitos de Sistemas Operacionais Implementados

### 1️⃣ **Threads, Processos e Concorrência**  
- Worker em **thread dedicada** processa tarefas em background
- Padrão **Producer/Consumer** com `Queue()`
- Evita **race conditions** no agendamento simultâneo
- **Arquivo:** `backend/app/infra/task_queue.py`

### 2️⃣ **Race Conditions e Sincronização**  
- Implementação de `RLock()` para acesso concorrente seguro
- Controle de estado da agenda: `disponível → reservado → ocupado`
- Garantia de **atomicidade** em operações críticas
- **Arquivo:** `backend/app/infra/schedule_state.py`

### 3️⃣ **Locks de Arquivos (File Lock)**  
- Lock compatível com **Windows** e **Linux/macOS**
- Previne **corrupção de dados** em escrita simultânea em JSON
- Implementação de lock exclusivo para operações de I/O
- **Arquivo:** `backend/app/infra/file_locks.py`

### 4️⃣ **Sistema de Arquivos (Filesystem)**  
- Persistência em **JSON** com lock granular
- Criação dinâmica de diretórios (`/banco`, `/logs`, `/reports`)
- Uso de `pathlib` para caminhos portáveis (cross-platform)
- **Arquivo:** `backend/app/core/config.py`

### 5️⃣ **I/O Bound – PDF e Backup**  
- Geração assíncrona de **relatórios PDF** (FPDF)
- Criação de **backup ZIP** com compressão
- Tarefas executadas em fila dedicada (não-bloqueante)
- **Arquivos:**  
  - `backend/app/services/relatorio_service.py`  
  - `backend/app/services/backup_service.py`

### 6️⃣ **Gerência de Memória e Cache**  
- Cache leve para **consultas frequentes**
- Liberação explícita de recursos após uso
- Evita acumulação de dados em **SSE streams**
- **Arquivo:** `backend/app/services/consulta_service.py`

### 7️⃣ **Chamadas de Sistema (Syscalls)**  
O projeto utiliza diversas syscalls de baixo nível:
- **I/O:** `open()`, `write()`, `read()`, `close()`
- **Filesystem:** `mkdir()`, `rename()`, `unlink()`
- **Sincronização:** `fsync()` (força flush de buffer)
- **Compressão:** `make_archive()` (ZIP)
- **Lock:** `flock()` (Linux) / `LockFileEx()` (Windows)

### 8️⃣ **Comunicação Inter-Processo (IPC)**  
- **SSE (Server-Sent Events)** para broadcasting de eventos
- **Fila assíncrona** para comunicação produtor-consumidor
- Notificações em tempo real entre frontend e backend
- **Arquivos:**
  - `backend/app/infra/sse.py`
  - `backend/app/services/event_service.py`
  - `frontend/src/store/useAgendaStore.ts`

---

## 📡 Atualizações em Tempo Real — SSE (Server-Sent Events)

O sistema implementa **comunicação bidirecional em tempo real** utilizando SSE para sincronizar múltiplos clientes simultaneamente.

### 🔹 Eventos Transmitidos

| Evento                  | Descrição                                      | Payload                              |
| ----------------------- | ---------------------------------------------- | ------------------------------------ |
| `horario_reservado`     | Slot foi reservado por um paciente             | `{medico_id, slot, paciente_id}`     |
| `horario_ocupado`       | Consulta confirmada (slot ocupado)             | `{medico_id, slot, consulta_id}`     |
| `horario_liberado`      | Slot foi cancelado/liberado                    | `{medico_id, slot}`                  |
| `horario_disponivel`    | Slot voltou a ficar disponível                 | `{medico_id, slot}`                  |

### 🔹 Arquitetura SSE

```
┌─────────────┐          ┌──────────────┐          ┌─────────────┐
│  Paciente 1 │ ◄────────┤  SSE Broker  │◄─────────┤  Paciente 2 │
│   (Tab 1)   │  Stream  │   (Backend)  │  Stream  │   (Tab 2)   │
└─────────────┘          └──────────────┘          └─────────────┘
       ▲                         │                         ▲
       │                         │                         │
       └─────────────────────────┴─────────────────────────┘
              Sincronização em tempo real
```

### 🔹 Implementação

**Backend:**
- `backend/app/infra/sse.py` - Broker SSE com fila assíncrona
- `backend/app/services/event_service.py` - Publicação de eventos
- `backend/app/controllers/sistema_controller.py` - Endpoint `/sistema/agenda/stream`

**Frontend:**
- `frontend/src/store/useAgendaStore.ts` - Conexão SSE com EventSource
- `frontend/src/components/domain/SlotSelector.tsx` - UI reativa

### 🔹 Fluxo de Sincronização

1. **Paciente 1** seleciona um horário → `POST /agenda/reservar`
2. Backend atualiza estado → `reservado`
3. Backend emite evento SSE → `horario_reservado`
4. **Paciente 2** recebe evento via stream → atualiza UI automaticamente
5. Slot aparece como "Aguarde..." (amarelo) para Paciente 2
6. Slot continua verde para Paciente 1 (próprio slot)

### 🔹 Tratamento de Concorrência

- **Own Slot Detection:** Frontend ignora eventos SSE do próprio slot selecionado
- **Comparação inteligente:** `selectedSlot.medicoId === event.medico_id && selectedSlot.datetime === event.slot`
- **Prevent Race Condition:** Backend valida disponibilidade antes de confirmar reserva

---

## 🗂 Fila de Tarefas (Task Queue)

Implementação de um **worker concorrente** usando thread dedicada para processar tarefas assíncronas.

### 🔹 Padrão Producer/Consumer

```python
# Producer (Controllers)
task_queue.enqueue_task({
    "type": "agendar_consulta",
    "data": {...}
})

# Consumer (Worker Thread)
while True:
    task = queue.get()
    process_task(task)
    queue.task_done()
```

### 🔹 Tipos de Tarefas

| Tarefa               | Descrição                                      | I/O Type     |
| -------------------- | ---------------------------------------------- | ------------ |
| `agendar_consulta`   | Agendamento com validação de conflito          | I/O Bound    |
| `backup`             | Backup ZIP do banco de dados                   | I/O Bound    |
| `gerar_relatorio`    | Relatório PDF (FPDF)                           | CPU Bound    |

### 🔹 Benefícios

- **Não-bloqueante:** Requisições HTTP retornam imediatamente
- **Escalável:** Pode processar múltiplas tarefas em paralelo
- **Resiliente:** Falhas não afetam outras tarefas na fila
- **Logging:** Todas as tarefas são registradas com timestamp

### 🔹 Arquivo

- `backend/app/infra/task_queue.py`

---

## 📄 API Endpoints

### 🔷 Pacientes

| Método | Endpoint           | Descrição                        |
| ------ | ------------------ | -------------------------------- |
| GET    | `/pacientes`       | Listar todos os pacientes        |
| GET    | `/pacientes/{id}`  | Obter paciente específico        |
| POST   | `/pacientes`       | Criar novo paciente              |
| PUT    | `/pacientes/{id}`  | Atualizar paciente (exceto CPF)  |
| DELETE | `/pacientes/{id}`  | Deletar paciente                 |

### 🔷 Médicos

| Método | Endpoint           | Descrição                        |
| ------ | ------------------ | -------------------------------- |
| GET    | `/medicos`         | Listar todos os médicos          |
| GET    | `/medicos/{id}`    | Obter médico específico          |
| POST   | `/medicos`         | Criar novo médico                |
| PUT    | `/medicos/{id}`    | Atualizar médico (exceto CRM)    |
| DELETE | `/medicos/{id}`    | Deletar médico                   |

### 🔷 Horários

| Método | Endpoint           | Descrição                        |
| ------ | ------------------ | -------------------------------- |
| GET    | `/horarios`        | Listar todos os horários         |
| POST   | `/horarios`        | Criar novo horário               |
| PUT    | `/horarios/{id}`   | Atualizar horário                |
| DELETE | `/horarios/{id}`   | Deletar horário                  |

### 🔷 Consultas

| Método | Endpoint                   | Descrição                                |
| ------ | -------------------------- | ---------------------------------------- |
| GET    | `/consultas`               | Listar todas as consultas                |
| GET    | `/consultas/{id}`          | Obter consulta específica                |
| POST   | `/consultas/agendar`       | Agendar consulta (via fila)              |
| DELETE | `/consultas/{id}`          | Cancelar consulta                        |

### 🔷 Agenda (Slots em Tempo Real)

| Método | Endpoint                   | Descrição                                |
| ------ | -------------------------- | ---------------------------------------- |
| GET    | `/agenda/slots`            | Obter slots por médico e data            |
| POST   | `/agenda/reservar`         | Reservar slot temporariamente            |
| POST   | `/agenda/liberar`          | Liberar slot reservado                   |

### 🔷 Sistema & SSE

| Método | Endpoint                   | Descrição                                |
| ------ | -------------------------- | ---------------------------------------- |
| GET    | `/sistema/logs`            | Listar logs do sistema                   |
| GET    | `/sistema/logs/stream`     | Stream SSE de logs                       |
| GET    | `/sistema/agenda/stream`   | Stream SSE de eventos da agenda          |

### 🔷 Backup

| Método | Endpoint                   | Descrição                                |
| ------ | -------------------------- | ---------------------------------------- |
| POST   | `/backup/gerar`            | Criar backup ZIP manual                  |
| GET    | `/backup/listar`           | Listar backups disponíveis               |
| GET    | `/backup/download/{nome}`  | Download de backup específico            |

### 🔷 Relatórios

| Método | Endpoint                   | Descrição                                |
| ------ | -------------------------- | ---------------------------------------- |
| POST   | `/relatorios/gerar`        | Gerar relatório PDF                      |
| GET    | `/relatorios/`             | Listar relatórios gerados                |
| GET    | `/relatorios/download/{nome}` | Download de PDF específico            |

---

## 📊 Fluxo Completo de Agendamento (Com Concorrência)

### 🔹 Cenário: Dois pacientes tentam agendar o mesmo horário

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TIMELINE DE CONCORRÊNCIA                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  T0: Paciente 1 (Tab A)           Paciente 2 (Tab B)               │
│      └─ Seleciona slot 14:00      └─ Visualiza slot 14:00          │
│                                      (disponível - verde)           │
│                                                                     │
│  T1: POST /agenda/reservar                                          │
│      ├─ Backend: slot → "reservado"                                │
│      ├─ SSE: horario_reservado                                      │
│      └─ Tab A: slot verde                                           │
│          Tab B: slot amarelo (aguarde)  ← Atualização instantânea   │
│                                                                     │
│  T2: Paciente 1 confirma                                            │
│      POST /consultas/agendar                                        │
│      ├─ Task entra na fila                                          │
│      ├─ Worker processa                                             │
│      ├─ Validação: OK                                               │
│      ├─ Persiste no JSON (com lock)                                 │
│      ├─ Backend: slot → "ocupado"                                   │
│      └─ SSE: horario_ocupado                                        │
│                                                                     │
│  T3: Paciente 2 tenta selecionar                                    │
│      ├─ Frontend: slot já está "aguarde"                            │
│      └─ Botão desabilitado ✅ (prevenção de conflito)               │
│                                                                     │
│  T4: Se Paciente 1 cancelar/voltar                                  │
│      POST /agenda/liberar                                           │
│      ├─ Backend: slot → "disponivel"                                │
│      ├─ SSE: horario_liberado                                       │
│      └─ Tab A e Tab B: slot verde ← Sincronização automática        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 🔹 Passo a Passo Detalhado

1. **Usuário seleciona horário**
   - Frontend chama `POST /agenda/reservar`
   - Slot marcado como `reservado` (temporário - 5 min)

2. **SSE notifica outros clientes**
   - Backend emite evento `horario_reservado`
   - Outros pacientes veem slot como "Aguarde..." (amarelo)
   - Próprio paciente continua vendo verde

3. **Tarefa entra na fila**
   - `POST /consultas/agendar` adiciona tarefa ao `task_queue`
   - Endpoint retorna imediatamente (não-bloqueante)

4. **Worker processa tarefa**
   - Thread dedicada consome da fila
   - **Valida conflito** (verifica se slot ainda está livre)
   - Aplica **file lock** antes de escrever JSON
   - Persiste consulta em `consultas.json`
   - Libera lock

5. **Slot marcado como ocupado**
   - Estado final: `ocupado`
   - SSE emite `horario_ocupado`
   - Frontend atualiza todos os clientes

6. **Se falhar ou cancelar**
   - Slot volta para `disponivel`
   - SSE emite `horario_liberado`
   - Todos veem slot verde novamente

### 🔹 Mecanismos de Proteção

| Mecanismo              | Propósito                                      |
| ---------------------- | ---------------------------------------------- |
| **RLock (schedule_state)** | Previne race condition no estado do slot   |
| **File Lock**          | Previne corrupção ao escrever JSON            |
| **Task Queue**         | Serializa agendamentos conflitantes            |
| **SSE Broadcast**      | Sincroniza UI em tempo real                    |
| **Own Slot Detection** | Evita que SSE sobrescreva seleção própria      |
| **Timeout Reserva**    | Libera slot após 5 min sem confirmação         |

---

## 🎨 Funcionalidades do Frontend

### 🔹 Telas do Paciente

- **Home** (`/paciente/:id`)
  - Seleção de médico por especialidade
  - Nome do paciente exibido na página
  - Navegação para agendamento

- **Agendar Consulta** (`/paciente/:id/agendar`)
  - Seleção de médico e especialidade
  - Seletor visual de horários (SlotSelector)
  - Estados de slot: verde (disponível), amarelo (aguarde), vermelho (ocupado)
  - Sincronização em tempo real via SSE
  - Fluxo: Médico → Horário → Confirmação

- **Minhas Consultas** (`/paciente/:id/consultas`)
  - Lista de consultas agendadas
  - Exibe médico, especialidade, data e horário
  - Filtro por paciente_id
  - Cancelamento de consultas

### 🔹 Telas do Médico

- **Dashboard** (`/medico`)
  - Visão geral do sistema
  - Estatísticas de consultas

- **Pacientes** (`/medico/pacientes`)
  - CRUD completo de pacientes
  - Campos obrigatórios: CPF, nome, data de nascimento
  - CPF e data de nascimento imutáveis após criação

- **Médicos** (`/medico/medicos`)
  - CRUD completo de médicos
  - Campos obrigatórios: CRM, nome, especialidade
  - CRM imutável após criação

- **Horários** (`/medico/horarios`)
  - CRUD de horários
  - Definição de dias da semana e horários

- **Consultas** (`/medico/consultas`)
  - Visualização de todas as consultas
  - Gerenciamento de agendamentos

- **Logs** (`/medico/logs`)
  - Stream SSE de logs em tempo real
  - Histórico de operações do sistema

- **Backup** (`/medico/backup`)
  - Geração manual de backup ZIP
  - Download de backups anteriores

- **Relatórios** (`/medico/relatorios`)
  - Geração de relatórios PDF
  - Download de relatórios gerados

### 🔹 Características Técnicas do Frontend

- **IDs Auto-incrementais:** Pacientes, médicos e consultas usam IDs numéricos sequenciais (1, 2, 3...)
- **Roteamento Dinâmico:** URLs com parâmetros `:pacienteId` para múltiplos usuários
- **SSE Integration:** Conexão EventSource com lifecycle management (connect/disconnect)
- **Estado Global:** Zustand stores para pacientes, médicos, consultas, horários e agenda
- **TypeScript Strict:** Tipagem completa com validação em tempo de compilação
- **UI Profissional:** Background sólido #F5F7FA, componentes Ant Design customizados
- **Validação de Forms:** Todos os campos obrigatórios validados
- **Toast Notifications:** Feedback visual com react-hot-toast
- **Date Handling:** date-fns para formatação e manipulação

---

## 🧩 Justificativa Técnica para Banca

### 🔹 Por que FastAPI?
- Suporte nativo a **async/await** (concorrência eficiente)
- **Validação automática** com Pydantic (type safety)
- **Documentação automática** com Swagger/OpenAPI
- **SSE support** para streaming de eventos
- Performance superior (baseado em Starlette + uvloop)

### 🔹 Por que React + TypeScript?
- **Componentização** facilita manutenção e reuso
- **TypeScript** garante type safety e previne bugs
- **Zustand** oferece state management leve e performático
- **SSE via EventSource** permite real-time updates
- **Vite** proporciona dev experience rápido e HMR eficiente

### 🔹 Por que JSON ao invés de Banco de Dados?
- **Simplicidade** para fins didáticos
- **Filesystem como DB** demonstra conceitos de I/O de SO
- **File locks** simulam transações e concorrência
- **Portabilidade** sem dependências externas
- **Fácil inspeção** dos dados para debug

### 🔹 Conceitos de SO Aplicados

| Conceito                    | Implementação no Projeto                       |
| --------------------------- | ---------------------------------------------- |
| **Threads**                 | Worker dedicado para task queue                |
| **Locks/Sincronização**     | RLock + file locks para prevenir race condition |
| **IPC (Comunicação)**       | SSE para broadcast de eventos                  |
| **I/O Bound**               | Backup ZIP e geração de PDF                    |
| **Filesystem**              | Persistência JSON com operações atômicas       |
| **Syscalls**                | open(), write(), fsync(), flock()              |
| **Escalonamento**           | Fila FIFO para processamento de tarefas        |
| **Concorrência**            | Múltiplos pacientes agendando simultaneamente  |

### 🔹 Diferenciais do Projeto

✅ **Arquitetura MVC completa** (separação clara de responsabilidades)  
✅ **Fullstack integrado** (Backend + Frontend sincronizados)  
✅ **Real-time sync** (SSE para múltiplos clientes)  
✅ **Controle de concorrência** (locks + fila + validação)  
✅ **Código limpo e documentado** (type hints, docstrings, comentários)  
✅ **Cross-platform** (Windows/Linux/macOS compatível)  
✅ **Extensível** (fácil adicionar novos endpoints/features)  
✅ **Testável** (arquitetura modular facilita testes)

---

## ✔️ Conclusão

Este projeto fullstack:
- ✅ **Atende 100% dos requisitos funcionais** de um sistema de agendamento médico
- ✅ **Implementa conceitos fundamentais de SO** (threads, locks, filesystem, syscalls, IPC)
- ✅ **Demonstra concorrência real** com múltiplos clientes simultâneos
- ✅ **Arquitetura modular e escalável** (MVC + camadas bem definidas)
- ✅ **Real-time updates** via SSE (sincronização entre tabs)
- ✅ **Controle de race conditions** com locks e fila de tarefas
- ✅ **Backup e relatórios** demonstrando I/O bound operations
- ✅ **UI/UX profissional** com feedback visual e validações

### 🎯 Conceitos de SO Validados

| Conceito          | ✅ Implementado |
| ----------------- | --------------- |
| Threads           | ✅             |
| Locks             | ✅             |
| Fila de Tarefas   | ✅             |
| Race Conditions   | ✅             |
| Filesystem I/O    | ✅             |
| Syscalls          | ✅             |
| IPC (SSE)         | ✅             |
| Concorrência      | ✅             |

---

## 🎓 Autor

Desenvolvido por **João Vitor**  
📚 Disciplina: **Sistemas Operacionais**  
🎓 Curso: **Engenharia da Computação**  
📅 Ano: **2025**
