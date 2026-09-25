'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  Clock3,
  Copy,
  Download,
  Handshake,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from '@/components/icons';
import { ExchangeTable } from '@/components/exchange-table';
import { ExchangeInsights } from '@/components/exchange-insights';
import { track } from '@/lib/analytics';
import { arcanaCards, cardBySlug, cardSlugById } from '@/lib/arcana-cards';
import {
  collectedTypeCount,
  defaultInventory,
  inventoryFromQuickSelection,
  neededCards,
  normalizeInventory,
  offeredCards,
  type CardCount,
  type ExchangeProfile,
  type InventoryCounts,
} from '@/lib/arcana-profile';
import { evaluateMatch, filterCompatibleServer } from '@/lib/matching';
import { getListingDaysRemaining, getListingTiming } from '@/lib/revisit';
import type { ExchangeSummary } from '@/lib/arcana-db';
import {
  cardNames,
  homeCopy,
  languageLinks,
  localeInfo,
  localizedPath,
  romans,
  type ArcanaId,
  type SiteLocale,
} from '@/lib/site-i18n';
import {
  normalizeServerRegion,
  serverLabels,
  serverRegions,
  type ServerRegion,
} from '@/lib/server-region';
import { statusLabel, v2Copy, type ExchangeStatus } from '@/lib/v2-i18n';

type LocalProfile = {
  displayName: string;
  uid: string;
  server: ServerRegion | '';
  note: string;
  status: ExchangeStatus;
  publicId?: string;
};

type Match = {
  profile: ExchangeProfile;
  give: ArcanaId[];
  receive: ArcanaId[];
  exact: boolean;
  score: number;
};

type SharedDraft = {
  server: ServerRegion;
  inventory: InventoryCounts;
};

const storageKeys = {
  inventory: 'arcana-link-v2-inventory',
  profile: 'arcana-link-v2-profile',
  token: 'arcana-link-v2-token',
  notifications: 'arcana-link-v2-notifications',
  server: 'arcana_server',
  reviewed: 'arcana-link-v2-reviewed',
  lastVisit: 'arcana-link-v2-last-visit',
  lastSeenMatchIds: 'arcana-link-v2-last-seen-match-ids',
  publishedAt: 'arcana-link-v2-published-at',
};

function tokenValue() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

function countLabel(locale: SiteLocale, count: CardCount) {
  const copy = v2Copy[locale];
  return count === 0
    ? copy.zero
    : count === 1
      ? copy.one
      : count === 2
        ? copy.two
        : copy.three;
}

const collectionShareCopy = {
  ja: {
    open: 'Xに共有',
    kicker: 'COLLECTION SHARE',
    title: '今の収集状況をシェア',
    badge: '22種コンプリートチャレンジ',
    collected: '種類コレクション',
    missing: 'コンプリートまで',
    duplicates: '交換できる重複',
    complete: '22種コンプリート！',
    remaining: 'あと{count}種類',
    noDuplicates: '重複なし',
    challenge: 'あなたは何種類？',
    post: '画像付きでXに投稿',
    download: 'X用画像を保存',
    copied: '投稿文をコピー',
    copiedDone: '投稿文をコピーしました',
    saved: 'X用画像を保存しました',
    fallback:
      'この端末では画像の自動添付に対応していないため、投稿画面を開きます。保存した画像を添えると、より目立ちます。',
    sharing: '画像を作成中…',
    privacy: 'UID・表示名は画像や投稿文に含みません。',
  },
  en: {
    open: 'Share to X',
    kicker: 'COLLECTION SHARE',
    title: 'Share your collection',
    badge: '22-CARD COMPLETION CHALLENGE',
    collected: 'types collected',
    missing: 'until complete',
    duplicates: 'duplicates to trade',
    complete: 'All 22 collected!',
    remaining: '{count} to go',
    noDuplicates: 'No duplicates yet',
    challenge: 'How many have you found?',
    post: 'Post to X with image',
    download: 'Save image for X',
    copied: 'Copy post text',
    copiedDone: 'Post text copied',
    saved: 'Image saved for X',
    fallback:
      'Automatic image attachment is unavailable on this device. The X composer will open; attach the saved image for more impact.',
    sharing: 'Creating image…',
    privacy: 'Your UID and display name are never included.',
  },
  'zh-cn': {
    open: '分享到X',
    kicker: 'COLLECTION SHARE',
    title: '分享你的收集进度',
    badge: '22种全收集挑战',
    collected: '种已收集',
    missing: '距离全收集',
    duplicates: '可交换的重复牌',
    complete: '22种全部集齐！',
    remaining: '还差{count}种',
    noDuplicates: '暂无重复牌',
    challenge: '你已经收集了多少种？',
    post: '带图片发布到X',
    download: '保存X用图片',
    copied: '复制发布文案',
    copiedDone: '发布文案已复制',
    saved: 'X用图片已保存',
    fallback:
      '此设备不支持自动附加图片。将打开X发布页面；附上保存的图片会更醒目。',
    sharing: '正在生成图片…',
    privacy: '图片和发布文案不会包含UID或显示名称。',
  },
} satisfies Record<SiteLocale, Record<string, string>>;

function replaceCount(value: string, count: number) {
  return value.replace('{count}', String(count));
}

const serverUiCopy = {
  ja: {
    chooseTitle: 'あなたの原神サーバーを選択してください',
    chooseLead: 'アルカナ交換は同じサーバーのユーザー同士でのみ行えます。',
    chooseAction: 'このサーバーで交換相手を探す',
    current: 'あなたのサーバー',
    change: '変更',
    changeTitle: 'プレイしているサーバーを変更',
    confirmTitle: '{from}から{to}へ変更しますか？',
    confirmLead:
      '異なるサーバーのユーザーとは交換できないため、マッチ候補が切り替わります。',
    confirm: '変更する',
    cancel: 'キャンセル',
    requested:
      'URLでは{server}が指定されています。設定を変更すると表示できます。',
    requestedAction: '{server}に変更',
    locked: 'サーバーを選択すると、所持数の登録と自動マッチを開始できます。',
    zero: '{server}では、現在この条件に一致する交換相手がいません。',
    exact: '完全一致 {count}',
    partial: '部分一致 {count}',
    publish: '募集を公開して待つ',
    alerts: 'マッチ通知をON',
    language: '表示言語',
  },
  en: {
    chooseTitle: 'Choose your Genshin Impact server',
    chooseLead:
      'Arcana exchanges can only be completed with players on the same server.',
    chooseAction: 'Find players on this server',
    current: 'Your server',
    change: 'Change',
    changeTitle: 'Change your game server',
    confirmTitle: 'Change from {from} to {to}?',
    confirmLead:
      'Players on different servers cannot exchange, so your match results will change.',
    confirm: 'Change server',
    cancel: 'Cancel',
    requested:
      'This link specifies {server}. Change your saved server to view compatible matches.',
    requestedAction: 'Change to {server}',
    locked:
      'Choose your server to register your collection and start automatic matching.',
    zero: 'No compatible exchange partner currently matches on {server}.',
    exact: '{count} exact',
    partial: '{count} partial',
    publish: 'Publish your listing',
    alerts: 'Turn match alerts on',
    language: 'Language',
  },
  'zh-cn': {
    chooseTitle: '请选择你的原神服务器',
    chooseLead: '月谕圣牌只能与同一服务器的玩家完成交换。',
    chooseAction: '在此服务器寻找交换伙伴',
    current: '你的服务器',
    change: '更改',
    changeTitle: '更改游戏服务器',
    confirmTitle: '从{from}更改为{to}吗？',
    confirmLead: '不同服务器的玩家无法交换，因此匹配结果将随之改变。',
    confirm: '更改服务器',
    cancel: '取消',
    requested: '此链接指定了{server}。更改保存的服务器后可查看匹配结果。',
    requestedAction: '更改为{server}',
    locked: '选择服务器后即可登记持有数量并开始自动匹配。',
    zero: '{server}目前没有符合此条件的交换伙伴。',
    exact: '完全匹配 {count}',
    partial: '部分匹配 {count}',
    publish: '发布交换信息并等待',
    alerts: '开启匹配提醒',
    language: '显示语言',
  },
} satisfies Record<SiteLocale, Record<string, string>>;

function replaceServerTokens(value: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (result, [key, replacement]) => result.replace(`{${key}}`, replacement),
    value,
  );
}

export function ExchangeHome({
  locale,
  initialSummary = null,
}: {
  locale: SiteLocale;
  initialSummary?: ExchangeSummary | null;
}) {
  const copy = v2Copy[locale];
  const siteCopy = homeCopy[locale];
  const labels = cardNames[locale];
  const [inventory, setInventory] = useState<InventoryCounts>(() => ({
    ...defaultInventory,
  }));
  const [profile, setProfile] = useState<LocalProfile>({
    displayName: '',
    uid: '',
    server: '',
    note: '',
    status: 'open',
  });
  const [profiles, setProfiles] = useState<ExchangeProfile[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [serverOpen, setServerOpen] = useState(false);
  const [serverChoice, setServerChoice] = useState<ServerRegion | ''>('');
  const [pendingServer, setPendingServer] = useState<ServerRegion | null>(null);
  const [requestedServer, setRequestedServer] = useState<ServerRegion | null>(
    null,
  );
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const [reportReason, setReportReason] = useState('already_exchanged');
  const [token, setToken] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [listingsLoaded, setListingsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [, setShareMode] = useState<'local' | 'shared'>('local');
  const [summary, setSummary] = useState<ExchangeSummary | null>(initialSummary);
  const [reviewedCards, setReviewedCards] = useState<ArcanaId[]>([]);
  const [quickStep, setQuickStep] = useState<1 | 2 | 3>(1);
  const [quickMissing, setQuickMissing] = useState<ArcanaId[]>([]);
  const [quickDuplicates, setQuickDuplicates] = useState<ArcanaId[]>([]);
  const [detailedEntry, setDetailedEntry] = useState(false);
  const [sharedDraft, setSharedDraft] = useState<SharedDraft | null>(null);
  const [sharedDraftResult, setSharedDraftResult] = useState<
    'exact' | 'different-server' | 'no-match' | null
  >(null);
  const [previousVisit, setPreviousVisit] = useState('');
  const [revisitDismissed, setRevisitDismissed] = useState(false);
  const [lastSeenMatchIds, setLastSeenMatchIds] = useState<string[]>([]);
  const [lastPublishedAt, setLastPublishedAt] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [profileDirty, setProfileDirty] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [intent, setIntent] = useState<{slug:string; action:string} | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const registerTracked = useRef(false);
  const quickTracked = useRef(false);
  const completeTracked = useRef(false);
  const inputCompleteTracked = useRef(false);
  const matchTracked = useRef('');
  const revisitTracked = useRef(false);
  const knownMatches = useRef<Set<string> | null>(null);
  const refreshRequested = useRef(false);
  const publishRequested = useRef(false);
  const sharedListingReferral = useRef(false);
  const zeroMatchTracked = useRef(false);

  const reviewedSet = useMemo(() => new Set(reviewedCards), [reviewedCards]);
  const reviewedCount = reviewedCards.length;
  const reviewComplete = reviewedCount === arcanaCards.length;
  const missing = useMemo(() => neededCards(inventory).filter(card=>reviewedSet.has(card)), [inventory, reviewedSet]);
  const duplicates = useMemo(() => offeredCards(inventory), [inventory]);
  const sharedDraftMissing = useMemo(
    () => (sharedDraft ? neededCards(sharedDraft.inventory) : []),
    [sharedDraft],
  );
  const sharedDraftDuplicates = useMemo(
    () => (sharedDraft ? offeredCards(sharedDraft.inventory) : []),
    [sharedDraft],
  );
  const collected = useMemo(() => collectedTypeCount(inventory), [inventory]);
  const progress = Math.round((collected / arcanaCards.length) * 100);
  const duplicateCopies = useMemo(
    () =>
      arcanaCards.reduce(
        (total, card) => total + Math.max(0, inventory[card.id] - 1),
        0,
      ),
    [inventory],
  );
  const shareCopy = collectionShareCopy[locale];
  const serverCopy = serverUiCopy[locale];
  const activeServerLabel = profile.server
    ? serverLabels[locale][profile.server]
    : '—';

  const matches = useMemo(() => {
    if (!profile.server || !reviewComplete) return [];
    const currentUser = { server: profile.server, inventory };
    return filterCompatibleServer(profile.server, profiles)
      .filter(
        (candidate) =>
          candidate.publicId !== profile.publicId &&
          candidate.status !== 'closed',
      )
      .map((candidate): Match => {
        const result = evaluateMatch(currentUser, candidate);
        const give = result?.give ?? [];
        const receive = result?.receive ?? [];
        const exact = result?.exact ?? false;
        const score = exact
          ? Math.min(99, 96 + give.length + receive.length)
          : Math.min(89, 62 + receive.length * 8 + give.length * 5);
        return { profile: candidate, give, receive, exact, score };
      })
      .filter((match) => match.give.length || match.receive.length)
      .sort(
        (a, b) =>
          Number(b.exact) - Number(a.exact) ||
          b.score - a.score ||
          b.receive.length - a.receive.length,
      );
  }, [inventory, profile.publicId, profile.server, profiles, reviewComplete]);

  const exactCount = matches.filter((match) => match.exact).length;
  const partialCount = matches.length - exactCount;
  const newMatchIds = useMemo(() => {
    const previous = Date.parse(previousVisit);
    if (!Number.isFinite(previous)) return [];
    return matches
      .filter(
        (match) =>
          match.exact &&
          Date.parse(match.profile.updatedAt) > previous &&
          !lastSeenMatchIds.includes(match.profile.publicId),
      )
      .map((match) => match.profile.publicId);
  }, [lastSeenMatchIds, matches, previousVisit]);
  const newMatchCount = newMatchIds.length;
  const listingTiming = profile.publicId && profile.status !== 'closed' && lastPublishedAt && currentTime ? getListingTiming(lastPublishedAt,currentTime) : 'active';
  const listingDaysRemaining = profile.publicId && profile.status !== 'closed' && lastPublishedAt && currentTime ? getListingDaysRemaining(lastPublishedAt,currentTime) : 0;
  const expiresSoon = listingTiming === 'expires-soon';
  const listingExpired = listingTiming === 'expired';

  /* oxlint-disable react/react-compiler -- Saved browser state is intentionally hydrated after mount. */
  useEffect(() => {
    document.documentElement.lang = localeInfo[locale].htmlLang;
    const savedInventory = normalizeInventory(
      JSON.parse(localStorage.getItem(storageKeys.inventory) || 'null'),
    );
    if (savedInventory) setInventory(savedInventory);
    const savedProfile = JSON.parse(
      localStorage.getItem(storageKeys.profile) || 'null',
    ) as (Omit<LocalProfile, 'server'> & { server?: unknown }) | null;
    const savedReviewed = JSON.parse(localStorage.getItem(storageKeys.reviewed) || '[]') as unknown;
    let savedReviewComplete = false;
    if (Array.isArray(savedReviewed)) {
      const valid = savedReviewed.filter((card): card is ArcanaId=>typeof card === 'string' && arcanaCards.some(item=>item.id===card));
      savedReviewComplete = valid.length === arcanaCards.length;
      if (valid.length) setReviewedCards([...new Set(valid)]);
      else if (savedProfile?.publicId || (savedInventory && collectedTypeCount(savedInventory)>0)) {
        savedReviewComplete = true;
        setReviewedCards(arcanaCards.map(card=>card.id));
      }
    }
    const lastVisit = localStorage.getItem(storageKeys.lastVisit) || '';
    setPreviousVisit(lastVisit);
    const savedSeenMatches = JSON.parse(
      localStorage.getItem(storageKeys.lastSeenMatchIds) || '[]',
    ) as unknown;
    if (Array.isArray(savedSeenMatches)) {
      setLastSeenMatchIds(
        savedSeenMatches.filter((id): id is string => typeof id === 'string'),
      );
    }
    setCurrentTime(Date.now());
    localStorage.setItem(storageKeys.lastVisit, new Date().toISOString());
    setLastPublishedAt(localStorage.getItem(storageKeys.publishedAt) || '');
    const savedServer =
      normalizeServerRegion(localStorage.getItem(storageKeys.server)) ??
      normalizeServerRegion(savedProfile?.server);
    const urlServer = normalizeServerRegion(
      new URL(window.location.href).searchParams.get('server'),
    );
    if (urlServer) setRequestedServer(urlServer);
    const params = new URL(window.location.href).searchParams;
    sharedListingReferral.current =
      params.get('utm_source') === 'shared_listing';
    const wantSlugs = new Set((params.get('want') || '').split(',').filter(slug=>Object.hasOwn(cardBySlug,slug)));
    const offerSlugs = new Set((params.get('offer') || '').split(',').filter(slug=>Object.hasOwn(cardBySlug,slug)));
    if (params.has('want') || params.has('offer')) {
      const sharedInventory = Object.fromEntries(
        arcanaCards.map((card) => [
          card.id,
          wantSlugs.has(card.slug) ? 0 : offerSlugs.has(card.slug) ? 2 : 1,
        ]),
      ) as InventoryCounts;
      if (params.get('shared') === '1' && urlServer) {
        setSharedDraft({ server: urlServer, inventory: sharedInventory });
        track('shared_listing_view', { server: urlServer });
      } else {
        setInventory(sharedInventory);
        setReviewedCards(arcanaCards.map((card) => card.id));
      }
    }
    const requestedCard = params.get('card');
    if (requestedCard && Object.hasOwn(cardBySlug, requestedCard)) setIntent({slug:requestedCard,action:params.get('intent') === 'offer' ? 'offer' : 'want'});
    if (savedProfile) {
      if (savedProfile.publicId) completeTracked.current = true;
      setProfile({
        ...savedProfile,
        server: savedServer ?? '',
      });
    } else if (savedServer) {
      setProfile((current) => ({ ...current, server: savedServer }));
    }
    if (params.get('publish') === '1' && savedReviewComplete) {
      setProfileOpen(true);
    }
    if (!savedServer) {
      setServerChoice(urlServer ?? '');
    }
    let savedToken = localStorage.getItem(storageKeys.token);
    if (!savedToken) {
      savedToken = tokenValue();
      localStorage.setItem(storageKeys.token, savedToken);
    }
    setToken(savedToken);
    setNotifications(
      localStorage.getItem(storageKeys.notifications) === 'true',
    );
    setHydrated(true);
  }, [locale]);
  /* oxlint-enable react/react-compiler */

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKeys.inventory, JSON.stringify(inventory));
    localStorage.setItem(storageKeys.profile, JSON.stringify(profile));
    localStorage.setItem(storageKeys.notifications, String(notifications));
    localStorage.setItem(storageKeys.reviewed, JSON.stringify(reviewedCards));
    if (profile.server) {
      localStorage.setItem(storageKeys.server, profile.server);
    }
  }, [hydrated, inventory, notifications, profile, reviewedCards]);

  useEffect(() => {
    let stopped = false;
    const refreshSummary = async () => {
      try {
        const response = await fetch('/api/profiles?summary=1', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json() as ExchangeSummary;
        if (!stopped) setSummary(data);
      } catch {
        // The service summary stays hidden if the shared database is unavailable.
      }
    };
    void refreshSummary();
    const interval = window.setInterval(refreshSummary, 300_000);
    return () => { stopped = true; window.clearInterval(interval); };
  }, []);

  /* oxlint-disable react/react-compiler -- Reset loading state when the selected server changes. */
  useEffect(() => {
    if (!profile.server) return;
    let stopped = false;
    setListingsLoaded(false);
    const refresh = async () => {
      try {
        const response = await fetch(
          `/api/profiles?server=${encodeURIComponent(profile.server)}`,
          { cache: 'no-store' },
        );
        const data = (await response.json()) as {
          profiles?: ExchangeProfile[];
          mode?: 'local' | 'shared';
        };
        if (!response.ok) throw new Error('listing_unavailable');
        if (stopped) return;
        setListingsLoaded(true);
        setListingError(data.mode !== 'shared');
        setShareMode(data.mode === 'shared' ? 'shared' : 'local');
        if (data.mode === 'shared') {
          setProfiles(data.profiles ?? []);
        } else {
          setProfiles([]);
          setListingError(true);
        }
      } catch {
        if (!stopped) {
          setListingsLoaded(true);
          setShareMode('local');
          setProfiles([]);
          setListingError(true);
        }
      }
    };
    void refresh();
    const interval = window.setInterval(refresh, 60_000);
    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, [locale, profile.server]);
  /* oxlint-enable react/react-compiler */

  useEffect(() => {
    if (
      !hydrated ||
      !profileDirty ||
      !token ||
      !reviewComplete ||
      !profile.server ||
      !profile.displayName.trim() ||
      !/^\d{9,10}$/.test(profile.uid)
    )
      return;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/profiles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...profile, inventory, locale, token }),
        });
        if (!response.ok) throw new Error('save_failed');
        const data = (await response.json()) as {
          publicId?: string;
          mode?: 'local' | 'shared';
          updatedAt?: string;
        };
        if (data.mode === 'shared') {
          setShareMode('shared');
          setSaving(false);
          setToast(refreshRequested.current ? locale === 'ja' ? '募集を更新しました ✓ あと7日間、マッチ候補に表示されます。' : locale === 'en' ? 'Listing refreshed ✓ It will remain active for 7 days.' : '招募已更新 ✓ 接下来7天会显示在匹配候选中。' : copy.saved);
          refreshRequested.current = false;
          if (data.updatedAt) {
            setLastPublishedAt(data.updatedAt);
            setCurrentTime(Date.now());
            localStorage.setItem(storageKeys.publishedAt, data.updatedAt);
          }
          setProfileDirty(false);
          if (!completeTracked.current) {track('register_complete', {server:profile.server}); completeTracked.current = true;}
          if (publishRequested.current) {
            track('listing_publish_success', { server: profile.server });
            if (sharedListingReferral.current) {
              track('shared_listing_new_listing', { server: profile.server });
            }
            publishRequested.current = false;
            setPublishSuccess(true);
            setShareOpen(true);
          }
        }
        if (data.publicId && data.publicId !== profile.publicId) {
          setProfile((current) => ({ ...current, publicId: data.publicId }));
        }
      } catch {
        refreshRequested.current = false;
        publishRequested.current = false;
        setSaving(false);
        setShareMode('local');
        setToast(locale === 'ja' ? '公開保存に失敗しました。通信状態を確認してプロフィールを保存し直してください。' : 'Could not publish. Please retry saving your profile.');
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [copy.saved, hydrated, inventory, locale, profile, profileDirty, refreshVersion, reviewComplete, token]);

  useEffect(() => {
    const newExact = newMatchCount;
    if (newExact && !revisitTracked.current) {
      track('revisit_match', {count:newExact});
      revisitTracked.current = true;
    }
    const liveIds = matches.filter(m=>m.exact && !m.profile.sample).map(m=>m.profile.publicId).sort().join(',');
    if (liveIds && liveIds !== matchTracked.current) track('match_found', {count:matches.filter(m=>m.exact && !m.profile.sample).length});
    matchTracked.current = liveIds;
    const exactIds = new Set(
      matches
        .filter((match) => match.exact)
        .map((match) => match.profile.publicId),
    );
    if (!knownMatches.current) {
      knownMatches.current = exactIds;
      return;
    }
    if (
      notifications &&
      [...exactIds].some((id) => !knownMatches.current?.has(id))
    ) {
      setNotificationText(
        locale === 'ja'
          ? '新しい完全マッチが見つかりました。'
          : locale === 'en'
            ? 'A new exact match is available.'
            : '发现了新的完全匹配。',
      );
    }
    knownMatches.current = exactIds;
  }, [locale, matches, newMatchCount, notifications]);

  useEffect(() => {
    if (
      hydrated &&
      reviewComplete &&
      profile.server &&
      listingsLoaded &&
      !listingError &&
      exactCount === 0 &&
      !zeroMatchTracked.current
    ) {
      track('match_zero', { server: profile.server });
      zeroMatchTracked.current = true;
    }
    if (exactCount > 0) zeroMatchTracked.current = false;
  }, [exactCount, hydrated, listingError, listingsLoaded, profile.server, reviewComplete]);

  function startRegistration() {
    if (!registerTracked.current) {
      track('register_start');
      track('input_start');
      registerTracked.current = true;
    }
  }

  function startQuickRegistration() {
    startRegistration();
    if (!quickTracked.current) {
      track('quick_create_start');
      quickTracked.current = true;
    }
    setDetailedEntry(false);
    setQuickStep(profile.server ? 2 : 1);
  }

  function selectQuickServer(server: ServerRegion) {
    startQuickRegistration();
    if (profile.server && profile.server !== server) {
      setServerChoice(server);
      setPendingServer(server);
      setServerOpen(true);
      return;
    }
    setProfile((current) => ({ ...current, server }));
    setProfileDirty(true);
    setQuickStep(2);
  }

  function toggleQuickCard(kind: 'missing' | 'duplicate', card: ArcanaId) {
    startRegistration();
    if (kind === 'missing') {
      setQuickMissing((current) =>
        current.includes(card)
          ? current.filter((item) => item !== card)
          : [...current, card],
      );
      setQuickDuplicates((current) => current.filter((item) => item !== card));
      return;
    }
    setQuickDuplicates((current) =>
      current.includes(card)
        ? current.filter((item) => item !== card)
        : [...current, card],
    );
    setQuickMissing((current) => current.filter((item) => item !== card));
  }

  function completeQuickRegistration() {
    if (!profile.server) {
      setQuickStep(1);
      return;
    }
    const nextInventory = inventoryFromQuickSelection(
      quickMissing,
      quickDuplicates,
    );
    setInventory(nextInventory);
    setReviewedCards(arcanaCards.map((card) => card.id));
    setProfileDirty(true);
    setQuickStep(3);
    if (!inputCompleteTracked.current) {
      track('input_complete_22', { server: profile.server });
      inputCompleteTracked.current = true;
    }
    track('quick_create_complete', { server: profile.server });
    track('exchange_table_create', { server: profile.server });
    if (sharedDraft) {
      if (sharedDraft.server !== profile.server) {
        setSharedDraftResult('different-server');
      } else {
        const result = evaluateMatch(
          { server: profile.server, inventory: nextInventory },
          { server: sharedDraft.server, inventory: sharedDraft.inventory },
        );
        setSharedDraftResult(result?.exact ? 'exact' : 'no-match');
        if (result?.exact) track('match_found', { server: profile.server, count: 1 });
      }
      window.location.hash = 'shared-condition';
    } else {
      setShareOpen(true);
    }
  }
  function setCount(card: ArcanaId, count: CardCount) {
    startRegistration();
    if (!profile.server) { setServerOpen(true); return; }
    setInventory(current=>({...current,[card]:count}));
    setReviewedCards(current=>{
      if (current.includes(card)) return current;
      const next = [...current,card];
      if (next.length === arcanaCards.length && !inputCompleteTracked.current) {
        track('input_complete_22', { server: profile.server });
        inputCompleteTracked.current = true;
      }
      return next;
    });
    setProfileDirty(true);
  }

  function refreshListing() {
    if (!reviewComplete || !profile.publicId) return;
    refreshRequested.current = true;
    setSaving(true);
    setToast(locale === 'ja' ? '募集を更新しています…' : 'Refreshing listing…');
    track('listing_refresh', {server:profile.server});
    setProfileDirty(true);
    setRefreshVersion(current=>current+1);
  }

  function setStatus(status: ExchangeStatus) {
    setProfile((current) => ({ ...current, status }));
    setProfileDirty(true);
    setToast(statusLabel(locale, status));
  }

  function submitProfile(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    if (!reviewComplete) {
      setProfileOpen(false);
      setToast(locale === 'ja' ? `残り${arcanaCards.length-reviewedCount}種類を確認すると募集を公開できます。` : `Review ${arcanaCards.length-reviewedCount} more cards before publishing.`);
      window.location.hash = 'inventory';
      return;
    }
    if (!profile.server) {
      setProfileOpen(false);
      setServerOpen(true);
      return;
    }
    const form = new FormData(event.currentTarget);
    const formText = (name: string) => {
      const value = form.get(name);
      return typeof value === 'string' ? value : '';
    };
    publishRequested.current = true;
    track('listing_publish', { server: profile.server });
    setProfile((current) => ({
      ...current,
      displayName: formText('displayName').trim(),
      uid: formText('uid'),
      note: formText('note').trim(),
      status: 'open',
    }));
    setProfileDirty(true);
    setProfileOpen(false);
    setSaving(true);
    setToast(locale === 'ja' ? '公開募集を保存しています…' : 'Saving your listing…');
  }

  async function reportMatch() {
    if (!selectedMatch) return;
    if (!selectedMatch.profile.sample) {
      try {
        await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            targetPublicId: selectedMatch.profile.publicId,
            reason: reportReason,
          }),
        });
      } catch {
        // The user still receives local confirmation if connectivity is unavailable.
      }
    }
    setToast(copy.reportSent);
  }

  function copyUid(uid: string) {
    track('uid_copy');
    void navigator.clipboard.writeText(uid);
    setCopied(true);
    setToast(copy.uidCopiedNext);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function openProfileSettings() {
    startRegistration();
    if (!profile.server) {
      setServerOpen(true);
      return;
    }
    setProfileOpen(true);
  }

  function publishCurrentListing() {
    if (!profile.server) {
      setServerOpen(true);
      return;
    }
    track('match_wait_register', { server: profile.server });
    if (
      profile.publicId &&
      profile.displayName.trim() &&
      /^\d{9,10}$/.test(profile.uid)
    ) {
      publishRequested.current = true;
      track('listing_publish', { server: profile.server });
      setSaving(true);
      setToast(locale === 'ja' ? '公開募集を保存しています…' : 'Saving your listing…');
      setProfile((current) => ({ ...current, status: 'open' }));
      setProfileDirty(true);
      setRefreshVersion((current) => current + 1);
      return;
    }
    openProfileSettings();
  }

  function openExchangeTable() {
    if (!profile.server) { setServerOpen(true); return; }
    track('exchange_table_create', {server:profile.server});
    setShareOpen(true);
  }

  function openServerSettings() {
    setServerChoice(profile.server);
    setServerOpen(true);
  }

  function chooseServer() {
    if (!serverChoice) return;
    if (!profile.server) {
      setProfile((current) => ({ ...current, server: serverChoice }));
      setProfileDirty(true);
      setQuickStep(2);
      setRequestedServer((current) =>
        current === serverChoice ? null : current,
      );
      setServerOpen(false);
      knownMatches.current = null;
      return;
    }
    if (profile.server === serverChoice) {
      setServerOpen(false);
      return;
    }
    setPendingServer(serverChoice);
  }

  function confirmServerChange() {
    if (!pendingServer) return;
    setProfile((current) => ({ ...current, server: pendingServer }));
    setProfileDirty(true);
    setQuickStep(2);
    setRequestedServer((current) =>
      current === pendingServer ? null : current,
    );
    setProfiles([]);
    setSelectedMatch(null);
    setPendingServer(null);
    setServerOpen(false);
    knownMatches.current = null;
  }

  function changeLanguage(nextLocale: SiteLocale) {
    if (nextLocale === locale) return;
    window.location.href = localizedPath(nextLocale);
  }

  function completeTrade(match: Match) {
    const give = match.give[0];
    const receive = match.receive[0];
    if (!give || !receive) return;
    setInventory((current) => ({
      ...current,
      [give]: Math.max(0, current[give] - 1) as CardCount,
      [receive]: Math.min(3, current[receive] + 1) as CardCount,
    }));
    setProfile((current) => ({ ...current, status: 'open' }));
    setProfileDirty(true);
    setSelectedMatch(null);
    setTradeSuccess(true);
    track('trade_completed', { server: profile.server });
    setToast(copy.completed);
  }

  function markNewMatchesSeen() {
    const next = [...new Set([...lastSeenMatchIds, ...newMatchIds])];
    setLastSeenMatchIds(next);
    localStorage.setItem(storageKeys.lastSeenMatchIds, JSON.stringify(next));
    setRevisitDismissed(true);
    track('new_match_view', { count: newMatchIds.length, server: profile.server });
  }

  function summarizedNames(cards: ArcanaId[]) {
    const visible = cards.slice(0, 4).map((card) => labels[card]);
    return cards.length > 4
      ? `${visible.join('・')} +${cards.length - 4}`
      : visible.join('・');
  }

  function listingShareUrl(source = 'copy') {
    const medium = source === 'x' ? 'social' : 'referral';
    if (profile.publicId) {
      return `https://arcana-card-link.pages.dev/genshin-arcana/share/${profile.publicId}?utm_source=${source}&utm_medium=${medium}&utm_campaign=exchange`;
    }
    const params = new URLSearchParams({shared:'1',server:profile.server||'asia',want:missing.map(card=>cardSlugById[card]).join(','),offer:duplicates.map(card=>cardSlugById[card]).join(','),utm_source:source,utm_medium:medium,utm_campaign:'exchange'});
    return `https://arcana-card-link.pages.dev/?${params.toString()}#matches`;
  }

  function shareText(source = 'x') {
    const url = listingShareUrl(source);
    const list = (cards: ArcanaId[], none: string) => {
      if (!cards.length) return none;
      if (source !== 'x' || cards.length <= 4)
        return cards.map((card) => labels[card]).join(' / ');
      return `${cards
        .slice(0, 3)
        .map((card) => labels[card])
        .join(' / ')}${locale === 'en' ? ` +${cards.length - 3} more` : ` ほか${cards.length - 3}種`}`;
    };
    if (locale === 'en') return ['Looking for Genshin Impact Lunar Arcana trades!','【Wanted】 '+list(missing,'None'),'【Offered】 '+list(duplicates,'None'),'Server: '+activeServerLabel,'Check compatible trades 👇',url,'#GenshinImpact #ArcanaTrade'].join('\n');
    if (locale === 'zh-cn') return ['寻找原神月谕圣牌交换伙伴！','【求】'+list(missing,'无'),'【出】'+list(duplicates,'无'),'Server：'+activeServerLabel,'查看匹配条件👇',url,'#原神 #月谕圣牌'].join('\n');
    return ['【原神 月諭のアルカナ交換】','求：'+list(missing,'なし'),'譲：'+list(duplicates,'なし'),'Server：'+activeServerLabel,'交換条件はこちら👇',url,'#原神 #月諭のアルカナ #アルカナ交換'].join('\n');
  }

  async function collectionImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable');

    const gradient = context.createLinearGradient(0, 0, 1200, 675);
    gradient.addColorStop(0, '#081d34');
    gradient.addColorStop(0.62, '#123b60');
    gradient.addColorStop(1, '#0b253f');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1200, 675);

    context.strokeStyle = 'rgba(218, 184, 121, .13)';
    context.lineWidth = 1;
    for (let x = 44; x < 1200; x += 52) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, 675);
      context.stroke();
    }
    for (let y = 42; y < 675; y += 52) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(1200, y);
      context.stroke();
    }

    context.fillStyle = '#d7b778';
    context.fillRect(72, 68, 7, 539);
    context.font = '700 24px Georgia, serif';
    context.letterSpacing = '5px';
    context.fillText('ARCANA LINK', 112, 104);
    context.letterSpacing = '0px';
    context.fillStyle = '#94adc2';
    context.font = '600 17px system-ui, sans-serif';
    context.fillText(shareCopy.badge, 112, 139);

    context.fillStyle = '#f5f8fb';
    context.font = '700 170px Georgia, serif';
    context.fillText(String(collected), 104, 346);
    const collectedWidth = context.measureText(String(collected)).width;
    context.fillStyle = '#d7b778';
    context.font = '400 58px Georgia, serif';
    context.fillText('/ 22', 118 + collectedWidth, 336);
    context.fillStyle = '#b8cad8';
    context.font = '600 23px system-ui, sans-serif';
    context.fillText(shareCopy.collected, 112, 389);

    context.fillStyle = 'rgba(255,255,255,.12)';
    context.fillRect(112, 430, 645, 18);
    context.fillStyle = '#d7b778';
    context.fillRect(112, 430, Math.round(645 * (progress / 100)), 18);
    context.fillStyle = '#f7fbff';
    context.font = '700 35px Georgia, serif';
    context.fillText(`${progress}% COMPLETE`, 112, 506);
    context.fillStyle = '#d9e5ed';
    context.font = '600 23px system-ui, sans-serif';
    context.fillText(
      collected === 22
        ? shareCopy.complete
        : replaceCount(shareCopy.remaining, missing.length),
      112,
      548,
    );

    context.fillStyle = 'rgba(6, 23, 41, .72)';
    context.fillRect(814, 68, 314, 480);
    context.strokeStyle = 'rgba(215, 183, 120, .55)';
    context.strokeRect(814.5, 68.5, 313, 479);
    context.fillStyle = '#d7b778';
    context.font = '700 16px system-ui, sans-serif';
    context.fillText('SERVER', 850, 122);
    context.fillStyle = '#fff';
    context.font = '700 34px Georgia, serif';
    context.fillText(activeServerLabel, 850, 170, 240);
    context.fillStyle = '#d7b778';
    context.font = '700 16px system-ui, sans-serif';
    context.fillText(locale === 'en' ? 'WANTED' : '求', 850, 230);
    context.fillStyle = '#91aabe';
    context.font = '500 20px system-ui, sans-serif';
    context.fillText(summarizedNames(missing) || '—', 850, 270, 240);
    context.fillStyle = '#d7b778';
    context.font = '700 16px system-ui, sans-serif';
    context.fillText(locale === 'en' ? 'OFFERED' : locale === 'ja' ? '譲' : '出', 850, 340);
    context.fillStyle = '#91aabe';
    context.font = '500 20px system-ui, sans-serif';
    context.fillText(summarizedNames(duplicates) || '—', 850, 380, 240);
    context.fillStyle = '#f4e3bf';
    context.font = '700 18px system-ui, sans-serif';
    context.fillText(locale === 'ja' ? '条件が合う相手を自動で探せます' : locale === 'en' ? 'Find compatible trades automatically' : '自动寻找条件匹配的伙伴', 850, 500, 240);

    context.fillStyle = '#8299ab';
    context.font = '600 17px system-ui, sans-serif';
    context.fillText('arcana-card-link.pages.dev', 112, 607);
    context.fillStyle = '#d7b778';
    context.textAlign = 'right';
    context.fillText('#ARCANALINK', 1128, 607);
    context.textAlign = 'left';

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
        'image/png',
      );
    });
  }

  async function saveShareImage() {
    track('share_image', {server:profile.server});
    setShareBusy(true);
    try {
      const blob = await collectionImage();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `arcana-link-${collected}-of-22.png`;
      link.click();
      URL.revokeObjectURL(url);
      setToast(shareCopy.saved);
    } finally {
      setShareBusy(false);
    }
  }

  async function postToX() {
    track('share_x', {server:profile.server});
    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(shareText('x'))}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  async function shareNative() {
    if (typeof navigator.share !== 'function') return;
    try {
      await navigator.share({
        title: 'ARCANA LINK 月諭アルカナ交換',
        text: shareText('native'),
      });
      track('share_native', { server: profile.server });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setToast(locale === 'ja' ? '共有できませんでした。リンクコピーをお使いください。' : 'Could not share. Please copy the link.');
      }
    }
  }

  async function copyListingUrl() {
    await navigator.clipboard.writeText(listingShareUrl('copy'));
    track('share_copy', {server:profile.server});
    setToast(locale === 'ja' ? '共有リンクをコピーしました' : 'Share link copied');
  }

  async function copyListingText() {
    try {
      await navigator.clipboard.writeText(shareText('copy'));
      track('share_copy', { server: profile.server });
      setToast(
        locale === 'ja'
          ? '募集文をコピーしました'
          : locale === 'en'
            ? 'Listing text copied'
            : '已复制招募文案',
      );
    } catch {
      setToast(
        locale === 'ja'
          ? 'コピーできませんでした。共有リンクをご利用ください。'
          : 'Copy failed. Please use the share link.',
      );
    }
  }

  function tradeSuccessText() {
    return [
      '月諭アルカナの交換相手が見つかりました！',
      '',
      '求・譲を登録すると、条件が合う相手を自動で探せます👇',
      '',
      'ARCANA LINK',
      'https://arcana-card-link.pages.dev/genshin-arcana?utm_source=trade_success&utm_medium=social',
      '',
      '#原神 #原神アルカナ',
    ].join('\n');
  }

  function postTradeSuccessToX() {
    track('trade_completed_share', { server: profile.server });
    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(tradeSuccessText())}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  async function shareTradeSuccessNative() {
    if (typeof navigator.share !== 'function') return;
    try {
      await navigator.share({
        title: 'ARCANA LINKで交換成立',
        text: tradeSuccessText(),
      });
      track('trade_completed_share', { server: profile.server });
    } catch {
      // Closing the native share sheet does not need an error message.
    }
  }

  const zeroMatchActions = listingsLoaded && !listingError ? <div className="v2-empty v2-zero-match">
    <Bell size={24}/><h3>{profile.publicId && profile.status !== 'closed' ? (locale==='ja'?'マッチ待ちに登録しました':locale==='en'?'Your listing is waiting for matches':'已进入匹配等待') : (locale==='ja'?'この条件でマッチ待ちできます':locale==='en'?'Save this listing and wait for matches':'可用此条件等待匹配')}</h3><p>{locale==='ja'?'今は条件が完全一致する相手がいません。募集を公開しておくと、新しい募集が追加された時にも同じサーバー内で自動比較されます。':locale==='en'?'There is no exact match right now. Publish your listing so future players on your server can be compared.':'目前没有条件完全一致的伙伴。发布招募后，可以与之后登记的同服务器玩家比较。'}</p>
    <small>{locale==='ja'?'募集は7日間保存され、古い募集は自動的に候補から外れます。':'Listings remain active for 7 days.'}</small>
    <div className="v2-empty-actions"><button className="v2-primary" onClick={publishCurrentListing} type="button">{profile.publicId && profile.status !== 'closed' ? (locale==='ja'?'募集を更新する':'Refresh listing') : (locale==='ja'?'この条件でマッチ待ちする':locale==='en'?'Publish and wait':'发布并等待')}</button><button className="v2-x-button" onClick={()=>void postToX()} type="button">𝕏 {locale==='ja'?'でも募集する':locale==='en'?'Share on X':'在X发布'}</button><button onClick={()=>void copyListingText()} type="button">{locale==='ja'?'募集文をコピー':locale==='en'?'Copy listing text':'复制招募文案'}</button><button onClick={openExchangeTable} type="button">{locale==='ja'?'交換表を共有する':locale==='en'?'Share exchange table':'分享交换表'}</button></div>
  </div> : null;

  return (
    <main className="v2-page" lang={localeInfo[locale].htmlLang}>
      <header className="topbar v2-topbar">
        <a className="brand" href={localizedPath(locale)}>
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          <span>
            <strong>ARCANA LINK</strong>
            <small>22 CARD COMPLETION TOOL</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/genshin-arcana/exchange-table">{locale === 'ja' ? '交換表' : locale === 'en' ? 'Exchange table' : '交换表'}</a>
          <a href="#inventory">{copy.inventory}</a>
          <a href="#matches">{copy.autoMatch}</a>
          <a href={localizedPath(locale, 'genshin-arcana')}>
            {siteCopy.nav[1]}
          </a>
          <a href={localizedPath(locale, 'about')}>{siteCopy.nav[4]}</a>
        </nav>
        <button
          className={`v2-server-chip ${profile.server ? '' : 'unset'}`}
          onClick={openServerSettings}
          type="button"
        >
          <span aria-hidden="true">🌏</span>
          <b>{activeServerLabel}</b>
          <small>{serverCopy.change}</small>
        </button>
        <div className="language-switcher" aria-label="Language">
          {languageLinks.map((link) => (
            <a
              className={link.locale === locale ? 'current' : ''}
              href={localizedPath(link.locale)}
              hrefLang={localeInfo[link.locale].hreflang}
              key={link.locale}
            >
              {link.locale === 'ja' ? 'JA' : link.locale === 'en' ? 'EN' : '中'}
            </a>
          ))}
        </div>
        <button className="new" type="button" onClick={openProfileSettings}>
          {copy.editProfile}
        </button>
      </header>

      {notificationText && (
        <button
          className="v2-notification"
          type="button"
          onClick={() => setNotificationText('')}
        >
          <Bell size={18} />
          <span>{notificationText}</span>
          <X size={16} />
        </button>
      )}

      {newMatchCount>0 && !revisitDismissed && <div className="v2-return-notice"><span>🎉 {locale==='ja'?`前回のアクセス後に${newMatchCount}件の新しい完全マッチがあります`:locale==='en'?`${newMatchCount} new exact match${newMatchCount>1?'es':''} since your last visit`:`上次访问后有${newMatchCount}个新的完全匹配`}</span><a href="#matches" onClick={markNewMatchesSeen}>{locale==='ja'?'マッチを見る':'View matches'}</a></div>}

      {requestedServer &&
        profile.server &&
        requestedServer !== profile.server && (
          <div className="v2-url-server-notice">
            <span>
              {replaceServerTokens(serverCopy.requested, {
                server: serverLabels[locale][requestedServer],
              })}
            </span>
            <button
              onClick={() => {
                setServerChoice(requestedServer);
                setServerOpen(true);
              }}
              type="button"
            >
              {replaceServerTokens(serverCopy.requestedAction, {
                server: serverLabels[locale][requestedServer],
              })}
            </button>
          </div>
        )}

      {sharedDraft && <section className={`v2-shared-draft${sharedDraftResult ? ` is-${sharedDraftResult}` : ''}`} id="shared-condition">
        <span className="v2-kicker">SHARED TRADE</span>
        <h2>{locale==='ja'?'この人の交換条件':locale==='en'?'Shared trade conditions':'对方的交换条件'}</h2>
        <p><b>Server：</b>{serverLabels[locale][sharedDraft.server]}</p>
        <p><b>{locale==='ja'?'欲しい':'Wanted'}：</b>{sharedDraftMissing.map((card)=>labels[card]).join(' / ')||'—'}</p>
        <p><b>{locale==='ja'?'出せる':'Offered'}：</b>{sharedDraftDuplicates.map((card)=>labels[card]).join(' / ')||'—'}</p>
        {!sharedDraftResult ? <a className="card-seo-action" href="#quick-create" onClick={()=>{startQuickRegistration();track('shared_listing_compare_start',{server:sharedDraft.server});}}>{locale==='ja'?'あなたと交換できるか確認する':locale==='en'?'Check if you can trade':'确认能否交换'}</a> : sharedDraftResult === 'exact' ? <div className="v2-shared-result"><h3>🎉 {locale==='ja'?'完全マッチです':locale==='en'?'Exact match':'完全匹配'}</h3><p>{locale==='ja'?'お互いの求・譲が一致しています。自分の募集も公開すると、共有者や同条件の人に見つけてもらえます。':'Both wanted and offered cards match. Publish your listing so this player or another compatible player can find you.'}</p><button className="v2-primary" onClick={publishCurrentListing} type="button">{locale==='ja'?'この条件でマッチ待ちする':'Publish and wait'}</button></div> : <div className="v2-shared-result"><h3>{sharedDraftResult==='different-server'?(locale==='ja'?'サーバーが異なります':'Different server'):(locale==='ja'?'今回は完全一致ではありません':'Not an exact match')}</h3><p>{locale==='ja'?'あなたの条件でも別の交換相手を探せます。':'You can still find another player using your own conditions.'}</p><button className="v2-primary" onClick={publishCurrentListing} type="button">{locale==='ja'?'この条件でマッチ待ちする':'Publish and wait'}</button></div>}
        <small>{locale==='ja'?'共有URLにUID・表示名・個人メモは含まれていません。':'UID, display name and private notes are not included in this URL.'}</small>
      </section>}

      <section className="quality-intro">
        <h2>{summary?.open === 0 ? (locale==='ja'?'月諭のアルカナ交換表を30秒で作成':locale==='en'?'Create your Lunar Arcana trade list in 30 seconds':'30秒制作月谕圣牌交换表') : (locale==='ja'?'掲示板を1件ずつ探す必要はありません':locale==='en'?'Skip searching listings one by one':'无需逐条查找交换帖')}</h2>
        {summary?.open === 0 && <p>{locale==='ja'?'交換相手がまだいなくても交換表を作成でき、そのまま同じ条件でマッチ待ちできます。':'Create a useful trade list now, then keep the same conditions active for automatic matching.'}</p>}
        <ul><li>{locale==='ja'?'お互いの「求・譲」を自動比較':locale==='en'?'Compare both wanted and offered cards':'自动比较双方求与出'}</li><li>{locale==='ja'?'同じサーバーだけ表示':locale==='en'?'Show players on your server only':'仅显示同服务器玩家'}</li><li>{locale==='ja'?'条件一致した相手を優先表示':locale==='en'?'Prioritize two-way matches':'优先显示双向匹配'}</li><li>{locale==='ja'?'7日以上更新のない募集は除外':locale==='en'?'Exclude listings inactive for 7 days':'排除7天未更新招募'}</li></ul>
        <nav><a className="card-seo-action" href="#quick-create" onClick={startQuickRegistration}>{locale==='ja'?'30秒で交換募集を作る':locale==='en'?'Create my trade list':'制作交换表'}</a><a href={localizedPath(locale,'guide')}>{locale==='ja'?'使い方を見る':'How it works'}</a></nav>
      </section>
      {summary && <ExchangeInsights locale={locale} now={currentTime} summary={summary} />}
      <section className="v2-overview" aria-labelledby="collection-heading">
        <div className="v2-progress-card">
          <div className="v2-progress-head">
            <div>
              <span className="v2-kicker">MY COLLECTION</span>
              <h1 id="collection-heading">{locale === 'ja' ? '原神 月諭アルカナ交換マッチング' : locale === 'en' ? 'Find a Lunar Arcana trading partner' : '自动寻找月谕圣牌交换伙伴'}</h1>
              <p className="v2-same-server-lead">{copy.sameServerLead}</p>
            </div>
            <strong>{reviewComplete?`${progress}%`:`${reviewedCount}/22`}</strong>
          </div>
          {!profile.publicId && reviewedCount === 0 && <div className="seo-empty"><p>{locale === 'ja' ? '未所持と余っているカードを選ぶだけ。選ばなかったカードは1枚として扱います。' : locale === 'en' ? 'Select missing cards and duplicates. Unselected cards count as one copy.' : '只需选择未持有和重复的圣牌，未选择的按1张处理。'}</p><a href="#quick-create" onClick={startQuickRegistration}>{locale === 'ja' ? '30秒で交換募集を作る' : locale === 'en' ? 'Create my trade list' : '制作交换表'}</a></div>}
          <div className="v2-progress-track" aria-label={`${reviewComplete?progress:Math.round(reviewedCount/22*100)}%`}>
            <i style={{ width: `${reviewComplete?progress:Math.round(reviewedCount/22*100)}%` }} />
          </div>
          <div className="v2-progress-meta">
            <b>{reviewComplete?collected:reviewedCount} / 22 <span>{reviewComplete?copy.owned:(locale==='ja'?'入力済み':'reviewed')}</span></b>
            <span>{reviewComplete?(missing.length?copy.remaining.replace('{count}',String(missing.length)):copy.complete):(locale==='ja'?`あと${22-reviewedCount}種類を確認`:`${22-reviewedCount} to review`)}</span>
          </div>
          {reviewedCount>0 && <div className="v2-summary-columns">
            <div>
              <small>{copy.missing}</small>
              <div className="v2-mini-cards">
                {missing.length ? (
                  missing.map((card) => <span key={card}>{labels[card]}</span>)
                ) : (
                  <p>{copy.noMissing}</p>
                )}
              </div>
            </div>
            <div>
              <small>{copy.duplicates}</small>
              <div className="v2-mini-cards offer">
                {duplicates.length ? (
                  duplicates.map((card) => (
                    <span key={card}>
                      {labels[card]} ×{inventory[card] - 1}
                    </span>
                  ))
                ) : (
                  <p>{copy.noDuplicates}</p>
                )}
              </div>
            </div>
          </div>}
          <button
            className="v2-share-launch"
            disabled={!reviewComplete}
            onClick={() => {if(!reviewComplete){setToast(locale==='ja'?`残り${22-reviewedCount}種類を確認してください。`:'Review all 22 cards first.');window.location.hash='inventory';return;}if (!profile.server) {setServerOpen(true); return;} track('exchange_table_create', {server:profile.server}); setShareOpen(true);}}
            type="button"
          >
            <span>
              <Share2 size={20} />
              <b>{locale === 'ja' ? '交換表を作る' : shareCopy.open}</b>
            </span>
            <small>
              {reviewComplete?`${collected}/22 · ${progress}%`:`${reviewedCount}/22 入力`} →
            </small>
          </button>
        </div>

        <aside className="v2-status-card">
          <div className="v2-status-title">
            <div>
              <span className="v2-kicker">LIVE STATUS</span>
              <h2>{copy.availability}</h2>
            </div>
            <span className={`v2-status-dot ${profile.status}`} />
          </div>
          <div className="v2-status-options">
            {(['open', 'negotiating', 'closed'] as ExchangeStatus[]).map(
              (status) => (
                <button
                  className={profile.status === status ? 'active' : ''}
                  key={status}
                  onClick={() => setStatus(status)}
                  type="button"
                >
                  {statusLabel(locale, status)}
                </button>
              ),
            )}
          </div>
          {profile.publicId && profile.status !== 'closed' && lastPublishedAt && !listingExpired && <p className="v2-listing-countdown">{locale==='ja'?`募集期限まであと${listingDaysRemaining}日`:locale==='en'?`${listingDaysRemaining} day${listingDaysRemaining===1?'':'s'} until listing expiry`:`招募还有${listingDaysRemaining}天到期`}</p>}
          {listingExpired ? <div className="v2-expiry-warning is-expired"><p>{locale==='ja'?'この募集は期限切れです。再公開すると、あと7日間マッチ候補に表示されます。':locale==='en'?'This listing has expired. Republish it to appear in matching for another 7 days.':'此招募已过期。重新发布后会在匹配候选中显示7天。'}</p><button disabled={saving} onClick={refreshListing} type="button">{locale==='ja'?'募集を再公開する':locale==='en'?'Republish listing':'重新发布招募'}</button></div> : expiresSoon && <div className="v2-expiry-warning"><p>{locale==='ja'?'募集期限が近づいています。あと1日以内でマッチ候補から外れます。':locale==='en'?'Your listing expires within one day and will leave matching results.':'招募将在1天内到期并从匹配候选中移除。'}</p><button disabled={saving} onClick={refreshListing} type="button">{locale==='ja'?'募集を更新する':locale==='en'?'Refresh listing':'更新招募'}</button></div>}
          <button
            className={`v2-alert-toggle ${notifications ? 'active' : ''}`}
            type="button"
            onClick={() => setNotifications((current) => !current)}
          >
            <Bell size={18} />
            <span>
              <b>{copy.notification}</b>
              <small>
                {notifications ? copy.notificationOn : copy.notificationOff}
              </small>
            </span>
          </button>
          <p>{copy.notificationText}</p>
          <button
            className="v2-text-button"
            onClick={openProfileSettings}
            type="button"
          >
            {copy.editProfile} →
          </button>
        </aside>
      </section>

      {saving && <output>{locale==='ja'?'公開保存中…':'Saving…'}</output>}
      <section className="v2-inventory-section" id="inventory">
        {intent && <div className="seo-empty"><p>{labels[cardBySlug[intent.slug].id]}：{locale === 'ja' ? (intent.action === 'offer' ? 'このカードを出せる方は、実際の所持数を2枚以上で入力してください。' : 'このカードを探す方は、所持数を0枚にしてください。') : 'Confirm your actual card count below.'}</p><p>{locale === 'ja' ? '他の21種類も確認すると、相互に条件の合う相手を探せます。' : 'Check all 22 counts to find a two-way match.'}</p></div>}
        <header className="v2-section-heading">
          <div>
            <span className="v2-kicker">01 · INVENTORY</span>
            <h2>{copy.inventory}<small>{reviewComplete?(locale==='ja'?'22 / 22 入力完了 ✓':'22 / 22 complete'):`${reviewedCount} / 22 ${locale==='ja'?'入力済み':'reviewed'}`}</small></h2>
          </div>
          <p>{copy.inventoryHint}</p>
        </header>
        {!reviewComplete && !detailedEntry && <div className="v2-quick-create" id="quick-create">
          <div className="v2-quick-head">
            <div><span className="v2-kicker">30-SECOND SETUP</span><h3>{locale==='ja'?'かんたん登録':locale==='en'?'Quick setup':'快速登记'}</h3></div>
            <ol aria-label={locale==='ja'?'入力手順':'Setup steps'}><li className={quickStep===1?'active':''}>1 {locale==='ja'?'サーバー':'Server'}</li><li className={quickStep===2?'active':''}>2 {locale==='ja'?'未所持':'Missing'}</li><li className={quickStep===3?'active':''}>3 {locale==='ja'?'重複':'Duplicates'}</li></ol>
          </div>
          {quickStep === 1 && <div className="v2-quick-step">
            <h4>{locale==='ja'?'サーバーを選択':locale==='en'?'Choose your server':'选择服务器'}</h4>
            <p>{locale==='ja'?'同じサーバーの交換相手だけを比較します。':'Only players on the same server can be matched.'}</p>
            <div className="v2-quick-servers">{serverRegions.map((server)=><button key={server} onClick={()=>selectQuickServer(server)} type="button">🌏 <b>{serverLabels.en[server]}</b></button>)}</div>
          </div>}
          {quickStep === 2 && <div className="v2-quick-step">
            <h4>{locale==='ja'?'持っていないアルカナを選んでください':locale==='en'?'Select cards you are missing':'选择未持有的圣牌'}</h4>
            <p>{locale==='ja'?'選ばなかったカードは「1枚持っている」として扱います。':'Unselected cards will count as one copy.'}</p>
            <div className="v2-quick-cards">{arcanaCards.map((card,index)=><button aria-pressed={quickMissing.includes(card.id)} key={card.id} onClick={()=>toggleQuickCard('missing',card.id)} type="button"><span>{romans[index]}</span><i>{card.symbol}</i><b>{labels[card.id]}</b></button>)}</div>
            <div className="v2-quick-actions"><button className="v2-primary" onClick={()=>setQuickStep(3)} type="button">{locale==='ja'?'次へ：余っているカード':'Next: duplicates'} →</button></div>
          </div>}
          {quickStep === 3 && <div className="v2-quick-step">
            <h4>{locale==='ja'?'2枚以上持っているアルカナを選んでください':locale==='en'?'Select cards you have at least twice':'选择持有2张以上的圣牌'}</h4>
            <p>{locale==='ja'?'選んだカードは交換に出せるカードとして扱います。3枚以上は完成後に詳細編集できます。':'Selected cards will be offered for trade. Edit exact counts after setup if needed.'}</p>
            <div className="v2-quick-cards offer">{arcanaCards.map((card,index)=><button aria-pressed={quickDuplicates.includes(card.id)} key={card.id} onClick={()=>toggleQuickCard('duplicate',card.id)} type="button"><span>{romans[index]}</span><i>{card.symbol}</i><b>{labels[card.id]}</b></button>)}</div>
            <div className="v2-quick-actions"><button onClick={()=>setQuickStep(2)} type="button">← {locale==='ja'?'戻る':'Back'}</button><button className="v2-primary" onClick={completeQuickRegistration} type="button">{locale==='ja'?'交換表を作る':'Create trade list'}</button></div>
          </div>}
          <button className="v2-detail-toggle" onClick={()=>setDetailedEntry(true)} type="button">{locale==='ja'?'所持数を細かく編集（0 / 1 / 2 / 3+）':'Edit exact counts (0 / 1 / 2 / 3+)'}</button>
          <p className="v2-quick-privacy">{locale==='ja'?'ログイン不要。交換表や共有文にUIDは入りません。':'No login required. Your UID is not included in trade lists or share text.'}</p>
        </div>}
        {reviewComplete && <button className="v2-detail-toggle" onClick={()=>setDetailedEntry((current)=>!current)} type="button">{detailedEntry ? (locale==='ja'?'詳細編集を閉じる':'Close exact counts') : (locale==='ja'?'所持数を細かく編集':'Edit exact counts')}</button>}
        {detailedEntry && !profile.server && (
          <button className="v2-server-lock" onClick={() => setServerOpen(true)} type="button"><span aria-hidden="true">🌏</span><b>{serverCopy.locked}</b><small>{serverCopy.chooseAction} →</small></button>
        )}
        {detailedEntry && <div className="v2-inventory-grid">
          {arcanaCards.map((card, index) => {
            const count = inventory[card.id];
            const reviewed = reviewedSet.has(card.id);
            return (
              <article
                className={`v2-card-count ${!reviewed?'unreviewed':count === 0 ? 'missing' : count >= 2 ? 'duplicate' : ''}`}
                key={card.id}
              >
                <div className="v2-card-identity">
                  <span>{romans[index]}</span>
                  <i>{card.symbol}</i>
                  <strong>{labels[card.id]}</strong>
                </div>
                <div className="v2-count-options" aria-label={`${labels[card.id]} ${reviewed?countLabel(locale,count):locale==='ja'?'未入力':'Not entered'}`}>
                  {([0,1,2,3] as CardCount[]).map(value=><button aria-pressed={reviewed&&count===value} disabled={!profile.server} key={value} onClick={()=>setCount(card.id,value)} type="button">{value===3?'3+':value}</button>)}
                </div>
                <small>{reviewed?countLabel(locale,count):(locale==='ja'?'未入力':locale==='en'?'Not entered':'未输入')}</small>
              </article>
            );
          })}
        </div>}
        {reviewComplete && <div className="v2-ready-panel"><div><span className="v2-kicker">READY</span><h3>{locale==='ja'?'交換準備ができました ✓':locale==='en'?'Ready to trade ✓':'交换准备完成 ✓'}</h3><p><b>Server：</b>{activeServerLabel}</p><p><b>{locale==='ja'?'求':'Wanted'}：</b>{missing.map(card=>labels[card]).join(' / ')||'—'}</p><p><b>{locale==='ja'?'譲':'Offered'}：</b>{duplicates.map(card=>labels[card]).join(' / ')||'—'}</p></div><nav><a className="v2-primary" href="#matches" onClick={()=>track('match_search',{server:profile.server})}>{locale==='ja'?'条件が合う相手を探す':'Find compatible players'}</a><button className="v2-primary v2-publish-primary" onClick={publishCurrentListing} type="button">{locale==='ja'?'この内容で募集を公開する':locale==='en'?'Publish this listing':'发布此招募'}</button><button className="v2-x-button" onClick={()=>void postToX()} type="button">𝕏 {locale==='ja'?'で交換募集する':'Share on X'}</button><button onClick={openExchangeTable} type="button">{locale==='ja'?'交換表を保存する':'Save exchange table'}</button></nav></div>}
      </section>

      <section className="v2-match-section" id="matches">
        <header className="v2-section-heading">
          <div>
            <span className="v2-kicker">02 · MATCHING</span>
            <h2>
              {copy.autoMatch}
              <small>
                {locale === 'en'
                  ? `${exactCount} ${copy.exactMatches}`
                  : `${exactCount}${copy.exactMatches}`}
              </small>
            </h2>
            {profile.server && (
              <button
                className="v2-match-server"
                onClick={openServerSettings}
                type="button"
              >
                <span>{serverCopy.current}</span>
                <b>🌏 {activeServerLabel}</b>
                <small>{serverCopy.change}</small>
              </button>
            )}
          </div>
          <p>{copy.matchLead}</p>
        </header>
        {profile.server && (
          <div className="v2-match-breakdown" aria-label={copy.autoMatch}>
            <span>{replaceCount(serverCopy.exact, exactCount)}</span>
            <span>{replaceCount(serverCopy.partial, partialCount)}</span>
            <small>🌏 {activeServerLabel}</small>
          </div>
        )}
        {!reviewComplete ? (
          <div className="v2-empty"><p>{locale==='ja'?`残り${22-reviewedCount}種類を確認すると、実際の条件でマッチングを開始します。`:'Review all 22 cards to start matching with accurate conditions.'}</p><a className="card-seo-action" href="#inventory">{locale==='ja'?'カード入力を続ける':'Continue card entry'}</a></div>
        ) : !profile.server ? (
          <div className="v2-empty v2-server-empty">
            <span aria-hidden="true">🌏</span>
            <p>{serverCopy.locked}</p>
            <button
              className="v2-primary"
              onClick={() => setServerOpen(true)}
              type="button"
            >
              {serverCopy.chooseAction}
            </button>
          </div>
        ) : matches.length ? (
          <><div className="v2-match-list">
            {matches.map((match) => (
              <article
                className={`v2-match-card ${match.exact ? 'exact' : ''}`}
                key={match.profile.publicId}
              >
                <div className="v2-match-score">
                  <strong>{match.give.length} ↔ {match.receive.length}</strong>
                  <span>{match.exact ? copy.exact : copy.possible}</span>
                </div>
                <div className="v2-match-user">
                  <div className="avatar">{match.profile.displayName[0]}</div>
                  <div>
                    <h3>{match.profile.displayName}</h3>
                    <p>
                      <span
                        className={`v2-status-dot ${match.profile.status}`}
                      />
                      <span className="v2-card-server-badge">
                        🌏 {serverLabels[locale][match.profile.server]}
                      </span>{' '}
                      · <Clock3 size={13} /> {match.profile.updatedAt}
                    </p>
                  </div>
                  {match.profile.sample && <small>{copy.sample}</small>}
                </div>
                <div className="v2-exchange-line">
                  <div>
                    <span>{copy.give}</span>
                    <b>{match.give[0] ? labels[match.give[0]] : '—'}</b>
                  </div>
                  <Handshake size={20} />
                  <div>
                    <span>{copy.receive}</span>
                    <b>{match.receive[0] ? labels[match.receive[0]] : '—'}</b>
                  </div>
                </div>
                <button
                  className="v2-primary"
                  type="button"
                  onClick={() => setSelectedMatch(match)}
                >
                  {copy.details} →
                </button>
              </article>
            ))}
          </div>{exactCount===0 && zeroMatchActions}</>
        ) : (
          listingError ? <div className="v2-empty"><p role="alert">{locale==='ja'?'募集を取得できませんでした。実際の募集状況は確認できていません。しばらくしてからページを再読み込みしてください。':'Listings are unavailable. Please reload later.'}</p></div> : zeroMatchActions
        )}
      </section>

      <aside className="v2-guide-card">
        <ShieldCheck size={24} />
        <div>
          <h2>{siteCopy.safetyTitle}</h2>
          <p>{siteCopy.safetyText}</p>
          <a href={localizedPath(locale, 'genshin-arcana')}>
            {siteCopy.seoLink}
          </a>
        </div>
      </aside>

      <footer className="v2-footer">
        <div>
          <strong>ARCANA LINK</strong>
          <p>{siteCopy.footerDescription}</p>
        </div>
        <nav>
          <a href={localizedPath(locale, 'genshin-arcana')}>
            {siteCopy.footerLinks[0]}
          </a>
          <a href={localizedPath(locale, 'arcana')}>{siteCopy.nav[3]}</a>
          <a href={localizedPath(locale, 'about')}>{siteCopy.footerLinks[2]}</a>
          <a href={localizedPath(locale, 'privacy')}>
            {siteCopy.footerLinks[3]}
          </a>
          <a href={localizedPath(locale, 'terms')}>{siteCopy.footerLinks[4]}</a><a href="/contact">{locale==='ja'?'お問い合わせ・訂正依頼':'Contact (JA)'}</a>
        </nav>
      </footer>

      {serverOpen && (
        <div className="modal-backdrop v2-modal-backdrop">
            <button
              className="modal-dismiss"
              aria-label={copy.close}
              onClick={() => {
                setPendingServer(null);
                setServerOpen(false);
              }}
              type="button"
            />
          <dialog
            className="dialog v2-dialog v2-server-dialog"
            open
            aria-labelledby="server-title"
          >
            <header className="dialog-head">
              <div>
                <span className="v2-kicker">SERVER REGION</span>
                <h2 id="server-title">
                  {pendingServer
                    ? replaceServerTokens(serverCopy.confirmTitle, {
                        from: activeServerLabel,
                        to: serverLabels[locale][pendingServer],
                      })
                    : profile.server
                      ? serverCopy.changeTitle
                      : serverCopy.chooseTitle}
                </h2>
              </div>
              {profile.server && (
                <button
                  className="dialog-close"
                  aria-label={copy.close}
                  onClick={() => {
                    setPendingServer(null);
                    setServerOpen(false);
                  }}
                  type="button"
                >
                  <X size={18} />
                </button>
              )}
            </header>
            {pendingServer ? (
              <div className="v2-server-confirm">
                <div className="v2-server-change-flow">
                  <span>🌏 {activeServerLabel}</span>
                  <b>→</b>
                  <span>🌏 {serverLabels[locale][pendingServer]}</span>
                </div>
                <p>{serverCopy.confirmLead}</p>
                <div>
                  <button onClick={() => setPendingServer(null)} type="button">
                    {serverCopy.cancel}
                  </button>
                  <button
                    className="v2-primary"
                    onClick={confirmServerChange}
                    type="button"
                  >
                    {serverCopy.confirm}
                  </button>
                </div>
              </div>
            ) : (
              <div className="v2-server-picker">
                <p>{serverCopy.chooseLead}</p>
                <div className="v2-server-options">
                  {serverRegions.map((server) => (
                    <button
                      aria-pressed={serverChoice === server}
                      className={serverChoice === server ? 'active' : ''}
                      key={server}
                      onClick={() => setServerChoice(server)}
                      type="button"
                    >
                      <span aria-hidden="true">🌏</span>
                      <b>{serverLabels[locale][server]}</b>
                      <small>{server}</small>
                    </button>
                  ))}
                </div>
                <button
                  className="v2-primary v2-server-submit"
                  disabled={!serverChoice}
                  onClick={chooseServer}
                  type="button"
                >
                  {serverCopy.chooseAction}
                </button>
              </div>
            )}
          </dialog>
        </div>
      )}

      {profileOpen && (
        <div className="modal-backdrop v2-modal-backdrop">
          <button
            className="modal-dismiss"
            aria-label={copy.close}
            onClick={() => setProfileOpen(false)}
            type="button"
          />
          <dialog
            className="dialog v2-dialog"
            open
            aria-labelledby="profile-title"
          >
            <header className="dialog-head">
              <div>
                <span className="v2-kicker">MY PROFILE</span>
                <h2 id="profile-title">{copy.profileTitle}</h2>
              </div>
              <button
                className="dialog-close"
                aria-label={copy.close}
                onClick={() => setProfileOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </header>
            <form className="form" onSubmit={submitProfile}>
              <div className="v2-profile-server-setting">
                <span>{copy.server}</span>
                <b>🌏 {activeServerLabel}</b>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    openServerSettings();
                  }}
                  type="button"
                >
                  {serverCopy.change}
                </button>
              </div>
              <div>
                <label htmlFor="profileLanguage">{serverCopy.language}</label>
                <select
                  id="profileLanguage"
                  value={locale}
                  onChange={(event) =>
                    changeLanguage(event.target.value as SiteLocale)
                  }
                >
                  {languageLinks.map((link) => (
                    <option key={link.locale} value={link.locale}>
                      {localeInfo[link.locale].label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="two">
                <div>
                  <label htmlFor="displayName">{copy.displayName}</label>
                  <input
                    defaultValue={profile.displayName}
                    id="displayName"
                    maxLength={30}
                    name="displayName"
                    placeholder={siteCopy.displayNamePlaceholder}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="uid">{copy.uid}</label>
                  <input
                    defaultValue={profile.uid}
                    id="uid"
                    inputMode="numeric"
                    name="uid"
                    pattern="[0-9]{9,10}"
                    placeholder="800123456"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="profileNote">{copy.note}</label>
                <textarea
                  defaultValue={profile.note}
                  id="profileNote"
                  maxLength={160}
                  name="note"
                  placeholder={siteCopy.notePlaceholder}
                />
              </div>
              <label className="contact-consent"><input type="checkbox" required/><span>{locale==='ja'?'表示名・UID・サーバー・所持数・メモを交換候補として公開することを確認しました。':locale==='en'?'I understand that my name, UID, server, inventory and note will be publicly visible.':'我已确认昵称、UID、服务器、圣牌数量和备注将公开显示。'}</span></label><p className="v2-data-note">
                <ShieldCheck size={17} />
                {copy.dataNote}
              </p>
              <button className="submit" type="submit">
                {copy.save}
              </button>
            </form>
          </dialog>
        </div>
      )}

      {shareOpen && (
        <div className="modal-backdrop v2-modal-backdrop">
          <button
            className="modal-dismiss"
            aria-label={copy.close}
            onClick={() => {setShareOpen(false);setPublishSuccess(false);}}
            type="button"
          />
          <dialog
            className="dialog v2-dialog v2-share-dialog"
            open
            aria-labelledby="share-title"
          >
            <header className="dialog-head">
              <div>
                <span className="v2-kicker">{shareCopy.kicker}</span>
                <h2 id="share-title">{publishSuccess && locale==='ja'?'募集を公開しました ✓':shareCopy.title}</h2>
              </div>
              <button
                className="dialog-close"
                aria-label={copy.close}
                onClick={() => {setShareOpen(false);setPublishSuccess(false);}}
                type="button"
              >
                <X size={18} />
              </button>
            </header>
            <div className="v2-share-body">
              {publishSuccess && <div className="v2-publish-success"><p><b>Server：</b>{activeServerLabel}</p><p><b>{locale==='ja'?'求':'Wanted'}：</b>{missing.map(card=>labels[card]).join(' / ')||'—'}</p><p><b>{locale==='ja'?'譲':'Offered'}：</b>{duplicates.map(card=>labels[card]).join(' / ')||'—'}</p><p>{locale==='ja'?'この募集を共有すると、交換相手に見つけてもらいやすくなります。':'Share this listing so compatible players can find it.'}</p></div>}
              <ExchangeTable inventory={inventory} server={profile.server} status={profile.status} publicId={(saving ? undefined : profile.publicId)} locale={locale} />
              {!profile.publicId && <div className="v2-match-wait-cta"><b>{locale==='ja'?'交換表が完成しました ✓':locale==='en'?'Your trade list is ready ✓':'交换表已完成 ✓'}</b><p>{locale==='ja'?'同じ条件を7日間保存し、新しい募集とも自動比較できます。UID入力は次の画面で行い、共有文や画像には載せません。':'Save these conditions for 7 days and compare them with future listings. Your UID is never included in share text or images.'}</p><button className="v2-primary" onClick={publishCurrentListing} type="button">{locale==='ja'?'この条件でマッチ待ちする':locale==='en'?'Save and wait for matches':'保存并等待匹配'}</button></div>}
              <div className="v2-share-preview">
                <div className="v2-share-brand">
                  <Sparkles size={18} />
                  <span>ARCANA LINK</span>
                  <small>{shareCopy.badge}</small>
                </div>
                <div className="v2-share-number">
                  <strong>{collected}</strong>
                  <span>/ 22</span>
                </div>
                <p>{shareCopy.collected}</p>
                <div className="v2-share-progress">
                  <i style={{ width: `${progress}%` }} />
                </div>
                <div className="v2-share-stats">
                  <span>
                    <small>{shareCopy.missing}</small>
                    <b>{missing.length}</b>
                  </span>
                  <span>
                    <small>{shareCopy.duplicates}</small>
                    <b>{duplicateCopies}</b>
                  </span>
                </div>
                <footer>
                  <b>{shareCopy.challenge}</b>
                  <span>#ARCANALINK</span>
                </footer>
              </div>
              <div className="v2-share-actions">
                <button
                  className="v2-x-button"
                  disabled={shareBusy}
                  onClick={() => void postToX()}
                  type="button"
                >
                  <b>𝕏</b>
                  {shareBusy ? shareCopy.sharing : shareCopy.post}
                </button>
                {hydrated && typeof navigator !== 'undefined' && typeof navigator.share === 'function' && <button onClick={() => void shareNative()} type="button"><Share2 size={17}/>{locale==='ja'?'共有する':'Share'}</button>}
                <button
                  disabled={shareBusy}
                  onClick={() => void saveShareImage()}
                  type="button"
                >
                  <Download size={17} />
                  {publishSuccess && locale==='ja'?'交換表画像を保存':shareCopy.download}
                </button>
                <button onClick={() => void copyListingUrl()} type="button">
                  <Copy size={17} />
                  {locale==='ja'?'リンクをコピー':'Copy link'}
                </button>
                <button onClick={() => void copyListingText()} type="button">
                  <Copy size={17} />
                  {locale==='ja'?'募集文をコピー':locale==='en'?'Copy listing text':'复制招募文案'}
                </button>
              </div>
              <p className="v2-share-privacy">
                <ShieldCheck size={16} /> {shareCopy.privacy}
              </p>
            </div>
          </dialog>
        </div>
      )}

      {selectedMatch && (
        <div className="modal-backdrop v2-modal-backdrop">
          <button
            className="modal-dismiss"
            aria-label={copy.close}
            onClick={() => setSelectedMatch(null)}
            type="button"
          />
          <dialog
            className="dialog v2-dialog v2-trade-dialog"
            open
            aria-labelledby="trade-title"
          >
            <header className="dialog-head">
              <div>
                <span className="v2-kicker">{selectedMatch.exact ? 'TWO-WAY MATCH' : 'ONE-WAY MATCH'}</span>
                <h2 id="trade-title">{selectedMatch.profile.displayName}</h2>
              </div>
              <button
                className="dialog-close"
                aria-label={copy.close}
                onClick={() => setSelectedMatch(null)}
                type="button"
              >
                <X size={18} />
              </button>
            </header>
            <div className="v2-trade-body">
              <p className="v2-trade-meta">
                <span
                  className={`v2-status-dot ${selectedMatch.profile.status}`}
                />
                🌏 {serverLabels[locale][selectedMatch.profile.server]} ·{' '}
                {statusLabel(locale, selectedMatch.profile.status)}
              </p>
              <div className="v2-trade-flow">
                <div>
                  <small>{copy.give}</small>
                  <strong>
                    {selectedMatch.give[0]
                      ? labels[selectedMatch.give[0]]
                      : '—'}
                  </strong>
                </div>
                <Handshake size={24} />
                <div>
                  <small>{copy.receive}</small>
                  <strong>
                    {selectedMatch.receive[0]
                      ? labels[selectedMatch.receive[0]]
                      : '—'}
                  </strong>
                </div>
              </div>
              <blockquote>{selectedMatch.profile.note}</blockquote>
              <div className="v2-uid-box">
                <div>
                  <small>UID</small>
                  <strong>{selectedMatch.profile.uid}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => copyUid(selectedMatch.profile.uid)}
                >
                  <Copy size={17} />
                  {copied ? copy.copied : copy.copyUid}
                </button>
              </div>
              <p className="v2-friend-instruction">{copy.friendInstruction}</p>
              <div className="v2-trade-actions">
                <button type="button" onClick={() => setStatus('negotiating')}>
                  {copy.markNegotiating}
                </button>
                <button
                  className="v2-primary"
                  disabled={!selectedMatch.exact}
                  type="button"
                  onClick={() => completeTrade(selectedMatch)}
                >
                  <Check size={17} />
                  {copy.completeTrade}
                </button>
              </div>
              <div className="v2-report-row">
                <AlertTriangle size={15} />
                <select
                  aria-label={copy.reportReason}
                  value={reportReason}
                  onChange={(event) => setReportReason(event.target.value)}
                >
                  {copy.reportReasons.map((reason, index) => (
                    <option
                      key={reason}
                      value={
                        [
                          'already_exchanged',
                          'incorrect_uid',
                          'suspicious_request',
                          'other',
                        ][index]
                      }
                    >
                      {reason}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => void reportMatch()}>
                  {copy.report}
                </button>
              </div>
            </div>
          </dialog>
        </div>
      )}

      {tradeSuccess && (
        <div className="modal-backdrop v2-modal-backdrop">
          <button
            className="modal-dismiss"
            aria-label={copy.close}
            onClick={() => setTradeSuccess(false)}
            type="button"
          />
          <dialog className="dialog v2-dialog v2-success-dialog" open aria-labelledby="success-title">
            <header className="dialog-head">
              <div>
                <span className="v2-kicker">TRADE COMPLETE</span>
                <h2 id="success-title">🎉 {locale==='ja'?'交換成立！':'Trade complete!'}</h2>
              </div>
              <button className="dialog-close" aria-label={copy.close} onClick={()=>setTradeSuccess(false)} type="button"><X size={18}/></button>
            </header>
            <div className="v2-success-body">
              <p>{locale==='ja'?'ARCANA LINKで条件が合う交換相手が見つかりました。同じように探している人へ共有できます。':'You found a compatible trade on ARCANA LINK. Share it with others looking for partners.'}</p>
              <div className="v2-share-actions">
                <button className="v2-x-button" onClick={postTradeSuccessToX} type="button">𝕏 {locale==='ja'?'で共有':'Share on X'}</button>
                {hydrated && typeof navigator !== 'undefined' && typeof navigator.share === 'function' && <button onClick={()=>void shareTradeSuccessNative()} type="button"><Share2 size={17}/>{locale==='ja'?'共有する':'Share'}</button>}
              </div>
              <small>{locale==='ja'?'相手のUID・名前・交換内容は共有文に含みません。':'The other player’s name, UID and trade details are not shared.'}</small>
            </div>
          </dialog>
        </div>
      )}

      {toast && (
        <button className="v2-toast" type="button" onClick={() => setToast('')}>
          <Check size={17} />
          {toast}
        </button>
      )}
    </main>
  );
}
