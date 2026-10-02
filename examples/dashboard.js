import { init, toast } from '../src/js/index.js';
import { initPatterns } from '../src/js/patterns.js';
import { initFormPatterns } from '../src/js/form-patterns.js';

init();
initFormPatterns();
const projects = document.querySelector('#projects');
const range = document.querySelector('#report-range');
initPatterns(range);
initPatterns(document.querySelector('[data-rf-notifications]'));
let stopTable = initPatterns(projects);
let nextId = 7;
let archiveValues = [];
const board = document.querySelector('#project-board');
const cardTemplate = board.querySelector('[data-rf-kanban-item]').cloneNode(true);
let stopBoard = () => {};
const renderBoard = () => {
  stopBoard();
  const columns = [...board.querySelectorAll('[data-rf-kanban-column]')];
  columns.forEach(column => column.querySelector('[data-rf-kanban-list]').replaceChildren());
  for (const row of projects.querySelectorAll('tbody tr')) {
    const column = columns.find(column => column.dataset.rfKanbanColumn === row.dataset.rfStatus);
    if (!column) continue;
    const card = cardTemplate.cloneNode(true), name = row.cells[1].textContent.trim();
    card.dataset.rfKanbanItem = row.querySelector('[data-rf-table-select]').value;
    card.querySelector('[data-rf-item-label]').textContent = name;
    card.querySelector('.rf-help').textContent = `${row.cells[2].textContent.trim()} · ${row.cells[4].textContent.trim()} tasks`;
    card.querySelector('.rf-sr-only').textContent = ` for ${name}`;
    for (const option of card.querySelectorAll('option')) option.defaultSelected = option.value === row.dataset.rfStatus;
    column.querySelector('[data-rf-kanban-list]').append(card);
  }
  stopBoard = initPatterns(board);
};
const selectedRows = values => [...projects.querySelectorAll('tbody tr')].filter(row => values.includes(row.querySelector('[data-rf-table-select]').value));
const mutateTable = (change, syncBoard = true) => {
  stopTable(); change(); stopTable = initPatterns(projects);
  document.querySelector('[data-project-count]').textContent = String(projects.querySelectorAll('tbody tr:not([data-rf-status="Archived"])').length);
  if (syncBoard) renderBoard();
};
renderBoard();
board.addEventListener('rf:kanban-change', event => {
  const row = selectedRows([event.detail.value])[0];
  if (!row) return;
  mutateTable(() => {
    row.dataset.rfStatus = event.detail.to;
    const badge = row.cells[3].querySelector('.rf-badge'); badge.textContent = event.detail.to;
    badge.dataset.variant = event.detail.to === 'Published' ? 'success' : event.detail.to === 'In progress' ? 'warning' : 'info';
  }, false);
});
const period = projects.querySelector('[data-rf-table-filter="period"]');
projects.addEventListener('submit', event => event.preventDefault());
const applyPeriod = () => {
  for (const row of projects.querySelectorAll('tbody tr')) row.dataset.rfPeriod = row.dataset.updated >= range.elements.start.value && row.dataset.updated <= range.elements.end.value ? 'included' : 'excluded';
  period.value = 'included'; period.dispatchEvent(new Event('change', { bubbles: true }));
};

range.addEventListener('submit', event => {
  event.preventDefault(); applyPeriod();
  document.querySelector('#report-status').textContent = `Project updates from ${range.elements.start.value} through ${range.elements.end.value}, inclusive. Charts keep their fixed sample period.`;
});
range.addEventListener('reset', event => {
  setTimeout(() => {
    if (event.defaultPrevented) return;
    period.value = ''; period.dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#report-status').textContent = 'All project dates shown. Charts show the fixed April–September sample.';
  }, 0);
});

projects.addEventListener('rf:table-action', event => {
  const { action, values } = event.detail;
  if (action === 'archive') {
    archiveValues = [...values];
    document.querySelector('#archive-count').textContent = `${values.length} selected project${values.length === 1 ? '' : 's'}.`;
    document.querySelector('#archive-dialog').showModal();
  }
  if (action === 'export') {
    const csvCell = value => {
      let text = String(value);
      // Keep sample/user text from becoming a spreadsheet formula when CSV is opened.
      if (/^[\u0000-\u0020]*[=+@-]/.test(text)) text = "'" + text;
      return '"' + text.replaceAll('"', '""') + '"';
    };
    const rows = [['Project', 'Owner', 'Status', 'Tasks'], ...selectedRows(values).map(row => [...row.cells].slice(1).map(cell => cell.textContent.trim()))];
    const csv = rows.map(row => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'studio-projects.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`Exported ${values.length} selected projects.`, { title: 'CSV ready', variant: 'success' });
  }
});
document.querySelector('#confirm-archive').addEventListener('click', () => {
  mutateTable(() => {
    for (const row of selectedRows(archiveValues)) {
      row.dataset.rfStatus = 'Archived'; row.cells[3].querySelector('.rf-badge').textContent = 'Archived'; row.cells[3].querySelector('.rf-badge').dataset.variant = 'info';
      row.querySelector('[data-rf-table-select]').checked = false;
    }
  });
  document.querySelector('#archive-dialog').close();
  // The invoking action becomes disabled after archiving; restore focus to a usable control.
  projects.querySelector('[data-rf-table-search]').focus();
  toast(`Archived ${archiveValues.length} sample projects.`, { title: 'Workspace updated', variant: 'success' });
});

document.querySelector('#new-project-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  if (!name) { form.elements.name.setCustomValidity('Enter a project name.'); form.elements.name.reportValidity(); return; }
  mutateTable(() => {
    const row = document.createElement('tr'); row.dataset.rfStatus = 'Draft'; row.dataset.updated = '2026-09-30';
    const selection = row.insertCell();
    const label = document.createElement('label'); label.className = 'rf-check';
    const input = document.createElement('input'); input.type = 'checkbox'; input.name = 'projects'; input.value = `project-${nextId++}`; input.dataset.rfTableSelect = ''; input.setAttribute('aria-label', `Select ${name}`);
    label.append(input); selection.append(label);
    const heading = document.createElement('th'); heading.scope = 'row'; heading.textContent = name; row.append(heading);
    row.insertCell().textContent = form.elements.owner.value;
    const status = document.createElement('span'); status.className = 'rf-badge'; status.textContent = 'Draft'; row.insertCell().append(status);
    row.insertCell().textContent = '0'; projects.querySelector('tbody').append(row);
  });
  // Clear search/status filters so the new draft is visible; date filters keep their explicit range.
  projects.reset(); projects.querySelector('[data-rf-table-page-size]').value = '20';
  if (period.value) applyPeriod(); else period.dispatchEvent(new Event('change', { bubbles: true }));
  form.reset(); document.querySelector('#new-project-dialog').close();
  toast(`Created ${name}.`, { title: 'A new beginning', variant: 'success' });
});
document.querySelector('#new-project-form [name="name"]').addEventListener('input', event => event.target.setCustomValidity(''));

document.querySelector('#preferences').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.elements.workspace.value.trim() || !form.elements.name.value.trim()) {
    toast('Enter a workspace and display name.', { title: 'A little more detail', variant: 'warning' }); return;
  }
  const name = form.elements.name.value.trim();
  document.querySelectorAll('[data-workspace-name]').forEach(element => { element.textContent = form.elements.workspace.value.trim(); });
  document.querySelector('[data-display-name]').textContent = name;
  const avatar = document.querySelector('[data-profile-avatar]'); avatar.setAttribute('aria-label', name); avatar.textContent = name.split(/\s+/).slice(0, 2).map(part => [...part][0]).join('').toLocaleUpperCase();
  for (const input of form.querySelectorAll('input')) { if (input.type === 'checkbox') input.defaultChecked = input.checked; else input.defaultValue = input.value; }
  for (const option of form.querySelectorAll('option')) option.defaultSelected = option.selected;
  document.querySelector('#settings-drawer').close(); toast('Preferences saved for this page session.', { title: 'All set', variant: 'success' });
});
document.querySelector('#dashboard-theme').addEventListener('click', event => {
  const dark = document.documentElement.dataset.rfTheme !== 'dark'; document.documentElement.dataset.rfTheme = dark ? 'dark' : 'light'; event.currentTarget.setAttribute('aria-pressed', String(dark));
});
document.querySelector('#refresh-dashboard').addEventListener('click', event => {
  const button = event.currentTarget; button.disabled = true; button.querySelector('.rf-spinner').hidden = false; projects.setAttribute('aria-busy', 'true');
  setTimeout(() => { button.disabled = false; button.querySelector('.rf-spinner').hidden = true; projects.removeAttribute('aria-busy'); toast('Sample data refreshed. Your session edits are kept.', { variant: 'success' }); }, 500);
});
document.querySelectorAll('[aria-label="Workspace"] a').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('[aria-label="Workspace"] a').forEach(other => other.removeAttribute('aria-current')); link.setAttribute('aria-current', 'page');
}));
