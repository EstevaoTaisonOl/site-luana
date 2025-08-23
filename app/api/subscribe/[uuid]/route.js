import webPush from 'web-push';

let subscriptions = []; // Salvar em memória (ou DB em produção)

const publicVapidKey = 'BLtWkX8Fu-PBJZWkl8bvyyPB9RZi1K-lM_-LRv5AQeOXPnltPf_YNmzMZ2DKEeZMh3Jk9QGXXOzPZ2ZJ6A1DgAI';
const privateVapidKey = 'JXwmvSd_ed6klbJbD9C5crTJpcBy76Vf5ls0SSzlYkk';

webPush.setVapidDetails(
    'mailto:estevaotaison56@gmail.com',
    publicVapidKey,
    privateVapidKey
);

export async function POST(request, { params }) {
    const { uuid } = params;
    const body = await request.json();
    const subscription = body.subscription;

    subscriptions.push({ uuid, subscription });
    console.log('Subscription adicionada:', subscription);

    return new Response(JSON.stringify({ message: 'Subscription adicionada com sucesso!' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}

export { subscriptions }; // exporta para usar na rota de envio
