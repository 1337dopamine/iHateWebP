const toggle = document.getElementById('toggle');
const formatSelect = document.getElementById('format');

chrome.storage.sync.get(['enabled', 'format'], (data) => {
  toggle.checked = data.enabled ?? false;
  formatSelect.value = data.format || 'png';
});

toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});

formatSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ format: formatSelect.value });
});
