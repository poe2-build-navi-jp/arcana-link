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
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from '@/components/icons';
import { arcanaCards } from '@/lib/arcana-cards';
import {
  collectedTypeCount,
  defaultInventory,
  neededCards,
  normalizeInventory,
  offeredCards,
  type CardCount,
  type ExchangeProfile,
  type InventoryCounts,
} from '@/lib/arcana-profile';
import { evaluateMatch, filterCompatibleServer } from '@/lib/matching';
import {
  cardNames,
  homeCopy,
  languageLinks,
  localeInfo,
  localeShortLabel,
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

const storageKeys = {
  inventory: 'arcana-link-v2-inventory',
  profile: 'arcana-link-v2-profile',
  token: 'arcana-link-v2-token',
  notifications: 'arcana-link-v2-notifications',
  server: 'arcana_server',
};

function inventoryWith(wants: ArcanaId[], offers: ArcanaId[]) {
  const inventory = Object.fromEntries(
    arcanaCards.map((card) => [card.id, 1]),
  ) as InventoryCounts;
  for (const card of wants) inventory[card] = 0;
  for (const card of offers) inventory[card] = 2;
  return inventory;
}

function sampleProfiles(locale: SiteLocale): ExchangeProfile[] {
  const text = {
    ja: {
      names: ['カード収集家', '白月', 'ルイルイ', 'NorthStar', '星めぐり'],
      notes: [
        '今夜22時ごろまでログインできます。',
        '交換後はすぐに解散でOKです。',
        '申請時に「ARCANA LINK」とお願いします！',
        'English / 日本語どちらでも大丈夫です。',
        '平日は20時以降に合流できます。',
      ],
      times: ['12分前', '18分前', '35分前', '1時間前', '2時間前'],
    },
    en: {
      names: ['Card Collector', 'White Moon', 'Lui', 'NorthStar', 'Stargazer'],
      notes: [
        'Online until around 10 PM tonight.',
        'Happy to leave after the exchange.',
        'Please mention “ARCANA LINK” in your request.',
        'English or Japanese is fine.',
        'Usually available after 8 PM on weekdays.',
      ],
      times: ['12 min ago', '18 min ago', '35 min ago', '1 hr ago', '2 hr ago'],
    },
    'zh-cn': {
      names: ['圣牌收藏家', '白月', '小鹿', 'NorthStar', '逐星者'],
      notes: [
        '今晚22点左右之前都可以上线。',
        '交换完成后可以直接结束联机。',
        '申请时请注明“ARCANA LINK”。',
        '可以使用中文或英文沟通。',
        '工作日20点以后可以上线。',
      ],
      times: ['12分钟前', '18分钟前', '35分钟前', '1小时前', '2小时前'],
    },
  }[locale === 'ja' || locale === 'en' || locale === 'zh-cn' ? locale : 'en'];
  const profiles = [
    { wants: ['月'], offers: ['世界'], uid: '800123456', server: 'asia' },
    { wants: ['皇帝'], offers: ['太陽'], uid: '812345670', server: 'asia' },
    { wants: ['戦車'], offers: ['死神'], uid: '845670123', server: 'asia' },
    { wants: ['愚者'], offers: ['星'], uid: '701234567', server: 'europe' },
    { wants: ['女帝'], offers: ['正義'], uid: '912345678', server: 'america' },
  ] satisfies Array<{
    wants: ArcanaId[];
    offers: ArcanaId[];
    uid: string;
    server: ServerRegion;
  }>;
  return profiles.map((profile, index) => ({
    publicId: `sample-${index}`,
    displayName: text.names[index],
    uid: profile.uid,
    server: profile.server,
    note: text.notes[index],
    status: index === 1 ? 'negotiating' : 'open',
    locale,
    inventory: inventoryWith(profile.wants, profile.offers),
    updatedAt: text.times[index],
    sample: true,
  }));
}

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

const baseCollectionShareCopy = {
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
    copyLink: 'リンクをコピー',
    linkCopied: 'リンクをコピーしました',
    nativeShare: 'ほかのアプリで共有',
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
    copyLink: 'Copy trade link',
    linkCopied: 'Trade link copied',
    nativeShare: 'Share with another app',
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
    copyLink: '复制交换链接',
    linkCopied: '交换链接已复制',
    nativeShare: '分享到其他应用',
    saved: 'X用图片已保存',
    fallback:
      '此设备不支持自动附加图片。将打开X发布页面；附上保存的图片会更醒目。',
    sharing: '正在生成图片…',
    privacy: '图片和发布文案不会包含UID或显示名称。',
  },
} satisfies Record<'ja' | 'en' | 'zh-cn', Record<string, string>>;

const collectionShareCopy: Record<SiteLocale, Record<string, string>> = {
  ...baseCollectionShareCopy,
  'zh-tw': {
    ...baseCollectionShareCopy['zh-cn'],
    open: '分享到X',
    title: '分享你的收集進度',
    copiedDone: '分享文字已複製',
  },
  ko: {
    ...baseCollectionShareCopy.en,
    open: 'X에 공유',
    title: '컬렉션 공유',
    copiedDone: '게시 문구 복사 완료',
  },
  es: {
    ...baseCollectionShareCopy.en,
    open: 'Compartir en X',
    title: 'Comparte tu colección',
    copiedDone: 'Texto copiado',
  },
  'pt-br': {
    ...baseCollectionShareCopy.en,
    open: 'Compartilhar no X',
    title: 'Compartilhe sua coleção',
    copiedDone: 'Texto copiado',
  },
};

function replaceCount(value: string, count: number) {
  return value.replace('{count}', String(count));
}

const baseServerUiCopy = {
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
} satisfies Record<'ja' | 'en' | 'zh-cn', Record<string, string>>;

const serverUiCopy: Record<SiteLocale, Record<string, string>> = {
  ...baseServerUiCopy,
  'zh-tw': {
    ...baseServerUiCopy['zh-cn'],
    chooseTitle: '請選擇你的伺服器',
    chooseLead: '聖牌只能與同一伺服器的玩家交換。',
  },
  ko: {
    ...baseServerUiCopy.en,
    chooseTitle: '서버를 선택하세요',
    chooseLead: '같은 서버의 플레이어끼리만 교환할 수 있습니다.',
  },
  es: {
    ...baseServerUiCopy.en,
    chooseTitle: 'Elige tu servidor',
    chooseLead: 'Solo puedes intercambiar con jugadores del mismo servidor.',
  },
  'pt-br': {
    ...baseServerUiCopy.en,
    chooseTitle: 'Escolha seu servidor',
    chooseLead: 'A troca só funciona entre jogadores do mesmo servidor.',
  },
};

function replaceServerTokens(value: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (result, [key, replacement]) => result.replace(`{${key}}`, replacement),
    value,
  );
}

export function ExchangeHome({ locale }: { locale: SiteLocale }) {
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
  const [shareMode, setShareMode] = useState<'local' | 'shared'>('local');
  const knownMatches = useRef<Set<string> | null>(null);

  const missing = useMemo(() => neededCards(inventory), [inventory]);
  const duplicates = useMemo(() => offeredCards(inventory), [inventory]);
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
    if (!profile.server) return [];
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
  }, [inventory, profile.publicId, profile.server, profiles]);

  const exactCount = matches.filter((match) => match.exact).length;
  const partialCount = matches.length - exactCount;

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
    const savedServer =
      normalizeServerRegion(localStorage.getItem(storageKeys.server)) ??
      normalizeServerRegion(savedProfile?.server);
    const urlServer = normalizeServerRegion(
      new URL(window.location.href).searchParams.get('server'),
    );
    if (urlServer) setRequestedServer(urlServer);
    if (savedProfile) {
      setProfile({
        ...savedProfile,
        server: savedServer ?? '',
      });
    } else if (savedServer) {
      setProfile((current) => ({ ...current, server: savedServer }));
    }
    if (!savedServer) {
      setServerChoice(urlServer ?? '');
      setServerOpen(true);
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
    if (profile.server) {
      localStorage.setItem(storageKeys.server, profile.server);
    }
  }, [hydrated, inventory, notifications, profile]);

  useEffect(() => {
    if (!profile.server) return;
    let stopped = false;
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
        if (stopped) return;
        setShareMode(data.mode === 'shared' ? 'shared' : 'local');
        if (data.mode === 'shared') {
          setProfiles(data.profiles ?? []);
        } else {
          setProfiles(sampleProfiles(locale));
        }
      } catch {
        if (!stopped) {
          setShareMode('local');
          setProfiles(sampleProfiles(locale));
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

  useEffect(() => {
    if (
      !hydrated ||
      !token ||
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
        if (!response.ok) return;
        const data = (await response.json()) as {
          publicId?: string;
          mode?: 'local' | 'shared';
        };
        if (data.mode === 'shared') setShareMode('shared');
        if (data.publicId && data.publicId !== profile.publicId) {
          setProfile((current) => ({ ...current, publicId: data.publicId }));
        }
      } catch {
        setShareMode('local');
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [hydrated, inventory, locale, profile, token]);

  useEffect(() => {
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
  }, [locale, matches, notifications]);

  function updateCount(card: ArcanaId, change: -1 | 1) {
    if (!profile.server) {
      setServerOpen(true);
      return;
    }
    setInventory((current) => ({
      ...current,
      [card]: Math.max(0, Math.min(3, current[card] + change)) as CardCount,
    }));
  }

  function setStatus(status: ExchangeStatus) {
    setProfile((current) => ({ ...current, status }));
    setToast(statusLabel(locale, status));
  }

  function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile.server) {
      setProfileOpen(false);
      setServerOpen(true);
      return;
    }
    const form = new FormData(event.currentTarget);
    setProfile((current) => ({
      ...current,
      displayName: String(form.get('displayName') || '').trim(),
      uid: String(form.get('uid') || ''),
      note: String(form.get('note') || '').trim(),
      status: 'open',
    }));
    setProfileOpen(false);
    setToast(shareMode === 'shared' ? copy.saved : copy.localSaved);
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
    void navigator.clipboard.writeText(uid);
    setCopied(true);
    setToast(copy.uidCopiedNext);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function openProfileSettings() {
    if (!profile.server) {
      setServerOpen(true);
      return;
    }
    setProfileOpen(true);
  }

  function openServerSettings() {
    setServerChoice(profile.server);
    setServerOpen(true);
  }

  function chooseServer() {
    if (!serverChoice) return;
    if (!profile.server) {
      setProfile((current) => ({ ...current, server: serverChoice }));
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
    setSelectedMatch(null);
    setToast(copy.completed);
  }

  function summarizedNames(cards: ArcanaId[]) {
    const visible = cards.slice(0, 4).map((card) => labels[card]);
    return cards.length > 4
      ? `${visible.join('・')} +${cards.length - 4}`
      : visible.join('・');
  }

  function shareText() {
    const status =
      collected === 22
        ? shareCopy.complete
        : replaceCount(shareCopy.remaining, missing.length);
    const duplicateLine = duplicates.length
      ? summarizedNames(duplicates)
      : shareCopy.noDuplicates;
    const lines: Record<SiteLocale, string> = {
      ja: `月諭アルカナ、現在 ${collected}/22種（${progress}%）✨\n${status}\n交換できる重複：${duplicateLine}`,
      en: `My Lunar Arcana collection: ${collected}/22 (${progress}%) ✨\n${status}\nDuplicates to trade: ${duplicateLine}`,
      'zh-cn': `我的月谕圣牌：${collected}/22（${progress}%）✨\n${status}\n可交换：${duplicateLine}`,
      'zh-tw': `我的月諭聖牌：${collected}/22（${progress}%）✨\n${status}\n可交換：${duplicateLine}`,
      ko: `나의 월의 아르카나: ${collected}/22 (${progress}%) ✨\n${status}\n교환 가능: ${duplicateLine}`,
      es: `Mi colección de Arcanos Lunares: ${collected}/22 (${progress}%) ✨\n${status}\nDuplicados: ${duplicateLine}`,
      'pt-br': `Minha coleção de Arcanos Lunares: ${collected}/22 (${progress}%) ✨\n${status}\nRepetidas: ${duplicateLine}`,
    };
    return `${lines[locale]}\n\n${shareCopy.challenge} 🔁\n#GenshinImpact #LunarArcana #ARCANALINK\n${shareUrl()}`;
  }

  function shareUrl() {
    return `https://arcana-card-link.pages.dev${localizedPath(locale)}${profile.server ? `?server=${profile.server}` : ''}`;
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
    context.fillText(shareCopy.missing.toUpperCase(), 850, 122);
    context.fillStyle = '#fff';
    context.font = '700 60px Georgia, serif';
    context.fillText(String(missing.length), 850, 188);
    context.fillStyle = '#91aabe';
    context.font = '500 20px system-ui, sans-serif';
    context.fillText(summarizedNames(missing) || '—', 850, 226);
    context.fillStyle = '#d7b778';
    context.font = '700 16px system-ui, sans-serif';
    context.fillText(shareCopy.duplicates.toUpperCase(), 850, 310);
    context.fillStyle = '#fff';
    context.font = '700 60px Georgia, serif';
    context.fillText(String(duplicateCopies), 850, 376);
    context.fillStyle = '#91aabe';
    context.font = '500 20px system-ui, sans-serif';
    context.fillText(summarizedNames(duplicates) || '—', 850, 414);
    context.fillStyle = '#f4e3bf';
    context.font = '700 20px system-ui, sans-serif';
    context.fillText(shareCopy.challenge, 850, 500);

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
    const text = shareText();
    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  async function copyShareLink() {
    await navigator.clipboard.writeText(shareUrl());
    setToast(shareCopy.linkCopied);
  }

  async function shareViaDevice() {
    if (!navigator.share) return copyShareLink();
    try {
      await navigator.share({
        title: shareCopy.title,
        text: shareText(),
        url: shareUrl(),
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') await copyShareLink();
    }
  }

  async function copyShareText() {
    await navigator.clipboard.writeText(shareText());
    setToast(shareCopy.copiedDone);
  }

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
          <span className="language-switcher-label">{serverCopy.language}</span>
          {languageLinks.map((link) => (
            <a
              className={link.locale === locale ? 'current' : ''}
              href={localizedPath(link.locale)}
              hrefLang={localeInfo[link.locale].hreflang}
              key={link.locale}
            >
              {localeShortLabel[link.locale]}
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

      <section className="v2-overview" aria-labelledby="collection-heading">
        <div className="v2-progress-card">
          <div className="v2-progress-head">
            <div>
              <span className="v2-kicker">MY COLLECTION</span>
              <h1 id="collection-heading">{copy.inventory}</h1>
              <p className="v2-same-server-lead">{copy.sameServerLead}</p>
            </div>
            <strong>{progress}%</strong>
          </div>
          <div className="v2-progress-track" aria-label={`${progress}%`}>
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="v2-progress-meta">
            <b>
              {collected} / 22 <span>{copy.owned}</span>
            </b>
            <span>
              {missing.length
                ? copy.remaining.replace('{count}', String(missing.length))
                : copy.complete}
            </span>
          </div>
          <div className="v2-summary-columns">
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
          </div>
          <button
            className="v2-share-launch"
            onClick={() => setShareOpen(true)}
            type="button"
          >
            <span>
              <Share2 size={20} />
              <b>{shareCopy.open}</b>
            </span>
            <small>
              {collected}/22 · {progress}% →
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

      <section className="v2-inventory-section" id="inventory">
        <header className="v2-section-heading">
          <div>
            <span className="v2-kicker">01 · INVENTORY</span>
            <h2>{copy.inventory}</h2>
          </div>
          <p>{copy.inventoryHint}</p>
        </header>
        {!profile.server && (
          <button
            className="v2-server-lock"
            onClick={() => setServerOpen(true)}
            type="button"
          >
            <span aria-hidden="true">🌏</span>
            <b>{serverCopy.locked}</b>
            <small>{serverCopy.chooseAction} →</small>
          </button>
        )}
        <div className="v2-inventory-grid">
          {arcanaCards.map((card, index) => {
            const count = inventory[card.id];
            return (
              <article
                className={`v2-card-count ${count === 0 ? 'missing' : count >= 2 ? 'duplicate' : ''}`}
                key={card.id}
              >
                <div className="v2-card-identity">
                  <span>{romans[index]}</span>
                  <i>{card.symbol}</i>
                  <strong>{labels[card.id]}</strong>
                </div>
                <div
                  className="v2-counter"
                  aria-label={`${labels[card.id]} ${countLabel(locale, count)}`}
                >
                  <button
                    aria-label={`${labels[card.id]} −1`}
                    disabled={!profile.server || count === 0}
                    onClick={() => updateCount(card.id, -1)}
                    type="button"
                  >
                    <Minus size={15} />
                  </button>
                  <b>{count === 3 ? '3+' : count}</b>
                  <button
                    aria-label={`${labels[card.id]} +1`}
                    disabled={!profile.server || count === 3}
                    onClick={() => updateCount(card.id, 1)}
                    type="button"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <small>{countLabel(locale, count)}</small>
              </article>
            );
          })}
        </div>
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
        {!profile.server ? (
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
          <div className="v2-match-list">
            {matches.map((match) => (
              <article
                className={`v2-match-card ${match.exact ? 'exact' : ''}`}
                key={match.profile.publicId}
              >
                <div className="v2-match-score">
                  <strong>{match.score}%</strong>
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
          </div>
        ) : (
          <div className="v2-empty">
            <Bell size={24} />
            <p>
              {replaceServerTokens(serverCopy.zero, {
                server: activeServerLabel,
              })}
            </p>
            <div className="v2-empty-actions">
              <button
                className="v2-primary"
                onClick={openProfileSettings}
                type="button"
              >
                {serverCopy.publish}
              </button>
              <button onClick={() => setNotifications(true)} type="button">
                <Bell size={16} /> {serverCopy.alerts}
              </button>
            </div>
          </div>
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
          <a href={localizedPath(locale, 'terms')}>{siteCopy.footerLinks[4]}</a>
        </nav>
      </footer>

      {(serverOpen || (hydrated && !profile.server)) && (
        <div className="modal-backdrop v2-modal-backdrop">
          {profile.server && (
            <button
              className="modal-dismiss"
              aria-label={copy.close}
              onClick={() => {
                setPendingServer(null);
                setServerOpen(false);
              }}
              type="button"
            />
          )}
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
              <p className="v2-data-note">
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
            onClick={() => setShareOpen(false)}
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
                <h2 id="share-title">{shareCopy.title}</h2>
              </div>
              <button
                className="dialog-close"
                aria-label={copy.close}
                onClick={() => setShareOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </header>
            <div className="v2-share-body">
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
                <button
                  disabled={shareBusy}
                  onClick={() => void saveShareImage()}
                  type="button"
                >
                  <Download size={17} />
                  {shareCopy.download}
                </button>
                <button onClick={() => void copyShareText()} type="button">
                  <Copy size={17} />
                  {shareCopy.copied}
                </button>
                <button onClick={() => void copyShareLink()} type="button">
                  <Copy size={17} />
                  {shareCopy.copyLink}
                </button>
                <button onClick={() => void shareViaDevice()} type="button">
                  <Share2 size={17} />
                  {shareCopy.nativeShare}
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
                <span className="v2-kicker">{selectedMatch.score}% MATCH</span>
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

      {toast && (
        <button className="v2-toast" type="button" onClick={() => setToast('')}>
          <Check size={17} />
          {toast}
        </button>
      )}
    </main>
  );
}
