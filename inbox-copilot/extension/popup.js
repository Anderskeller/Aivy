document.getElementById('open-dash')?.addEventListener('click', async () => {
  const url = 'http://localhost:3000/dashboard';
  chrome.tabs.create({ url });
});


