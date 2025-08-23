self.addEventListener('push', event => {
    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/icon.png',
            tag: data.tag || 'notificacao',
            data: { url: data.url || '/' } 
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close(); // fecha a notificação

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Se já tiver uma aba aberta do site, foca nela
            for (const client of clientList) {
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Se não tiver, abre uma nova aba
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});