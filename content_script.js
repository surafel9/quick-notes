// Function to send a message to the background script to set an alarm
function setAlarmForNote(noteText, alarmMinutes) {
	chrome.runtime.sendMessage(
		{
			action: 'setAlarm',
			noteText,
			alarmMinutes,
		},
		function (response) {
			if (response.success) {
				// Find the button element and add the "inactive" class
				const alarmButtons =
					document.querySelectorAll('.alarmSetButton');
				for (const button of alarmButtons) {
					if (button.dataset.noteText === noteText) {
						button.classList.add('inactive');
						break; // No need to process other buttons
					}
				}
			}
		}
	);
}

// Receive messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === 'alarmTriggered') {
		const noteText = message.noteText;
		alert(`Scheduled time reached for note: ${noteText}`);
	}
});
