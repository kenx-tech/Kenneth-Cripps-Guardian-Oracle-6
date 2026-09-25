import { SovereignNodeIdentity, NodeRole, AuthorityScope } from "../../../types/sovereign";
import { SOVEREIGN_CONFIG } from "../config";

// Convert ArrayBuffer to Hex String
export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Convert Hex String to ArrayBuffer
export function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

// Generate or load existing node identity
export async function getOrCreateNodeIdentity(
  customName?: string, 
  customRole: NodeRole = "WORKER",
  isSuperAdmin = false
): Promise<SovereignNodeIdentity> {
  const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

  if (isBrowser) {
    const existing = localStorage.getItem(SOVEREIGN_CONFIG.STORAGE_KEYS.NODE_IDENTITY);
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as SovereignNodeIdentity;
        // Upgrade scope if user is super admin
        if (isSuperAdmin && !parsed.authorityScopes.includes("ROOT_ADMIN")) {
          parsed.authorityScopes = ["ROOT_ADMIN", "MESH_OPERATOR", "INFERENCE_WORKER", "MEMORY_VALIDATOR", "TASK_DISPATCHER", "SACRED_WITNESS"];
          parsed.role = "LEADER";
          localStorage.setItem(SOVEREIGN_CONFIG.STORAGE_KEYS.NODE_IDENTITY, JSON.stringify(parsed));
        }
        return parsed;
      } catch (err) {
        console.warn("Corrupted sovereign identity found, generating new one...");
      }
    }
  }

  // Generate keypair via WebCrypto ECDSA P-256
  const keyPair = await globalThis.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256"
    },
    true,
    ["sign", "verify"]
  );

  const exportedPub = await globalThis.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const exportedPriv = await globalThis.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  const pubHex = bufferToHex(exportedPub);
  const privHex = bufferToHex(exportedPriv);

  // Calculate SHA-256 fingerprint of public key
  const digestBuffer = await globalThis.crypto.subtle.digest("SHA-256", exportedPub);
  const fingerprint = bufferToHex(digestBuffer).slice(0, 16);
  const nodeId = `urn:guardian:node:${fingerprint}`;

  const defaultScopes: AuthorityScope[] = isSuperAdmin
    ? ["ROOT_ADMIN", "MESH_OPERATOR", "INFERENCE_WORKER", "MEMORY_VALIDATOR", "TASK_DISPATCHER", "SACRED_WITNESS"]
    : ["INFERENCE_WORKER", "SACRED_WITNESS", "GUEST_SEEKER"];

  const nodeName = customName || (isSuperAdmin ? "Oracle Alpha (Kenneth Cripps Apex)" : `Sovereign-Peer-${fingerprint.slice(0, 6)}`);

  // Create initial self-attestation signature proof
  const attestationMessage = new TextEncoder().encode(`INIT_NODE:${nodeId}:${fingerprint}:${Date.now()}`);
  const rawSignature = await globalThis.crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    keyPair.privateKey,
    attestationMessage
  );

  const identity: SovereignNodeIdentity = {
    nodeId,
    fingerprint,
    publicKey: pubHex,
    privateKey: privHex,
    algorithm: "ECDSA-P256",
    registeredAt: new Date().toISOString(),
    name: nodeName,
    role: isSuperAdmin ? "LEADER" : customRole,
    authorityScopes: defaultScopes,
    signatureProof: bufferToHex(rawSignature)
  };

  if (isBrowser) {
    localStorage.setItem(SOVEREIGN_CONFIG.STORAGE_KEYS.NODE_IDENTITY, JSON.stringify(identity));
  }

  return identity;
}
