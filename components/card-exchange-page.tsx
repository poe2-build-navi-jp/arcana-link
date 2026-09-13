/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import { ArticleShell } from '@/components/public-shell';
import { cardBySlug, englishCardSlugById } from '@/lib/arcana-cards';
import { readProfiles } from '@/lib/arcana-db';
import { cardStructuredData } from '@/lib/card-seo';
import {
  cardNames,
  localizedPath,
  romans,
  type SiteLocale,
} from '@/lib/site-i18n';
import { serverLabels, serverRegions } from '@/lib/server-region';

export async function CardExchangePage({
  locale,
  slug,
  path,
}: {
  locale: SiteLocale;
  slug: string;
  path?: string;
}) {
  const card = cardBySlug[slug];
  if (!card) return null;
  const index = Object.values(cardBySlug).findIndex(
    (item) => item.slug === slug,
  );
  const name = cardNames[locale][card.id];
  const profiles = await readProfiles();
  const wanting =
    profiles?.filter((profile) => profile.inventory[card.id] === 0).length ?? 0;
  const offering =
    profiles?.filter((profile) => profile.inventory[card.id] >= 2).length ?? 0;
  const baseCopy = {
    ja: {
      kicker: '原神 月諭アルカナ交換',
      title: `「${name}」のアルカナ交換募集`,
      lead: `「${name}」を探している人と、交換に出せる人を相互条件で見つけるための専用ページです。`,
      want: `${name}を探している人`,
      offer: `${name}を出せる人`,
      heading: `${name}を交換で入手するには`,
      intro: `自分の22枚の所持数を登録すると、「${name}」が未所持なら欲しいカードとして自動判定されます。2枚以上持っているカードは交換候補となり、相手の不足カードと一致した完全マッチが優先表示されます。`,
      examples: '現在の交換条件例',
      points: [
        `${name}を出せる → あなたの重複カードが欲しい`,
        `あなたが${name}を受け取る → 相手の不足カードを渡す`,
        '同じサーバーで、交換受付中の相手だけを確認する',
      ],
      action: '22枚を登録して交換相手を探す →',
      faq: `${name}が出ないときは`,
      faqText:
        '収集状況には偏りが生じることがあります。同じカードを繰り返し狙うより、手元の重複カードを登録して相互交換できる相手を待つ方が効率的です。',
      safety: '交換前に確認すること',
      safetyText:
        '原神でUID検索を行い、フレンド申請後に交換内容を再確認してください。パスワード、認証コード、金銭は交換に必要ありません。',
    },
    en: {
      kicker: 'LUNAR ARCANA EXCHANGE',
      title: `${name} Lunar Arcana Trade Listings`,
      lead: `A dedicated page for finding collectors who need or can offer ${name}.`,
      want: `Players looking for ${name}`,
      offer: `Players offering ${name}`,
      heading: `How to trade for ${name}`,
      intro: `Register the count of all 22 cards. If ${name} is missing, it becomes a wanted card automatically. Cards with two or more copies become offers, and exact two-way matches appear first.`,
      examples: 'Current exchange examples',
      points: [
        `They offer ${name} and need one of your duplicates`,
        `You receive ${name} and give a card they are missing`,
        'Review only active collectors on the same server',
      ],
      action: 'Register all 22 cards and find a match →',
      faq: `What if ${name} does not drop?`,
      faqText:
        'Collection results can be uneven. Instead of repeatedly targeting one card, register your duplicates and wait for a two-way match.',
      safety: 'Check before exchanging',
      safetyText:
        'Search the UID in the game, send a friend request, and confirm both cards again. A password, verification code, or payment is never required.',
    },
    'zh-cn': {
      kicker: '原神月谕圣牌交换',
      title: `“${name}”月谕圣牌交换招募`,
      lead: `用于查找需要“${name}”或可提供该圣牌玩家的专属页面。`,
      want: `正在寻找“${name}”的玩家`,
      offer: `可提供“${name}”的玩家`,
      heading: `如何交换获得“${name}”`,
      intro: `登记22种圣牌的持有数量后，如果缺少“${name}”，系统会自动将其设为想要的圣牌。持有2张以上的圣牌会成为可交换项，并优先显示双方条件一致的完全匹配。`,
      examples: '当前交换条件示例',
      points: [
        `对方可提供“${name}”，并需要你的重复圣牌`,
        `你获得“${name}”，向对方提供其缺少的圣牌`,
        '仅查看同一服务器且处于可交换状态的玩家',
      ],
      action: '登记22种圣牌并查找匹配 →',
      faq: `一直无法获得“${name}”怎么办？`,
      faqText:
        '收集结果可能会有偏差。与其反复获取同一种圣牌，不如登记重复圣牌并等待双方条件一致的交换。',
      safety: '交换前请确认',
      safetyText:
        '在游戏中搜索UID、发送好友申请，并再次确认双方圣牌。交换不需要密码、验证码或付款。',
    },
  };
  const internationalCopy = {
    'zh-tw': {
      kicker: '月諭聖牌交換',
      title: `「${name}」月諭聖牌交換`,
      lead: `尋找需要或可提供「${name}」的同伺服器玩家。`,
      want: `正在尋找「${name}」`,
      offer: `可提供「${name}」`,
      heading: `如何交換取得「${name}」`,
      intro: '登記22種聖牌的持有數量，系統會自動判定缺少與可交換的重複聖牌。',
      examples: '交換條件',
      points: ['確認同一伺服器', '確認雙方要交換的聖牌', '在遊戲內完成交換'],
      action: '登記22種並尋找配對 →',
      faq: `一直拿不到「${name}」怎麼辦？`,
      faqText: '登記重複聖牌並等待互相符合條件的玩家。',
      safety: '交換前確認',
      safetyText: '不要提供密碼、驗證碼或金錢。',
    },
    ko: {
      kicker: '월의 아르카나 교환',
      title: `${name} 월의 아르카나 교환`,
      lead: `${name} 카드를 필요로 하거나 제공하는 같은 서버 플레이어를 찾습니다.`,
      want: `${name} 필요`,
      offer: `${name} 제공`,
      heading: `${name} 교환 방법`,
      intro:
        '22종 수량을 등록하면 없는 카드와 교환 가능한 중복 카드가 자동으로 계산됩니다.',
      examples: '교환 조건',
      points: ['같은 서버 확인', '두 카드 확인', '게임 안에서 교환 완료'],
      action: '22종 등록하고 찾기 →',
      faq: `${name} 카드가 나오지 않을 때`,
      faqText: '중복 카드를 등록하고 상호 조건이 맞는 상대를 기다리세요.',
      safety: '교환 전 확인',
      safetyText: '비밀번호, 인증 코드, 결제는 필요하지 않습니다.',
    },
    es: {
      kicker: 'INTERCAMBIO DE ARCANO LUNAR',
      title: `Intercambio de ${name}`,
      lead: `Encuentra jugadores de tu servidor que buscan u ofrecen ${name}.`,
      want: `Buscan ${name}`,
      offer: `Ofrecen ${name}`,
      heading: `Cómo intercambiar ${name}`,
      intro:
        'Registra las 22 cartas para calcular automáticamente faltantes y duplicados disponibles.',
      examples: 'Condiciones',
      points: [
        'Comprueba el servidor',
        'Confirma ambas cartas',
        'Completa el intercambio dentro del juego',
      ],
      action: 'Registrar las 22 cartas →',
      faq: `¿No consigues ${name}?`,
      faqText: 'Registra tus duplicados y espera una coincidencia recíproca.',
      safety: 'Antes del intercambio',
      safetyText: 'No compartas contraseñas, códigos ni dinero.',
    },
    'pt-br': {
      kicker: 'TROCA DE ARCANO LUNAR',
      title: `Troca de ${name}`,
      lead: `Encontre jogadores do seu servidor que procuram ou oferecem ${name}.`,
      want: `Procuram ${name}`,
      offer: `Oferecem ${name}`,
      heading: `Como trocar ${name}`,
      intro:
        'Cadastre as 22 cartas para calcular automaticamente as faltantes e repetidas disponíveis.',
      examples: 'Condições',
      points: [
        'Confira o servidor',
        'Confirme as duas cartas',
        'Conclua a troca dentro do jogo',
      ],
      action: 'Cadastrar as 22 cartas →',
      faq: `${name} não aparece?`,
      faqText: 'Cadastre as repetidas e aguarde uma combinação recíproca.',
      safety: 'Antes da troca',
      safetyText: 'Não compartilhe senha, código ou dinheiro.',
    },
  } as const;
  const copy =
    locale === 'ja' || locale === 'en' || locale === 'zh-cn'
      ? baseCopy[locale]
      : internationalCopy[locale];
  const pagePath = path ?? `genshin-arcana/${slug}`;
  const distribution = {
    ja: 'サーバー別の公開状況',
    en: 'Live availability by server',
    'zh-cn': '各服务器公开情况',
    'zh-tw': '各伺服器公開狀況',
    ko: '서버별 공개 현황',
    es: 'Disponibilidad por servidor',
    'pt-br': 'Disponibilidade por servidor',
  }[locale];
  const structuredData = cardStructuredData(locale, slug, pagePath);
  const languagePaths = {
    ja: `genshin-arcana/${slug}`,
    en: path?.startsWith('lunar-arcana/')
      ? path
      : `lunar-arcana/${englishCardSlugById[card.id]}`,
    'zh-cn': `genshin-arcana/${slug}`,
    'zh-tw': `genshin-arcana/${slug}`,
    ko: `genshin-arcana/${slug}`,
    es: `genshin-arcana/${slug}`,
    'pt-br': `genshin-arcana/${slug}`,
  } as const;
  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ArticleShell
        kicker={copy.kicker}
        title={copy.title}
        lead={copy.lead}
        locale={locale}
        path={pagePath}
        languagePaths={languagePaths}
      >
        <section className="card-seo-summary">
          <div className="card-seo-symbol">
            <span>{romans[index]}</span>
            <strong>{card.symbol}</strong>
            <b>{name}</b>
          </div>
          <div>
            <small>{copy.want}</small>
            <strong>{wanting}</strong>
          </div>
          <div>
            <small>{copy.offer}</small>
            <strong>{offering}</strong>
          </div>
        </section>
        <section>
          <h2>{distribution}</h2>
          <div className="card-server-distribution">
            {serverRegions.map((region) => {
              const sameServer =
                profiles?.filter((profile) => profile.server === region) ?? [];
              const regionWanting = sameServer.filter(
                (profile) => profile.inventory[card.id] === 0,
              ).length;
              const regionOffering = sameServer.filter(
                (profile) => profile.inventory[card.id] >= 2,
              ).length;
              return (
                <a
                  href={localizedPath(
                    locale,
                    `genshin-arcana/${region === 'tw_hk_mo' ? 'tw-hk-mo' : region}`,
                  )}
                  key={region}
                >
                  <strong>{serverLabels[locale][region]}</strong>
                  <span>
                    {regionWanting} / {regionOffering}
                  </span>
                </a>
              );
            })}
          </div>
        </section>
        <section>
          <h2>{copy.heading}</h2>
          <p>{copy.intro}</p>
          <h3>{copy.examples}</h3>
          <ul>
            {copy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p>
            <a
              className="card-seo-action"
              href={`${localizedPath(locale)}?card=${slug}`}
            >
              {copy.action}
            </a>
          </p>
        </section>
        <section>
          <h2>{copy.faq}</h2>
          <p>{copy.faqText}</p>
        </section>
        <section>
          <h2>{copy.safety}</h2>
          <p>{copy.safetyText}</p>
        </section>
      </ArticleShell>
    </>
  );
}
