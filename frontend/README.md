# 🏥 Sistema de Agendamento Médico - Frontend

Frontend completo do Sistema de Agendamento de Consultas Médicas desenvolvido como projeto para a disciplina de Sistemas Operacionais.

## 📋 Sobre o Projeto

Sistema de agendamento médico com duas visões distintas:
- **Paciente**: Interface simples para agendar e visualizar consultas
- **Médico/Admin**: Painel administrativo completo com CRUD de todas as entidades

### 🎯 Características Principais

- ✅ **Sem autenticação**: Navegação direta por URL
- ✅ **Sistema de concorrência visual**: Lock temporário de horários com feedback em tempo real
- ✅ **Design moderno**: UI/UX profissional com componentes reutilizáveis
- ✅ **Arquitetura escalável**: Separação clara de responsabilidades
- ✅ **TypeScript**: Tipagem completa para maior confiabilidade
- ✅ **Real-time**: Logs do sistema em tempo real via Server-Sent Events (SSE)

## 🚀 Tecnologias Utilizadas

- **React 18.2** - Biblioteca principal
- **TypeScript 5.2** - Tipagem estática
- **Vite 5.0** - Build tool e dev server ultra-rápido
- **React Router DOM 6.20** - Roteamento
- **Zustand 4.4** - Gerenciamento de estado global
- **Axios 1.6** - Cliente HTTP
- **date-fns 3.0** - Manipulação de datas
- **Lucide React 0.294** - Ícones modernos
- **React Hot Toast 2.4** - Notificações toast

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── api/                    # Camada de comunicação com backend
│   │   ├── axios.ts           # Configuração do Axios
│   │   ├── pacientesApi.ts    # API de pacientes
│   │   ├── medicosApi.ts      # API de médicos
│   │   ├── consultasApi.ts    # API de consultas
│   │   ├── horariosApi.ts     # API de horários
│   │   ├── agendaApi.ts       # API de agenda (slots)
│   │   └── logsApi.ts         # API de logs
│   │
│   ├── components/
│   │   ├── ui/                # Componentes reutilizáveis do Design System
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loading.tsx
│   │   │
│   │   └── domain/            # Componentes de domínio
│   │       └── SlotSelector.tsx  # Seletor de horários com concorrência
│   │
│   ├── layouts/
│   │   ├── LayoutPaciente.tsx # Layout para visão do paciente
│   │   └── LayoutMedico.tsx   # Layout para visão médico/admin
│   │
│   ├── pages/
│   │   ├── paciente/          # Páginas do paciente
│   │   │   ├── HomePaciente.tsx
│   │   │   ├── AgendarConsulta.tsx
│   │   │   └── ConsultasPaciente.tsx
│   │   │
│   │   └── medico/            # Páginas médico/admin
│   │       ├── DashboardMedico.tsx
│   │       ├── Logs.tsx
│   │       └── index.tsx      # Stubs para CRUD (expandir depois)
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx      # Configuração de rotas
│   │
│   ├── store/                 # Zustand stores
│   │   ├── usePacienteStore.ts
│   │   ├── useMedicoStore.ts
│   │   ├── useConsultaStore.ts
│   │   └── useAgendaStore.ts
│   │
│   ├── styles/
│   │   └── global.css         # Estilos globais e variáveis CSS
│   │
│   ├── types/
│   │   └── index.ts           # Definições de tipos TypeScript
│   │
│   ├── main.tsx               # Entry point da aplicação
│   └── vite-env.d.ts          # Tipos do Vite
│
├── .env                       # Variáveis de ambiente
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend rodando em `http://localhost:8000`

### Passo a Passo

1. **Instalar dependências**
```bash
cd frontend
npm install
```

2. **Configurar variáveis de ambiente**

Edite o arquivo `.env` se necessário:
```env
VITE_API_URL=http://localhost:8000
```

3. **Executar em desenvolvimento**
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

4. **Build para produção**
```bash
npm run build
```

5. **Preview do build**
```bash
npm run preview
```

## 🌐 Rotas do Sistema

### 👤 Visão do Paciente

| Rota | Descrição |
|------|-----------|
| `/paciente/home` | Página inicial do paciente |
| `/paciente/agendar` | Fluxo de agendamento de consulta |
| `/paciente/consultas` | Lista de consultas do paciente |

### 🩺 Visão Médico/Admin

| Rota | Descrição |
|------|-----------|
| `/medico/dashboard` | Dashboard com estatísticas |
| `/medico/pacientes` | Lista de pacientes |
| `/medico/pacientes/novo` | Cadastrar novo paciente |
| `/medico/pacientes/editar/:id` | Editar paciente |
| `/medico/medicos` | Lista de médicos |
| `/medico/medicos/novo` | Cadastrar novo médico |
| `/medico/medicos/editar/:id` | Editar médico |
| `/medico/consultas` | Lista de consultas |
| `/medico/consultas/novo` | Cadastrar nova consulta |
| `/medico/consultas/editar/:id` | Editar consulta |
| `/medico/horarios` | Lista de horários |
| `/medico/horarios/novo` | Cadastrar novo horário |
| `/medico/horarios/editar/:id` | Editar horário |
| `/medico/logs` | Logs do sistema em tempo real |

## 🔒 Sistema de Concorrência Visual

O componente **SlotSelector** implementa controle de concorrência de horários através de um sistema visual de 3 estados:

### Estados dos Slots

#### 🟢 Disponível
- **Cor**: Verde
- **Comportamento**: Clicável
- **Descrição**: Horário livre para agendamento

#### 🟡 Reservado (Lock Temporário)
- **Cor**: Amarelo com animação pulsante
- **Comportamento**: Desabilitado
- **Descrição**: Outro paciente está agendando este horário AGORA
- **Ícone**: Relógio com animação

#### 🔴 Ocupado
- **Cor**: Vermelho
- **Comportamento**: Desabilitado
- **Descrição**: Horário já agendado

### Fluxo de Agendamento com Concorrência

```
1. Paciente A seleciona horário às 14:00
   ↓
2. Frontend chama POST /agenda/reservar
   ↓
3. Backend marca slot como "reservado"
   ↓
4. Outros usuários veem horário AMARELO (pulsando)
   ↓
5. Paciente A confirma agendamento
   ↓
6. Backend chama POST /consultas/agendar
   ↓
7. Slot vira "ocupado" (VERMELHO)
```

### Implementação Técnica

```typescript
// useAgendaStore.ts
const reservarSlot = async (medicoId: string, datetime: string) => {
  await agendaApi.reservar({ medico_id: medicoId, slot: datetime });
  
  // Atualiza estado local
  set((state) => ({
    slots: {
      ...state.slots,
      [medicoId]: {
        ...state.slots[medicoId],
        [datetime]: 'reservado', // Lock temporário
      },
    },
  }));
};
```

## 🎨 Design System

### Paleta de Cores

```css
--color-primary: #1E88E5      /* Azul principal */
--color-success: #43A047      /* Verde (sucesso/disponível) */
--color-danger: #E53935       /* Vermelho (erro/ocupado) */
--color-warning: #FB8C00      /* Laranja (reservado/aguardando) */
--color-gray: #E0E0E0         /* Cinza */
--color-text: #1A1A1A         /* Texto principal */
--color-white: #FFFFFF        /* Branco */
```

### Tipografia

- **Títulos**: Poppins (600-700)
- **Corpo**: Inter (400-500)

### Componentes Base

- **Button**: 4 variantes (primary, secondary, danger, success)
- **Input**: Com label, validação e helper text
- **Card**: Container com sombra e título opcional
- **Table**: Tabela responsiva com paginação
- **Modal**: Overlay com backdrop
- **Loading**: Spinner animado

## 📊 Gerenciamento de Estado

Utilizamos **Zustand** para gerenciamento de estado com 4 stores principais:

### usePacienteStore
- Lista de pacientes
- CRUD completo
- Cache local

### useMedicoStore  
- Lista de médicos
- CRUD completo
- Cache local

### useConsultaStore
- Lista de consultas
- Agendamento assíncrono
- Histórico

### useAgendaStore
- Slots por médico
- Reserva/liberação de horários
- Status em tempo real

## 🔄 Integração com Backend

### Endpoints Utilizados

```typescript
// Pacientes
GET    /pacientes
GET    /pacientes/:id
POST   /pacientes
PUT    /pacientes/:id
DELETE /pacientes/:id

// Médicos
GET    /medicos
GET    /medicos/:id
POST   /medicos
PUT    /medicos/:id
DELETE /medicos/:id

// Consultas
GET    /consultas
GET    /consultas/:id
POST   /consultas
POST   /consultas/agendar    # Agendamento assíncrono
PUT    /consultas/:id
DELETE /consultas/:id

// Horários
GET    /horarios
GET    /horarios/medico/:medico_id
GET    /horarios/:id
POST   /horarios/:medico_id
PUT    /horarios/:id
DELETE /horarios/:id

// Agenda (Slots)
GET    /agenda/slots?days=7
POST   /agenda/reservar
POST   /agenda/liberar

// Logs
GET    /sistema/logs
GET    /sistema/logs/stream   # Server-Sent Events
```

## 🧪 Próximos Passos

### Implementar CRUD Completo
As páginas stub em `/pages/medico/index.tsx` precisam ser expandidas com:
- Formulários completos
- Validação
- Listagens com busca e filtros
- Paginação

### Melhorias Futuras
- [ ] Implementar testes unitários (Vitest)
- [ ] Implementar testes E2E (Playwright)
- [ ] Adicionar SSR (Server-Side Rendering)
- [ ] Implementar PWA (Progressive Web App)
- [ ] Adicionar internacionalização (i18n)
- [ ] Melhorar acessibilidade (WCAG)
- [ ] Adicionar dark mode

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se de que o backend está configurado com CORS habilitado:
```python
# Backend FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Slots não atualizam
Verifique se o backend está retornando os slots no formato correto:
```json
{
  "medico_id": {
    "2025-01-15T14:00:00": "disponivel",
    "2025-01-15T15:00:00": "reservado",
    "2025-01-15T16:00:00": "ocupado"
  }
}
```

### Stream de logs não funciona
Certifique-se de que o navegador suporta EventSource (SSE) e que não há bloqueios de CORS.

## 📝 Conceitos de SO Demonstrados

Este frontend demonstra os seguintes conceitos de Sistemas Operacionais:

1. **Concorrência**: Sistema de locks temporários de horários
2. **Sincronização**: Estado compartilhado entre múltiplos usuários
3. **I/O Assíncrono**: Comunicação não-bloqueante com backend
4. **Streaming**: Server-Sent Events para logs em tempo real
5. **Cache**: Armazenamento local de dados para performance

## 👥 Equipe

Projeto desenvolvido para a disciplina de Sistemas Operacionais.

## 📄 Licença

Este projeto é acadêmico e está sob licença MIT.

---

**Desenvolvido com ❤️ usando React + TypeScript + Vite**
