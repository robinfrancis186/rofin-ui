export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer';
export interface TeamMember { id: string; name: string; email: string; role: TeamRole }
export interface TeamInvitation { id: string; email: string; role: TeamRole; expiresAt: number }
export interface Team { id: string; name: string; revision: number; members: TeamMember[]; invitations: TeamInvitation[] }
export type TeamOperation = { type: 'invite'; email: string; role: TeamRole } | { type: 'member-role' | 'invitation-role'; id: string; role: TeamRole } | { type: 'remove' | 'regenerate' | 'revoke'; id: string };
export const teamRoles: TeamRole[];
export function teamPermissions(role: TeamRole): { manage: boolean; privileged: boolean; edit: boolean };
export function validateTeam(team: Team): Team;
export function applyTeamChange(team: Team, actorId: string, operation: TeamOperation, options?: { now?: number; id?: string; lifetime?: number }): Team;
export function acceptTeamInvitation(team: Team, invitationId: string, name: string, options?: { now?: number; id?: string }): Team;
export function createTeamManager(element: HTMLElement, options: { team: Team; actorId: string; change?: (operation: TeamOperation, context: { signal: AbortSignal; revision: number }) => Promise<{ team: Team | null; invitationUrl?: string; invitationId?: string }>; load?: (context: { signal: AbortSignal }) => Promise<Team> }): { getTeam(): Team | null; refresh(): Promise<void>; destroy(): void };
