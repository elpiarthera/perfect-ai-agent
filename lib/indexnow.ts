const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface IndexNowResult {
  ok: boolean;
  status: number;
  message?: string;
}

/**
 * Submit a list of URLs to IndexNow (Bing, Yandex, Naver).
 *
 * Requires env vars:
 *   INDEXNOW_API_KEY — must match UUID format (e.g. 6afd4401-c939-4f0a-8262-03a1bfe743cc)
 *   INDEXNOW_HOST    — hostname without protocol (e.g. perfectaiagent.xyz)
 *
 * Defensive guards (Tau PR #14 pattern):
 *   - runtime typeof checks on env vars
 *   - URL parse via new URL() in try/catch, skip malformed
 *   - 10 000 URL cap per request (IndexNow spec limit — truncate, not reject)
 */
export async function notifyIndexNow(
  urls: string[],
): Promise<IndexNowResult> {
  // Runtime typeof checks (Tau pattern)
  const apiKey = process.env.INDEXNOW_API_KEY;
  const host = process.env.INDEXNOW_HOST;

  if (typeof apiKey !== "string" || apiKey.length === 0) {
    console.error("[IndexNow] INDEXNOW_API_KEY env var missing or not a string");
    return { ok: false, status: 0, message: "Missing INDEXNOW_API_KEY" };
  }
  if (!UUID_RE.test(apiKey)) {
    console.error("[IndexNow] INDEXNOW_API_KEY does not match UUID format");
    return { ok: false, status: 0, message: "INDEXNOW_API_KEY must be a UUID" };
  }
  if (typeof host !== "string" || host.length === 0) {
    console.error("[IndexNow] INDEXNOW_HOST env var missing or not a string");
    return { ok: false, status: 0, message: "Missing INDEXNOW_HOST" };
  }

  if (urls.length === 0) {
    return { ok: true, status: 200, message: "No URLs to submit" };
  }

  // Filter: only URLs on the configured host — URL parse in try/catch (Alpha + Tau pattern)
  const validUrls: string[] = [];
  for (const raw of urls) {
    try {
      const parsed = new URL(raw);
      if (parsed.hostname === host) {
        validUrls.push(raw);
      } else {
        console.warn(`[IndexNow] Skipping URL not on host (${host}): ${raw}`);
      }
    } catch {
      console.warn(`[IndexNow] Skipping malformed URL: ${raw}`);
    }
  }

  if (validUrls.length === 0) {
    return { ok: false, status: 0, message: "No valid URLs for configured host" };
  }

  // Cap at 10 000 (IndexNow per-request limit — Tau defensive guard)
  const capped = validUrls.length > 10000 ? validUrls.slice(0, 10000) : validUrls;
  if (validUrls.length > 10000) {
    console.warn(
      `[IndexNow] Truncated URL list from ${validUrls.length} to 10000 (IndexNow limit)`,
    );
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: apiKey,
        keyLocation: `https://${host}/${apiKey}.txt`,
        urlList: capped,
      }),
    });

    if (response.ok || response.status === 202) {
      console.log(
        `[IndexNow] Submitted ${capped.length} URL(s) to ${host} (status ${response.status})`,
      );
      return { ok: true, status: response.status };
    }

    const text = await response.text().catch(() => "");
    console.error(
      `[IndexNow] Failed with status ${response.status}: ${text}`,
    );
    return { ok: false, status: response.status, message: text };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[IndexNow] Network error: ${msg}`);
    return { ok: false, status: 0, message: msg };
  }
}
