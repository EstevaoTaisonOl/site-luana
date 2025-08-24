import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Send, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Interacoes({ uuid, enviarNotificacao }) {
    const [isNotificationSent, setIsNotificationSent] = useState(false)

    const sendSaudade = () => {
        enviarNotificacao(uuid, "Esta com saudes de voce", ``, 'https://site-luana-eight.vercel.app')
    }
    return ( 
        <div className="min-h-screen p-6 z-50">
            <div className="max-w-5xl mx-auto space-y-8 py-8">
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-3">
                        <Heart className="w-12 h-12 text-primary fill-current" />
                        <h1 className="text-6xl font-bold text-foreground tracking-tight">Saudades</h1>
                        <Heart className="w-12 h-12 text-primary fill-current" />
                    </div>
                    <p className="text-muted-foreground text-xl font-medium">Conectando corações através da distância</p>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="flex justify-center gap-6 flex-wrap">
                    <Card className="bg-card border-border shadow-lg min-h-50 min-w-70 hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg text-card-foreground">Saudades Enviadas</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-primary mb-1">1</div>
                            <p className="text-sm text-muted-foreground">mensagens de amor</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border min-h-50 min-w-70  shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg text-card-foreground">Última Saudade</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold text-primary mb-1">"hoje"</div>
                            <p className="text-sm text-muted-foreground">tempo desde o último "saudades"</p>
                        </CardContent>
                    </Card>
                </div>
                    

                <div className="text-center space-y-8">
                    <div className={`transition-all duration-500 ${isNotificationSent ? "scale-110" : "scale-100"}`}>
                        <Button
                            className={`bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-2xl px-20 py-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-primary/20 ${isNotificationSent ? "animate-pulse bg-green-600 hover:bg-green-700" : ""
                                }`}
                            onClick={sendSaudade}
                            disabled={isNotificationSent}
                        >
                            <Send className="w-6 h-6 mr-3" />
                            {isNotificationSent ? "Enviado!" : "Enviar Saudades"}
                        </Button>
                    </div>

                    
                </div>
            </div>
        </div>
    )
}