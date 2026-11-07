import { cache } from "react";
import {
  FALLBACK_GITHUB_CONTRIBUTIONS,
  FALLBACK_LEETCODE_CALENDAR,
  type HeatmapDay,
} from "./contributions-fallback";

export type { HeatmapDay };

export const CONTRIBUTIONS_REVALIDATE_SECONDS = 3600; // 1 hour cache
const FETCH_TIMEOUT_MS = 4000;

let memoryCachedGithub: HeatmapDay[] | null = null;
let memoryCachedLeetCode: HeatmapDay[] | null = null;

/**
 * Fetch GitHub contribution days (last 1 year) with ISR + in-memory cache + timeout + offline fallback.
 */
export const getGithubContributions = cache(
  async (username = "nishur31"): Promise<HeatmapDay[]> => {
    if (memoryCachedGithub && memoryCachedGithub.length > 0) {
      return memoryCachedGithub;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
        {
          signal: controller.signal,
          next: {
            tags: ["github-contributions"],
            revalidate: CONTRIBUTIONS_REVALIDATE_SECONDS,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`GitHub contributions returned status ${res.status}`);
      }

      const json = await res.json();
      if (Array.isArray(json.contributions) && json.contributions.length > 0) {
        const days: HeatmapDay[] = json.contributions.map((c: any) => ({
          date: c.date,
          count: Number(c.count) || 0,
          level: Number(c.level) || 0,
        }));
        memoryCachedGithub = days;
        return days;
      }
      throw new Error("Empty contributions array");
    } catch {
      return memoryCachedGithub || FALLBACK_GITHUB_CONTRIBUTIONS;
    } finally {
      clearTimeout(timeoutId);
    }
  },
);

/**
 * Fetch LeetCode submission days (transformed into HeatmapDay[]) with ISR + in-memory cache + timeout + offline fallback.
 */
export const getLeetCodeContributions = cache(
  async (username = "nishanr_19"): Promise<HeatmapDay[]> => {
    if (memoryCachedLeetCode && memoryCachedLeetCode.length > 0) {
      return memoryCachedLeetCode;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const query = JSON.stringify({
        query: `query userProfileCalendar($username: String!) {
          matchedUser(username: $username) {
            userCalendar {
              submissionCalendar
            }
          }
        }`,
        variables: { username },
      });

      const res = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        body: query,
        signal: controller.signal,
        next: {
          tags: ["leetcode-contributions"],
          revalidate: CONTRIBUTIONS_REVALIDATE_SECONDS,
        },
      });

      if (!res.ok) {
        throw new Error(`LeetCode API returned ${res.status}`);
      }

      const json = await res.json();
      const rawCalendar =
        json?.data?.matchedUser?.userCalendar?.submissionCalendar;
      if (!rawCalendar) {
        throw new Error("No userCalendar found");
      }

      const parsed: Record<string, number> =
        typeof rawCalendar === "string" ? JSON.parse(rawCalendar) : rawCalendar;

      const days = transformLeetCodeCalendarToDays(parsed);
      memoryCachedLeetCode = days;
      return days;
    } catch {
      const fallbackDays = transformLeetCodeCalendarToDays(
        FALLBACK_LEETCODE_CALENDAR,
      );
      return memoryCachedLeetCode || fallbackDays;
    } finally {
      clearTimeout(timeoutId);
    }
  },
);

/**
 * Build 1-year timeline (approx 365 days up to today) from LeetCode timestamp map.
 */
function transformLeetCodeCalendarToDays(
  calendar: Record<string, number>,
): HeatmapDay[] {
  const countByDate = new Map<string, number>();

  for (const [timestampStr, count] of Object.entries(calendar)) {
    const ts = Number(timestampStr);
    if (!ts) continue;
    const d = new Date(ts * 1000);
    const dateKey = d.toISOString().split("T")[0];
    countByDate.set(dateKey, (countByDate.get(dateKey) || 0) + Number(count));
  }

  const days: HeatmapDay[] = [];
  const today = new Date();
  const totalDays = 365;

  for (let i = totalDays - 1; i >= 0; i--) {
    const cur = new Date(today);
    cur.setDate(today.getDate() - i);
    const dateStr = cur.toISOString().split("T")[0];
    const count = countByDate.get(dateStr) || 0;

    let level = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count <= 4) level = 2;
    else if (count <= 7) level = 3;
    else if (count > 7) level = 4;

    days.push({
      date: dateStr,
      count,
      level,
    });
  }

  return days;
}

