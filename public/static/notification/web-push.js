
async function subscribeToPush() {
  try {
    if (window.Notification) {
      const permissionResult = await Notification.requestPermission();

      if (permissionResult === 'denied') {
        console.log("Thông báo bị chặn");
        return;
      } else if (permissionResult === 'default') {
        console.log("Có thể Thông báo");
        return;
      }

      if (permissionResult === 'granted') {
        // Đăng ký thông báo đẩy
        const registration = await navigator.serviceWorker.register('/static/notification/sw.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BCyv0TqH4ZLmsXq83kG9C4vl59_kysN5aWQmPWOwwki70LCjnJaPEobGkLNDel0FGwhelWU693iRNKUDWQYHxds'
        });

        // Gửi subscription đến máy chủ (bạn cần triển khai API để lưu subscription)
        $.ajax({
          url: '/admin/subscribe',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(subscription),
          success: function (data) {
            console.log('Success:', data);
          },
          error: function (error) {
            console.error('Error:', error);
          }
        });
      };

    } else {
      // Code xử lý cho trường hợp Notification không được hỗ trợ
      console.log("Without Notice");
    };
    // alert('Push subscription successful!');
  } catch (error) {
    console.error('Error subscribing to push:', error);
  }
};
// Kiểm tra xem trình duyệt đã có đăng ký thông báo hay chưa
async function isPushNotificationSupported() {
  try {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.getRegistration();

      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        return subscription !== null;
      }
    }

    return false;
  } catch (error) {
    // Xử lý lỗi ở đây
    console.error('Error checking push notification support:', error);
    return false;
  }
}

// Sử dụng hàm kiểm tra
isPushNotificationSupported().then((isSubscribed) => {
  if (isSubscribed) {
    console.log('Client đã đăng ký thông báo. Reset lại để đăng ký mới.');
  } else {
    console.log('Client chưa đăng ký thông báo');
    subscribeToPush();
  }
});
