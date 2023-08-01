// Handle message passing from content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === 'setAlarm') {
		const { noteText, alarmMinutes } = message;
		const alarmTimestamp = new Date().getTime() + alarmMinutes * 60 * 1000;
		chrome.alarms.create(noteText, { when: alarmTimestamp });

		// Send a response to content script (optional)
		sendResponse({ success: true });
	}
});

// Handle alarm firing event
chrome.alarms.onAlarm.addListener(function (alarm) {
	if (alarm.name === 'quickNoteAlarm') {
		// Retrieve the note text from the alarm name and send a message to the popup
		const noteText = alarm.name;
		chrome.runtime.sendMessage({
			action: 'alarmTriggered',
			noteText,
		});
	}
});

// Register the service worker
chrome.runtime.onInstalled.addListener(() => {
	chrome.alarms.create('quickNoteAlarm', {
		//delayInMinutes: 1, // Optional initial delay for the first alarm
		//periodInMinutes: 1, // Optional interval for periodic alarms (e.g., every minute)
	});
});
