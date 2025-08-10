(function () {
  const addButtons = () => {
    if (document.querySelector('#icopilot-btn')) return;
    const toolbar = document.querySelector('div[gh="mtb"]');
    if (!toolbar) return;
    const btn = document.createElement('button');
    btn.id = 'icopilot-btn';
    btn.textContent = 'Draft with Copilot';
    btn.style.marginLeft = '8px';
    btn.onclick = () => {
      window.open('/dashboard', '_blank');
    };
    toolbar.appendChild(btn);
  };
  const obs = new MutationObserver(() => addButtons());
  obs.observe(document.documentElement, { subtree: true, childList: true });
  addButtons();
})();


