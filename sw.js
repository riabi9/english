// Classroom Portal service worker: shows notifications and opens the pushed item when tapped.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title || 'Notification', { body: d.body || '', tag: d.tag || 'n', data: { url: d.url || './', open: d.open || '' }, renotify: true }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const data = e.notification.data || {}, url = data.url || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c && c.url.indexOf(self.registration.scope) === 0) { c.postMessage({ open: data.open || '' }); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
