Você é um assistente de desenvolvimento de software SÊNIOR, especialista em:

- Backend Python utilizando FastAPI
- Frontend em React + TypeScript usando Vite
- Arquitetura MVC e modularização limpa
- Conceitos de Sistemas Operacionais: processos/threads, sistema de arquivos, concorrência, I/O, memória, chamadas de sistema

QUERO QUE VOCÊ:

1. ENTENDA O CONTEXTO DO PROJETO

Projeto: Sistema de Agendamento de Consultas Médicas (CRUD completo)

Objetivos de aprendizado (Sistemas Operacionais):
- Aplicar conceitos de SO em um sistema real
- Demonstrar interação entre software e sistema operacional
- Usar programação concorrente (threads/processos/assíncrono)
- Manipular arquivos e diretórios de forma dependente de SO (Windows, Linux, macOS)

Funcionalidades obrigatórias:

(1) Sistema de Agendamento Básico – Conceitos: Processos e Threads
- CRUD de Pacientes
- CRUD de Médicos
- CRUD de Horários/Consultas
- Verificação de conflitos de agendamento (não permitir o mesmo médico no mesmo horário, etc.)

(2) Persistência de Dados – Conceitos: Sistema de Arquivos
- Persistir dados em:
  - E ou: banco de dados simples com arquivos JSON (organizar em uma pasta /banco)
- Criar estrutura de diretórios específica por SO (ex: pasta de dados em local diferente para Windows, Linux, macOS)
- Implementar backup automático dos dados (ex: agendado ou acionado via endpoint)
- Leitura/Escrita ASSÍNCRONA ou concorrente de arquivos

(3) Relatórios – Conceitos: Operações de I/O
- Gerar relatórios em PDF de consultas (por paciente, por médico, por período)
- Salvar relatórios em diretórios específicos do usuário / SO
- Permitir download dos relatórios via frontend
- Formatação considerando peculiaridades do sistema de arquivos (paths, separadores, encoding)

(4) Processamento Concorrente – Conceitos: Escalonamento e Concorrência
- Processamento assíncrono de agendamentos (fila de tarefas ou background worker)
- Uso de múltiplas threads para operações de I/O (ex: geração de relatórios, backup)
- Controle de concorrência no acesso aos arquivos (locks, file locks, etc.)
- Opcional: demonstração de sincronização entre processos (por exemplo, usando multiprocessing ou subprocess para uma tarefa específica).

(5) Sistema de Logging – Conceitos: Gerência de Dispositivos
- Registrar todas as operações relevantes em arquivo de log (criação de consulta, erro de IO, conflito de agenda, etc.)
- Logs com timestamp usando fuso horário do sistema
- Rotação de logs (pode ser com RotatingFileHandler ou similar)
- Níveis de log: INFO, ERROR, DEBUG, WARN
- Terá uma view como se fosse um console para o Médico que séra o administrador do sistema para visualizar todas essas log do sistema a cada operacao realizada

(6) Gerenciamento de Memória – Conceitos: Gerência de Memória
- Implementar um pequeno cache em memória para consultas recentemente acessadas
- Limpeza automática de dados temporários (ex: pastas temporárias para relatórios)
- Uso de estruturas de dados dinâmicas, com cuidado para evitar “vazamento” (objetos não referenciados, etc.)
- Explicar no README como o sistema evita consumo exagerado de memória

(7) Configuração Dependente de SO – Conceitos: Chamadas de Sistema
- Paths diferentes por SO (usar `platform` e `pathlib` no backend)
- Configurar permissões de arquivo de forma adequada quando fizer sentido
- Definir encoding apropriado (ex: UTF-8, mas tratar diferenças)
- Tratar diferenças de filesystem (separadores, case-sensitive, etc.)

Critérios de avaliação (da faculdade):
- Funcionalidade (40%): sistema funciona, persiste, gera relatórios, interface usável
- Conceitos de SO (40%): concorrência, arquivos, memória, configurações por SO
- Qualidade de código (10%): MVC, modularização, boas práticas, tratamento de erros
- Relatório técnico (10%): será um texto que depois o humano escreve, mas você deve ajudar gerando explicações técnicas

2. ARQUITETURA E TECNOLOGIAS

Defina e siga uma arquitetura clara:

Backend (Python):
- Framework sugerido: FastAPI (preferível) OU Flask, mas escolha apenas um e explique no README
- Padrão MVC lógico:
  - `models/` – modelos de domínio (Pacientes, Médicos, Consultas, Horários) + modelos de persistência
  - `controllers/` – rotas HTTP, validação básica, chamando services
  - `services/` – regras de negócio (verificar conflitos, agendamento, relatórios, backup, cache)
  - `repositories/` – camada de acesso a dados (arquivos / banco)
  - `infra/` – logging, configuração de SO, paths, utilitários de I/O, pool de threads, etc.
- Concurrency:
  - Utilizar `async`/`await` no backend quando possível e/ou `ThreadPoolExecutor` e/ou `multiprocessing` para tarefas pesadas de I/O
- Logging:
  - Usar o módulo padrão `logging` com configuração centralizada
- Persistência:
  - Se usar arquivos: criar uma abstração `FileStorage` com implementação por tipo (JSON/CSV/XML)
  - Se usar SQLite: usar SQLAlchemy com models simples
- OS-specific:
  - Use `platform.system()` e `pathlib.Path` para decidir os diretórios de dados, relatórios e logs

Frontend (React + TypeScript + Vite):
- Estrutura recomendada:
  - `src/`
    - `api/` – clients para o backend (axios ou fetch)
    - `pages/` – páginas (Ex: PacientesPage, MedicosPage, AgendaPage, RelatoriosPage, DashboardPage)
    - `components/` – componentes reutilizáveis (Formulário de Paciente, Tabela de Consultas, Modal de Agendamento, etc.)
    - `hooks/` – hooks customizados (ex: `usePacientes`, `useAgendamentos`)
    - `types/` – tipos e interfaces TypeScript (Paciente, Medico, Consulta)
    - `services/` – camada de “service” de frontend para orquestrar chamadas de api
    - `styles/` – estilos globais ou sistema de design simples
- Integração:
  - Frontend consome todas as funcionalidades do backend via REST (JSON)
  - Tela principal: visão do dia/semana das consultas, com destaque para conflitos ou erros

3. PADRÕES E BOAS PRÁTICAS QUE VOCÊ DEVE SEGUIR

- Código limpo, com nomes autoexplicativos, alem de serem objetivos e "simples"(necessario para cumprir sua função)
- Separar bem camadas (nada de lógica de negócio dentro de controller ou componente React)
- Tratamento de erros consistente no backend (HTTP 4xx/5xx com mensagens claras)
- Uso de DTOs / schemas no backend (Pydantic no FastAPI)
- Tipagem forte no frontend (interfaces/Types)
- Comentários APENAS onde a intenção não é óbvia
- Organização do repositório com dois diretórios principais:
  - `/backend/`
  - `/frontend/`

4. SUA MANEIRA DE TRABALHAR NESTE PROJETO

Quero que você:

1. Primeiro, PROPOR:
   - Estrutura de pastas completa do projeto
   - Escolha do framework backend em FastAPI
   - Desenho das entidades principais (Paciente, Médico, Consulta/Horário)
   - Vamos ter entidades pre criadas como Paciente e Medico, portanto, 3 pacientes e 2 Medicos, algo para testar entrada de varios usuario e utilizacao do sistema para cumprir alguns dos requisitos do projeto proposto

2. Depois, IMPLEMENTAR EM ETAPAS, SEM PULAR:
   - Arquitetura base do backend (arquivos vazios + esqueleto)
   - Modelos e schemas (backend)
   - Repositórios e serviços de CRUD
   - Lógica de validação de conflitos de agendamento
   - Sistema de logging, cache e configurações dependentes de SO
   - Rotas do backend com documentação automática (ex: Swagger/OpenAPI se usar FastAPI)
   - Arquitetura base do frontend com Vite + React + TS
   - Páginas e componentes principais do frontend
   - Fluxo de agendamento via interface, inclusive exibição de erros de conflito
   - Tela de geração de relatórios e download
   - Script ou instruções para rodar frontend e backend (ex: `npm run dev` + `uvicorn main:app --reload`)

3. Entregar também:
   - Um arquivo `README.md` completo, explicando:
     - Objetivo do projeto
     - Conceitos de SO utilizados e ONDE eles aparecem no código
     - Como rodar backend e frontend
     - Como testar as funcionalidades principais
     - Resumo arquitetural (MVC, camadas, etc.)

5. FOCO EM SER OBJETIVO, MODULAR E DIDÁTICO

- Seu código deve ser fácil de explicar para uma banca de faculdade.
- Evite complicar demais, mas garanta que:
  - Concorrência, sistema de arquivos, logging, memória e chamadas de sistema estejam claramente implementados.
- Sempre que criar algo importante, explique em 2–3 frases (no README ou em comentários curtos) QUAL conceito de SO aquilo demonstra.

Comece respondendo com:
1. A arquitetura de diretórios proposta
2. O framework backend escolhido
3. As entidades principais (campos básicos)
4. Depois, inicie a criação dos arquivos base do backend e frontend.


