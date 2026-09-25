// Never send UID, names, tokens, notes or complete URLs to analytics.
export type AnalyticsEvent = 'card_page_view' | 'register_start' | 'register_complete' | 'match_found' | 'exchange_table_create' | 'share_x' | 'share_copy' | 'share_image' | 'share_url_view' | 'uid_copy' | 'listing_refresh' | 'revisit_match' | 'input_start' | 'input_complete_22' | 'match_search' | 'match_zero' | 'listing_publish' | 'listing_publish_success' | 'share_native' | 'shared_listing_view' | 'shared_listing_compare_start' | 'shared_listing_new_listing' | 'new_match_view' | 'trade_completed' | 'trade_completed_share' | 'quick_create_start' | 'quick_create_complete' | 'match_wait_register';
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
