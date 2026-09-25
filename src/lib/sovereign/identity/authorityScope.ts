import { AuthorityScope, SovereignNodeIdentity } from "../../../types/sovereign";

const SCOPE_HIERARCHY: Record<AuthorityScope, number> = {
  ROOT_ADMIN: 100,
  MESH_OPERATOR: 80,
  MEMORY_VALIDATOR: 60,
  TASK_DISPATCHER: 50,
  INFERENCE_WORKER: 40,
  SACRED_WITNESS: 20,
  GUEST_SEEKER: 10
};

export function hasAuthorityScope(
  identity: SovereignNodeIdentity,
  requiredScope: AuthorityScope
): boolean {
  if (identity.authorityScopes.includes("ROOT_ADMIN")) return true;
  return identity.authorityScopes.includes(requiredScope);
}

export function hasAllScopes(
  identity: SovereignNodeIdentity,
  requiredScopes: AuthorityScope[]
): boolean {
  if (identity.authorityScopes.includes("ROOT_ADMIN")) return true;
  return requiredScopes.every(scope => identity.authorityScopes.includes(scope));
}

export function getHighestScopeLevel(scopes: AuthorityScope[]): number {
  return scopes.reduce((max, s) => Math.max(max, SCOPE_HIERARCHY[s] || 0), 0);
}

export function canDispatchTo(
  requesterIdentity: SovereignNodeIdentity,
  workerIdentity: SovereignNodeIdentity
): boolean {
  const reqLevel = getHighestScopeLevel(requesterIdentity.authorityScopes);
  const workerLevel = getHighestScopeLevel(workerIdentity.authorityScopes);
  // Root and Operators can dispatch to any worker
  if (reqLevel >= SCOPE_HIERARCHY.TASK_DISPATCHER) return true;
  return reqLevel >= workerLevel;
}
