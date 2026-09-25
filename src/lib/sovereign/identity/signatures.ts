import { hexToBuffer, bufferToHex } from "./nodeIdentity";

export async function signMessage(privateKeyHex: string, message: string): Promise<string> {
  const privKeyBuffer = hexToBuffer(privateKeyHex);
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    "pkcs8",
    privKeyBuffer,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const data = new TextEncoder().encode(message);
  const signatureBuffer = await globalThis.crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    cryptoKey,
    data
  );

  return bufferToHex(signatureBuffer);
}

export async function verifyMessage(publicKeyHex: string, message: string, signatureHex: string): Promise<boolean> {
  try {
    const pubKeyBuffer = hexToBuffer(publicKeyHex);
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      "spki",
      pubKeyBuffer,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["verify"]
    );

    const data = new TextEncoder().encode(message);
    const sigBuffer = hexToBuffer(signatureHex);

    return await globalThis.crypto.subtle.verify(
      { name: "ECDSA", hash: { name: "SHA-256" } },
      cryptoKey,
      sigBuffer,
      data
    );
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}
