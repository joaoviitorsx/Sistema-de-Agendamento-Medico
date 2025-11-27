import { useLogs } from "../hooks/useLogs";
import { LogsConsole } from "../components/logs/LogsConsole";

export default function LogsPage() {
  const logs = useLogs();

  return (
    <div className="p-8">
      <LogsConsole logs={logs} />
    </div>
  );
}
