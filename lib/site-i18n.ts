export const siteLocales = [
  'ja',
  'en',
  'zh-cn',
  'zh-tw',
  'ko',
  'es',
  'pt-br',
] as const;

export type SiteLocale = (typeof siteLocales)[number];

export const arcanaIds = [
  '魔術師',
  '女教皇',
  '女帝',
  '皇帝',
  '教皇',
  '恋人',
  '戦車',
  '力',
  '隠者',
  '運命の輪',
  '正義',
  '吊るされた男',
  '死神',
  '節制',
  '悪魔',
  '塔',
  '星',
  '月',
  '太陽',
  '審判',
  '世界',
  '愚者',
] as const;

export type ArcanaId = (typeof arcanaIds)[number];

export const romans = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
  'XXI',
  'XXII',
] as const;

const englishCards: Record<ArcanaId, string> = {
  魔術師: 'The Magician',
  女教皇: 'The High Priestess',
  女帝: 'The Empress',
  皇帝: 'The Emperor',
  教皇: 'The Hierophant',
  恋人: 'The Lovers',
  戦車: 'The Chariot',
  力: 'Strength',
  隠者: 'The Hermit',
  運命の輪: 'Wheel of Fortune',
  正義: 'Justice',
  吊るされた男: 'The Hanged Man',
  死神: 'Death',
  節制: 'Temperance',
  悪魔: 'The Devil',
  塔: 'The Tower',
  星: 'The Star',
  月: 'The Moon',
  太陽: 'The Sun',
  審判: 'Judgment',
  世界: 'The World',
  愚者: 'The Fool',
};

const chineseCards: Record<ArcanaId, string> = {
  魔術師: '魔法师',
  女教皇: '女祭司',
  女帝: '女皇',
  皇帝: '皇帝',
  教皇: '圣职者',
  恋人: '恋人',
  戦車: '战车',
  力: '力量',
  隠者: '隐者',
  運命の輪: '命运之轮',
  正義: '正义',
  吊るされた男: '倒吊人',
  死神: '死神',
  節制: '节制',
  悪魔: '魔鬼',
  塔: '塔',
  星: '星',
  月: '月亮',
  太陽: '太阳',
  審判: '审判',
  世界: '世界',
  愚者: '愚者',
};

const traditionalChineseCards = Object.fromEntries(
  Object.entries(chineseCards).map(([card, name]) => [
    card,
    (
      {
        魔法师: '魔法師',
        女祭司: '女祭司',
        女皇: '女皇',
        圣职者: '聖職者',
        恋人: '戀人',
        战车: '戰車',
        力量: '力量',
        隐者: '隱者',
        命运之轮: '命運之輪',
        正义: '正義',
        倒吊人: '倒吊人',
        节制: '節制',
        魔鬼: '魔鬼',
        审判: '審判',
        愚者: '愚者',
      } as Record<string, string>
    )[name] ?? name,
  ]),
) as Record<ArcanaId, string>;

const koreanCards = Object.fromEntries(
  arcanaIds.map((card, index) => [
    card,
    [
      '마법사',
      '여사제',
      '여황제',
      '황제',
      '교황',
      '연인',
      '전차',
      '힘',
      '은둔자',
      '운명의 수레바퀴',
      '정의',
      '매달린 사람',
      '죽음',
      '절제',
      '악마',
      '탑',
      '별',
      '달',
      '태양',
      '심판',
      '세계',
      '광대',
    ][index],
  ]),
) as Record<ArcanaId, string>;
const spanishCards = Object.fromEntries(
  arcanaIds.map((card, index) => [
    card,
    [
      'El Mago',
      'La Sacerdotisa',
      'La Emperatriz',
      'El Emperador',
      'El Hierofante',
      'Los Enamorados',
      'El Carro',
      'La Fuerza',
      'El Ermitaño',
      'La Rueda de la Fortuna',
      'La Justicia',
      'El Colgado',
      'La Muerte',
      'La Templanza',
      'El Diablo',
      'La Torre',
      'La Estrella',
      'La Luna',
      'El Sol',
      'El Juicio',
      'El Mundo',
      'El Loco',
    ][index],
  ]),
) as Record<ArcanaId, string>;
const portugueseCards = Object.fromEntries(
  arcanaIds.map((card, index) => [
    card,
    [
      'O Mago',
      'A Sacerdotisa',
      'A Imperatriz',
      'O Imperador',
      'O Hierofante',
      'Os Enamorados',
      'O Carro',
      'A Força',
      'O Eremita',
      'A Roda da Fortuna',
      'A Justiça',
      'O Enforcado',
      'A Morte',
      'A Temperança',
      'O Diabo',
      'A Torre',
      'A Estrela',
      'A Lua',
      'O Sol',
      'O Julgamento',
      'O Mundo',
      'O Louco',
    ][index],
  ]),
) as Record<ArcanaId, string>;

export const cardNames: Record<SiteLocale, Record<ArcanaId, string>> = {
  ja: Object.fromEntries(arcanaIds.map((card) => [card, card])) as Record<
    ArcanaId,
    string
  >,
  en: englishCards,
  'zh-cn': chineseCards,
  'zh-tw': traditionalChineseCards,
  ko: koreanCards,
  es: spanishCards,
  'pt-br': portugueseCards,
};

export const localeInfo = {
  ja: { htmlLang: 'ja', hreflang: 'ja', label: '日本語' },
  en: { htmlLang: 'en', hreflang: 'en', label: 'English' },
  'zh-cn': { htmlLang: 'zh-CN', hreflang: 'zh-CN', label: '简体中文' },
  'zh-tw': { htmlLang: 'zh-TW', hreflang: 'zh-TW', label: '繁體中文' },
  ko: { htmlLang: 'ko', hreflang: 'ko', label: '한국어' },
  es: { htmlLang: 'es', hreflang: 'es', label: 'Español' },
  'pt-br': {
    htmlLang: 'pt-BR',
    hreflang: 'pt-BR',
    label: 'Português (Brasil)',
  },
} as const;

export function localizedPath(locale: SiteLocale, path = '') {
  const normalized = path && path !== '/' ? `/${path.replace(/^\//, '')}` : '';
  if (locale === 'ja') return normalized || '/';
  return `/${locale}${normalized}`;
}

export function languageAlternates(path = '') {
  return {
    ja: localizedPath('ja', path),
    en: localizedPath('en', path),
    'zh-CN': localizedPath('zh-cn', path),
    'zh-TW': localizedPath('zh-tw', path),
    ko: localizedPath('ko', path),
    es: localizedPath('es', path),
    'pt-BR': localizedPath('pt-br', path),
    'x-default': localizedPath('en', path),
  };
}

export type HomeCopy = {
  brandSubtitle: string;
  nav: [string, string, string, string, string];
  create: string;
  closeCreate: string;
  dialogTitle: string;
  displayName: string;
  displayNamePlaceholder: string;
  server: string;
  wantArcana: string;
  offerArcana: string;
  noteOptional: string;
  notePlaceholder: string;
  submit: string;
  selectArcana: string;
  selectFrom22: string;
  heroLead: string;
  heroAccent: string;
  heroDescription: string;
  allCards: string;
  allSupported: string;
  yourConditions: string;
  conditionDescription: string;
  collecting: string;
  availableToTrade: string;
  matchPrompt: string;
  matchCandidates: string;
  candidateDescription: string;
  searchPlaceholder: string;
  allServers: string;
  filters: string;
  available: string;
  want: string;
  offer: string;
  copied: string;
  copyUid: string;
  seoTitle: string;
  seoDescription: string;
  seoLink: string;
  flowTitle: string;
  steps: [string, string][];
  safetyTitle: string;
  safetyText: string;
  footerDescription: string;
  footerLinks: [string, string, string, string, string];
  now: string;
  invalid: string;
  toolTitle: string;
  toolDescription: string;
};

const baseHomeCopy = {
  ja: {
    brandSubtitle: '22種カード交換所',
    nav: ['マッチング', '原神アルカナ', '交換ガイド', '22種一覧', '運営情報'],
    create: '募集を作る',
    closeCreate: '募集作成画面を閉じる',
    dialogTitle: '新しい交換募集',
    displayName: '表示名',
    displayNamePlaceholder: 'カード収集家',
    server: 'サーバー',
    wantArcana: '欲しいアルカナ',
    offerArcana: '出せるアルカナ',
    noteOptional: 'メモ（任意）',
    notePlaceholder: 'ログイン可能な時間など',
    submit: 'この内容で募集する',
    selectArcana: 'アルカナを選択',
    selectFrom22: '22種類から選択',
    heroLead: '流れる募集から、',
    heroAccent: '見つかる交換へ。',
    heroDescription:
      '手持ちを登録するだけで、条件の合うコレクターを自動マッチング。',
    allCards: 'コレクションカード',
    allSupported: '全種類対応',
    yourConditions: 'あなたの交換条件',
    conditionDescription:
      '一度設定すれば、募集の新しさに関係なく、条件の合う相手を優先表示します。',
    collecting: '集めているアルカナ',
    availableToTrade: '交換に出せるアルカナ',
    matchPrompt: '両方を選ぶとマッチ候補が表示されます',
    matchCandidates: 'マッチ候補',
    candidateDescription:
      '条件の合うコレクターを探して、ユーザーIDからフレンド申請しましょう。',
    searchPlaceholder: 'アルカナ名・募集主で検索',
    allServers: 'すべて',
    filters: '条件',
    available: '交換可',
    want: '欲しい',
    offer: '出せる',
    copied: 'コピー済み',
    copyUid: 'UIDをコピー',
    seoTitle: '原神のアルカナ交換を初める方へ',
    seoDescription:
      '月諭のアルカナの入手方法、交換相手の探し方、フレンドとマルチプレイで交換する手順を順番に解説しています。',
    seoLink: '原神アルカナ交換ガイドを読む →',
    flowTitle: '交換の流れ',
    steps: [
      ['募集を見つける', '欲しい一枚と、手元の予備が合う募集を探します。'],
      [
        'フレンドになる',
        'UIDをコピーし、対応するサービスのフレンド申請から募集主と繋がります。',
      ],
      [
        'マルチ中に交換',
        '同じ交換ルームに集まり、対応するサービス内の正式機能から交換します。',
      ],
    ],
    safetyTitle: '安心して交換するために',
    safetyText:
      'パスワードや認証コードは絶対に教えず、交換は必ず対応サービス内の正式な機能を利用しましょう。',
    footerDescription:
      '22種類のコレクションカード交換を支援する独立運営のサイトです。',
    footerLinks: [
      '原神アルカナ',
      'ガイド',
      '運営情報',
      'プライバシー',
      '利用規約',
    ],
    now: 'たった今',
    invalid: '募集内容が不正です',
    toolTitle: 'アルカナ交換募集を作成',
    toolDescription:
      'UID、サーバー、欲しいアルカナ、出せるアルカナを指定して募集を作成する。',
  },
  en: {
    brandSubtitle: '22-Card Exchange',
    nav: ['Matching', 'Game Arcana', 'Exchange Guide', 'All 22 Cards', 'About'],
    create: 'Create listing',
    closeCreate: 'Close listing form',
    dialogTitle: 'New exchange listing',
    displayName: 'Display name',
    displayNamePlaceholder: 'Card Collector',
    server: 'Server',
    wantArcana: 'Arcana wanted',
    offerArcana: 'Arcana offered',
    noteOptional: 'Note (optional)',
    notePlaceholder: 'When you are available to play',
    submit: 'Publish this listing',
    selectArcana: 'Select Arcana',
    selectFrom22: 'Choose from 22 cards',
    heroLead: 'Skip the endless feed.',
    heroAccent: 'Find the right exchange.',
    heroDescription:
      'Add the cards you have and need to match with collectors whose exchange terms fit yours.',
    allCards: 'collection cards',
    allSupported: 'all supported',
    yourConditions: 'Your exchange terms',
    conditionDescription:
      'Set them once and compatible collectors appear first, regardless of when they posted.',
    collecting: 'Arcana you need',
    availableToTrade: 'Arcana you can offer',
    matchPrompt: 'Select both lists to see compatible collectors',
    matchCandidates: 'Matching collectors',
    candidateDescription:
      'Find a compatible collector, then use their UID to send a friend request.',
    searchPlaceholder: 'Search by Arcana or collector',
    allServers: 'All',
    filters: 'Filters',
    available: 'Available',
    want: 'Wants',
    offer: 'Offers',
    copied: 'Copied',
    copyUid: 'Copy UID',
    seoTitle: 'New to Arcana exchange in Genshin Impact?',
    seoDescription:
      'Learn where Lunar Arcana cards come from, how to find a compatible collector, and how to complete the exchange with a friend in multiplayer.',
    seoLink: 'Read the Arcana exchange guide →',
    flowTitle: 'How an exchange works',
    steps: [
      [
        'Find a listing',
        'Look for a collector who offers a card you need and needs one you have.',
      ],
      [
        'Become friends',
        'Copy the UID and send the listing owner a friend request in the game.',
      ],
      [
        'Exchange in multiplayer',
        'Meet in the same multiplayer session and use the official in-game exchange feature.',
      ],
    ],
    safetyTitle: 'Exchange safely',
    safetyText:
      'Never share a password or verification code. Complete every exchange only through the official in-game feature.',
    footerDescription:
      'An independently operated matching site for exchanging all 22 collection cards.',
    footerLinks: ['Game Arcana', 'Guide', 'About', 'Privacy', 'Terms'],
    now: 'just now',
    invalid: 'The listing details are invalid.',
    toolTitle: 'Create an Arcana exchange listing',
    toolDescription:
      'Create a listing with a UID, server, wanted Arcana, and offered Arcana.',
  },
  'zh-cn': {
    brandSubtitle: '22种圣牌交换站',
    nav: ['条件匹配', '原神月谕圣牌', '交换指南', '22种圣牌一览', '关于本站'],
    create: '发布交换',
    closeCreate: '关闭交换发布窗口',
    dialogTitle: '发布新的交换需求',
    displayName: '显示名称',
    displayNamePlaceholder: '卡牌收藏家',
    server: '服务器',
    wantArcana: '想要的圣牌',
    offerArcana: '可交换的圣牌',
    noteOptional: '备注（可选）',
    notePlaceholder: '例如可上线时间',
    submit: '发布该交换需求',
    selectArcana: '选择圣牌',
    selectFrom22: '从22种卡牌中选择',
    heroLead: '告别不断下沉的帖子，',
    heroAccent: '找到真正匹配的交换。',
    heroDescription:
      '登记你拥有和需要的卡牌，系统会优先显示交换条件互相匹配的收藏家。',
    allCards: '收藏卡牌',
    allSupported: '全部支持',
    yourConditions: '你的交换条件',
    conditionDescription:
      '设置一次后，系统会优先显示与你条件相符的玩家，不受发布时间影响。',
    collecting: '你需要的圣牌',
    availableToTrade: '你可交换的圣牌',
    matchPrompt: '完成两项选择后即可查看匹配对象',
    matchCandidates: '匹配对象',
    candidateDescription: '找到条件互相符合的玩家，再通过UID发送好友申请。',
    searchPlaceholder: '按圣牌名称或收藏家搜索',
    allServers: '全部',
    filters: '筛选',
    available: '可交换',
    want: '想要',
    offer: '可提供',
    copied: '已复制',
    copyUid: '复制UID',
    seoTitle: '初次了解《原神》月谕圣牌交换？',
    seoDescription:
      '了解月谕圣牌的获取方式、如何找到条件匹配的玩家，以及如何在多人游戏中完成交换。',
    seoLink: '阅读月谕圣牌交换指南 →',
    flowTitle: '交换流程',
    steps: [
      ['查找需求', '找到能提供你所需卡牌、同时需要你所拥有卡牌的玩家。'],
      ['添加好友', '复制UID，并在游戏中向发布者发送好友申请。'],
      ['多人游戏中交换', '在同一多人游戏中会合，使用游戏内的正式交换功能。'],
    ],
    safetyTitle: '安全交换',
    safetyText: '切勿透露密码或验证码。请始终使用游戏内的正式功能完成交换。',
    footerDescription: '独立运营的22种收藏卡牌交换匹配网站。',
    footerLinks: ['原神月谕圣牌', '指南', '关于本站', '隐私', '使用条款'],
    now: '刚刚',
    invalid: '交换信息无效。',
    toolTitle: '创建月谕圣牌交换需求',
    toolDescription: '使用UID、服务器、想要和可提供的圣牌创建交换需求。',
  },
} satisfies Record<'ja' | 'en' | 'zh-cn', HomeCopy>;

export const homeCopy: Record<SiteLocale, HomeCopy> = {
  ...baseHomeCopy,
  'zh-tw': {
    ...baseHomeCopy['zh-cn'],
    brandSubtitle: '22種聖牌交換站',
    nav: ['條件配對', '原神月諭聖牌', '交換指南', '22種聖牌一覽', '關於本站'],
    heroLead: '告別不斷下沉的貼文，',
    heroAccent: '找到真正符合的交換。',
    heroDescription:
      '登記持有與缺少的聖牌，自動找到同一伺服器且互相符合條件的玩家。',
    yourConditions: '你的交換條件',
    collecting: '你缺少的聖牌',
    availableToTrade: '可交換的重複聖牌',
    footerDescription: '協助完成22種月諭聖牌收藏的獨立交換配對工具。',
  },
  ko: {
    ...baseHomeCopy.en,
    brandSubtitle: '22종 카드 교환',
    nav: [
      '자동 매칭',
      '원신 아르카나',
      '교환 가이드',
      '22종 목록',
      '운영 정보',
    ],
    heroLead: '게시글을 찾지 말고,',
    heroAccent: '맞는 교환을 바로 찾으세요.',
    heroDescription:
      '22종 보유 수량을 등록하면 같은 서버에서 서로 필요한 카드가 맞는 플레이어를 자동으로 찾습니다.',
    yourConditions: '내 교환 조건',
    collecting: '없는 카드',
    availableToTrade: '교환 가능한 중복 카드',
    footerDescription:
      '22종 카드 컬렉션 완성을 돕는 독립 교환 매칭 도구입니다.',
  },
  es: {
    ...baseHomeCopy.en,
    brandSubtitle: 'Intercambio de 22 cartas',
    nav: [
      'Matching',
      'Arcanos Lunares',
      'Guía',
      'Las 22 cartas',
      'Información',
    ],
    heroLead: 'Deja atrás el tablón.',
    heroAccent: 'Encuentra el intercambio correcto.',
    heroDescription:
      'Registra tus 22 cartas y encuentra automáticamente jugadores compatibles en el mismo servidor.',
    yourConditions: 'Tus condiciones',
    collecting: 'Cartas que te faltan',
    availableToTrade: 'Duplicados disponibles',
    footerDescription:
      'Herramienta independiente para completar la colección de 22 Arcanos Lunares.',
  },
  'pt-br': {
    ...baseHomeCopy.en,
    brandSubtitle: 'Troca de 22 cartas',
    nav: [
      'Combinações',
      'Arcanos Lunares',
      'Guia',
      'As 22 cartas',
      'Informações',
    ],
    heroLead: 'Esqueça o mural.',
    heroAccent: 'Encontre a troca certa.',
    heroDescription:
      'Cadastre suas 22 cartas e encontre automaticamente jogadores compatíveis no mesmo servidor.',
    yourConditions: 'Suas condições',
    collecting: 'Cartas que faltam',
    availableToTrade: 'Repetidas disponíveis',
    footerDescription:
      'Ferramenta independente para completar a coleção de 22 Arcanos Lunares.',
  },
};

export const localeShortLabel: Record<SiteLocale, string> = {
  ja: 'JA',
  en: 'EN',
  'zh-cn': '简',
  'zh-tw': '繁',
  ko: 'KO',
  es: 'ES',
  'pt-br': 'PT',
};

export const languageLinks = siteLocales.map((locale) => ({
  locale,
  label: localeInfo[locale].label,
}));
