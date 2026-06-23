/* ============================================================
   EVENTS — pulled from the Google Sheet via SheetDB.
   This runs on the SERVER (at request time, cached by ISR),
   so the events are baked into the HTML that crawlers and
   link-preview bots see. Ported from the original inline JS.

   Columns are auto-detected. To force a specific sheet header,
   set it in COLS below.
   ============================================================ */

const FEED_URL = import.meta.env.PUBLIC_EVENTS_FEED_URL || 'https://sheetdb.io/api/v1/89vcb4t2iqrej';

const COLS = { date: '', name: '', url: '', meta: '', presenter: '' }; // optional exact header overrides

// Fallback only — shown if the feed can't load.
const SAMPLE: RawRow[] = [{ date: '2026-06-20', name: 'Noiyse Project', url: '#' }];

const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const DOW = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

type RawRow = Record<string, unknown>;

export interface GearyEvent {
  date: Date;
  iso: string; // YYYY-MM-DD, for <time> / schema.org
  name: string;
  url: string;
  meta: string;
  presenter: string; // organizer / "presented by" name, if provided in the sheet
  label: string; // "jun 20"
  dow: string; // "fri"
}

function pick(row: RawRow, override: string, needles: string[]): string {
  if (override && row[override] !== undefined) return String(row[override]);
  const keys = Object.keys(row);
  for (const n of needles) {
    const k = keys.find((k) => k.toLowerCase().trim().includes(n));
    if (k && String(row[k]).trim()) return String(row[k]);
  }
  return '';
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  s = String(s).trim();
  let m = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.exec(s);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/.exec(s);
  if (m) {
    let a = +m[1],
      bb = +m[2],
      y = +m[3];
    if (y < 100) y += 2000;
    let mo, da;
    if (a > 12) {
      da = a;
      mo = bb;
    } else {
      mo = a;
      da = bb;
    }
    return new Date(y, mo - 1, da);
  }
  let d: Date = new Date(s);
  if (!isNaN(d.getTime())) return d;
  const y = new Date().getFullYear();
  d = new Date(s + ' ' + y);
  if (!isNaN(d.getTime())) {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    if ((t.getTime() - d.getTime()) / 86400000 > 31) d = new Date(s + ' ' + (y + 1));
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmt = (d: Date) => MON[d.getMonth()] + ' ' + d.getDate();
const dowOf = (d: Date) => DOW[d.getDay()];

function normalize(raw: RawRow[]): GearyEvent[] {
  return raw
    .map((r) => {
      const date = parseDate(pick(r, COLS.date, ['date', 'when', 'day']));
      return {
        date,
        name: String(pick(r, COLS.name, ['event', 'name', 'title', 'artist', 'lineup'])).trim(),
        url: String(pick(r, COLS.url, ['ticket', 'url', 'link', 'buy', 'rsvp'])).trim() || '#',
        meta: String(pick(r, COLS.meta, ['time', 'door', 'info', 'detail'])).trim(),
        presenter: String(
          pick(r, COLS.presenter, ['present', 'hosted', 'host', 'organiz', 'promoter', 'curat'])
        ).trim(),
      };
    })
    .filter(
      (e): e is { date: Date; name: string; url: string; meta: string; presenter: string } =>
        !!e.date && !!e.name
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((e) => ({
      ...e,
      iso: isoOf(e.date),
      label: fmt(e.date),
      dow: dowOf(e.date),
    }));
}

function upcoming(list: GearyEvent[]): GearyEvent[] {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return list.filter((e) => e.date >= t);
}

/**
 * Fetch + normalize the events feed on the server.
 * Returns the next event (featured) and the rest of the upcoming list.
 */
export async function getEvents(): Promise<{ next: GearyEvent | null; rest: GearyEvent[]; all: GearyEvent[] }> {
  let list: GearyEvent[] = [];
  try {
    const r = await fetch(FEED_URL);
    const j: any = await r.json();
    const arr: RawRow[] = Array.isArray(j) ? j : j.data || j.events || j.items || [];
    const n = normalize(arr);
    if (n.length) list = n;
  } catch (err) {
    console.warn('Live feed failed, using fallback:', err);
  }
  if (!list.length) list = normalize(SAMPLE);

  const up = upcoming(list);
  return { next: up[0] || null, rest: up.slice(1), all: up };
}
