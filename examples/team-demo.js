import { createTeamManager, applyTeamChange, acceptTeamInvitation } from '../src/js/team-management.js';
import { onFormReset } from '../src/js/utils.js';

export const sampleTeam = (id = 'studio', name = 'Studio', names = ['Robin Francis', 'Jamie Lee', 'Alex Morgan']) => ({ id, name, revision: 0, members: names.map((name, index) => ({ id: name.split(' ')[0].toLowerCase(), name, email: `${name.split(' ')[0].toLowerCase()}@example.com`, role: index ? index === 1 ? 'editor' : 'viewer' : 'owner' })), invitations: [] });
const local = () => ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname);
async function call(url, { signal, method = 'GET', body, accessToken } = {}) {
  const response = await fetch(url, { signal, method, credentials: 'omit', headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const result = await response.json(); if (!response.ok) throw Error(result.error || 'The local team service is unavailable.'); return result;
}
const serverOptions = session => ({ team: session.team, actorId: session.actorId, change: (operation, { signal, revision }) => call(`/api/sample-teams/${session.team.id}`, { signal, method: 'POST', accessToken: session.accessToken, body: { revision, operation } }), load: async ({ signal }) => (await call(`/api/sample-teams/${session.team.id}`, { signal, accessToken: session.accessToken })).team });

export function initTeamExamples(root) {
  const cleanups = [];
  for (const element of root.querySelectorAll('[data-rf-team-manager]')) {
    const controller = new AbortController(), start = element.querySelector('[data-rf-team-local]'), back = element.querySelector('[data-rf-team-page]'), note = element.querySelector('[data-rf-team-note]');
    let pageTeam = sampleTeam(), manager;
    function pageSample() { manager?.destroy(); manager = createTeamManager(element, { team: pageTeam, actorId: 'robin', change: async operation => ({ team: pageTeam = applyTeamChange(pageTeam, 'robin', operation) }), load: async () => pageTeam }); start.hidden = !local(); back.hidden = true; note.textContent = 'Page-session sample. Invitations create pending rows; no email or account access is provided.'; }
    pageSample();
    start.addEventListener('click', async () => {
      start.disabled = true;
      try { const session = await call('/api/sample-teams', { signal: controller.signal, method: 'POST', body: {} }); if (controller.signal.aborted) return; manager.destroy(); manager = createTeamManager(element, serverOptions(session)); start.hidden = true; back.hidden = false; note.textContent = 'Private local sample: server-issued tokens enforce team permissions. Links grant their holder the selected role. No email or verified account is created. Data expires after 15 minutes or server stop.'; }
      catch (cause) { if (!controller.signal.aborted) { const error = element.querySelector('[data-rf-team-error]'); error.textContent = cause.message; error.hidden = false; } }
      finally { start.disabled = false; }
    }, { signal: controller.signal });
    back.addEventListener('click', pageSample, { signal: controller.signal });
    cleanups.push(() => { controller.abort(); manager.destroy(); start.hidden = back.hidden = true; });
  }
  for (const element of root.querySelectorAll('[data-rf-team-accept]')) {
    const controller = new AbortController(), form = element.querySelector('form'), join = element.querySelector('[data-rf-invite-join]'), error = element.querySelector('[data-rf-invite-error]'), status = element.querySelector('[data-rf-invite-status]');
    form.addEventListener('submit', event => {
      event.preventDefault(); if (!form.checkValidity() || join.disabled) return; error.hidden = true;
      try { const team = applyTeamChange(sampleTeam(), 'robin', { type: 'invite', email: form.elements.email.value, role: 'viewer' }, { id: 'preview-invite' }); const joined = acceptTeamInvitation(team, 'preview-invite', form.elements.name.value); status.textContent = `${joined.members.at(-1).name} joined the page-session sample as Viewer. No account was created.`; join.disabled = true; }
      catch (cause) { error.textContent = cause.message; error.hidden = false; }
    }, { signal: controller.signal });
    const stopReset = onFormReset(form, () => { join.disabled = false; error.hidden = true; status.textContent = ''; }, controller.signal);
    cleanups.push(() => { controller.abort(); stopReset(); });
  }
  return () => cleanups.forEach(cleanup => cleanup());
}

export async function initLiveInvitation(root) {
  const element = root.querySelector('[data-rf-team-accept]'), form = element.querySelector('form'), join = element.querySelector('[data-rf-invite-join]'), error = element.querySelector('[data-rf-invite-error]'), status = element.querySelector('[data-rf-invite-status]'), note = element.querySelector('[data-rf-invite-note]'), host = root.querySelector('[data-rf-invite-joined]'), params = new URL(location.href).searchParams, id = params.get('team'), token = params.get('token'), controller = new AbortController();
  let manager; join.disabled = true;
  note.textContent = 'This private localhost sample grants the invitation holder its configured role. It does not verify email identity, create a durable account or send email. Access expires after 15 minutes or server stop; reloading loses the access token.';
  const showError = cause => { error.textContent = cause.message; error.hidden = false; };
  if (!local() || !/^[a-f\d-]{36}$/i.test(id || '') || !/^[A-Za-z\d_-]{43}$/.test(token || '')) { showError(Error('Open a valid invitation from an isolated local team. Production invitation services are not configured.')); return; }
  const url = `/api/sample-teams/${id}`, query = `?token=${encodeURIComponent(token)}`;
  try { const invite = await call(`${url}/invitation${query}`, { signal: controller.signal }); element.querySelector('[data-rf-invite-team]').textContent = invite.workspace; element.querySelector('[data-rf-invite-role]').textContent = invite.role; form.elements.email.value = invite.email; join.disabled = false; }
  catch (cause) { showError(cause); }
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (join.disabled || !form.checkValidity()) return; join.disabled = true; error.hidden = true;
    try { const session = await call(`${url}/accept${query}`, { signal: controller.signal, method: 'POST', body: { name: form.elements.name.value } }); if (controller.signal.aborted) return; manager = createTeamManager(host.querySelector('[data-rf-team-manager]'), serverOptions(session)); host.hidden = false; host.querySelector('[data-rf-team-note]').textContent = 'Current membership and permissions come from the isolated local server. No durable account or email identity is provided.'; status.textContent = `Joined ${session.team.name} as ${session.team.members.find(member => member.id === session.actorId).role}. The invitation was consumed.`; form.elements.name.disabled = true; form.querySelector('[type="reset"]').disabled = true; history.replaceState(null, '', location.pathname); }
    catch (cause) { if (!controller.signal.aborted) { showError(cause); join.disabled = false; } }
  }, { signal: controller.signal });
  window.addEventListener('pagehide', () => { controller.abort(); manager?.destroy(); }, { once: true });
}
