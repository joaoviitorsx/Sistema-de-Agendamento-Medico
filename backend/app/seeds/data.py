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