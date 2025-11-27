import { Tooltip } from "antd";

type Props = {
  slots: Record<string, string>;
  onSelect: (slot: string) => void;
};

export function AgendaCalendar({ slots, onSelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {Object.entries(slots).map(([slot, estado]) => {
        const cor =
          estado === "disponivel" ? "bg-green-600" :
          estado === "reservando" ? "bg-yellow-500 animate-pulse" :
          "bg-red-600";

        return (
          <Tooltip title={`Horário: ${slot} | Estado: ${estado}`} key={slot}>
            <div
              onClick={() => estado === "disponivel" && onSelect(slot)}
              className={`
                p-4 text-center rounded text-white shadow cursor-pointer
                ${cor}
                ${estado !== "disponivel" && "cursor-not-allowed opacity-70"}
              `}
            >
              {slot}
              <div className="text-xs opacity-80 capitalize">
                {estado}
              </div>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}
