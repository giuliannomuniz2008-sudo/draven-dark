(() => {
  const data = window.RYUSEN_CODEX;
  if (!data) return;
  const panel = document.getElementById('codexPanel');
  const content = document.getElementById('codexContent');
  const toggle = document.getElementById('codexToggle');
  const close = document.getElementById('codexClose');
  const filter = document.getElementById('codexFilter');
  if (!panel || !content || !toggle || !close || !filter) return;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const groups = [...new Set(data.sections.map(item => item.group))];
  filter.innerHTML = '<button class="active" data-codex-filter="all">Tudo</button>' + groups.map(group => `<button data-codex-filter="${esc(group)}">${esc(group)}</button>`).join('');
  const render = selected => {
    content.innerHTML = data.sections.filter(item => selected === 'all' || item.group === selected).map(item =>
      `<article class="codex-entry status-${item.status.toLowerCase().replaceAll(' ','-')}"><div class="codex-meta"><span>${esc(item.status)}</span><small>${esc(item.group)}</small></div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></article>`
    ).join('');
  };
  render('all');
  filter.addEventListener('click', event => {
    const button = event.target.closest('[data-codex-filter]');
    if (!button) return;
    filter.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
    render(button.dataset.codexFilter);
  });
  toggle.addEventListener('click', () => { panel.classList.add('open'); panel.focus(); });
  close.addEventListener('click', () => panel.classList.remove('open'));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') panel.classList.remove('open'); });
})();
