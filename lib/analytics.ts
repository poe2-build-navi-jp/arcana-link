// Never send UID, names, tokens, notes or complete URLs to analytics.
export type AnalyticsEvent = 'card_page_view' | 'register_start' | 'register_complete' | 'match_found' | 'exchange_table_create' | 'share_x' | 'share_url_view' | 'uid_copy';
export function track(event: AnalyticsEvent, properties: {card?: string; server?: string; count?: number} = {}) {
  if (typeof window === 'undefined') return;
  const source = (() => {
    const utm = new URLSearchParams(window.location.search).get('utm_source');
    const ref = document.referrer;
    if (utm === 'note' || /https:\/\/note\.com\//.test(ref)) return 'note';
    if (utm === 'x' || /https:\/\/(t\.co|x\.com|twitter\.com)\//.test(ref)) return 'x';
    if (/https:\/\/(www\.)?google\./.test(ref)) return 'google';
    return ref ? 'other' : 'direct';
  })();
  const payload = {...properties, traffic_source: source};
  const target = window as unknown as {gtag?: (...args: unknown[]) => void; dataLayer?: unknown[]};
  if (target.gtag) target.gtag('event', event, payload);
  else (target.dataLayer ??= []).push({event, ...payload});
}
