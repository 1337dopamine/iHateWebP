chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: false, format: 'png' });
});
