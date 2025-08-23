import { subscriptions } from '../subscribe/[uuid]/route';
import webPush from 'web-push';

export async function POST(request) {
    const { title, body, uuid } = await request.json();

    // Envia para todas as subscriptions do usuário
    subscriptions
        .filter(sub => sub.uuid === uuid)
        .forEach(sub => {
            webPush.sendNotification(sub.subscription, JSON.stringify({ title, body, icon: '/icon.png' }))
                .catch(console.error);
        });

    return new Response(JSON.stringify({ message: 'Notificação enviada!' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
