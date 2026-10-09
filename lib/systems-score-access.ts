import { createHash, randomBytes } from "crypto";
import { SYSTEMS_SCORE_RESULTS_PATH } from "./site-links";
import type { LeakId } from "./systems-score-v2";

export function systemsScorePublicOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return configured || "https://buildwithmosaic.co";
}

export function createAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function hashAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function isPlausibleAccessToken(token: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}

export function resultsLink(token: string, leakId?: LeakId | string) {
  const fragment = leakId ? `${token}/${leakId}` : token;
  return `${systemsScorePublicOrigin()}${SYSTEMS_SCORE_RESULTS_PATH}#${fragment}`;
}

export function parseResultsHash(hash: string) {
  const raw = hash.replace(/^#/, "").trim();
  const [token, leakId] = raw.split("/");
  if (!token || !isPlausibleAccessToken(token)) return null;
  return { token, leakId: leakId || null };
}
