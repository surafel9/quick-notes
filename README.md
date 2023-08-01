
![icon640](https://github.com/surafel9/quick-notes/assets/96924000/bd4ff8de-d5f6-40c5-9bff-f8c7531d9b43)



QuickNote Chrome Extension
QuickNote is a simple note-taking Chrome extension that allows users to create and save quick notes while browsing. The extension provides a minimalistic user interface with features to create, save, and set alarms for notes.

Features
Create and save quick notes while browsing the web.
Set alarms for notes to receive reminders.
Manage saved notes with options to delete and edit alarms.
Minimalistic and user-friendly interface.

QuickNote Popup

How to Use
Installation: Add the QuickNote extension to your Chrome browser from the Chrome Web Store.

Accessing the Extension: Click on the QuickNote extension icon in the Chrome toolbar to open the popup.

Save a Note: Type your note in the text area and click the "Save Note" button. The note will be added to the list of saved notes.

Manage Notes: Each saved note is displayed with its creation timestamp. You can delete notes or set alarms for reminders.

Set Alarms: Click the "Set Alarm" button for a note, enter the time (in minutes), and click "OK" to set an alarm for the note.

Receive Alarms: When the alarm time is reached, a notification will remind you of the note.

Scripts
QuickNote consists of the following main scripts:

Background.js: Manages alarms and handles message passing between extension components.
Content_script.js: Injected into web pages to interact with their content.
Popup.js: Controls the behavior of the popup window displayed when the user clicks on the extension icon in the Chrome toolbar.
Popup.html: Defines the structure of the popup window for the QuickNote extension.
