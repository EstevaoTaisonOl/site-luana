import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Interacoes({ uuid, enviarNotificacao }) {
    const [isNotificationSent, setIsNotificationSent] = useState(false);
    const [saudadesCount, setSaudadesCount] = useState(0);
    const [lastSaudade, setLastSaudade] = useState(null);
    const [ranking, setRankingData] = useState([]);

    const sendSaudade = async () => {
        if (isNotificationSent) return;
        enviarNotificacao(
            uuid,
            "Está com saudades de você",
            ``,
            "saudade"
        );
        try {
            let response = await fetch("/api/users/saudades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uuid }),
            });
            if (!response.ok) {
                throw new Error("Erro ao enviar saudade");
            }

            let data = await response.json();
            console.log("Saudade enviada com sucesso:", data);
            setSaudadesCount(data.saudades);
            setLastSaudade(data.lastDate);
            setIsNotificationSent(true);
        } catch (error) {
            console.error("Erro ao enviar saudade:", error);
        }
        setTimeout(() => {
            setIsNotificationSent(false);
        }, 2000);
    };

    useEffect(() => {
        const fetchSaudades = async () => {
            try {
                let response = await fetch(`/api/users/saudades/${uuid}`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar saudades");
                }
                let data = await response.json();
                setSaudadesCount(data.saudade.sended || 0);
                setLastSaudade(data.saudade.lastDate || null);
            } catch (error) {
                console.error("Erro ao buscar saudades:", error);
            }
        };
        fetchSaudades();
    }, [uuid]);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                let response = await fetch(`/api/users/saudades`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar ranking");
                }
                let data = await response.json();
                console.log("Ranking carregado:", data);
                setRankingData(data.ranking || []);
            } catch (error) {
                console.error("Erro ao buscar ranking:", error);
            }
        };
        fetchRanking();
    }, [saudadesCount]);

    return (
        <div className="min-h-screen p-6 z-50">
            <div className="max-w-5xl mx-auto space-y-8 py-8">
                {/* Cabeçalho */}
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-3">
                        <Heart className="w-12 h-12 text-primary fill-current" />
                        <h1 className="text-6xl font-bold text-foreground tracking-tight">
                            Saudades
                        </h1>
                        <Heart className="w-12 h-12 text-primary fill-current" />
                    </div>
                    <p className="text-muted-foreground text-xl font-medium">
                        Conectando corações através da distância
                    </p>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                {/* Cards principais */}
                <div className="flex justify-center gap-6 flex-wrap">
                    <Card className="bg-card border-border shadow-lg min-h-50 min-w-70 hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg text-card-foreground">
                                    Saudades Enviadas
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-primary mb-1">{saudadesCount}</div>
                            <p className="text-sm text-muted-foreground">mensagens de amor</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border min-h-50 min-w-70 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg text-card-foreground">
                                    Última Saudade
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold text-primary mb-1">
                                {lastSaudade
                                    ? new Date(lastSaudade).toLocaleString("pt-BR")
                                    : "Nunca"}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                tempo desde o último "saudades"
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Botão */}
                <div className="text-center space-y-8">
                    <div
                        className={`transition-all duration-500 ${isNotificationSent ? "scale-110" : "scale-100"
                            }`}
                    >
                        <Button
                            className={`relative overflow-hidden font-semibold text-lg px-12 py-6 rounded-2xl shadow-lg transition-all duration-500 
                ${isNotificationSent
                                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                                    : "bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70"
                                } 
                ${isNotificationSent
                                    ? "animate-pulse"
                                    : "hover:scale-105 hover:shadow-2xl"
                                }
              `}
                            onClick={sendSaudade}
                            disabled={isNotificationSent}
                        >
                            {/* Efeito Glow suave atrás do botão */}
                            <span className="absolute inset-0 bg-white/20 blur-xl opacity-30"></span>

                            <div className="relative flex items-center justify-center gap-2">
                                <Send className="w-6 h-6" />
                                {isNotificationSent ? "✨ Enviado!" : "💌 Enviar Saudades"}
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Ranking */}
                <div className="max-w-3xl mx-auto mt-12 flex items-center flex-col">
                    <h2 className="text-3xl font-bold text-center text-foreground mb-6 flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Quem mais sentiu saudades
                        <Sparkles className="w-6 h-6 text-primary" />
                    </h2>

                    <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden w-10/12">
                        <ul className="divide-y divide-border w-full">
                            {ranking.map((pessoa, index) => (
                                <li
                                    key={pessoa.name}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-bold text-primary">
                                            {index + 1}º
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {pessoa.name}
                                        </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        💌 {pessoa.miss?.sended ?? 0} saudades
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
