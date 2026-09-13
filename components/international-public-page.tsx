/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import { ArticleShell } from '@/components/public-shell';
import { cardSlugById } from '@/lib/arcana-cards';
import {
  arcanaIds,
  cardNames,
  localizedPath,
  romans,
  type SiteLocale,
} from '@/lib/site-i18n';
export type IntlPublicPage = 'guide' | 'arcana' | 'about' | 'privacy' | 'terms';
type PageCopy = {
  kicker: string;
  title: string;
  lead: string;
  sections: Array<{ heading: string; body: string }>;
};
const localeData = {
  'zh-tw': {
    titles: [
      '月諭聖牌交換指南',
      '月諭聖牌一覽',
      '關於 ARCANA LINK',
      '隱私權政策',
      '使用條款',
    ],
    leads: [
      '從登記22種聖牌到遊戲內交換的完整流程。',
      '查看全部22種聖牌並前往個別交換頁面。',
      '協助玩家管理收藏並尋找互相符合條件的非官方工具。',
      '說明公開資料、本機儲存、Cookie與廣告。',
      '使用交換配對功能前請閱讀安全規範。',
    ],
  },
  ko: {
    titles: [
      '월의 아르카나 교환 가이드',
      '월의 아르카나 카드 목록',
      'ARCANA LINK 소개',
      '개인정보 처리방침',
      '이용약관',
    ],
    leads: [
      '22종 등록부터 게임 내 교환까지 안내합니다.',
      '22종 카드와 각 교환 페이지를 확인하세요.',
      '컬렉션과 상호 교환을 돕는 비공식 도구입니다.',
      '공개 정보와 로컬 저장소 처리 방식을 안내합니다.',
      '교환 매칭 사용 전 안전 기준을 확인하세요.',
    ],
  },
  es: {
    titles: [
      'Guía de intercambio de Arcanos Lunares',
      'Lista de Arcanos Lunares',
      'Acerca de ARCANA LINK',
      'Política de privacidad',
      'Condiciones de uso',
    ],
    leads: [
      'Desde registrar las 22 cartas hasta el intercambio dentro del juego.',
      'Consulta las 22 cartas y su página de intercambio.',
      'Herramienta no oficial para organizar colecciones e intercambios.',
      'Cómo tratamos datos públicos, almacenamiento local, cookies y anuncios.',
      'Normas de seguridad y responsabilidad del matching.',
    ],
  },
  'pt-br': {
    titles: [
      'Guia de troca de Arcanos Lunares',
      'Lista de Arcanos Lunares',
      'Sobre o ARCANA LINK',
      'Política de privacidade',
      'Termos de uso',
    ],
    leads: [
      'Do cadastro das 22 cartas até a troca dentro do jogo.',
      'Confira as 22 cartas e a página de troca de cada uma.',
      'Ferramenta não oficial para organizar coleções e trocas.',
      'Como tratamos dados públicos, armazenamento local, cookies e anúncios.',
      'Regras de segurança e responsabilidade da combinação de trocas.',
    ],
  },
} as const;
const pages: IntlPublicPage[] = [
  'guide',
  'arcana',
  'about',
  'privacy',
  'terms',
];
export const internationalPublicCopy = Object.fromEntries(
  Object.entries(localeData).map(([locale, data]) => [
    locale,
    Object.fromEntries(
      pages.map((page, index) => [
        page,
        {
          kicker: 'ARCANA LINK',
          title: data.titles[index],
          lead: data.leads[index],
          sections: [
            { heading: data.titles[index], body: data.leads[index] },
            { heading: 'Safety', body: data.leads[index] },
          ] satisfies PageCopy['sections'],
        } satisfies PageCopy,
      ]),
    ),
  ]),
) as Record<
  Extract<SiteLocale, 'zh-tw' | 'ko' | 'es' | 'pt-br'>,
  Record<IntlPublicPage, PageCopy>
>;
export function InternationalPublicPage({
  locale,
  page,
}: {
  locale: keyof typeof internationalPublicCopy;
  page: IntlPublicPage;
}) {
  const copy = internationalPublicCopy[locale][page];
  return (
    <ArticleShell
      kicker={copy.kicker}
      title={copy.title}
      lead={copy.lead}
      locale={locale}
      path={page}
    >
      {copy.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}
      {page === 'arcana' && (
        <div className="arcana-catalog">
          {arcanaIds.map((card, index) => (
            <a
              href={localizedPath(
                locale,
                `genshin-arcana/${cardSlugById[card]}`,
              )}
              key={card}
            >
              <span>{romans[index]}</span>
              <strong>{cardNames[locale][card]}</strong>
            </a>
          ))}
        </div>
      )}
    </ArticleShell>
  );
}
