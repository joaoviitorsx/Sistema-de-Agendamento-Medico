# 🏥 Sistema de Agendamento de Consultas Médicas — Backend (FastAPI)
### Projeto Integrado com Conceitos de Sistemas Operacionais (SO)

---

## 📌 Visão Geral

Este projeto implementa um **backend completo** para um **Sistema de Agendamento Médico**, utilizando:

- **FastAPI (Python 3.12)**
- **Arquitetura MVC / Modular**
- **Persistência utilizando arquivos JSON**
- **Fila de tarefas + worker em thread (concorrência)**
- **Atualizações em tempo real via SSE (Server-Sent Events)**
- **Backup automático e manual do sistema**
- **Geração de relatórios em PDF**
- **Gerenciamento de memória e cache**
- **Locks e sincronização de arquivos**
- **Configuração dependente de sistema operacional (Windows/Linux/macOS)**

O projeto foi desenvolvido com foco em aplicar **conceitos reais de Sistemas Operacionais**, tais como:

- Processos e Threads
- Concorrência e Race Conditions
- Escalonamento e Fila Producer/Consumer
- Sistema de Arquivos
- Chamadas de Sistema (syscalls)
- I/O Bound vs CPU Bound
- Gerência de Memória
- Sincronização (Locks, Queues)

---

## 📂 Estrutura de Diretórios

```text
backend/
│── app/
│   ├── controllers/
│   │   ├── paciente_controller.py
│   │   ├── medico_controller.py
│   │   ├── consulta_controller.py
│   │   └── sistema_controller.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   └── logging_config.py
│   │
│   ├── infra/
│   │   ├── file_lock.py
│   │   ├── file_storage.py
│   │   ├── schedule_state.py
│   │   ├── sse_broker.py
│   │   └── task_queue.py
│   │
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── seeds/
│   │   └── data.py
│   │
│   ├── services/
│   │   ├── paciente_service.py
│   │   ├── medico_service.py
│   │   ├── consulta_service.py
│   │   ├── task_service.py
│   │   ├── backup_service.py
│   │   ├── relatorio_service.py
│   │   ├── log_service.py
│   │   └── event_service.py
│   │
│   └── main.py
│
├── banco/
│   ├── pacientes.json
│   ├── medicos.json
│   └── consultas.json
│
└── backups/
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

---

## 📝 Possíveis Extensões Futuras

- Dashboard React com visualização da agenda.
- Notificações live usando SSE.
- Autenticação JWT.
- Logs avançados com filtros.
- Sistema híbrido JSON + SQLite.

---

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
#   S O - - - S i s t e m a - d e - A g e n d a m e n t o  
 