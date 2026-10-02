import { init, toast, clearToasts } from '../src/js/index.js';
import { initPatterns } from '../src/js/patterns.js';
import { initFormPatterns } from '../src/js/form-patterns.js';
import { createTeamManager, applyTeamChange } from '../src/js/team-management.js';
import { sampleTeam } from './team-demo.js';
import { initEditors } from '../src/js/editors.js';
import { createFileBrowser } from '../src/js/file-browser.js';

init();
const projects = document.querySelector('#projects');
const range = document.querySelector('#report-range');
const preferences = document.querySelector('#preferences'), createForm = document.querySelector('#new-project-form'), inbox = document.querySelector('[data-rf-notifications]');
const rowTemplate = projects.querySelector('tbody tr').cloneNode(true), noticeTemplate = inbox.querySelector('li').cloneNode(true);
const initials = value => { const parts = value.trim().split(/\s+/); return (parts.length > 1 ? parts.slice(0, 2).map(part => [...part][0]).join('') : [...parts[0]].slice(0, 2).join('')).toLocaleUpperCase(); };
const projectRow = (id, name, owner, status, tasks, updated = '2026-09-30') => {
  const row = rowTemplate.cloneNode(true), input = row.querySelector('[data-rf-table-select]');
  row.hidden = false; row.dataset.rfStatus = status; row.dataset.updated = updated; input.value = id; input.checked = input.defaultChecked = false;
  row.querySelector('.rf-sr-only').textContent = `Select ${name}`; row.cells[1].textContent = name; row.cells[2].textContent = owner; row.cells[4].textContent = String(tasks);
  const badge = row.cells[3].querySelector('.rf-badge'); badge.textContent = status; badge.dataset.variant = status === 'Published' ? 'success' : status === 'In progress' ? 'warning' : 'info'; return row;
};
const notice = (id, title, message) => {
  const item = noticeTemplate.cloneNode(true); item.dataset.rfNotificationId = id; item.querySelector('strong').textContent = title; item.querySelector('p').textContent = message;
  item.querySelector('time').textContent = 'September 30, 9:00 AM'; item.querySelector('time').dateTime = '2026-09-30T09:00:00+05:30'; return item;
};
// ponytail: three public in-memory samples; an application supplies authorized durable workspace data.
const workspaces = new Map([
  ['studio', { name: 'Studio', rows: [...projects.querySelectorAll('tbody tr')], nextId: 7, owners: ['Robin', 'Jamie', 'Alex'], members: ['Robin Francis', 'Jamie Lee', 'Alex Morgan'], notices: [...inbox.querySelectorAll('li')], revenue: '$12,480', growth: '↑ 12%', retention: '96.2%', change: '↓ 0.8 points', months: [18, 30, 24, 42, 36, 60], completed: 72, total: 100, prefs: { timezone: 'Asia/Kolkata', updates: true, digest: false }, activity: [['2026-09-29', 'Studio website launched', "Robin shared the team's latest work."], ['2026-09-24', 'A fresh perspective', 'Jamie opened the mobile journal for review.'], ['2026-09-20', 'A foundation to build on', 'The component library reached its next milestone.']] }],
  ['personal', { name: 'Personal', rows: [projectRow('project-1', 'Weekend journal', 'Robin', 'Draft', 4, '2026-09-27'), projectRow('project-2', 'Reading list', 'Robin', 'In progress', 2, '2026-09-28')], nextId: 3, owners: ['Robin'], members: ['Robin Francis'], notices: [notice('personal-draft', 'An idea worth keeping', 'Your weekend journal is ready for another look.')], revenue: '$420', growth: '↑ 8%', retention: '100%', change: '↑ 2 points', months: [2, 4, 3, 5, 4, 6], completed: 6, total: 16, prefs: { timezone: 'Asia/Kolkata', updates: false, digest: true }, activity: [['2026-09-28', 'A few good pages', 'The reading list has a new chapter.'], ['2026-09-27', 'A beginning of your own', 'The weekend journal started as a small idea.']] }],
  ['lab', { name: 'Lab', rows: [projectRow('project-1', 'Motion study', 'Alex', 'In progress', 8, '2026-09-22'), projectRow('project-2', 'Accessible map', 'Robin', 'Draft', 5, '2026-09-26'), projectRow('project-3', 'Prototype kit', 'Alex', 'Published', 12, '2026-09-29')], nextId: 4, owners: ['Robin', 'Alex'], members: ['Robin Francis', 'Alex Morgan'], notices: [notice('lab-map', 'Make room for everyone', 'The accessible map is ready for keyboard review.'), notice('lab-kit', 'A useful little toolkit', 'Alex published the prototype kit.')], revenue: '$2,160', growth: '↑ 5%', retention: '94.5%', change: '↑ 1.2 points', months: [4, 6, 3, 8, 6, 12], completed: 24, total: 48, prefs: { timezone: 'UTC', updates: true, digest: false }, activity: [['2026-09-29', 'A prototype to share', 'Alex published the first toolkit.'], ['2026-09-26', 'An inclusive direction', 'Robin started the accessible map.']] }]
]);
for (const [id, workspace] of workspaces) workspace.team = sampleTeam(id, workspace.name, workspace.members);
for (const [id, workspace] of workspaces) workspace.notes = ({ studio: '### Your next chapter\n\nMake room for **a good idea**.\n\n- [x] Start small\n- [ ] Share something useful', personal: '### A little room of your own\n\nKeep a thought worth coming back to.', lab: '### An experiment worth trying\n\n- [ ] Test the next prototype' })[id];
for (const [id, name, contents] of [['personal', 'Reading list.txt', 'A few good pages.\n'], ['lab', 'Experiment.txt', 'Try a new perspective.\n']]) workspaces.get(id).files = [{ id: `${id}-file`, parentId: null, kind: 'file', name, file: new File([contents], name, { type: 'text/plain' }) }];
const filesHost = document.querySelector('[data-workspace-files-host]'), filesTemplate = filesHost.firstElementChild.cloneNode(true);
let fileBrowser;
function renderFiles() {
  fileBrowser?.destroy(); const workspace = workspaces.get(activeWorkspace), browser = filesTemplate.cloneNode(true);
  filesHost.replaceChildren(browser);
  fileBrowser = createFileBrowser(browser, { entries: workspace.files, onChange: entries => { workspace.files = entries; } });
  workspace.files = fileBrowser.getEntries();
}
const notesHost = document.querySelector('[data-workspace-notes-host]'), notesTemplate = notesHost.firstElementChild.cloneNode(true);
let stopNotes = () => {};
function renderNotes() {
  stopNotes(); const workspace = workspaces.get(activeWorkspace), editor = notesTemplate.cloneNode(true), source = editor.querySelector('[data-rf-editor-source]'), status = editor.querySelector('[data-workspace-notes-status]');
  source.value = source.defaultValue = workspace.notes;
  const form = editor.querySelector('form');
  form.addEventListener('submit', event => { event.preventDefault(); workspace.notes = new FormData(form).get('notes'); form.elements.notes.defaultValue = workspace.notes; status.textContent = 'Notes saved for this workspace during the page session.'; });
  form.addEventListener('input', () => status.textContent = '');
  notesHost.replaceChildren(editor); stopNotes = initEditors(editor);
}
const teamElement = document.querySelector('[data-rf-team-manager]');
let activeWorkspace = 'studio', refreshTimer, teamManager;
function renderTeamMembers() {
  const workspace = workspaces.get(activeWorkspace), members = document.querySelector('[data-workspace-team]'); members.replaceChildren();
  for (const member of workspace.team.members) { const avatar = document.createElement('span'); avatar.className = 'rf-avatar'; avatar.setAttribute('role', 'img'); avatar.setAttribute('aria-label', member.name); avatar.textContent = initials(member.name); members.append(avatar); }
}
function initWorkspaceTeam() {
  teamManager?.destroy(); const workspace = workspaces.get(activeWorkspace);
  teamElement.querySelector('[data-rf-team-note]').textContent = 'Team changes belong to this workspace for the page session. No email, durable accounts or access to application resources is provided.';
  teamManager = createTeamManager(teamElement, { team: workspace.team, actorId: 'robin', change: async operation => { workspace.team = applyTeamChange(workspace.team, 'robin', operation); renderTeamMembers(); updateContextLabels(); return { team: workspace.team }; }, load: async () => workspace.team });
}
initFormPatterns(range);
let stopOwner = initFormPatterns(createForm);
initPatterns(range);
let stopInbox = initPatterns(inbox);
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
function updateContextLabels() {
  const current = workspaces.get(activeWorkspace);
  document.querySelectorAll('[data-workspace-name]').forEach(element => { element.textContent = current.name; });
  document.querySelector('[data-workspace-avatar]').textContent = initials(current.name);
  document.querySelector('[data-dashboard-workspace-trigger]').setAttribute('aria-label', `Switch workspace: ${current.name}`);
  for (const link of document.querySelectorAll('[data-dashboard-workspace]')) {
    const id = link.dataset.dashboardWorkspace, workspace = workspaces.get(id); if (!workspace) continue;
    link.setAttribute('aria-label', `${workspace.name} workspace`); link.querySelector('[data-workspace-option-name]').textContent = workspace.name;
    link.querySelector('[data-workspace-option-avatar]').textContent = initials(workspace.name); link.querySelector('[data-workspace-current]').hidden = id !== activeWorkspace;
    const count = link.querySelector('[data-workspace-member-count]'); if (count) count.textContent = String(workspace.team.members.length);
    if (id === activeWorkspace) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
  }
  for (const link of document.querySelectorAll('[data-dashboard-account-link]')) { const url = new URL(link.href); url.searchParams.set('workspace', activeWorkspace); link.href = url.href; }
}
function renderWorkspaceData() {
  const workspace = workspaces.get(activeWorkspace);
  document.querySelector('[data-workspace-revenue]').textContent = workspace.revenue; document.querySelector('[data-workspace-growth]').textContent = workspace.growth;
  document.querySelector('[data-workspace-retention]').textContent = workspace.retention; document.querySelector('[data-workspace-retention-change]').textContent = workspace.change;
  const maximum = Math.max(...workspace.months);
  document.querySelectorAll('.rf-chart__bars li').forEach((bar, index) => { bar.querySelector('strong').textContent = String(workspace.months[index]); bar.querySelector('i').style.setProperty('--rf-bar', `${workspace.months[index] / maximum * 100}%`); });
  document.querySelectorAll('.dashboard-charts table tbody tr').forEach((row, index) => { row.cells[1].textContent = String(workspace.months[index]); });
  const percent = Math.round(workspace.completed / workspace.total * 1000) / 10, remaining = Math.round((100 - percent) * 10) / 10;
  document.querySelector('.rf-chart__value').setAttribute('stroke-dasharray', `${percent} ${remaining}`); document.querySelector('.rf-chart__ring text').textContent = `${percent}%`;
  document.querySelectorAll('.rf-chart__legend strong').forEach((value, index) => { value.textContent = [`${workspace.completed} tasks · ${percent}%`, `${workspace.total - workspace.completed} tasks · ${remaining}%`, `${workspace.total} tasks`][index]; });
  renderTeamMembers(); renderNotes(); renderFiles();
  const activity = document.querySelector('[data-workspace-activity]'); activity.replaceChildren();
  for (const [date, title, description] of workspace.activity) {
    const item = document.createElement('li'), time = document.createElement('time'), text = document.createElement('p'), heading = document.createElement('strong'), note = document.createElement('span');
    time.dateTime = date; time.textContent = `September ${Number(date.slice(-2))}`; heading.textContent = title; note.className = 'rf-muted'; note.textContent = description;
    text.append(heading, document.createElement('br'), note); item.append(time, text); activity.append(item);
  }
  preferences.elements.workspace.value = preferences.elements.workspace.defaultValue = workspace.name;
  for (const name of ['updates', 'digest']) preferences.elements[name].checked = preferences.elements[name].defaultChecked = workspace.prefs[name];
  preferences.elements.timezone.value = workspace.prefs.timezone;
  for (const option of preferences.elements.timezone.options) option.defaultSelected = option.value === workspace.prefs.timezone;
  updateContextLabels();
}
function syncSection() {
  const links = [...document.querySelectorAll('[aria-label="Workspace"] a')], current = links.find(link => link.hash === (location.hash || '#overview')) || links[0];
  for (const link of links) { if (link === current) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); }
  document.querySelector('.rf-breadcrumb [aria-current="page"]').textContent = current.textContent;
}
function switchWorkspace(id, navigate = false) {
  if (!workspaces.has(id)) return false;
  const changed = id !== activeWorkspace;
  if (changed) {
    teamManager?.destroy();
    for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
    clearToasts(); clearTimeout(refreshTimer); const refresh = document.querySelector('#refresh-dashboard'); refresh.disabled = false; refresh.querySelector('.rf-spinner').hidden = true; projects.removeAttribute('aria-busy');
    stopTable(); stopInbox(); stopOwner(); const previous = workspaces.get(activeWorkspace); previous.rows = [...projects.querySelectorAll('tbody tr')]; previous.notices = [...inbox.querySelectorAll('li')]; previous.nextId = nextId;
    projects.reset(); range.reset(); preferences.reset(); createForm.reset(); createForm.elements.name.setCustomValidity(''); archiveValues = [];
    for (const row of previous.rows) row.querySelector('[data-rf-table-select]').checked = false;
    activeWorkspace = id; const workspace = workspaces.get(id); nextId = workspace.nextId;
    projects.querySelector('tbody').replaceChildren(...workspace.rows); inbox.querySelector('.rf-notifications__list').replaceChildren(...workspace.notices); inbox.querySelector('[role="status"]').textContent = '';
    const owners = createForm.querySelector('select[name="owner"]'); owners.replaceChildren(...workspace.owners.map((name, index) => { const option = document.createElement('option'); option.textContent = name; option.defaultSelected = index === 0; return option; }));
    stopOwner = initFormPatterns(createForm); stopInbox = initPatterns(inbox); stopTable = initPatterns(projects);
    renderBoard();
  }
  if (changed) { renderWorkspaceData(); initWorkspaceTeam(); } else updateContextLabels(); document.querySelector('[data-project-count]').textContent = String(projects.querySelectorAll('tbody tr:not([data-rf-status="Archived"])').length);
  document.querySelector('[data-workspace-status]').textContent = `${workspaces.get(id).name} workspace loaded.${changed ? ' Filters, selections and unsaved forms cleared.' : ''}`;
  if (navigate) { const url = new URL(location.href); url.searchParams.set('workspace', id); url.searchParams.delete('panel'); url.hash = 'overview'; if (url.href !== location.href) history.pushState(null, '', url); }
  syncSection(); if (changed || navigate) document.querySelector('[data-dashboard-workspace-trigger]').focus({ preventScroll: true }); return true;
}
renderBoard();
renderNotes();
renderFiles();
initWorkspaceTeam();
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
    const link = document.createElement('a'); link.href = url; link.download = `${activeWorkspace}-projects.csv`; link.click();
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
    projects.querySelector('tbody').append(projectRow(`project-${nextId++}`, name, form.elements.owner.value, 'Draft', 0));
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
  const workspace = workspaces.get(activeWorkspace); workspace.name = form.elements.workspace.value.trim(); workspace.team.name = workspace.name; workspace.team.revision++; workspace.prefs = { timezone: form.elements.timezone.value, updates: form.elements.updates.checked, digest: form.elements.digest.checked }; updateContextLabels(); initWorkspaceTeam();
  document.querySelector('[data-display-name]').textContent = name;
  document.querySelector('[data-account-name]').textContent = name; document.querySelector('[data-dashboard-account-trigger]').setAttribute('aria-label', `Account menu for ${name}`);
  const avatar = document.querySelector('[data-profile-avatar]'); avatar.textContent = initials(name);
  for (const input of form.querySelectorAll('input')) { if (input.type === 'checkbox') input.defaultChecked = input.checked; else input.defaultValue = input.value; }
  for (const option of form.querySelectorAll('option')) option.defaultSelected = option.selected;
  document.querySelector('#settings-drawer').close(); toast('Preferences saved for this page session.', { title: 'All set', variant: 'success' });
});
document.querySelector('#dashboard-theme').addEventListener('click', event => {
  const dark = document.documentElement.dataset.rfTheme !== 'dark'; document.documentElement.dataset.rfTheme = dark ? 'dark' : 'light'; event.currentTarget.setAttribute('aria-pressed', String(dark));
});
document.querySelector('#refresh-dashboard').addEventListener('click', event => {
  const button = event.currentTarget; button.disabled = true; button.querySelector('.rf-spinner').hidden = false; projects.setAttribute('aria-busy', 'true');
  refreshTimer = setTimeout(() => { button.disabled = false; button.querySelector('.rf-spinner').hidden = true; projects.removeAttribute('aria-busy'); toast('Sample data refreshed. Your session edits are kept.', { variant: 'success' }); }, 500);
});
document.addEventListener('click', event => {
  const link = event.target.closest('a[data-dashboard-workspace], a[data-dashboard-account-link]'); if (!link || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const url = new URL(link.href); if (url.origin !== location.origin || url.pathname !== location.pathname || !workspaces.has(url.searchParams.get('workspace'))) return;
  event.preventDefault();
  if (link.hasAttribute('data-dashboard-workspace')) switchWorkspace(link.dataset.dashboardWorkspace, true);
  else { if (url.href !== location.href) history.pushState(null, '', url); readLocation(); if (url.searchParams.get('panel') !== 'account') document.querySelector(url.hash)?.scrollIntoView(); }
});
document.querySelector('#settings-drawer').addEventListener('close', event => { const url = new URL(location.href); if (!event.target.open && url.searchParams.get('panel') === 'account') { url.searchParams.delete('panel'); history.replaceState(null, '', url); } });
function readLocation() {
  const url = new URL(location.href), requested = url.searchParams.get('workspace') || 'studio', valid = workspaces.has(requested);
  switchWorkspace(valid ? requested : 'studio');
  if (!valid) { url.searchParams.set('workspace', 'studio'); history.replaceState(null, '', url); document.querySelector('[data-workspace-status]').textContent = 'Unknown public sample workspace. Studio is shown.'; }
  if (url.searchParams.get('panel') === 'account') {
    const dialog = document.querySelector('#settings-drawer'); dialog.showModal();
    // Firefox completes native fragment focus after load; focus inside the modal on the next frame.
    requestAnimationFrame(() => { if (dialog.open) preferences.elements.name.focus(); });
  }
}
window.addEventListener('popstate', readLocation); window.addEventListener('hashchange', syncSection);
// Initial fragment navigation completes before the account drawer takes focus.
if (document.readyState === 'complete') readLocation(); else window.addEventListener('load', readLocation, { once: true });
