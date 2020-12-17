var enablePWA = true;

if(enablePWA) {
    // SERVICE WORKER
    
	if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(function(reg) {
            console.log('Successfully registered service worker', reg);
        }).catch(function(err) {
            console.warn('Error whilst registering service worker', err);
        })
    };
    
	// // NOTIFICATIONS TEMPLATE
	// Notification.requestPermission().then(function(result) {
	// 	if(result === 'granted') {
	// 		exampleNotification();
	// 	}
	// });
	// function exampleNotification() {
	// 	var notifTitle = 'Booter';
	// 	var notifBody = 'Zero-config template for web games.';
	// 	var notifImg = 'img/icons/icon-512.png';
	// 	var options = {
	// 		body: notifBody,
	// 		icon: notifImg
	// 	}
	// 	var notif = new Notification(notifTitle, options);
	// 	setTimeout(exampleNotification, 30000);
	// }
}