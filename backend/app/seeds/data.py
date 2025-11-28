from ..repositories.horario_repository import HorarioRepository
from ..models.horario_model import Horario
from ..repositories.consulta_repository import ConsultaRepository
from ..models.consulta_model import Consulta

async def seed_initial_horarios():
    repo = HorarioRepository()
    existentes = repo.list_all()
    if existentes:
        logger.info("Seed: horários já existentes, ignorando.")
        return

    # Exemplo: cria um horário para cada médico existente
    from ..repositories.medico_repository import MedicoRepository
    medicos = MedicoRepository().list_all()
    horarios = []
    dias = ["segunda", "terca", "quarta"]
    for idx, medico in enumerate(medicos):
        for i, dia in enumerate(dias):
            horario = Horario(
                id=str(uuid4()),
                medico_id=medico.id,
                dia_semana=dia,
                hora_inicio=f"0{8+i}:00",
                hora_fim=f"1{0+i}:00"
            )
            horarios.append(horario)
    for h in horarios:
        repo.save(h)
    logger.info("Horários iniciais criados.")

# Seed para consultas
async def seed_initial_consultas():
    repo = ConsultaRepository()
    existentes = repo.list_all()
    if existentes:
        logger.info("Seed: consultas já existentes, ignorando.")
        return

    from ..repositories.paciente_repository import PacienteRepository
    from ..repositories.medico_repository import MedicoRepository
    pacientes = PacienteRepository().list_all()
    medicos = MedicoRepository().list_all()
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
import asyncio
from datetime import datetime, date
from uuid import uuid4
from ..repositories.paciente_repository import PacienteRepository
from ..models.paciente_model import Paciente
import logging

from ..repositories.medico_repository import MedicoRepository
from ..models.medico_model import Medico

logger = logging.getLogger("seeds")


async def seed_initial_data():
    repo = PacienteRepository()

    # Se já houver pacientes, não faz seed
    existentes = await asyncio.to_thread(repo.list_all)
    if existentes:
        logger.info("Seed ignorado (pacientes.json já contém dados).")
        return

    now = datetime.utcnow()

    pacientes = [
        Paciente(
            id=str(uuid4()),
            nome="Ana Silva",
            cpf="11111111111",
            data_nascimento=date(1990, 5, 10),
            email="ana@example.com",
            telefone="(11) 99999-1111",
            created_at=now,
            updated_at=now,
        ),
        Paciente(
            id=str(uuid4()),
            nome="Bruno Souza",
            cpf="22222222222",
            data_nascimento=date(1985, 8, 23),
            email="bruno@example.com",
            telefone="(11) 98888-2222",
            created_at=now,
            updated_at=now,
        ),
        Paciente(
            id=str(uuid4()),
            nome="Carla Pereira",
            cpf="33333333333",
            data_nascimento=date(1995, 1, 5),
            email="carla@example.com",
            telefone="(11) 97777-3333",
            created_at=now,
            updated_at=now,
        ),
    ]

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