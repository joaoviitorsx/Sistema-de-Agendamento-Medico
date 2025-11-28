import { useEffect, useRef, useState } from "react";
import {
    Card,
    Button,
    Space,
    Typography,
    Tag,
    message,
} from "antd";
import {
    ClearOutlined,
    PauseOutlined,
    PlayCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export default function MedicoLogsPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [listening, setListening] = useState(true);
    const eventSourceRef = useRef<EventSource | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    /** Autoscroll no final ao adicionar log */
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    /** Carrega histórico inicial */
    const loadInitialLogs = async () => {
        try {
            const res = await fetch("http://localhost:8000/sistema/logs");
            const data = await res.json();
            setLogs(data.logs || []);
        } catch {
            message.error("Erro ao carregar logs iniciais.");
        }
    };

    /** Iniciar conexão SSE */
    const startStream = () => {
        if (eventSourceRef.current) return;

        const es = new EventSource("http://localhost:8000/sistema/logs/stream");
        eventSourceRef.current = es;

        es.onmessage = (event) => {
            if (!listening) return;

            const msg = event.data.trim();
            if (msg) {
                setLogs((prev) => [...prev, msg]);
            }
        };

        es.onerror = () => {
            console.error("Erro no stream de logs, tentando reconectar...");
            eventSourceRef.current?.close();
            eventSourceRef.current = null;

            setTimeout(startStream, 2000);
        };
    };

    const stopStream = () => {
        eventSourceRef.current?.close();
        eventSourceRef.current = null;
    };

    useEffect(() => {
        (async () => {
            await loadInitialLogs();
            startStream();
        })();

        return () => {
            stopStream();
        };
    },);

    const handleToggleListening = (checked: boolean) => {
        setListening(checked);
        message.info(checked ? "Streaming retomado" : "Streaming pausado");
    };

    const handleClear = () => {
        setLogs([]);
    };

    const handleReload = async () => {
        await loadInitialLogs();
        message.success("Histórico de logs recarregado");
    };

    return (
        <Card
            title="Logs do Sistema"
            className="max-w-5xl mx-auto mt-8"
            bordered={false}
            style={{ padding: 24 }}
        >
            <Space style={{ marginBottom: 16 }}>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReload}
                >
                    Recarregar histórico
                </Button>

                <Button
                    icon={listening ? <PauseOutlined /> : <PlayCircleOutlined />}
                    onClick={() => handleToggleListening(!listening)}
                >
                    {listening ? "Pausar streaming" : "Retomar streaming"}
                </Button>

                <Button
                    icon={<ClearOutlined />}
                    danger
                    onClick={handleClear}
                >
                    Limpar tela
                </Button>
            </Space>

            <div
                ref={containerRef}
                style={{
                    height: 500,
                    overflowY: "auto",
                    background: "#ddddddff",
                    borderRadius: 8,
                    padding: 16,
                    fontFamily: "Consolas, monospace",
                    color: "#d1d1d1",
                    boxShadow: "inset 0 0 6px rgba(0,0,0,0.5)",
                }}
            >
                {logs.length === 0 ? (
                    <Text type="secondary">Nenhum log registrado.</Text>
                ) : (
                    logs.map((linha, index) => {
                        const isError = linha.includes("ERROR") || linha.includes("ERRO");
                        const isDebug = linha.includes("DEBUG");
                        const isInfo = linha.includes("INFO");
                        return (
                            <div
                                key={index}
                                style={{
                                    marginBottom: 4,
                                    background: isError ? "rgba(255, 0, 0, 0.12)" : undefined,
                                    borderRadius: isError ? 4 : undefined,
                                    padding: isError ? "2px 8px" : undefined,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {isError && (
                                    <Tag color="red" style={{ marginRight: 8 }}>ERRO</Tag>
                                )}
                                {isDebug && (
                                    <Tag color="blue" style={{ marginRight: 8 }}>DEBUG</Tag>
                                )}
                                {isInfo && (
                                    <Tag color="green" style={{ marginRight: 8 }}>INFO</Tag>
                                )}

                                <Text style={{ whiteSpace: "pre-wrap" }}>{linha}</Text>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
}
