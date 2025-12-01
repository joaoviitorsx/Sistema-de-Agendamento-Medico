import asyncio
import logging
from datetime import datetime, date
from uuid import uuid4

from ..repositories.horario_repository import HorarioRepository
from ..models.horario_model import Horario
from ..repositories.consulta_repository import ConsultaRepository
from ..models.consulta_model import Consulta
from ..repositories.paciente_repository import PacienteRepository
from ..models.paciente_model import Paciente
from ..repositories.medico_repository import MedicoRepository
from ..models.medico_model import Medico

logger = logging.getLogger(__name__)

async def seed_initial_horarios():
    repo = HorarioRepository()
    existentes = await asyncio.to_thread(repo.list_all)
    if existentes:
        logger.info("Seed: horários já existentes, ignorando.")
        return

    # Cria horários para cada médico existente (seg/ter/qua/qui/sex - 8h às 18h)
    medicos = await asyncio.to_thread(MedicoRepository().list_all)
    horarios = []
    dias = ["segunda", "terca", "quarta", "quinta", "sexta"]
    
    for medico in medicos:
        for dia in dias:
            # Cria 5 slots de 2h cada: 8-10, 10-12, 12-14, 14-16, 16-18
            for hora in [8, 10, 12, 14, 16]:
                horario = Horario(
                    id=str(uuid4()),
                    medico_id=medico.id,
                    dia_semana=dia,
                    hora_inicio=f"{hora:02d}:00",
                    hora_fim=f"{hora+2:02d}:00"
                )
                horarios.append(horario)
    
    for h in horarios:
        await asyncio.to_thread(repo.save, h)
    
    logger.info(f"Horários iniciais criados: {len(horarios)} horários para {len(medicos)} médicos.")

# Seed para consultas
async def seed_initial_consultas():
    repo = ConsultaRepository()
    existentes = await asyncio.to_thread(repo.list_all)
    if existentes:
        logger.info("Seed: consultas já existentes, ignorando.")
        return

    pacientes = await asyncio.to_thread(PacienteRepository().list_all)
    medicos = await asyncio.to_thread(MedicoRepository().list_all)
    now = datetime.utcnow()
    consultas = []
    if pacientes and medicos:
        consultas.append(
            Consulta(
                id=str(uuid4()),
                paciente_id=pacientes[0].id,
                medico_id=medicos[0].id,
                inicio=now,
                fim=now,
                status="agendada",
                observacoes="Primeira consulta",
                created_at=now,
                updated_at=now,
            )
        )
    if consultas:
        repo.storage.save_all([repo._serialize(c) for c in consultas])
        logger.info("Consultas iniciais criadas.")


async def seed_initial_data():
    repo = PacienteRepository()

    # Se já houver pacientes, não faz seed
    existentes = await asyncio.to_thread(repo.list_all)
    if existentes:
        logger.info("Seed ignorado (pacientes.json já contém dados).")
        return

    now = datetime.utcnow()

    # cria 10 pacientes de teste para facilitar testes de concorrência
    # Usando IDs auto-incrementais simples (1, 2, 3, etc.)
    pacientes = []
    for i in range(1, 11):
        pacientes.append(
            Paciente(
                id=str(i),
                nome=f"Paciente {i}",
                cpf=f"{10000000000 + i}",
                data_nascimento=date(1990, 1, (i % 28) + 1),
                email=f"paciente{i}@example.com",
                telefone=f"(11) 90000-1{str(i).zfill(3)}",
                created_at=now,
                updated_at=now,
            )
        )

    repo.storage.save_all([repo._serialize(p) for p in pacientes])
    logger.info("Pacientes iniciais criados.")

async def seed_initial_medicos():
    repo = MedicoRepository()
    existentes = await asyncio.to_thread(repo.list_all)

    if existentes:
        logger.info("Seed: médicos já existentes, ignorando.")
        return

    now = datetime.utcnow()

    medicos = [
        Medico(
            id=str(uuid4()),
            nome="Dr. João",
            crm="12345-SP",
            especialidade="Cardiologia",
            email="joao@hospital.com",
            telefone="(11) 98888-1111",
            created_at=now,
            updated_at=now,
        ),
        Medico(
            id=str(uuid4()),
            nome="Dra. Maria",
            crm="67890-SP",
            especialidade="Clínico Geral",
            email="maria@hospital.com",
            telefone="(11) 97777-2222",
            created_at=now,
            updated_at=now,
        ),
    ]

    repo.storage.save_all([repo._serialize(m) for m in medicos])
    logger.info("Médicos iniciais criados.")