import type { Metadata } from 'next';
import {
  languageAlternates,
  localizedPath,
  type SiteLocale,
} from '@/lib/site-i18n';
import type { ServerRegion } from '@/lib/server-region';

export const seoTopicSlugs = [
  'how-to-trade',
  'how-to-get',
  'complete',
  'cant-trade',
  'find-trade',
] as const;
export const serverPageSlugs = [
  'america',
  'europe',
  'asia',
  'tw-hk-mo',
] as const;
export type SeoTopic = (typeof seoTopicSlugs)[number];
export type ServerPageSlug = (typeof serverPageSlugs)[number];
export const serverSlugToRegion: Record<ServerPageSlug, ServerRegion> = {
  america: 'america',
  europe: 'europe',
  asia: 'asia',
  'tw-hk-mo': 'tw_hk_mo',
};
export const isSeoTopic = (value: string): value is SeoTopic =>
  (seoTopicSlugs as readonly string[]).includes(value);
export const isServerPageSlug = (value: string): value is ServerPageSlug =>
  (serverPageSlugs as readonly string[]).includes(value);

type Topic = {
  title: string;
  description: string;
  lead: string;
  sections: Array<{ heading: string; body: string }>;
  cta: string;
};
type Copy = {
  overview: Topic;
  topics: Record<SeoTopic, Topic>;
  clusterTitle: string;
  allCards: string;
  serverTitle: string;
  activePlayers: string;
  perfectMatches: string;
  mostWanted: string;
  mostOffered: string;
  noData: string;
  serverCta: string;
  serverNotes: Record<ServerPageSlug, string>;
};

const englishTopics: Record<SeoTopic, Topic> = {
  'how-to-trade': {
    title: 'How to Trade Lunar Arcana in Genshin Impact',
    description: 'A step-by-step Lunar Arcana trading guide.',
    lead: 'Match missing cards with another player’s duplicates, then exchange safely in multiplayer.',
    sections: [
      {
        heading: 'Register all 22 cards',
        body: 'Mark missing cards as zero and duplicates as two or more. Your trade terms are calculated automatically.',
      },
      {
        heading: 'Match on the same server',
        body: 'America, Europe, Asia, and TW/HK/MO are separate. Only players on your selected server appear.',
      },
      {
        heading: 'Complete the trade in-game',
        body: 'Copy the UID, become friends, confirm both cards, and use the official multiplayer exchange feature.',
      },
    ],
    cta: 'Find a Lunar Arcana trade',
  },
  'how-to-get': {
    title: 'How to Get Lunar Arcana Cards',
    description: 'Where Lunar Arcana cards come from and how duplicates help.',
    lead: 'Lunar Arcana are earned through Imaginarium Theater Lunar Mode and kept in the Lunar Arcana Case.',
    sections: [
      {
        heading: 'Earn an Arcanum',
        body: 'Complete the required Lunar Mode performance and Arcana challenges, then choose an available reward.',
      },
      {
        heading: 'Use the Arcana Case',
        body: 'The case stores your collection and provides the exchange flow used with friends in multiplayer.',
      },
      {
        heading: 'Trade duplicates',
        body: 'Register repeated cards as offers and match with someone who has one of your missing cards.',
      },
    ],
    cta: 'Register your collection',
  },
  complete: {
    title: 'Complete All 22 Lunar Arcana Cards',
    description: 'Track missing cards, duplicates, and compatible trades.',
    lead: 'A collection tracker and reciprocal matcher makes the final missing cards easier to organize.',
    sections: [
      {
        heading: 'Track every count',
        body: 'Record zero, one, two, or three-plus copies for each card.',
      },
      {
        heading: 'Prioritize exact matches',
        body: 'An exact match means both players can give the other a missing card.',
      },
      {
        heading: 'Keep availability current',
        body: 'Use open, negotiating, or closed status so listings stay reliable.',
      },
    ],
    cta: 'Start the 22-card tracker',
  },
  'cant-trade': {
    title: "Can't Trade Lunar Arcana? Check These Steps",
    description:
      'Troubleshoot server, friendship, multiplayer, and listing status.',
    lead: 'Most failed exchanges come from server mismatch, incomplete friendship, or outdated trade details.',
    sections: [
      {
        heading: 'Confirm the server',
        body: 'Players on different servers cannot exchange. Language and location do not determine your server.',
      },
      {
        heading: 'Check in-game steps',
        body: 'Verify the UID, become friends, join the same multiplayer session, and reopen the exchange flow.',
      },
      {
        heading: 'Refresh the collection',
        body: 'After a trade, update both inventories and recalculate matches.',
      },
    ],
    cta: 'Review same-server matches',
  },
  'find-trade': {
    title: 'Find a Lunar Arcana Trading Partner',
    description:
      'Find reciprocal trades without searching chronological posts.',
    lead: 'ARCANA LINK compares missing cards and duplicates in both directions and puts exact matches first.',
    sections: [
      {
        heading: 'Choose your server',
        body: 'Select America, Europe, Asia, or TW/HK/MO.',
      },
      {
        heading: 'Enter the collection once',
        body: 'Missing and duplicate cards automatically become matching criteria.',
      },
      {
        heading: 'Contact a compatible player',
        body: 'Review the trade, copy the UID, and arrange the in-game exchange.',
      },
    ],
    cta: 'Find your perfect trade',
  },
};

const localeText = {
  ja: [
    '原神 月諭アルカナ交換・自動マッチング',
    '同じサーバーで交換条件が合う相手を自動で探します。',
    '交換ガイド',
    '22種類の一覧',
    'サーバー別交換',
    '交換受付中',
    '完全マッチ候補',
    '探されているカード',
    '交換に出ているカード',
    '現在の公開募集はありません。',
    'このサーバーで探す',
  ],
  en: [
    'Genshin Impact Lunar Arcana Trading & Player Matching',
    'Select your server and enter your 22 Lunar Arcana cards. ARCANA LINK automatically finds compatible players on the same server.',
    'Lunar Arcana guides',
    'All 22 Lunar Arcana cards',
    'Trade by server',
    'Players looking for trades',
    'Perfect matches available',
    'Most wanted cards',
    'Most offered cards',
    'No active public listings yet.',
    'Find trades on this server',
  ],
  'zh-cn': [
    '原神月谕圣牌交换与自动匹配',
    '登记22种圣牌，在同一服务器寻找双方条件一致的玩家。',
    '交换指南',
    '22种圣牌一览',
    '按服务器交换',
    '正在交换的玩家',
    '完全匹配候选',
    '最需要的圣牌',
    '提供最多的圣牌',
    '目前没有公开交换信息。',
    '在此服务器查找',
  ],
  'zh-tw': [
    '原神月諭聖牌交換與自動配對',
    '登記22種聖牌，在同一伺服器尋找互相符合條件的玩家。',
    '交換指南',
    '22種聖牌一覽',
    '依伺服器交換',
    '正在交換的玩家',
    '完全配對候選',
    '最多人尋找的聖牌',
    '最多人提供的聖牌',
    '目前沒有公開交換資訊。',
    '在此伺服器尋找',
  ],
  ko: [
    '원신 월의 아르카나 교환 및 자동 매칭',
    '22종을 등록하고 같은 서버에서 서로 조건이 맞는 플레이어를 찾으세요.',
    '교환 가이드',
    '22종 카드 목록',
    '서버별 교환',
    '교환 중인 플레이어',
    '완전 매칭 후보',
    '가장 많이 찾는 카드',
    '가장 많이 제공되는 카드',
    '현재 공개 교환이 없습니다.',
    '이 서버에서 찾기',
  ],
  es: [
    'Intercambio y matching de Arcanos Lunares de Genshin Impact',
    'Registra las 22 cartas y encuentra intercambios compatibles en tu servidor.',
    'Guías de intercambio',
    'Los 22 Arcanos Lunares',
    'Intercambio por servidor',
    'Jugadores buscando intercambio',
    'Coincidencias exactas',
    'Cartas más buscadas',
    'Cartas más ofrecidas',
    'Todavía no hay publicaciones activas.',
    'Buscar en este servidor',
  ],
  'pt-br': [
    'Troca e combinação de Arcanos Lunares de Genshin Impact',
    'Cadastre as 22 cartas e encontre trocas compatíveis no seu servidor.',
    'Guias de troca',
    'Os 22 Arcanos Lunares',
    'Troca por servidor',
    'Jogadores buscando troca',
    'Combinações exatas',
    'Cartas mais procuradas',
    'Cartas mais oferecidas',
    'Ainda não há publicações ativas.',
    'Buscar neste servidor',
  ],
} satisfies Record<SiteLocale, string[]>;

function localizedTopics(
  locale: Exclude<SiteLocale, 'en'>,
): Record<SeoTopic, Topic> {
  const titles: Record<Exclude<SiteLocale, 'en'>, string[]> = {
    ja: [
      '月諭アルカナを交換する方法',
      '月諭アルカナの入手方法',
      '全22種をコンプリートする方法',
      '交換できないときの確認事項',
      '交換相手を探す方法',
    ],
    'zh-cn': [
      '月谕圣牌怎么交换',
      '月谕圣牌怎么获得',
      '集齐全部22种月谕圣牌',
      '月谕圣牌无法交换怎么办',
      '寻找月谕圣牌交换伙伴',
    ],
    'zh-tw': [
      '月諭聖牌怎麼交換',
      '月諭聖牌怎麼取得',
      '集齊全部22種月諭聖牌',
      '月諭聖牌無法交換時',
      '尋找月諭聖牌交換玩家',
    ],
    ko: [
      '월의 아르카나 교환 방법',
      '월의 아르카나 획득 방법',
      '월의 아르카나 22종 완성',
      '교환할 수 없을 때',
      '교환 상대 찾기',
    ],
    es: [
      'Cómo intercambiar Arcanos Lunares',
      'Cómo conseguir Arcanos Lunares',
      'Completa los 22 Arcanos Lunares',
      '¿No puedes intercambiar?',
      'Encuentra un intercambio',
    ],
    'pt-br': [
      'Como trocar Arcanos Lunares',
      'Como obter Arcanos Lunares',
      'Complete os 22 Arcanos Lunares',
      'Não consegue trocar?',
      'Encontre uma troca',
    ],
  };
  return Object.fromEntries(
    seoTopicSlugs.map((slug, index) => [
      slug,
      {
        title: titles[locale][index],
        description: localeText[locale][1],
        lead: localeText[locale][1],
        sections: [
          { heading: titles[locale][index], body: localeText[locale][1] },
          {
            heading: localeText[locale][4],
            body: 'America · Europe · Asia · TW/HK/MO',
          },
          {
            heading: 'ARCANA LINK',
            body:
              locale === 'ja'
                ? 'UIDでフレンド申請し、正式なゲーム内機能で交換します。パスワードは不要です。'
                : localeText[locale][1],
          },
        ],
        cta: localeText[locale][10],
      },
    ]),
  ) as Record<SeoTopic, Topic>;
}

export const internationalSeoCopy = Object.fromEntries(
  (Object.keys(localeText) as SiteLocale[]).map((locale) => {
    const t = localeText[locale];
    const overview: Topic = {
      title: t[0],
      description: t[1],
      lead: t[1],
      sections: [
        { heading: t[2], body: t[1] },
        { heading: t[4], body: 'America · Europe · Asia · TW/HK/MO' },
        {
          heading: locale === 'en' ? 'No password required' : 'ARCANA LINK',
          body: t[1],
        },
      ],
      cta: t[10],
    };
    const note = (server: string) => `${server}: ${t[1]}`;
    return [
      locale,
      {
        overview,
        topics: locale === 'en' ? englishTopics : localizedTopics(locale),
        clusterTitle: t[2],
        allCards: t[3],
        serverTitle: t[4],
        activePlayers: t[5],
        perfectMatches: t[6],
        mostWanted: t[7],
        mostOffered: t[8],
        noData: t[9],
        serverCta: t[10],
        serverNotes: {
          america: note('America / NA'),
          europe: note('Europe / EU'),
          asia: note('Asia'),
          'tw-hk-mo': note('TW / HK / MO'),
        },
      },
    ];
  }),
) as Record<SiteLocale, Copy>;

const og: Record<SiteLocale, string> = {
  ja: 'ja_JP',
  en: 'en_US',
  'zh-cn': 'zh_CN',
  'zh-tw': 'zh_TW',
  ko: 'ko_KR',
  es: 'es_ES',
  'pt-br': 'pt_BR',
};
export function buildSeoPageMetadata(
  locale: SiteLocale,
  slug?: string,
): Metadata {
  const copy = internationalSeoCopy[locale];
  const server = slug && isServerPageSlug(slug) ? slug : null;
  const topic = slug && isSeoTopic(slug) ? copy.topics[slug] : copy.overview;
  const title = server
    ? locale === 'en'
      ? `Genshin Lunar Arcana Trade – ${server === 'america' ? 'America / NA' : server === 'tw-hk-mo' ? 'TW / HK / MO' : server[0].toUpperCase() + server.slice(1)} Server`
      : `${copy.serverTitle} – ${server}`
    : topic.title;
  const description = server ? copy.serverNotes[server] : topic.description;
  const path = slug ? `genshin-arcana/${slug}` : 'genshin-arcana';
  const canonical = localizedPath(locale, path);
  return {
    title: `${title} | ARCANA LINK`,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      locale: og[locale],
    },
    twitter: { card: 'summary', title, description },
  };
}
