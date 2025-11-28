import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHorariosByMedico, createHorario, updateHorario, deleteHorario} from "../api/horarios";
import type { Horario, HorarioCreate } from "../api/horarios";

export function useHorarios(medicoId?: string) {
    const queryClient = useQueryClient();

    const {
        data: horarios = [],
        isLoading,
        error,
    } = useQuery<Horario[], Error>({
        queryKey: ["horarios", medicoId],
        queryFn: () => (medicoId ? getHorariosByMedico(medicoId) : Promise.resolve([])),
        enabled: !!medicoId,
    });

    const create = useMutation({
        mutationFn: (payload: { medicoId: string; horario: HorarioCreate }) =>
            createHorario(payload.medicoId, payload.horario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["horarios", medicoId] });
        },
    });

    const update = useMutation({
        mutationFn: (payload: { horarioId: string; horario: Partial<HorarioCreate> }) =>
            updateHorario(payload.horarioId, payload.horario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["horarios", medicoId] });
        },
    });

    const remove = useMutation({
        mutationFn: (horarioId: string) => deleteHorario(horarioId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["horarios", medicoId] });
        },
    });

    return {
        horarios,
        isLoading,
        error,
        create: create.mutateAsync,
        update: update.mutateAsync,
        remove: remove.mutateAsync,
    };
}
