const webpush = require('web-push');

// VAPID keys should be generated only once.
const vapidKeys = {
    publicKey: 'BCyv0TqH4ZLmsXq83kG9C4vl59_kysN5aWQmPWOwwki70LCjnJaPEobGkLNDel0FGwhelWU693iRNKUDWQYHxds',
    privateKey: 'Qo_JeZIDYVxLP-yg6voagiLoirpgDLchJ6lt6671rO0',
};
webpush.setVapidDetails(
    'mailto:bee051296@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

async function pushNotifications(subscription, title, message, redirectLink) {
    try {
        if (!subscription) return false;
        const options = {
            body: message.substring(0, 50),
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            redirectLink: redirectLink,
            title: title
        };
        await webpush.sendNotification(JSON.parse(subscription), JSON.stringify(options));
        return true;
    } catch (error) {
        // console.error('Error sending notification:', error);
        return false;
    }
}

module.exports = {
    pushNotifications: pushNotifications
};