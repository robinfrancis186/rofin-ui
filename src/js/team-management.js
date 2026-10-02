import { uid, onFormReset } from './utils.js';

export const teamRoles = ['owner', 'admin', 'editor', 'viewer'];
const title = role => role[0].toUpperCase() + role.slice(1);
const fail = (status, message) => Object.assign(Error(message), { status });
const value = (input, limit, label) => { if (typeof input !== 'string' || !input.trim() || input.trim().length > limit || /[\x00-\x1f\x7f]/.test(input)) throw fail(400, `Enter a valid ${label}.`); return input.trim(); };
const email = input => { const result = value(input, 254, 'email address').toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw fail(400, 'Enter a valid email address.'); return result; };
const role = input => { if (!teamRoles.includes(input)) throw fail(400, 'Choose a valid role.'); return input; };
export function teamPermissions(input) { return { manage: ['owner', 'admin'].includes(input), privileged: input === 'owner', edit: ['owner', 'admin', 'editor'].includes(input) }; }

/** Validate application snapshots before rendering or applying a server policy. */
export function validateTeam(team) {
  if (!team || !Number.isSafeInteger(team.revision) || team.revision < 0 || !Array.isArray(team.members) || team.members.length < 1 || team.members.length > 50 || !Array.isArray(team.invitations) || team.invitations.length > 20) throw fail(400, 'Invalid team snapshot.');
  value(team.id, 64, 'workspace ID'); value(team.name, 80, 'workspace name');
  const ids = new Set(), addresses = new Set();
  for (const member of team.members) { value(member.id, 64, 'member ID'); value(member.name, 80, 'member name'); role(member.role); const address = email(member.email); if (ids.has(member.id) || addresses.has(address)) throw fail(400, 'Duplicate team member.'); ids.add(member.id); addresses.add(address); }
  if (!team.members.some(member => member.role === 'owner')) throw fail(409, 'Keep at least one workspace owner.');
  for (const invite of team.invitations) { value(invite.id, 64, 'invitation ID'); role(invite.role); const address = email(invite.email); if (ids.has(invite.id) || addresses.has(address) || !Number.isSafeInteger(invite.expiresAt) || invite.expiresAt < 1 || invite.expiresAt > 8640000000000000) throw fail(400, 'Invalid invitation.'); ids.add(invite.id); addresses.add(address); }
  return structuredClone(team);
}
const canManage = (actor, target, next = target) => actor === 'owner' || actor === 'admin' && !['owner', 'admin'].includes(target) && !['owner', 'admin'].includes(next);

/** Servers obtain actorId from a verified session/capability, never a request role. */
export function applyTeamChange(input, actorId, operation, { now = Date.now(), id = crypto.randomUUID(), lifetime = 604800000 } = {}) {
  const team = validateTeam(input), actor = team.members.find(member => member.id === actorId);
  if (!Number.isSafeInteger(now) || now < 0) throw fail(400, 'Invalid current time.');
  if (!actor) throw fail(403, 'You no longer belong to this workspace.');
  if (!operation || typeof operation !== 'object' || Array.isArray(operation)) throw fail(400, 'Invalid team action.');
  const fields = { invite: ['type', 'email', 'role'], 'member-role': ['type', 'id', 'role'], remove: ['type', 'id'], 'invitation-role': ['type', 'id', 'role'], regenerate: ['type', 'id'], revoke: ['type', 'id'] }[operation.type];
  if (!fields || Object.keys(operation).some(key => !fields.includes(key))) throw fail(400, 'Invalid team action.');
  if (operation.type === 'invite') {
    const next = role(operation.role), address = email(operation.email);
    if (!canManage(actor.role, next)) throw fail(403, 'Your role cannot invite that role.');
    if (team.members.some(member => email(member.email) === address) || team.invitations.some(invite => email(invite.email) === address)) throw fail(409, 'This address already belongs to a member or invitation.');
    if (team.invitations.length >= 20) throw fail(409, 'Use at most 20 pending invitations.');
    if (!Number.isSafeInteger(lifetime) || lifetime < 1000 || lifetime > 2678400000) throw fail(400, 'Invalid invitation lifetime.');
    team.invitations.push({ id: value(id, 64, 'invitation ID'), email: address, role: next, expiresAt: now + lifetime });
  } else {
    const memberAction = ['member-role', 'remove'].includes(operation.type), target = (memberAction ? team.members : team.invitations).find(item => item.id === operation.id);
    if (!target) throw fail(404, memberAction ? 'Member not found.' : 'Invitation not found.');
    const next = operation.type.endsWith('-role') ? role(operation.role) : target.role;
    const leave = operation.type === 'remove' && target.id === actorId;
    if (!leave && !canManage(actor.role, target.role, next)) throw fail(403, 'Your role cannot change this member or invitation.');
    if (memberAction && target.role === 'owner' && (operation.type === 'remove' || next !== 'owner') && team.members.filter(member => member.role === 'owner').length === 1) throw fail(409, 'Add another owner before removing or changing the last owner.');
    if (operation.type.endsWith('-role')) target.role = next;
    if (operation.type === 'remove') team.members = team.members.filter(member => member.id !== target.id);
    if (operation.type === 'revoke') team.invitations = team.invitations.filter(invite => invite.id !== target.id);
    if (operation.type === 'regenerate') { if (!Number.isSafeInteger(lifetime) || lifetime < 1000 || lifetime > 2678400000) throw fail(400, 'Invalid invitation lifetime.'); target.expiresAt = now + lifetime; }
  }
  team.revision++; return validateTeam(team);
}

/** Call on a server only after validating its invitation token and recipient. */
export function acceptTeamInvitation(input, invitationId, name, { now = Date.now(), id = crypto.randomUUID() } = {}) {
  const team = validateTeam(input), invite = team.invitations.find(item => item.id === invitationId);
  if (!Number.isSafeInteger(now) || now < 0) throw fail(400, 'Invalid current time.');
  if (!invite || invite.expiresAt <= now) throw fail(410, 'This invitation is expired, revoked or already accepted.');
  if (team.members.length >= 50) throw fail(409, 'This workspace has reached its 50-member limit.');
  team.members.push({ id: value(id, 64, 'member ID'), name: value(name, 80, 'display name'), email: invite.email, role: invite.role });
  team.invitations = team.invitations.filter(item => item.id !== invitationId); team.revision++; return validateTeam(team);
}

const instances = new WeakMap();
const node = (tag, className, text) => { const item = document.createElement(tag); if (className) item.className = className; if (text != null) item.textContent = text; return item; };
const button = (text, label) => { const item = node('button', 'rf-button rf-button--outline rf-button--small', text); item.type = 'button'; if (label) item.setAttribute('aria-label', label); return item; };

/** Native forms/tables with application-owned, abortable mutations and reloads. */
export function createTeamManager(element, options) {
  if (instances.has(element)) return instances.get(element);
  let team = validateTeam(options.team), actorId = options.actorId, busy = false, destroyed = false, pending, generation = 0, request;
  const form = element.querySelector('[data-rf-team-invite-form]'), body = element.querySelector('[data-rf-team-members]'), invitations = element.querySelector('[data-rf-team-invitations]'), search = element.querySelector('[data-rf-team-search]'), status = element.querySelector('[data-rf-team-status]'), error = element.querySelector('[data-rf-team-error]'), dialog = element.querySelector('[data-rf-team-confirm]'), confirm = dialog.querySelector('form');
  const originalRows = [...body.childNodes], originalInvites = [...invitations.childNodes], originalDisabled = [...element.querySelectorAll('input,select,button')].map(input => [input, input.disabled]), originalText = [...element.querySelectorAll('[data-rf-team-name],[data-rf-team-count],[data-rf-team-current-role],[data-rf-team-status]')].map(item => [item, item.textContent]), empty = element.querySelector('[data-rf-team-empty]'), originalEmpty = empty.hidden, dialogError = dialog.querySelector('[data-rf-team-confirm-error]');
  const controller = new AbortController(), listen = (target, event, action) => target.addEventListener(event, action, { signal: controller.signal }), links = new Map(), drafts = new Map();
  dialog.setAttribute('aria-labelledby', dialog.querySelector('h3').id ||= uid('rf-team-confirm'));
  const announce = text => { status.textContent = text; }, showError = cause => { const target = dialog.open && dialogError ? dialogError : error; target.textContent = cause.message || 'The team could not be updated. Refresh to confirm its current state.'; target.hidden = false; };
  const actor = () => team?.members.find(member => member.id === actorId), owners = () => team?.members.filter(member => member.role === 'owner').length || 0;
  const allowed = (target, next = target.role) => !!actor() && canManage(actor().role, target.role, next);
  const lastOwner = member => member.role === 'owner' && owners() === 1;
  function roleField(item, kind) {
    const label = node('label', 'rf-field'), text = node('span', 'rf-sr-only', `Role for ${item.name || item.email}`), select = node('select', 'rf-select');
    select.dataset.rfTeamRole = item.id; select.dataset.rfTeamKind = kind;
    for (const value of teamRoles) { const option = node('option', '', title(value)); option.value = value; option.disabled = !allowed(item, value) || kind === 'member' && lastOwner(item) && value !== 'owner'; select.append(option); }
    const draft = drafts.get(item.id); select.value = draft && ![...select.options].find(option => option.value === draft)?.disabled ? draft : item.role;
    select.disabled = !allowed(item) || kind === 'member' && lastOwner(item); label.append(text, select); return label;
  }
  function filter() { const query = search.value.trim().toLocaleLowerCase(); for (const row of body.querySelectorAll('tr')) { const member = team?.members.find(member => member.id === row.dataset.rfTeamMember); row.hidden = !`${member?.name} ${member?.email} ${member?.role}`.toLocaleLowerCase().includes(query); }; element.querySelector('[data-rf-team-empty]').hidden = [...body.querySelectorAll('tr')].some(row => !row.hidden); }
  function controls() {
    if (busy) element.setAttribute('aria-busy', 'true'); else element.removeAttribute('aria-busy');
    const member = actor(), permissions = teamPermissions(member?.role);
    element.querySelector('[data-rf-team-current-role]').textContent = member ? title(member.role) : 'No active membership';
    form.querySelector('[type="submit"]').disabled = busy || !options.change || !permissions.manage;
    form.querySelector('[type="reset"]').disabled = busy;
    form.elements.email.disabled = busy || !options.change || !permissions.manage;
    form.elements.role.disabled = busy || !options.change || !permissions.manage;
    for (const option of form.elements.role.options) option.disabled = !permissions.privileged && ['owner', 'admin'].includes(option.value);
    if (form.elements.role.selectedOptions[0]?.disabled) form.elements.role.value = 'viewer';
    element.querySelector('[data-rf-team-refresh]').disabled = busy || !options.load || !member;
    for (const input of element.querySelectorAll('[data-rf-team-role]')) { const item = (input.dataset.rfTeamKind === 'member' ? team?.members : team?.invitations)?.find(item => item.id === input.dataset.rfTeamRole); input.disabled = busy || !options.change || !item || !allowed(item) || input.dataset.rfTeamKind === 'member' && lastOwner(item); }
    for (const action of element.querySelectorAll('[data-rf-team-action]')) { const operation = JSON.parse(action.dataset.rfTeamAction), select = operation.type.endsWith('-role') && element.querySelector(`[data-rf-team-role="${CSS.escape(operation.id)}"]`), item = [...team?.members || [], ...team?.invitations || []].find(item => item.id === operation.id); action.disabled = busy || !options.change || action.dataset.rfTeamAllowed !== 'true' || !!select && select.value === item?.role; }
    for (const input of confirm.querySelectorAll('button')) input.disabled = busy;
  }
  function action(text, operation, label, permitted) { const item = button(text, label); item.dataset.rfTeamAction = JSON.stringify(operation); item.dataset.rfTeamAllowed = String(permitted); return item; }
  function render() {
    body.replaceChildren(); invitations.replaceChildren();
    if (!actor()) { element.querySelector('[data-rf-team-count]').textContent = '0'; announce('Your membership ended. Workspace access is no longer available.'); controls(); filter(); return; }
    element.querySelector('[data-rf-team-name]').textContent = team.name;
    element.querySelector('[data-rf-team-count]').textContent = String(team.members.length);
    for (const member of team.members) {
      const row = node('tr'), name = node('th'), role = node('td'), actions = node('td'), group = node('div', 'rf-cluster'); name.scope = 'row'; row.dataset.rfTeamMember = member.id;
      name.append(node('strong', '', member.name), node('p', 'rf-help', member.email)); role.append(roleField(member, 'member'));
      group.append(action('Save role', { type: 'member-role', id: member.id }, `Save role for ${member.name}`, allowed(member) && !lastOwner(member)), action(member.id === actorId ? 'Leave' : 'Remove', { type: 'remove', id: member.id }, `${member.id === actorId ? 'Leave workspace as' : 'Remove'} ${member.name}`, !lastOwner(member) && (allowed(member) || member.id === actorId))); actions.append(group);
      if (lastOwner(member)) role.append(node('p', 'rf-help', 'Add another owner before changing or removing the last owner.'));
      row.append(name, role, actions); body.append(row);
    }
    if (!team.invitations.length) invitations.append(node('li', 'rf-help', 'No pending invitations.'));
    for (const invite of team.invitations) {
      const item = node('li', 'rf-team-invitation'), copy = node('div', 'rf-stack'), actions = node('div', 'rf-cluster'), expires = node('time', 'rf-help', `${invite.expiresAt <= Date.now() ? 'Expired' : 'Expires'} ${new Date(invite.expiresAt).toLocaleString()}`); item.dataset.rfTeamInvitation = invite.id; expires.dateTime = new Date(invite.expiresAt).toISOString();
      copy.append(node('strong', '', invite.email), roleField(invite, 'invitation'), expires);
      actions.append(action('Save role', { type: 'invitation-role', id: invite.id }, `Save invitation role for ${invite.email}`, allowed(invite)), action('Regenerate link', { type: 'regenerate', id: invite.id }, `Regenerate invitation for ${invite.email}`, allowed(invite)), action('Revoke', { type: 'revoke', id: invite.id }, `Revoke invitation for ${invite.email}`, allowed(invite)));
      if (links.has(invite.id)) { const label = node('label', 'rf-field'), input = node('input', 'rf-input'), link = node('a', '', 'Open invitation'); input.value = links.get(invite.id); input.readOnly = true; label.append(node('span', 'rf-label', `Invitation link for ${invite.email}`), input); link.href = input.value; link.target = '_blank'; link.rel = 'noopener'; link.referrerPolicy = 'no-referrer'; copy.append(label, link); }
      item.append(copy, actions); invitations.append(item);
    }
    filter(); controls();
  }
  async function run(operation) {
    if (busy || destroyed || !options.change || !actor()) return;
    const previous = team, current = ++generation; request = new AbortController(); busy = true; error.hidden = true; if (dialogError) dialogError.hidden = true; controls();
    try {
      const result = await options.change(operation, { signal: request.signal, revision: previous.revision });
      if (destroyed || current !== generation || request.signal.aborted) return;
      if (!result || !Object.hasOwn(result, 'team')) throw fail(400, 'The application did not confirm this team change.');
      const next = result.team === null ? null : validateTeam(result.team);
      if (next && (next.id !== previous.id || next.revision <= previous.revision)) throw fail(409, 'A stale or invalid team update was returned. Refresh to confirm the current state.');
      let link;
      if (result.invitationUrl) { link = new URL(result.invitationUrl, location.href); if (!['http:', 'https:'].includes(link.protocol) || !next?.invitations.some(invite => invite.id === result.invitationId)) throw fail(400, 'Invalid invitation link.'); }
      team = next; if (operation.id) { drafts.delete(operation.id); if (['revoke', 'regenerate'].includes(operation.type)) links.delete(operation.id); }
      if (link) links.set(result.invitationId, link.href);
      if (operation.type === 'invite') form.reset(); dialog.close(); render(); announce(actor() ? 'Team updated. Your application is responsible for account access and email delivery.' : 'Your membership ended. Workspace access is no longer available.');
      element.dispatchEvent(new CustomEvent('rf:team-change', { bubbles: true, detail: { type: operation.type, team: next && structuredClone(next) } }));
      if (actor()) search.focus({ preventScroll: true });
    } catch (cause) { if (!destroyed && current === generation && !request.signal.aborted) showError(cause); }
    finally { if (!destroyed && current === generation) { busy = false; controls(); } }
  }
  listen(search, 'input', filter);
  listen(element, 'change', event => { const select = event.target.closest('[data-rf-team-role]'); if (select) { drafts.set(select.dataset.rfTeamRole, select.value); controls(); } });
  listen(form, 'submit', event => { event.preventDefault(); if (!form.checkValidity() || !actor() || !teamPermissions(actor().role).manage) return; run({ type: 'invite', email: form.elements.email.value, role: form.elements.role.value }); });
  const stopReset = onFormReset(form, () => { error.hidden = true; }, controller.signal);
  listen(element, 'click', event => {
    const target = event.target.closest('[data-rf-team-action]'); if (!target || target.disabled || busy) return;
    pending = JSON.parse(target.dataset.rfTeamAction);
    if (pending.type.endsWith('-role')) { const select = element.querySelector(`[data-rf-team-role="${CSS.escape(pending.id)}"]`); pending.role = select.value; }
    const item = [...team.members, ...team.invitations].find(item => item.id === pending.id); if (dialogError) dialogError.hidden = true; dialog.querySelector('[data-rf-team-confirm-text]').textContent = `${pending.type === 'remove' ? 'End membership for' : pending.type === 'revoke' ? 'Revoke the invitation for' : pending.type === 'regenerate' ? 'Replace the previous invitation link for' : `Set ${title(pending.role)} access for`} ${item.name || item.email}?`;
    dialog.showModal();
  });
  listen(confirm, 'submit', event => { event.preventDefault(); if (pending) run(pending); });
  listen(dialog, 'cancel', event => { if (busy) event.preventDefault(); });
  listen(dialog, 'click', event => { if (event.target.closest('[data-rf-team-cancel]') && !busy) dialog.close(); });
  async function refresh() {
    if (busy || destroyed || !options.load || !actor()) return;
    const current = ++generation; request = new AbortController(); busy = true; controls(); error.hidden = true;
    try { const result = await options.load({ signal: request.signal }); if (destroyed || current !== generation || request.signal.aborted) return; const next = validateTeam(result); if (next.id !== team.id || next.revision < team.revision) throw fail(409, 'A stale team snapshot was returned.'); team = next; render(); announce('Team refreshed. Unsaved role choices are retained when still allowed.'); }
    catch (cause) { if (!destroyed && current === generation && !request.signal.aborted) showError(cause); }
    finally { if (!destroyed && current === generation) { busy = false; controls(); } }
  }
  listen(element.querySelector('[data-rf-team-refresh]'), 'click', refresh);
  const api = { getTeam: () => team && structuredClone(team), refresh, destroy() { if (destroyed) return; destroyed = true; generation++; request?.abort(); controller.abort(); stopReset(); dialog.close(); body.replaceChildren(...originalRows); invitations.replaceChildren(...originalInvites); for (const [input, disabled] of originalDisabled) input.disabled = disabled; for (const [item, text] of originalText) item.textContent = text; empty.hidden = originalEmpty; error.hidden = true; if (dialogError) dialogError.hidden = true; links.clear(); drafts.clear(); element.removeAttribute('aria-busy'); instances.delete(element); } };
  instances.set(element, api); render(); return api;
}
