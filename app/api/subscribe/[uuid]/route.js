import webPush from 'web-push';

let subscriptions = []; // Salvar em memória (ou DB em produção)

const publicVapidKey = 'BIs3UWhlAi711ax_K6e3KJhqFYrK0ChESkUaG_TsdqZI1KmwCftHamR6_FBznZhzC5xfHQmceAbEK_B4iT7XGlo';
const privateVapidKey = 'x30mBy0k2ED38SSUZGkUuKesM19g71kMAgoeRSviq1';

webPush.setVapidDetails(
    'estevaotaison56@gmail.com',
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
