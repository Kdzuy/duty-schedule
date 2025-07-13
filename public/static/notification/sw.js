self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: {
      redirectLink: data.redirectLink  // Move redirectLink to the data property
    }
  };


  event.waitUntil(
    self.registration.showNotification(data.title || 'Push Notification', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  const redirectLink = event.notification.data && event.notification.data.redirectLink;
  if (redirectLink) {
    event.waitUntil(
      clients.openWindow(redirectLink)
    );
  }
});