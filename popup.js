document.addEventListener('DOMContentLoaded', function () {
	const noteInput = document.getElementById('noteInput');
	const saveButton = document.getElementById('saveButton');
	const notesList = document.getElementById('notesList');

	// Load existing notes from storage
	chrome.storage.sync.get('notes', function (data) {
		if (data.notes) {
			const notes = data.notes;
			notes.forEach(function (note) {
				appendNoteToDOM(note);
			});
		}
	});

	// Save the note to storage and display it on the popup
	saveButton.addEventListener('click', function () {
		const noteText = noteInput.value.trim();
		if (noteText !== '') {
			chrome.storage.sync.get('notes', function (data) {
				const notes = data.notes || [];
				notes.push({
					text: noteText,
					timestamp: new Date().toISOString(),
				});
				chrome.storage.sync.set({ notes: notes });
				appendNoteToDOM({
					text: noteText,
					timestamp: new Date().toISOString(),
				});
				noteInput.value = '';

				// Ask user if they want to set an alarm for this note
				if (confirm('Do you want to set an alarm for this note?')) {
					const alarmTime = prompt(
						'Enter the alarm time (in minutes):'
					);
					if (alarmTime !== null && !isNaN(alarmTime)) {
						const alarmMinutes = parseInt(alarmTime, 10);
						const alarmTimestamp =
							new Date().getTime() + alarmMinutes * 60 * 1000;
						chrome.alarms.create('quickNoteAlarm', {
							when: alarmTimestamp,
						});
						alert(
							`Alarm set for ${alarmTime} minutes. Note: ${noteText}`
						);
					}
				}
			});
		}
	});

	// Function to append a new note to the popup's DOM
	function appendNoteToDOM(note) {
		const noteElement = document.createElement('div');
		noteElement.textContent =
			note.text +
			' (Created on ' +
			new Date(note.timestamp).toLocaleString() +
			')';
		notesList.appendChild(noteElement);
	}
});

// Handle alarm firing event
chrome.alarms.onAlarm.addListener(function (alarm) {
	if (alarm.name === 'quickNoteAlarm') {
		chrome.storage.sync.get('notes', function (data) {
			const notes = data.notes || [];
			const lastNote = notes[notes.length - 1];
			if (lastNote) {
				alert(`Scheduled time reached for note: ${lastNote.text}`);
			}
		});
	}
});
