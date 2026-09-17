'use client';
import {useEffect, useRef} from 'react';
import {track, type AnalyticsEvent} from '@/lib/analytics';
export function PageEvent({event, card}: {event: AnalyticsEvent; card?: string}) {
  const sent = useRef(false);
  useEffect(() => { if (!sent.current) {sent.current = true; track(event, {card});} }, [event, card]);
  return null;
}
