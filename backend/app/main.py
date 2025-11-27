
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.controllers import consulta_controller, medico_controller, paciente_controller, sistema_controller, backup_controller, report_controller
from app.infra import task_queue

from .core.log import configure_logging
from .seeds.data import seed_initial_data, seed_initial_medicos, seed_initial_medicos

# configura logging logo no início
configure_logging()

app = FastAPI(
    title="Sistema de Agendamento de Consultas Médicas",
    version="1.0.0",
    description=(
        "API para agendamento de consultas médicas, "
        "projeto para demonstrar conceitos de Sistemas Operacionais."
    ),
)

# Adiciona o middleware CORS após a criação do app
app.add_middleware(
     CORSMiddleware,
     allow_origins=["*"],  # Ou especifique ["http://localhost:5173"] para mais segurança
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"],
)

#rotas
app.include_router(paciente_controller.router, prefix="/pacientes", tags=["Pacientes"])
app.include_router(medico_controller.router, prefix="/medicos", tags=["Medicos"])
app.include_router(consulta_controller.router, prefix="/consultas", tags=["Consultas"])
app.include_router(sistema_controller.router, prefix="/sistema", tags=["Sistema"])
app.include_router(report_controller.router, prefix="/relatorios", tags=["Relatórios"])
app.include_router(backup_controller.router, prefix="/backup", tags=["Backup"])

@app.on_event("startup")
async def on_startup():
    task_queue.task_queue.start()
    
    # cria dados iniciais
    await seed_initial_data()
    await seed_initial_medicos()
    
@app.on_event("shutdown")
async def on_shutdown():
    # para worker da fila
    task_queue.task_queue.stop()        

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "API de agendamento rodando"}