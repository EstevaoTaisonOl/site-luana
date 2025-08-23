import webPush from 'web-push';


const publicVapidKey = 'BLtWkX8Fu-PBJZWkl8bvyyPB9RZi1K-lM_-LRv5AQeOXPnltPf_YNmzMZ2DKEeZMh3Jk9QGXXOzPZ2ZJ6A1DgAI';
const privateVapidKey = 'JXwmvSd_ed6klbJbD9C5crTJpcBy76Vf5ls0SSzlYkk';

webPush.setVapidDetails(
    'mailto:estevaotaison56@gmail.com',
    publicVapidKey,
    privateVapidKey
);

import clientPromise from '@/lib/mongodb'; // sua conexão com o MongoDB

export async function POST(req, { params }) {
    const { uuid } = params;
    const body = await req.json();
    const subscription = body.subscription;

    const client = await clientPromise;
    const db = client.db('siteLuana');

    // Salva a subscription do usuário
    await db.collection('subscriptions').updateOne(
        { uuid },
        { $set: { subscription } },
        { upsert: true }
    );

    return new Response(JSON.stringify({ message: 'Subscription salva no MongoDB!' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}
