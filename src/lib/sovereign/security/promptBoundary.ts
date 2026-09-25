export interface BoundaryCheckResult {
  safe: boolean;
  sanitizedPrompt: string;
  violations: string[];
}

const FORBIDDEN_PATTERNS = [
  /ignore\s+all\s+previous\s+instructions/i,
  /system\s*override/i,
  /dump\s+private\s+keys/i,
  /exfiltrate/i
];

export function sanitizeAndCheckPrompt(rawPrompt: string): BoundaryCheckResult {
  const violations: string[] = [];

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(rawPrompt)) {
      violations.push(`Pattern detected: ${pattern.source}`);
    }
  }

  // Basic sanitization
  let sanitized = rawPrompt.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  return {
    safe: violations.length === 0,
    sanitizedPrompt: sanitized,
    violations
  };
}
