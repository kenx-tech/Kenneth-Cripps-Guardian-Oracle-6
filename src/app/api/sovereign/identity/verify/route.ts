import { verifyNodeCredentials } from "../../../../../lib/sovereign/identity/credentialVerifier";
import { SovereignNodeIdentity } from "../../../../../types/sovereign";

export async function handleIdentityVerifyRoute(req: any, res: any) {
  const { identity, challenge, signature } = req.body || {};

  if (!identity || !identity.nodeId || !identity.publicKey) {
    return res.status(400).json({ valid: false, reason: "Missing identity credentials (nodeId or publicKey)" });
  }

  if (!challenge || !signature) {
    return res.status(400).json({ valid: false, reason: "Missing challenge nonce or cryptographic signature" });
  }

  const result = await verifyNodeCredentials(
    identity as SovereignNodeIdentity,
    challenge,
    signature
  );

  if (!result.valid) {
    return res.status(401).json({
      valid: false,
      reason: result.reason || "Cryptographic proof signature verification failed",
      verifiedAt: result.verifiedAt
    });
  }

  return res.json({
    valid: true,
    nodeId: identity.nodeId,
    verifiedAt: result.verifiedAt,
    grantedScopes: identity.authorityScopes || ["INFERENCE_WORKER"]
  });
}
