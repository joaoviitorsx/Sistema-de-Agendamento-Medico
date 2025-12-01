# 🏥 Sistema de Agendamento de Consultas Médicas
### Projeto Fullstack Integrado com Conceitos de Sistemas Operacionais (SO)

> **Disciplina:** Sistemas Operacionais  
> **Objetivo:** Aplicar conceitos teóricos de SO em um projeto real, demonstrando a interação entre software e sistema operacional através de um sistema de agendamento médico completo.

---

## 📌 Visão Geral

Este projeto implementa um **sistema completo de agendamento médico** que demonstra na prática os principais conceitos de Sistemas Operacionais, incluindo processos, threads, concorrência, sistema de arquivos, gerência de memória e chamadas de sistema.

### 🎯 Objetivos de Aprendizado Alcançados

✅ **Aplicação de conceitos teóricos de SO** em ambiente real de produção  
✅ **Compreensão da interação software-SO** através de chamadas de sistema  
✅ **Desenvolvimento de programação concorrente** com threads e sincronização  
✅ **Manipulação avançada de arquivos** com locks e operações assíncronas  
✅ **Tratamento multiplataforma** (Windows, Linux, macOS)

---

## 🏗️ Arquitetura do Sistema

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

## 📊 Fluxo Completo de Agendamento (Com Concorrência)

### 🔹 Cenário: Dois pacientes tentam agendar o mesmo horário simultaneamente

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TIMELINE DE CONCORRÊNCIA                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  T0: Paciente 1 e Paciente 2 abrem a página simultaneamente        │
│      └─ GET /agenda/slots → Ambos veem slot "disponível" (verde)   │
│                                                                     │
│  T1: Paciente 1 clica em "Reservar"                                │
│      └─ POST /agenda/reservar                                      │
│         ├─ Adquire RLock (schedule_state)                          │
│         ├─ Verifica: slot disponível? ✅                           │
│         ├─ Atualiza: status = "reservado"                          │
│         ├─ Timestamp: 14:32:15.123                                 │
│         └─ Libera RLock                                            │
│      └─ SSE notifica: "horario_reservado"                          │
│         └─ Paciente 2 vê slot ficar "Aguarde..." (amarelo)         │
│                                                                     │
│  T2: Paciente 2 clica em "Reservar" (0.5s depois)                  │
│      └─ POST /agenda/reservar                                      │
│         ├─ Adquire RLock (schedule_state)                          │
│         ├─ Verifica: slot disponível? ❌ (já reservado)            │
│         └─ Libera RLock                                            │
│      └─ Retorna: HTTP 409 Conflict                                │
│         └─ Frontend exibe: "Horário já reservado por outro paciente"│
│                                                                     │
│  T3: Paciente 1 confirma agendamento                               │
│      └─ POST /consultas/agendar                                    │
│         ├─ Enfileira tarefa na Queue (Producer)                    │
│         └─ Retorna imediatamente: HTTP 200                         │
│                                                                     │
│  T4: Worker thread processa (Consumer)                             │
│      └─ Processa tarefa da fila                                    │
│         ├─ Valida dados (médico existe, paciente existe)           │
│         ├─ Adquire File Lock (consultas.json)                      │
│         ├─ Adiciona consulta no arquivo JSON                       │
│         ├─ fsync() - força flush para disco                        │
│         ├─ Libera File Lock                                        │
│         ├─ Adquire RLock (schedule_state)                          │
│         ├─ Atualiza: "reservado" → "ocupado"                       │
│         ├─ Libera RLock                                            │
│         └─ SSE notifica: "horario_ocupado"                         │
│            └─ Todos os clientes veem slot vermelho                 │
│                                                                     │

---

## 🎯 Conclusão

Este projeto demonstra na prática os principais conceitos de **Sistemas Operacionais**:

✅ **Processos e Threads**: Worker thread + paralelismo  
✅ **Sistema de Arquivos**: JSON com locks + estrutura de diretórios  
✅ **Gerência de Memória**: Cache + RAII + garbage collection  
✅ **Concorrência**: RLock + File Lock + Queue thread-safe  
✅ **Chamadas de Sistema**: open, write, fsync, flock, mkdir, etc.  
✅ **Entrada/Saída**: I/O síncrono e assíncrono + buffering  
✅ **Multiplataforma**: Windows, Linux, macOS compatível  

### 📚 Referências de Estudo

**Livros recomendados:**
- *Operating System Concepts* - Silberschatz, Galvin, Gagne (Capítulos 3, 5, 6, 10, 13)
- *Modern Operating Systems* - Andrew S. Tanenbaum (Capítulos 2, 3, 4, 6)

**Documentação técnica:**
- [Python threading module](https://docs.python.org/3/library/threading.html)
- [Python fcntl module](https://docs.python.org/3/library/fcntl.html)
- [pathlib - Object-oriented filesystem paths](https://docs.python.org/3/library/pathlib.html)

**Conceitos-chave:**
- Race conditions e mutual exclusion
- Producer-Consumer problem
- File locking e sincronização
- Syscalls e kernel/user space
- I/O buffering e durabilidade

---

## 👥 Equipe

**Desenvolvimento e Documentação:**
- João Vitor - Sistema completo + Documentação de conceitos de SO

**Disciplina:** Sistemas Operacionais  
**Instituição:** [Nome da Faculdade]  
**Data:** Dezembro de 2025

---

## 📄 Licença

Este projeto foi desenvolvido para fins **educacionais** como parte da disciplina de Sistemas Operacionais.

---

**Última atualização:** 01/12/2025
│      └─ Todos os clientes atualizados via SSE ✅                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 🔹 Mecanismos de Sincronização Utilizados

| Mecanismo           | Finalidade                                    | Arquivo                      |
|---------------------|-----------------------------------------------|------------------------------|
| **RLock**           | Protege estado da agenda em memória           | `schedule_state.py`          |
| **File Lock**       | Previne corrupção do JSON em disco            | `file_locks.py`              |
| **Queue**           | Sincroniza Producer/Consumer (thread-safe)    | `task_queue.py`              |
| **SSE**             | Notifica clientes em tempo real               | `sse.py`, `event_service.py` |
| **Context Manager** | Garante liberação de recursos (RAII)          | Todos os arquivos            |

### 🔹 Prevenção de Race Conditions

**❌ Sem sincronização:**
```python
# PROBLEMA: Race condition
if slot_disponivel(medico_id, datetime):  # Thread 1 e 2 chegam aqui
    criar_consulta(...)  # Ambas criam → CONFLITO!
```

**✅ Com sincronização:**
```python
with schedule_state.lock:  # Apenas uma thread por vez
    if slot_disponivel(medico_id, datetime):
        marcar_reservado(...)  # Operação atômica
```

---

## 🎓 Guia de Estudo para Apresentação ao Professor

### 📚 Roteiro de Explicação dos Conceitos

#### **1. Processos e Threads**

**O que explicar:**
- "Usamos uma thread worker dedicada que roda em background processando tarefas assíncronas"
- "Implementamos o padrão Producer/Consumer com Queue() thread-safe do Python"
- "Isso permite que requisições HTTP retornem imediatamente, enquanto I/O pesado roda em paralelo"

**Código para demonstrar:**
```python
# backend/app/infra/task_queue.py - linhas 10-30
class TaskQueue:
    def __init__(self):
        self.queue = Queue()
        self.worker_thread = Thread(target=self._worker, daemon=True)
        self.worker_thread.start()
```

**Perguntas que o professor pode fazer:**
- Q: "Por que usar thread ao invés de processo?"
- A: "Threads compartilham memória, facilitando acesso ao estado da agenda. Processos teriam overhead de IPC."

- Q: "O que é daemon=True?"
- A: "Thread daemon termina automaticamente quando o programa principal encerra, sem precisar de cleanup manual."

---

#### **2. Sistema de Arquivos**

**O que explicar:**
- "Criamos estrutura de diretórios portável com pathlib (funciona em Windows/Linux/macOS)"
- "Dados persistidos em JSON com encoding UTF-8 consistente"
- "Usamos fsync() para garantir que dados saem do buffer e vão para disco físico"

**Código para demonstrar:**
```python
# backend/app/infra/file_storage.py - linhas 25-35
def save(self, filename: str, data: dict):
    with filepath.open('w', encoding='utf-8') as f:
        with FileLock(f):
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.flush()
            os.fsync(f.fileno())  # Syscall: força flush para disco
```

**Perguntas que o professor pode fazer:**
- Q: "Qual a diferença entre flush() e fsync()?"
- A: "flush() move dados do buffer do Python para o buffer do kernel. fsync() força o kernel a escrever no disco físico."

- Q: "Por que usar encoding='utf-8'?"
- A: "Garante compatibilidade entre sistemas. Windows usa cp1252 por padrão, mas UTF-8 é universal."

---

#### **3. Gerência de Memória**

**O que explicar:**
- "Usamos cache em memória (dict) para consultas frequentes, evitando I/O desnecessário"
- "Context managers (with) garantem liberação automática de recursos (RAII pattern)"
- "Python usa garbage collector baseado em contagem de referências, liberamos memória deletando referências"

**Código para demonstrar:**
```python
# backend/app/services/consulta_service.py - linhas 15-25
class ConsultaService:
    def __init__(self):
        self._cache = {}  # Cache em RAM
    
    def buscar_consultas(self, medico_id: int):
        if medico_id in self._cache:
            return self._cache[medico_id]  # Cache hit: evita I/O
        
        consultas = self.repository.buscar_por_medico(medico_id)
        self._cache[medico_id] = consultas  # Armazena em RAM
        return consultas
```

**Perguntas que o professor pode fazer:**
- Q: "Como evitamos memory leak?"
- A: "Usamos context managers que garantem liberação mesmo com exceções. Python tem GC automático."

- Q: "O que é RAII?"
- A: "Resource Acquisition Is Initialization - recursos liberados automaticamente no destrutor/exit do context manager."

---

#### **4. Concorrência e Sincronização**

**O que explicar:**
- "Usamos RLock (Reentrant Lock) para proteger o estado da agenda em memória"
- "File locks previnem corrupção quando múltiplos processos escrevem no JSON"
- "Sistema de estados: disponível → reservado → ocupado (máquina de estados)"

**Código para demonstrar:**
```python
# backend/app/infra/schedule_state.py - linhas 15-30
class ScheduleState:
    def __init__(self):
        self.lock = RLock()  # Permite re-aquisição pela mesma thread
        self.slots = {}
    
    def reservar_slot(self, medico_id: int, datetime: str, paciente_id: int):
        with self.lock:  # Seção crítica
            key = f"{medico_id}_{datetime}"
            if key in self.slots and self.slots[key]["status"] != "disponível":
                raise ValueError("Slot já reservado")
            
            self.slots[key] = {"status": "reservado", "paciente_id": paciente_id}
```

**Perguntas que o professor pode fazer:**
- Q: "O que é race condition e como evitamos?"
- A: "Duas threads leem 'disponível' simultaneamente e ambas tentam agendar. Lock garante mutual exclusion."

- Q: "Por que RLock e não Lock simples?"
- A: "RLock permite que a mesma thread adquira o lock múltiplas vezes, útil em métodos que chamam outros métodos sincronizados."

---

#### **5. Chamadas de Sistema**

**O que explicar:**
- "Usamos syscalls como open(), write(), fsync(), flock() para interagir com o kernel"
- "File locking multiplataforma: fcntl.flock() no Linux/macOS, msvcrt.locking() no Windows"
- "mkdir() cria diretórios, fsync() garante durabilidade"

**Código para demonstrar:**
```python
# backend/app/infra/file_locks.py - linhas 20-35
class FileLock:
    def __enter__(self):
        if platform.system() == "Windows":
            msvcrt.locking(self.fd, msvcrt.LK_LOCK, size)  # Syscall Windows
        else:
            fcntl.flock(self.fd, fcntl.LOCK_EX)  # Syscall Linux/macOS
    
    def __exit__(self, *args):
        if platform.system() == "Windows":
            msvcrt.locking(self.fd, msvcrt.LK_UNLCK, size)
        else:
            fcntl.flock(self.fd, fcntl.LOCK_UN)
```

**Perguntas que o professor pode fazer:**
- Q: "Quais syscalls você usa?"
- A: "open(), write(), read(), close(), fsync(), flock()/LockFileEx(), mkdir(), rename(), unlink(), time()."

- Q: "Como funciona a transição user space → kernel space?"
- A: "Quando chamamos uma syscall, CPU muda de user mode (ring 3) para kernel mode (ring 0) via interrupt/trap."

---

#### **6. Entrada/Saída (I/O)**

**O que explicar:**
- "I/O síncrono: thread espera disco responder (bloqueante)"
- "I/O assíncrono: enfileiramos tarefa e retornamos imediatamente (não-bloqueante)"
- "Buffering em camadas: buffer do Python → buffer do kernel → disco físico"

**Código para demonstrar:**
```python
# backend/app/controllers/consulta_controller.py - linhas 30-40
@router.post("/consultas/agendar")
async def agendar_consulta(dados: ConsultaCreate):
    # Enfileira tarefa (não-bloqueante)
    task_queue.enqueue_task({
        "type": "agendar_consulta",
        "data": dados.dict()
    })
    
    # Retorna ANTES do I/O terminar
    return {"status": "processando"}
```

**Perguntas que o professor pode fazer:**
- Q: "Qual a diferença entre I/O bound e CPU bound?"
- A: "I/O bound: tempo gasto esperando disco/rede. CPU bound: tempo gasto processando. Geração de PDF é I/O bound."

- Q: "Como funciona buffering?"
- A: "Dados vão para buffer na RAM antes de ir ao disco. flush() esvazia buffer Python, fsync() força kernel a escrever."

---

### 📝 Checklist Final para Apresentação

**Antes da apresentação:**
- [ ] Revisar `task_queue.py` (threads e Queue)
- [ ] Revisar `schedule_state.py` (RLock e concorrência)
- [ ] Revisar `file_locks.py` (locks multiplataforma)
- [ ] Revisar `file_storage.py` (I/O com fsync)
- [ ] Revisar `config.py` (estrutura de diretórios)
- [ ] Testar sistema com 2 abas simultâneas (demonstrar concorrência)
- [ ] Verificar logs em `backend/app/logs/` (mostrar timestamping)
- [ ] Gerar PDF de relatório (demonstrar I/O assíncrono)

**Durante a demonstração:**
1. Mostrar estrutura de pastas (`/banco`, `/logs`, `/reports`, `/backups`)
2. Abrir 2 abas do frontend (Paciente 1 e 2)
3. Paciente 1 reserva slot → mostrar SSE atualizando Paciente 2
4. Mostrar logs em tempo real (stream SSE de logs)
5. Gerar relatório PDF (mostrar processamento assíncrono)
6. Criar backup manual (mostrar ZIP criado)
7. Mostrar código de RLock e File Lock
8. Explicar fluxo completo de agendamento com timeline

**Conceitos para enfatizar:**
- ✅ Thread worker = paralelismo
- ✅ RLock = proteção contra race condition
- ✅ File lock = previne corrupção de JSON
- ✅ fsync() = garante durabilidade
- ✅ SSE = comunicação em tempo real
- ✅ Context managers = gerência automática de recursos
- ✅ Multiplataforma = funciona em Windows/Linux/macOS

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

## 📋 Funcionalidades Requisitadas (Checklist Professor)

### ✅ 1. Sistema de Agendamento Básico
**🔹 Conceitos de SO: Processos e Threads**

- [x] Interface web responsiva para agendamento de consultas
- [x] **CRUD completo de Pacientes** (Create, Read, Update, Delete)
- [x] **CRUD completo de Médicos** (Create, Read, Update, Delete)
- [x] **CRUD completo de Horários** (Create, Read, Update, Delete)
- [x] **CRUD completo de Consultas** (Create, Read, Delete)
- [x] Verificação automática de conflitos de agendamento
- [x] Sistema de reserva temporária de slots (evita race conditions)
- [x] Sincronização em tempo real entre múltiplos usuários via SSE

**📂 Arquivos principais:**
- `backend/app/controllers/paciente_controller.py` - CRUD Pacientes
- `backend/app/controllers/medico_controller.py` - CRUD Médicos
- `backend/app/controllers/horario_controller.py` - CRUD Horários
- `backend/app/controllers/consulta_controller.py` - CRUD Consultas
- `backend/app/controllers/agenda_controller.py` - Sistema de reservas
- `backend/app/infra/task_queue.py` - **Thread worker** para processamento assíncrono

---

### ✅ 2. Persistência de Dados em Arquivos Locais
**🔹 Conceitos de SO: Sistema de Arquivos**

- [x] Armazenamento de dados em arquivos **JSON** estruturados
- [x] Criação automática de estrutura de diretórios por SO
- [x] **Backup automático** e manual dos dados em ZIP
- [x] Leitura/Escrita **assíncrona** com locks de arquivo
- [x] Sistema de **file locking** compatível com Windows/Linux/macOS
- [x] Organização em diretórios: `/banco`, `/logs`, `/reports`, `/backups`

**📂 Arquivos principais:**
- `backend/app/infra/file_storage.py` - Sistema de persistência JSON
- `backend/app/infra/file_locks.py` - **File locking multiplataforma**
- `backend/app/core/config.py` - Estrutura de diretórios por SO
- `backend/app/services/backup_service.py` - Backup ZIP automático
- `backend/app/banco/` - Diretório de dados JSON

**🔍 Chamadas de Sistema utilizadas:**
```python
# Syscalls de I/O
open()      # Abertura de arquivos
write()     # Escrita em disco
read()      # Leitura de dados
close()     # Fechamento de descritores
fsync()     # Flush forçado de buffer para disco

# Syscalls de Filesystem
mkdir()     # Criação de diretórios
rename()    # Renomeação de arquivos
unlink()    # Remoção de arquivos

# Syscalls de Lock
flock()     # Linux/macOS - lock de arquivo
LockFileEx()  # Windows - lock de arquivo
```

---

### ✅ 3. Geração de Relatórios
**🔹 Conceitos de SO: Operações de I/O**

- [x] Geração de relatórios de consultas em **PDF**
- [x] Salvamento em diretório específico (`/reports`)
- [x] **Download de relatórios** via endpoint HTTP
- [x] Formatação com FPDF (processamento I/O bound)
- [x] Filtros: médico, paciente, período (data inicial/final)
- [x] Listagem de todos os relatórios gerados

**📂 Arquivos principais:**
- `backend/app/services/relatorio_service.py` - **Geração de PDF**
- `backend/app/controllers/report_controller.py` - Endpoints de relatórios
- `backend/app/reports/` - Diretório de PDFs gerados
- `frontend/src/pages/medico/Relatorios.tsx` - Interface de relatórios

**🔍 Operações de I/O demonstradas:**
- **I/O Bound**: Geração de PDF (escrita intensiva em disco)
- **Buffering**: Uso de buffer para otimizar escrita
- **Flush explícito**: Garantia de persistência com `fsync()`

---

### ✅ 4. Processamento Concorrente
**🔹 Conceitos de SO: Escalonamento e Concorrência**

- [x] **Thread worker dedicada** para processamento assíncrono
- [x] Fila de tarefas (**Queue**) padrão Producer/Consumer
- [x] **RLock** (Reentrant Lock) para sincronização de agenda
- [x] **File locks** para evitar corrupção de dados
- [x] Sistema de estados de slot: `disponível → reservado → ocupado`
- [x] Prevenção de **race conditions** no agendamento simultâneo
- [x] Sincronização entre múltiplos processos via SSE

**📂 Arquivos principais:**
- `backend/app/infra/task_queue.py` - **Worker thread + Queue**
- `backend/app/infra/schedule_state.py` - **RLock para agenda**
- `backend/app/infra/file_locks.py` - **File locking**
- `backend/app/services/task_service.py` - Processamento de tarefas

**🔍 Mecanismos de sincronização:**
```python
# Thread Worker (Producer/Consumer)
Queue()           # Fila thread-safe
Thread.start()    # Criação de thread dedicada
queue.get()       # Bloqueio até tarefa disponível
queue.task_done() # Sinalização de conclusão

# Locks de Sincronização
RLock()           # Reentrant lock (permite múltiplas aquisições)
with lock:        # Context manager para RAII
    # Seção crítica protegida

# File Lock
flock(LOCK_EX)    # Lock exclusivo (Linux/macOS)
LockFileEx()      # Lock exclusivo (Windows)
```

---

### ✅ 5. Sistema de Logging
**🔹 Conceitos de SO: Gerência de Dispositivos**

- [x] Registro detalhado de **todas as operações** em arquivo de log
- [x] **Timestamp** com fuso horário do sistema (ISO 8601)
- [x] Níveis de log: **INFO**, **ERROR**, **DEBUG**, **WARNING**
- [x] **Rotação de logs** por data (arquivos diários)
- [x] Stream em tempo real de logs via SSE
- [x] Logs com emojis para facilitar visualização

**📂 Arquivos principais:**
- `backend/app/core/log.py` - **Sistema de logging centralizado**
- `backend/app/services/log_service.py` - Leitura e stream de logs
- `backend/app/controllers/sistema_controller.py` - Endpoints de logs
- `backend/app/logs/` - Diretório de arquivos de log
- `frontend/src/pages/medico/Logs.tsx` - Interface de visualização

**🔍 Conceitos de gerência de dispositivos:**
- **Buffering de I/O**: Logs escritos em buffer antes de flush
- **Device Driver abstraction**: Interface unificada para escrita
- **Stream de dados**: SSE para transmissão contínua de logs
- **Timestamp preciso**: Uso de relógio do sistema (`time.time()`)

**📋 Formato de log:**
```
[2025-12-01T14:32:15-03:00] INFO 📅 [AgendaController] Reserva criada: Dr. Silva, 2025-12-05 14:00
[2025-12-01T14:32:16-03:00] ERROR ❌ [ConsultaService] Conflito: horário já ocupado
[2025-12-01T14:32:17-03:00] DEBUG 🔍 [FileStorage] Lock adquirido: consultas.json
```

---

### ✅ 6. Gerenciamento de Memória
**🔹 Conceitos de SO: Gerência de Memória**

- [x] **Cache de consultas** frequentes em memória
- [x] Limpeza automática de dados temporários (slots reservados expirados)
- [x] **Alocação dinâmica** de estruturas de dados (listas, dicionários)
- [x] **Liberação explícita** de recursos após uso (context managers)
- [x] Controle de **vazamento de memória** via RAII pattern
- [x] Otimização de memória em streams SSE (evita acumulação)

**📂 Arquivos principais:**
- `backend/app/services/consulta_service.py` - Cache de consultas
- `backend/app/infra/schedule_state.py` - Estado em memória da agenda
- `backend/app/infra/sse.py` - Gerência de streams SSE
- `backend/app/infra/file_storage.py` - Context managers para recursos

**🔍 Técnicas de gerência de memória:**
```python
# Context Managers (RAII - Resource Acquisition Is Initialization)
with open(file, 'w') as f:
    # Memória e descriptor liberados automaticamente ao sair do bloco
    f.write(data)

# Cache com estruturas nativas do Python
cache = {}  # Dicionário hash-based (O(1))
cache[key] = value  # Alocação dinâmica

# Limpeza explícita de recursos
def limpar_reservas_expiradas():
    # Remove objetos não mais necessários
    del estado['slot_reservado']
    # Garbage collector do Python libera memória
```

**📊 Estratégias de otimização:**
- **Lazy loading**: Dados carregados apenas quando necessários
- **Referências fracas**: Evita ciclos de referência
- **Pool de conexões**: Reutilização de recursos
- **Streaming**: Processamento incremental (evita carregar tudo na RAM)

---

### ✅ 7. Configuração Dependente de SO
**🔹 Conceitos de SO: Chamadas de Sistema**

- [x] **Paths diferentes** para Windows, Linux e macOS
- [x] **Permissões de arquivo** adequadas por SO (chmod 0o644)
- [x] **Encoding UTF-8** consistente em todos os arquivos
- [x] **File locking** multiplataforma (fcntl vs msvcrt)
- [x] Tratamento de diferenças de filesystem (case-sensitive)
- [x] Detecção automática de plataforma (`platform.system()`)

**📂 Arquivos principais:**
- `backend/app/core/config.py` - **Configuração multiplataforma**
- `backend/app/infra/file_locks.py` - **Locks específicos por SO**

**🔍 Diferenças entre sistemas operacionais:**

| Aspecto                | Windows                          | Linux/macOS                     |
|------------------------|----------------------------------|---------------------------------|
| **Separador de path**  | `\` (backslash)                  | `/` (forward slash)             |
| **File lock**          | `msvcrt.locking()`               | `fcntl.flock()`                 |
| **Permissões**         | ACLs (Access Control Lists)      | POSIX (rwxrwxrwx)               |
| **Case sensitivity**   | Case-insensitive                 | Case-sensitive                  |
| **Encoding padrão**    | cp1252 (legacy) / UTF-8 (novo)   | UTF-8                           |
| **Newline**            | `\r\n` (CRLF)                    | `\n` (LF)                       |

**💻 Código multiplataforma:**
```python
import platform
from pathlib import Path

# Detecção de SO
sistema = platform.system()  # 'Windows', 'Linux', 'Darwin' (macOS)

# Paths portáveis com pathlib
base_dir = Path(__file__).parent  # Funciona em qualquer SO
data_dir = base_dir / "banco"     # Operador / gera path correto

# File locking multiplataforma
if platform.system() == "Windows":
    import msvcrt
    msvcrt.locking(fd, msvcrt.LK_LOCK, size)
else:
    import fcntl
    fcntl.flock(fd, fcntl.LOCK_EX)
```

---

## 🧠 Demonstração dos Conceitos de SO (Requisitos do Professor)

### 1️⃣ **Processos e Threads: Como o sistema lida com múltiplas operações simultâneas?**

**📚 Conceito teórico:**  
Processos são instâncias de programas em execução, enquanto threads são fluxos de execução dentro de um processo. Threads compartilham memória e recursos, permitindo paralelismo eficiente.

**🔧 Implementação no projeto:**

O sistema utiliza uma **thread worker dedicada** que roda em background processando tarefas de forma assíncrona:

```python
# backend/app/infra/task_queue.py

class TaskQueue:
    def __init__(self):
        self.queue = Queue()  # Fila thread-safe do Python
        self.worker_thread = Thread(target=self._worker, daemon=True)
        self.worker_thread.start()  # Thread inicia imediatamente
    
    def _worker(self):
        """Thread worker que processa tarefas continuamente"""
        while True:
            task = self.queue.get()  # Bloqueia até ter tarefa
            try:
                self._process_task(task)  # Processa em background
            finally:
                self.queue.task_done()  # Sinaliza conclusão
    
    def enqueue_task(self, task):
        """Producer: adiciona tarefa na fila (thread-safe)"""
        self.queue.put(task)
```

**🎯 Benefícios:**
- ✅ Requisições HTTP retornam **imediatamente** (não-bloqueante)
- ✅ Tarefas pesadas (PDF, backup) rodam em **background**
- ✅ **Paralelismo**: Frontend continua responsivo durante processamento
- ✅ **Producer/Consumer pattern**: Desacopla produção de consumo

**📂 Onde encontrar:**
- `backend/app/infra/task_queue.py` - Thread worker e Queue
- `backend/app/services/task_service.py` - Processamento de tarefas
- `backend/app/controllers/consulta_controller.py` - Enqueue de agendamentos

---

### 2️⃣ **Sistema de Arquivos: Como os dados são organizados e acessados?**

**📚 Conceito teórico:**  
O sistema de arquivos organiza dados em diretórios hierárquicos, com metadados (permissões, timestamps) e operações (criar, ler, escrever, deletar).

**🔧 Implementação no projeto:**

Estrutura de diretórios criada automaticamente ao iniciar:

```
Sistema-de-Agendamento-Medico/backend/app/
│
├── banco/              ← Persistência JSON (dados principais)
│   ├── pacientes.json
│   ├── medicos.json
│   ├── horarios.json
│   └── consultas.json
│
├── logs/               ← Logs rotativos por data
│   ├── sistema_2025-12-01.log
│   └── sistema_2025-12-02.log
│
├── reports/            ← PDFs gerados
│   ├── relatorio_consultas_2025-12-01_143215.pdf
│   └── relatorio_medicos_2025-12-01_150432.pdf
│
└── backups/            ← Backups ZIP automáticos
    ├── backup_2025-12-01_080000.zip
    └── backup_2025-12-01_200000.zip
```

**💾 Operações de arquivo com lock:**

```python
# backend/app/infra/file_storage.py

class FileStorage:
    def save(self, filename: str, data: dict):
        """Salva dados em JSON com lock exclusivo"""
        filepath = self.base_dir / filename
        
        # Context manager garante liberação de recursos
        with filepath.open('w', encoding='utf-8') as f:
            with FileLock(f):  # Lock exclusivo (evita race condition)
                json.dump(data, f, ensure_ascii=False, indent=2)
                f.flush()     # Flush de buffer
                os.fsync(f.fileno())  # Força escrita em disco (syscall)
```

**🔍 Chamadas de sistema (syscalls):**
- `open()` - Abre arquivo e retorna file descriptor
- `write()` - Escreve dados no buffer
- `fsync()` - Força flush do buffer para disco físico
- `close()` - Fecha descriptor e libera recursos
- `mkdir()` - Cria diretórios recursivamente
- `flock()` / `LockFileEx()` - Lock exclusivo de arquivo

**📂 Onde encontrar:**
- `backend/app/infra/file_storage.py` - Operações de I/O
- `backend/app/core/config.py` - Criação de diretórios
- `backend/app/infra/file_locks.py` - File locking multiplataforma

---

### 3️⃣ **Gerência de Memória: Como a memória é alocada e liberada?**

**📚 Conceito teórico:**  
A gerência de memória controla alocação e liberação de RAM, evitando vazamentos (memory leaks) e fragmentação. Python usa garbage collector baseado em contagem de referências.

**🔧 Implementação no projeto:**

**Alocação dinâmica:**
```python
# backend/app/infra/schedule_state.py

class ScheduleState:
    def __init__(self):
        # Alocação dinâmica de dicionário (heap)
        self.slots = {}  # Cresce conforme necessário
        self.lock = RLock()  # Lock para sincronização
    
    def reservar_slot(self, medico_id: int, datetime: str, paciente_id: int):
        with self.lock:  # RAII: lock liberado automaticamente
            # Alocação de objeto em memória
            self.slots[f"{medico_id}_{datetime}"] = {
                "status": "reservado",
                "paciente_id": paciente_id,
                "timestamp": time.time()
            }
```

**Liberação de recursos (RAII pattern):**
```python
# Context manager garante liberação mesmo com exceção
with open('arquivo.json', 'r') as f:
    data = json.load(f)
    # f.close() chamado automaticamente ao sair do bloco
    # Memória do buffer liberada pelo garbage collector
```

**Cache em memória:**
```python
# backend/app/services/consulta_service.py

class ConsultaService:
    def __init__(self):
        self._cache = {}  # Cache em RAM (hash table)
    
    def buscar_consultas(self, medico_id: int):
        # Verifica cache primeiro (evita I/O)
        if medico_id in self._cache:
            return self._cache[medico_id]
        
        # Cache miss: carrega de disco
        consultas = self.repository.buscar_por_medico(medico_id)
        self._cache[medico_id] = consultas  # Armazena em RAM
        return consultas
```

**Limpeza de memória:**
```python
# SSE: evita acumulação de eventos na memória
def limpar_eventos_antigos():
    agora = time.time()
    eventos_ativos = [
        evento for evento in eventos
        if agora - evento['timestamp'] < 60  # Remove eventos > 1min
    ]
    # Eventos antigos removidos → garbage collector libera memória
```

**📂 Onde encontrar:**
- `backend/app/infra/schedule_state.py` - Estado em memória
- `backend/app/services/consulta_service.py` - Cache
- `backend/app/infra/sse.py` - Gerência de streams

---

### 4️⃣ **Concorrência: Como são evitados conflitos no acesso aos recursos?**

**📚 Conceito teórico:**  
Concorrência ocorre quando múltiplas threads/processos acessam recursos compartilhados. Race conditions podem corromper dados. Locks garantem **mutual exclusion** (mutex).

**🔧 Implementação no projeto:**

**Problema: Race condition no agendamento**

```
Cenário sem sincronização:
T0: Paciente A lê slot → "disponível" ✅
T1: Paciente B lê slot → "disponível" ✅  (ainda não foi atualizado)
T2: Paciente A agenda → slot = "ocupado"
T3: Paciente B agenda → slot = "ocupado"  ❌ CONFLITO!
```

**Solução 1: RLock (Reentrant Lock) para estado da agenda**

```python
# backend/app/infra/schedule_state.py

class ScheduleState:
    def __init__(self):
        self.lock = RLock()  # Lock reentrante (permite múltiplas aquisições)
        self.slots = {}
    
    def reservar_slot(self, medico_id: int, datetime: str, paciente_id: int):
        with self.lock:  # Seção crítica protegida
            key = f"{medico_id}_{datetime}"
            
            # Verifica disponibilidade (dentro do lock)
            if key in self.slots and self.slots[key]["status"] != "disponível":
                raise ValueError("Slot já reservado/ocupado")
            
            # Atualiza estado (operação atômica)
            self.slots[key] = {
                "status": "reservado",
                "paciente_id": paciente_id,
                "timestamp": time.time()
            }
            # Lock liberado automaticamente aqui
```

**Solução 2: File Lock para escrita em JSON**

```python
# backend/app/infra/file_locks.py

class FileLock:
    def __enter__(self):
        # Lock exclusivo (bloqueia outras threads/processos)
        if platform.system() == "Windows":
            msvcrt.locking(self.fd, msvcrt.LK_LOCK, size)
        else:
            fcntl.flock(self.fd, fcntl.LOCK_EX)  # LOCK_EX = exclusive
    
    def __exit__(self, *args):
        # Libera lock
        if platform.system() == "Windows":
            msvcrt.locking(self.fd, msvcrt.LK_UNLCK, size)
        else:
            fcntl.flock(self.fd, fcntl.LOCK_UN)
```

**Fluxo de agendamento com sincronização:**

```
1. POST /agenda/reservar
   ├─ Adquire RLock (schedule_state)
   ├─ Verifica disponibilidade
   ├─ Marca como "reservado" (temporário)
   └─ Libera RLock ✅

2. POST /consultas/agendar (via Queue)
   ├─ Worker thread processa tarefa
   ├─ Adquire File Lock (consultas.json)
   ├─ Escreve consulta no arquivo
   ├─ Libera File Lock
   ├─ Adquire RLock
   ├─ Atualiza estado: "reservado" → "ocupado"
   └─ Libera RLock ✅

3. SSE notifica todos os clientes
   └─ Frontend atualiza UI (slot fica vermelho)
```

**📂 Onde encontrar:**
- `backend/app/infra/schedule_state.py` - RLock para agenda
- `backend/app/infra/file_locks.py` - File locking
- `backend/app/infra/task_queue.py` - Queue thread-safe
- `backend/app/controllers/agenda_controller.py` - Fluxo de reserva

---

### 5️⃣ **Chamadas de Sistema: Quais APIs do SO são utilizadas?**

**📚 Conceito teórico:**  
Chamadas de sistema (syscalls) são interfaces entre user space e kernel space. Permitem que programas solicitem serviços do SO (I/O, processos, memória, rede).

**🔧 Syscalls utilizadas no projeto:**

| Syscall              | Descrição                                | Onde é usada                          |
|----------------------|------------------------------------------|---------------------------------------|
| `open()`             | Abre arquivo, retorna file descriptor    | `file_storage.py`, `relatorio_service.py` |
| `write()`            | Escreve dados no buffer                  | Todas as operações de salvamento      |
| `read()`             | Lê dados do arquivo                      | Carregamento de JSON, logs            |
| `close()`            | Fecha descriptor, libera recursos        | Context managers (`with`)             |
| `fsync()`            | Força flush de buffer para disco         | `file_storage.py` (garantia de persistência) |
| `mkdir()`            | Cria diretório                           | `config.py` (estrutura de pastas)     |
| `rename()`           | Renomeia arquivo                         | `backup_service.py`                   |
| `unlink()`           | Remove arquivo                           | Limpeza de relatórios antigos         |
| `flock()` / `LockFileEx()` | Lock exclusivo de arquivo        | `file_locks.py`                       |
| `time()`             | Timestamp do sistema                     | Logs, cache, expiração de reservas    |
| `getpid()`           | Process ID                               | Logging avançado                      |
| `getcwd()`           | Current working directory                | `config.py`                           |

**💻 Exemplo prático:**

```python
# backend/app/infra/file_storage.py

import os

def save(self, filename: str, data: dict):
    filepath = self.base_dir / filename
    
    # Syscall: open()
    with filepath.open('w', encoding='utf-8') as f:
        fd = f.fileno()  # File descriptor (inteiro)
        
        # Syscall: flock() ou LockFileEx()
        with FileLock(f):
            # Syscall: write() (via json.dump)
            json.dump(data, f, ensure_ascii=False, indent=2)
            
            # Syscall: flush (user buffer → kernel buffer)
            f.flush()
            
            # Syscall: fsync() (kernel buffer → disco físico)
            os.fsync(fd)  # Garante durabilidade
        # Lock liberado (syscall: unlock)
    # Syscall: close()
```

**🔍 Camadas de abstração:**

```
Aplicação (Python)
    ↓
Biblioteca padrão (json, pathlib, open)
    ↓
Interpretador Python (CPython)
    ↓
Biblioteca C (libc)
    ↓
[ SYSCALLS - Transição user → kernel ]
    ↓
Kernel do SO (Windows NT, Linux, macOS)
    ↓
Hardware (Disco SSD/HDD, RAM, CPU)
```

**📂 Onde encontrar:**
- `backend/app/infra/file_storage.py` - I/O syscalls
- `backend/app/infra/file_locks.py` - Lock syscalls
- `backend/app/core/config.py` - Filesystem syscalls
- `backend/app/services/backup_service.py` - Archive syscalls

---

### 6️⃣ **Entrada/Saída: Como são realizadas as operações de leitura/escrita?**

**📚 Conceito teórico:**  
Operações de I/O movem dados entre memória e dispositivos externos (disco, rede). Podem ser **síncronas** (bloqueantes) ou **assíncronas** (não-bloqueantes). Buffering otimiza performance.

**🔧 Implementação no projeto:**

**I/O Síncrono (Bloqueante):**
```python
# backend/app/infra/file_storage.py

def load(self, filename: str) -> dict:
    """Leitura síncrona de JSON"""
    filepath = self.base_dir / filename
    
    # Operação bloqueante: thread espera I/O terminar
    with filepath.open('r', encoding='utf-8') as f:
        with FileLock(f, shared=True):  # Shared lock (múltiplos leitores OK)
            data = json.load(f)  # Lê do buffer → deserializa JSON
    
    return data  # Retorna após I/O completo
```

**I/O Assíncrono (Não-bloqueante):**
```python
# backend/app/controllers/consulta_controller.py

@router.post("/consultas/agendar")
async def agendar_consulta(dados: ConsultaCreate):
    """Endpoint assíncrono: retorna imediatamente"""
    
    # Enfileira tarefa (Producer)
    task_queue.enqueue_task({
        "type": "agendar_consulta",
        "data": dados.dict()
    })
    
    # Retorna ANTES do I/O terminar (não-bloqueante)
    return {"status": "processando", "message": "Consulta agendada com sucesso"}
    
    # Worker thread processa I/O em background (Consumer)
```

**Buffering em camadas:**

```
┌─────────────────────────────────────────────┐
│  Aplicação: json.dump(data, file)           │
│              ↓                              │
│  User Buffer (Python): FILE* buffer         │
│              ↓ f.flush()                    │
│  Kernel Buffer: page cache                  │
│              ↓ os.fsync(fd)                 │
│  Disco físico: SSD/HDD                      │
└─────────────────────────────────────────────┘
```

**Geração de PDF (I/O Bound):**
```python
# backend/app/services/relatorio_service.py

def gerar_relatorio_pdf(self, consultas: list) -> str:
    """Operação I/O bound: escrita intensiva em disco"""
    
    pdf = FPDF()
    pdf.add_page()
    
    # Processamento em memória (CPU bound leve)
    for consulta in consultas:
        pdf.cell(0, 10, consulta['paciente'], ln=True)
    
    # I/O bound: escrita em disco
    filename = f"relatorio_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = self.reports_dir / filename
    
    pdf.output(str(filepath))  # Write syscalls
    
    return filename
```

**Streaming de logs (SSE - Server-Sent Events):**
```python
# backend/app/controllers/sistema_controller.py

@router.get("/sistema/logs/stream")
async def stream_logs():
    """Stream assíncrono de logs em tempo real"""
    
    async def event_generator():
        async for log_line in log_service.tail_logs():
            # Yield não-bloqueante: envia dados incrementalmente
            yield f"data: {json.dumps(log_line)}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )
```

**🎯 Tipos de I/O no sistema:**

| Operação              | Tipo          | Bloqueante? | Onde está             |
|-----------------------|---------------|-------------|-----------------------|
| Carregar JSON         | I/O Bound     | Sim         | `file_storage.py`     |
| Salvar consulta       | I/O Bound     | Não (Queue) | `task_service.py`     |
| Gerar PDF             | I/O Bound     | Não (Queue) | `relatorio_service.py`|
| Criar backup ZIP      | I/O Bound     | Não (Queue) | `backup_service.py`   |
| Stream SSE            | I/O Bound     | Não (async) | `sse.py`              |
| Escrever log          | I/O Bound     | Sim (flush) | `log.py`              |

**📂 Onde encontrar:**
- `backend/app/infra/file_storage.py` - I/O síncrono
- `backend/app/infra/task_queue.py` - I/O assíncrono (Queue)
- `backend/app/services/relatorio_service.py` - PDF I/O
- `backend/app/controllers/sistema_controller.py` - Streaming

---

## 🔧 Arquitetura (MVC + Modularização)

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

O sistema implementa **comunicação em tempo real** utilizando SSE para sincronizar múltiplos clientes simultaneamente.

### 🔹 Conceito de SO: Comunicação Inter-Processo (IPC)

SSE é uma forma de **IPC** (Inter-Process Communication) onde o servidor mantém conexão HTTP aberta e envia eventos para múltiplos clientes.

**Analogia com conceitos de SO:**
- **Pipes unidirecionais**: Servidor → Cliente (apenas servidor envia)
- **Broadcasting**: Um evento notifica N clientes
- **Event-driven**: Clientes reagem a eventos assíncronos

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

### 🔹 Conceito de SO: Escalonamento e Concorrência

A fila de tarefas demonstra os seguintes conceitos:
- **Thread scheduling**: SO escala thread worker junto com thread principal
- **Producer/Consumer pattern**: Desacoplamento entre produção e consumo
- **Bounded buffer problem**: Queue() resolve problema clássico de SO
- **Context switching**: CPU alterna entre thread principal e worker

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
| `gerar_relatorio`    | Relatório PDF (FPDF)                           | I/O Bound    |

### 🔹 Benefícios (Conceitos de SO)

- **Não-bloqueante:** Requisições HTTP retornam imediatamente (async I/O)
- **Escalável:** Pode processar múltiplas tarefas em paralelo (thread pool)
- **Resiliente:** Falhas não afetam outras tarefas na fila (isolamento)
- **Logging:** Todas as tarefas são registradas com timestamp (auditoria)
- **FIFO**: Tarefas processadas na ordem de chegada (escalonamento FCFS)

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

Desenvolvido por **João Vitor e Kainã**  
📚 Disciplina: **Sistemas Operacionais**  
🎓 Curso: **Engenharia da Computação**  
📅 Ano: **2025**
