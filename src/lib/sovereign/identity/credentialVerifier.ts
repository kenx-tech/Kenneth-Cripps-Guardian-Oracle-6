import { SovereignNodeIdentity } from "../../../types/sovereign";
import { verifyMessage } from "./signatures";

export interface VerificationResult {
  valid: boolean;
  reason?: string;
  verifiedAt: string;
}

export async function verifyNodeCredentials(
  identity: SovereignNodeIdentity,
  challengeNonce: string,
  providedSignature: string
): Promise<VerificationResult> {
  const now = new Date().toISOString();

  if (!identity.nodeId || !identity.publicKey) {
    return { valid: false, reason: "Missing Node ID or Public Key", verifiedAt: now };
  }

  // Verify node ID matches fingerprint format
  if (!identity.nodeId.startsWith("urn:guardian:node:")) {
    return { valid: false, reason: "Invalid URN structure for Sovereign Node", verifiedAt: now };
  }

  // Verify challenge signature
  const challengeMessage = `AUTH_CHALLENGE:${identity.nodeId}:${challengeNonce}`;
  const isSignatureValid = await verifyMessage(identity.publicKey, challengeMessage, providedSignature);

  if (!isSignatureValid) {
    return { valid: false, reason: "Cryptographic proof signature verification failed", verifiedAt: now };
  }

  return { valid: true, verifiedAt: now };
}
