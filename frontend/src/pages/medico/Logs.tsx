import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { logsApi, parseLogLine } from '@/api/logsApi';
import { FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from '@/components/ui/Button';
import './CrudPages.css';

export const Logs = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();

        const eventSource = logsApi.getLogsStream();

        eventSource.onmessage = (event) => {
            // Adiciona no início para manter mais recentes primeiro
            setLogs((prev) => [event.data, ...prev]);
        };

        eventSource.onerror = () => {
            console.error('Erro no stream de logs');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
        // eslint-disable-next-line
    }, []);

    // useEffect removido - não precisa scroll automático
    // Logs mais recentes ficam no topo

    const loadLogs = async () => {
        try {
            setLoading(true);
            const response = await logsApi.getLogs();
            // NÃO inverte - mantém ordem original (mais recente primeiro)
            setLogs(response.logs);
        } catch (error) {
            console.error('Erro ao carregar logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            INFO: 'text-blue-400',
            ERROR: 'text-red-400',
            WARN: 'text-yellow-400',
            WARNING: 'text-yellow-400',
            DEBUG: 'text-purple-400',
        };
        return colors[level] || 'text-gray-300';
    };

    return (
        <div className="crud-page animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1>Logs do Sistema</h1>
                    <p className="text-neutral-medium mt-1">Acompanhe os eventos e atividades do sistema em tempo real</p>
                </div>
                <Button onClick={loadLogs} disabled={loading}>
                    <ReloadOutlined className="mr-2" />
                    Atualizar
                </Button>
            </div>

            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FileTextOutlined className="text-2xl text-primary" />
                        <h2 className="text-xl font-bold text-neutral-black">Histórico de Logs</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-neutral-medium">Carregando logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-8">
                            <FileTextOutlined className="text-5xl text-neutral-light mb-3" />
                            <p className="text-neutral-medium">Nenhum log disponível.</p>
                        </div>
                    ) : (
                        <div
                            className="bg-[#18181b] rounded-md p-0 max-h-[600px] overflow-y-auto font-mono text-sm border border-neutral-800"
                            style={{
                                boxShadow: '0 2px 8px 0 #0002',
                                minHeight: 320,
                            }}
                        >
                            <pre className="m-0 p-4 leading-relaxed text-gray-200">
                                {logs.map((log, index) => {
                                    const parsed = parseLogLine(log);
                                    return parsed ? (
                                        <div key={index} className="flex gap-2">
                                            <span className="text-gray-500 text-xs">[{parsed.timestamp}]</span>
                                            <span className={`font-bold text-xs ${getLevelColor(parsed.level)}`}>[{parsed.level}]</span>
                                            <span className="flex-1 whitespace-pre-wrap">{parsed.message}</span>
                                        </div>
                                    ) : (
                                        <div key={index} className="text-gray-300">{log}</div>
                                    );
                                })}
                            </pre>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
