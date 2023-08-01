// Background script for the extension
chrome.runtime.onInstalled.addListener(function () {
	// Set up default data in Chrome storage
	chrome.storage.sync.set({ notes: [] });
});
