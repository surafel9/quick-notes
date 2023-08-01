document.addEventListener('DOMContentLoaded', function () {
	const noteInput = document.getElementById('noteInput');
	const saveButton = document.getElementById('saveButton');
	const notesList = document.getElementById('notesList');
	const request = indexedDB.open('myNotesDB', 1);
	let db;

	// Handle database upgrade or creation
	request.onupgradeneeded = function (event) {
		db = event.target.result;
		db.createObjectStore('notes', { keyPath: 'timestamp' });
	};

	request.onsuccess = function (event) {
		db = event.target.result;
	};

	request.onerror = function (event) {
		console.error('Error opening IndexedDB:', event.target.error);
	};
	// Save the note to storage and display it on the popup
	saveButton.addEventListener('click', function () {
		const noteText = noteInput.value.trim();
		if (noteText !== '') {
			saveNoteToStorage(noteText);
			setAlarmForNote(noteText, 0); // Set alarmMinutes to 0 for no alarm
			noteInput.value = '';
		}
	});

	function saveNoteToStorage(noteText) {
		// Perform IndexedDB operation to save the note
		const transaction = db.transaction(['notes'], 'readwrite');
		const store = transaction.objectStore('notes');
		const timestamp = new Date().toISOString();

		const note = {
			text: noteText,
			timestamp: timestamp,
		};

		const request = store.add(note);

		request.onsuccess = function (event) {
			appendNoteToDOM(note);
		};

		request.onerror = function (event) {
			console.error(
				'Error saving note to IndexedDB:',
				event.target.error
			);
		};
	}

	// Function to append a new note to the popup's DOM
	function appendNoteToDOM(note) {
		const noteElement = document.createElement('div');
		noteElement.textContent =
			note.text +
			' (Created on ' +
			new Date(note.timestamp).toLocaleString() +
			')';
		noteElement.classList.add('noteItem');

		//Create container for buttons
		const btnElement = document.createElement('div');
		btnElement.classList.add('btn-group');
		// Create delete button
		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.addEventListener('click', function () {
			deleteNoteFromStorage(note);
			notesList.removeChild(noteElement);
		});

		const alarmSetButton = document.createElement('button');
		alarmSetButton.textContent = 'Set Alarm';
		alarmSetButton.addEventListener('click', function () {
			const alarmTime = prompt('Enter the alarm time (in minutes):');
			if (alarmTime !== null && !isNaN(alarmTime)) {
				const alarmMinutes = parseInt(alarmTime, 10);
				setAlarmForNote(note.text, alarmMinutes);
				alarmSetButton.textContent = 'Edit Alarm';
				alert(`Alarm set for ${alarmTime} minutes. Note: ${note.text}`);
			}
		});

		alarmSetButton.classList.add('btn');
		btnElement.appendChild(alarmSetButton);
		deleteButton.classList.add('btn', 'deleteBtn');
		btnElement.appendChild(deleteButton);
		noteElement.appendChild(btnElement);
		notesList.appendChild(noteElement);

		// Check if the note has an alarm set and apply the "alarm-active" class
		if (note.alarmTime !== null) {
			alarmSetButton.classList.add('alarm-active');
		}
	}
});
function deleteNoteFromStorage(note) {
	// Perform IndexedDB operation to delete the note
	const transaction = db.transaction(['notes'], 'readwrite');
	const store = transaction.objectStore('notes');

	const request = store.delete(note.timestamp);

	request.onsuccess = function (event) {
		// The note is deleted from IndexedDB, now remove it from the DOM
		notesList.removeChild(noteElement);
	};

	request.onerror = function (event) {
		console.error(
			'Error deleting note from IndexedDB:',
			event.target.error
		);
	};
}

// Function to send a message to the background script to set an alarm
function setAlarmForNote(noteText, alarmMinutes) {
	chrome.runtime.sendMessage(
		chrome.runtime.id,
		{ action: 'setAlarm', noteText, alarmMinutes },
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
chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(function (message) {
		if (message.action === 'alarmTriggered') {
			const noteText = message.noteText;
			alert(`Scheduled time reached for note: ${noteText}`);
		}
	});
});
