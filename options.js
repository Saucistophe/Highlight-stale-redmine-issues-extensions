const input = document.getElementById('columns');
const saveBtn = document.getElementById('save');

// Charger la config existante
chrome.storage.sync.get({ columns: [] }, (data) => {
  input.value = data.columns.join(',');
});

// Sauvegarder
saveBtn.addEventListener('click', () => {
  const cols = input.value.split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  chrome.storage.sync.set({ columns: cols }, () => {
    alert('Column saved: ' + cols.join(', '));
  });
});
