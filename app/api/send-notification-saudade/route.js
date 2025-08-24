// app/api/send-notification/route.js
import webPush from 'web-push';
import clientPromise from '@/lib/mongodb'; // sua conexão com MongoDB

const publicVapidKey = 'BLtWkX8Fu-PBJZWkl8bvyyPB9RZi1K-lM_-LRv5AQeOXPnltPf_YNmzMZ2DKEeZMh3Jk9QGXXOzPZ2ZJ6A1DgAI';
const privateVapidKey = 'JXwmvSd_ed6klbJbD9C5crTJpcBy76Vf5ls0SSzlYkk';

webPush.setVapidDetails(
    'mailto:estevaotaison56@gmail.com',
    publicVapidKey,
    privateVapidKey
);

export async function POST(req) {
    const { title, uuid } = await req.json();

    // Conecta ao MongoDB
    const client = await clientPromise;
    const db = client.db('siteLuana');

    // Busca todas as subscriptions, exceto do usuário que enviou
    const userSubs = await db
        .collection('subscriptions')
        .find({ uuid: { $ne: uuid } })
        .toArray();

    // Busca o usuário que enviou
    const user = await db.collection('users').findOne({ uuid });

    if (!user) {
        return new Response(JSON.stringify({ error: 'Usuário não encontrado.' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Corpo e URL da notificação
    const messageBody = `${user.name} esta com saudade de você! ❤️`;
    const notificationUrl = `/${user.uuid}`;

    // Envia a notificação para cada subscription
    await Promise.all(
        userSubs.map(sub =>
            webPush.sendNotification(
                sub.subscription,
                JSON.stringify({
                    title,
                    body: messageBody,
                    icon: '/icon.png',
                    url: notificationUrl // adiciona a URL que será aberta ao clicar
                })
            ).catch(err => console.error('Erro ao enviar notificação:', err))
        )
    );

    return new Response(JSON.stringify({ message: 'Notificação enviada!' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
