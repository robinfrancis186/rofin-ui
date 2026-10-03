import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { applyTeamChange, acceptTeamInvitation } from '../src/js/team-management.js';

const teams = new Map(), sessions = new Map(), invitations = new Map(), lifetime = 900000;
const token = () => randomBytes(32).toString('base64url'), hash = value => createHash('sha256').update(value).digest('hex');
const fail = (status, message) => Object.assign(Error(message), { status });
const send = (response, status, body) => { if (!response.destroyed && !response.writableEnded) response.writeHead(status).end(JSON.stringify(body)); };
const validToken = value => typeof value === 'string' && /^[A-Za-z\d_-]{43}$/.test(value);
function removeTeam(id) { teams.delete(id); for (const [key, value] of sessions) if (value.teamId === id) sessions.delete(key); for (const [key, value] of invitations) if (value.teamId === id) invitations.delete(key); }
function access(teamId, memberId) { const value = token(); sessions.set(hash(value), { teamId, memberId }); return value; }
function invitation(teamId, invitationId, origin) {
  for (const [key, value] of invitations) if (value.teamId === teamId && value.invitationId === invitationId) invitations.delete(key);
  const value = token(); invitations.set(hash(value), { teamId, invitationId });
  return `${origin}/examples/team-invite.html?team=${teamId}&token=${value}`;
}
async function json(request) {
  if ((request.headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/json') throw fail(415, 'Send a JSON body.');
  let length = 0, parts = [];
  for await (const part of request) { length += part.length; if (length <= 8192) parts.push(part); else parts = []; }
  if (length > 8192) throw fail(413, 'The request exceeds 8 KB.');
  if (!request.complete) throw fail(400, 'Incomplete request.');
  let value; try { value = JSON.parse(Buffer.concat(parts).toString('utf8')); } catch { throw fail(400, 'Invalid JSON body.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw fail(400, 'Send a JSON object.'); return value;
}
const shape = (value, fields) => { if (Object.keys(value).some(key => !fields.includes(key))) throw fail(400, 'Unexpected request field.'); };
function holder(request, id) {
  const value = (request.headers.authorization || '').replace(/^Bearer /, ''), session = validToken(value) && sessions.get(hash(value)), record = teams.get(id);
  if (!session || !record || record.expiresAt <= Date.now() || session.teamId !== id || !record.team.members.some(member => member.id === session.memberId)) throw fail(401, 'Workspace access is unavailable or expired.');
  return { record, memberId: session.memberId };
}

/** Private capability-based local sandboxes, not durable accounts or email delivery. */
export async function handleSampleTeam(request, response, url, port) {
  response.setHeader('Content-Type', 'application/json'); response.setHeader('Cache-Control', 'no-store'); response.setHeader('X-Content-Type-Options', 'nosniff'); response.setHeader('Referrer-Policy', 'no-referrer'); response.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  try {
    const origin = new URL(`http://${request.headers.host}`);
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname) || origin.port !== String(port)) throw fail(403, 'Use the local development origin.');
    if (request.headers.origin && request.headers.origin !== origin.origin) throw fail(403, 'Use the local development origin.');
    for (const [id, record] of teams) if (record.expiresAt <= Date.now()) removeTeam(id);
    const suffix = url.pathname.slice('/api/sample-teams'.length);
    if (!suffix) {
      if (request.method !== 'POST') { response.setHeader('Allow', 'POST'); throw fail(405, 'Create your own isolated sample with POST.'); }
      const body = await json(request); shape(body, []);
      // ponytail: 100 private local samples expire after 15 minutes; production supplies durable authenticated services.
      if (teams.size >= 100) throw fail(429, 'The local sample service is full. Retry after samples expire.');
      const id = randomUUID(), team = { id, name: 'Private Studio', revision: 0, members: [{ id: 'robin', name: 'Robin Francis', email: 'robin@example.com', role: 'owner' }, { id: 'jamie', name: 'Jamie Lee', email: 'jamie@example.com', role: 'editor' }, { id: 'alex', name: 'Alex Morgan', email: 'alex@example.com', role: 'viewer' }], invitations: [] }, expiresAt = Date.now() + lifetime;
      teams.set(id, { team, expiresAt }); send(response, 201, { team, actorId: 'robin', accessToken: access(id, 'robin'), expiresAt }); return;
    }
    const match = /^\/([a-f\d-]{36})(\/invitation|\/accept)?$/i.exec(suffix); if (!match) throw fail(404, 'Sample route not found.');
    const [, id, action] = match;
    if (action) {
      const record = teams.get(id), value = url.searchParams.get('token'), invite = validToken(value) && invitations.get(hash(value)), pending = invite?.teamId === id && record?.team.invitations.find(item => item.id === invite.invitationId);
      if (!pending || pending.expiresAt <= Date.now()) throw fail(410, 'This invitation is expired, revoked or already accepted.');
      if (action === '/invitation') {
        if (request.method !== 'GET') { response.setHeader('Allow', 'GET'); throw fail(405, 'Use GET to view this invitation.'); }
        send(response, 200, { workspace: record.team.name, email: pending.email, role: pending.role, expiresAt: pending.expiresAt }); return;
      }
      if (request.method !== 'POST') { response.setHeader('Allow', 'POST'); throw fail(405, 'Use POST to accept this invitation.'); }
      const body = await json(request); shape(body, ['name']);
      // Body reads may overlap; recheck the token and latest state immediately before the synchronous mutation.
      const current = invitations.get(hash(value)); if (!current || current.teamId !== id || !teams.has(id) || teams.get(id).expiresAt <= Date.now()) throw fail(410, 'This invitation is no longer available.');
      const memberId = randomUUID(), latest = teams.get(id), team = acceptTeamInvitation(latest.team, current.invitationId, body.name, { id: memberId }); latest.team = team; invitations.delete(hash(value));
      send(response, 201, { team, actorId: memberId, accessToken: access(id, memberId), expiresAt: latest.expiresAt }); return;
    }
    const { record, memberId } = holder(request, id);
    if (request.method === 'GET') { send(response, 200, { team: record.team, actorId: memberId, expiresAt: record.expiresAt }); return; }
    if (request.method === 'DELETE') { if (record.team.members.find(member => member.id === memberId).role !== 'owner') throw fail(403, 'Only owners can discard this isolated sample.'); removeTeam(id); send(response, 200, { deleted: id }); return; }
    if (request.method !== 'POST') { response.setHeader('Allow', 'GET, POST, DELETE'); throw fail(405, 'Use a supported team action.'); }
    const body = await json(request); shape(body, ['revision', 'operation']);
    const latest = holder(request, id); // Never trust a role or membership captured before an asynchronous body read.
    if (!Number.isSafeInteger(body.revision) || body.revision !== latest.record.team.revision) throw fail(409, 'The team changed. Refresh before applying this action.');
    const invitationId = randomUUID(), team = applyTeamChange(latest.record.team, latest.memberId, body.operation, { id: invitationId, lifetime }); latest.record.team = team;
    let invitationUrl, changedId;
    if (body.operation.type === 'invite') { changedId = invitationId; invitationUrl = invitation(id, changedId, origin.origin); }
    if (body.operation.type === 'regenerate') { changedId = body.operation.id; invitationUrl = invitation(id, changedId, origin.origin); }
    if (body.operation.type === 'revoke') for (const [key, invite] of invitations) if (invite.teamId === id && invite.invitationId === body.operation.id) invitations.delete(key);
    if (body.operation.type === 'remove') for (const [key, session] of sessions) if (session.teamId === id && session.memberId === body.operation.id) sessions.delete(key);
    send(response, 200, { team: team.members.some(member => member.id === latest.memberId) ? team : null, ...(invitationUrl ? { invitationUrl, invitationId: changedId } : {}) });
  } catch (error) { if (!request.complete) request.resume(); send(response, error.status || 400, { error: error.message || 'The team request could not be completed.' }); }
}
export function cleanupSampleTeams() { teams.clear(); sessions.clear(); invitations.clear(); }
