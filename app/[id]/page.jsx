"use client"

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Mural from "@/app/components/mural";
import { useEffect } from "react";

export default function page() {
    const params = useParams()
    const uuid = params.id
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.error('Falha ao registrar Service Worker:', error);
            });
    }

    function solicitarPermissao() {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permissão concedida para notificações!');
            } else {
                console.log('Permissão negada para notificações!');
            }
        });
    }

    solicitarPermissao();

    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('Título da Notificação', {
            body: 'Esta é a mensagem da notificação!',
            icon: '/icon.png',
            vibrate: [200, 100, 200],
            tag: 'notificacao-exemplo'
        });
    });

    useEffect(() => {
        var responnse = fetch(`/api/users/${uuid}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    window.location.href = "/";
                }
            })
            .catch(err => {
                console.error("Erro ao verificar usuário:", err);
                window.location.href = "/";
            });
    }, [uuid])

    useEffect(() => {
        const checkToken = async () => {
            if (typeof window === "undefined") return;

            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/";
                return;
            }

            try {
                const res = await fetch(`/api/users/token/${token}`);
                const data = await res.json();

                if (!data.valid) {
                    console.error("Token inválido:", data.error);
                    window.location.href = "/";
                    return;
                }

                console.log("Usuário autenticado com UUID:", data.uuid);
            } catch (err) {
                console.error("Erro ao validar token:", err);
                window.location.href = "/";
            }
        };

        checkToken();
    }, []);


    return (
        <div className="flex flex-col items-center  h-screen">
            <div>
                <div
                    className="polaroid polaroid-scattered top-10 left-10 w-35 h-45 floating"
                    style={{ "--rotation": "-15deg" }}
                >
                    <img
                        src="/login/foto1.jpeg"
                        className="w-full h-30 object-cover rounded-sm"
                    />
                </div>

                <div
                    className="polaroid polaroid-scattered top-20 right-16 w-28 h-32 floating"
                    style={{ "--rotation": "12deg", animationDelay: "1s" }}
                >
                    <img
                        src="/login/foto3.jpeg"
                        className="w-full h-20 object-cover rounded-sm"
                    />
                </div>

                <div
                    className="polaroid polaroid-scattered bottom-32 left-20 w-26 h-30 floating"
                    style={{ "--rotation": "8deg", animationDelay: "2s" }}
                >
                    <img
                        src="/login/foto5.jpeg"
                        className="w-full h-18 object-cover rounded-sm"
                    />
                </div>

                <div
                    className="polaroid polaroid-scattered bottom-20 right-12 w-24 h-28 floating"
                    style={{ "--rotation": "-10deg", animationDelay: "0.5s" }}
                >
                    <img
                        src="/login/foto8.jpeg"
                        className="w-full h-16 object-cover rounded-sm"
                    />
                </div>

                <div
                    className="polaroid polaroid-scattered top-1/2 left-8 w-40 h-35 floating"
                    style={{ "--rotation": "18deg", animationDelay: "1.5s" }}
                >
                    <img
                        src="/login/foto11.jpeg"
                        className="w-full h-25 object-cover rounded-sm"
                    />
                </div>

                <div
                    className="polaroid polaroid-scattered top-1/3 right-8 w-40 h-50 floating"
                    style={{ "--rotation": "-8deg", animationDelay: "2.5s" }}
                >
                    <img
                        src="/login/foto12.jpeg"
                        className="w-full h-30 object-cover rounded-sm"
                    />
                </div>
            </div>
            <header className="flex flex-col items-center justify-center mt-8 mb-6">
                <nav className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20 flex gap-1">
                    <Button
                        variant="ghost"
                        className="px-6 py-2 rounded-xl font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 hover:shadow-sm"
                    >
                        Mural
                    </Button>
                    <Button
                        variant="ghost"
                        className="px-6 py-2 rounded-xl font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 hover:shadow-sm"
                    >
                        Interagir
                    </Button>
                    <Button
                        variant="ghost"
                        className="px-6 py-2 rounded-xl font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 hover:shadow-sm"
                    >
                        Galeria
                    </Button>
                </nav>
            </header>
            <Mural uuid={uuid} />
        </div>
    )
}