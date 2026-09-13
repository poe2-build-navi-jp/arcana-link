import type { SiteLocale } from '@/lib/site-i18n';

export type TranslatedLocale = Extract<SiteLocale, 'en' | 'zh-cn'>;
export type PublicPageKey =
  | 'genshin-arcana'
  | 'guide'
  | 'arcana'
  | 'about'
  | 'privacy'
  | 'terms';

export type PageSection = {
  id?: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  subheadings?: { heading: string; paragraph: string }[];
  details?: [string, string][];
};

export type LocalizedPage = {
  kicker: string;
  title: string;
  description: string;
  lead: string;
  tocLabel?: string;
  sections: PageSection[];
  related?: { title: string; label: string; href: string };
  updated: string;
};

const english: Record<PublicPageKey, LocalizedPage> = {
  'genshin-arcana': {
    kicker: 'GENSHIN IMPACT LUNAR ARCANA GUIDE',
    title: 'Genshin Impact Lunar Arcana Trading & Listings Guide',
    description:
      'Find Genshin Impact Lunar Arcana trading partners by matching the cards you want, the cards you can offer, your server, and UID.',
    lead: 'A practical guide to preparing your collection, finding a compatible player, and completing a Lunar Arcana exchange with a friend in multiplayer.',
    tocLabel: 'On this page',
    sections: [
      {
        id: 'what',
        heading: 'What Is Lunar Arcana in Genshin Impact?',
        paragraphs: [
          'Lunar Arcana is a 22-card collection feature. As your collection grows, you may receive duplicates while still missing other cards. Compatible friends can exchange spare cards to help each other complete the set.',
          'ARCANA LINK does not transfer cards. It helps players compare what they need and what they can offer before meeting in the game. The exchange itself takes place with the official in-game feature during multiplayer.',
        ],
      },
      {
        id: 'before',
        heading: 'Before You Look for a Trading Partner',
        paragraphs: [
          'Check your collection in the game and separate missing cards from duplicates you are genuinely ready to trade. Confirm quantities so the same spare card is not promised to more than one person.',
        ],
        bullets: [
          'The number and name of every card you need',
          'The cards and quantities you can offer',
          'Your Asia, America, Europe, or TW/HK/MO server',
          'The UID used for friend requests',
          'Times when you can join multiplayer',
        ],
      },
      {
        id: 'find',
        heading: 'How to Find Genshin Impact Lunar Arcana Trade Listings',
        paragraphs: [
          'A chronological board can bury older posts. ARCANA LINK ranks candidates by mutual fit: the other player offers a card you need, and you offer a card they need.',
        ],
        bullets: [
          'Select every Lunar Arcana card you still need.',
          'Select only duplicates you can currently offer.',
          'Filter to the same server so both players can meet.',
          'Review both sides of the exchange before copying a UID.',
        ],
      },
      {
        id: 'steps',
        heading: 'How to Trade Lunar Arcana with a Friend',
        paragraphs: [
          'After finding a match, send a friend request by UID and agree on the cards and meeting time. Join the same multiplayer session, choose the cards in the official exchange screen, and verify the name and quantity before confirming.',
          'A password or verification code is never required for a card exchange. Stop immediately if anyone asks for login credentials, money, or access to another account.',
        ],
      },
      {
        id: 'faq',
        heading: 'Genshin Impact Lunar Arcana Trading FAQ',
        subheadings: [
          {
            heading: 'Can cards be exchanged on this website?',
            paragraph:
              'No. ARCANA LINK only helps you find compatible players. Complete the exchange through the official in-game feature.',
          },
          {
            heading: 'Can players on different servers trade?',
            paragraph:
              'Choose a player on the same server. Players on different servers generally cannot join the same multiplayer world.',
          },
          {
            heading: 'What information is safe to share?',
            paragraph:
              'Share only the UID and exchange terms needed to coordinate. Never share a password, email or SMS verification code, real name, address, or payment information.',
          },
        ],
      },
      {
        id: 'editorial',
        heading: 'Editorial Policy',
        paragraphs: [
          'This independently written page summarizes the steps and safety information players need for an exchange. ARCANA LINK is unofficial and is not affiliated with the game’s developer or publisher. It does not use third-party logos, artwork, music, story text, or character assets.',
        ],
      },
    ],
    related: {
      title: 'Find a match',
      label: 'Open the Arcana trade matcher →',
      href: '',
    },
    updated: 'Published September 5, 2026 · Updated September 6, 2026',
  },
  guide: {
    kicker: 'TRADING GUIDE',
    title: 'Collection Card Trading Guide',
    description:
      'Learn how to prepare, find a compatible player, and safely complete a 22-card collection exchange.',
    lead: 'Follow these steps from checking your duplicates to completing the exchange through the official in-game feature.',
    tocLabel: 'On this page',
    sections: [
      {
        id: 'prepare',
        heading: '1. Before You Trade',
        paragraphs: [
          'Check each card and quantity in the game. Keep the card needed for your own collection separate from duplicates that are safe to offer.',
        ],
        bullets: [
          'Cards you need',
          'Cards and quantities you can offer',
          'Server and UID',
          'Times you can meet',
        ],
      },
      {
        id: 'match',
        heading: '2. Find a Trading Partner',
        paragraphs: [
          'Enter both lists in the matcher. The strongest candidates can offer something you need and need something you can offer. Always select the same server.',
        ],
      },
      {
        id: 'ingame',
        heading: '3. Complete the Trade In-Game',
        bullets: [
          'Send a friend request using the listed UID.',
          'Confirm the cards and meeting time in chat.',
          'Join the same multiplayer world.',
          'Use the official exchange screen and check both cards before confirming.',
        ],
      },
      {
        id: 'safe',
        heading: '4. Stay Safe',
        paragraphs: [
          'ARCANA LINK never needs your login credentials. Do not share passwords, email or SMS verification codes, sign-in screens, money, or payment information. Use only the official in-game exchange feature.',
        ],
      },
      {
        id: 'trouble',
        heading: '5. Troubleshooting',
        subheadings: [
          {
            heading: 'You cannot find the player',
            paragraph:
              'Check every UID digit and confirm that both players selected the same server.',
          },
          {
            heading: 'The offered card is no longer available',
            paragraph:
              'Do not substitute a different card without agreement. Update or close the listing and search again.',
          },
          {
            heading: 'The exchange feels unsafe',
            paragraph:
              'Leave the session. You never have to continue an exchange that makes you uncomfortable.',
          },
        ],
      },
    ],
    related: {
      title: 'Ready to search?',
      label: 'Find a compatible collector →',
      href: '',
    },
    updated: 'Updated September 6, 2026',
  },
  arcana: {
    kicker: 'COLLECTION',
    title: 'All 22 Lunar Arcana Cards',
    description:
      'Check the English names and numbers of all 22 Lunar Arcana cards before arranging an exchange.',
    lead: 'Use the number and English name together to avoid selecting the wrong card.',
    sections: [
      {
        heading: 'Verify Card Names Before Trading',
        paragraphs: [
          'ARCANA LINK supports all 22 collection cards. Confirm both the Roman numeral and card name with the other player before the exchange.',
        ],
      },
      {
        heading: 'Tips for Completing Your Collection',
        subheadings: [
          {
            heading: 'Review your inventory after every change',
            paragraph:
              'Update both lists whenever you receive or exchange a card so other players see accurate terms.',
          },
          {
            heading: 'Include more than one possible match',
            paragraph:
              'Listing several needed cards and genuine duplicates increases the chance of a mutual match without overpromising.',
          },
        ],
      },
    ],
    related: {
      title: 'Start matching',
      label: 'Match from your current collection →',
      href: '',
    },
    updated: 'Updated September 6, 2026',
  },
  about: {
    kicker: 'ABOUT',
    title: 'About ARCANA LINK',
    description:
      'Learn about ARCANA LINK, its purpose, editorial policy, and independent operation.',
    lead: 'ARCANA LINK helps collectors with complementary needs find one another without relying on a fast-moving post feed.',
    sections: [
      {
        heading: 'Purpose',
        paragraphs: [
          'Duplicates become more common as a collection grows, while the last missing cards are harder to find. The matcher prioritizes mutual exchange terms rather than post age.',
        ],
      },
      {
        heading: 'Content and Editorial Policy',
        paragraphs: [
          'We independently write card-reference information, exchange steps, and safety guidance in plain language. We do not republish articles from other sites. Always follow the current information shown in the game before confirming an exchange.',
        ],
      },
      {
        heading: 'Site Information',
        details: [
          ['Site name', 'ARCANA LINK'],
          ['Operator', 'ARCANA LINK editorial team'],
          ['Launched', 'September 2026'],
          [
            'Purpose',
            'Organize 22-card exchange information and explain safer trading steps',
          ],
        ],
      },
      {
        heading: 'Independent Operation',
        paragraphs: [
          'This is not an official website of any game, company, work, or brand. It uses no third-party logos, artwork, music, story text, or character assets.',
        ],
      },
    ],
    updated: 'Updated September 6, 2026',
  },
  privacy: {
    kicker: 'POLICY',
    title: 'Privacy Policy',
    description:
      'How ARCANA LINK handles listing information, cookies, logs, and advertising services.',
    lead: 'ARCANA LINK handles only the information reasonably needed to provide and improve the service.',
    sections: [
      {
        heading: '1. Information We Handle',
        paragraphs: [
          'An exchange profile may contain a display name, UID, server, counts for all 22 cards, availability status, and an optional note. A random profile-update token and alert setting are stored on the device. We do not ask for passwords, verification codes, legal names, home addresses, or other information that is unnecessary for an exchange.',
          'Security and diagnostic logs may automatically record an IP address, browser type, referrer, and access time.',
        ],
      },
      {
        heading: '2. Purposes of Use',
        bullets: [
          'Show compatible exchange candidates',
          'Improve usability, speed, and matching quality',
          'Prevent spam, abuse, and violations of the terms',
          'Review user reports and improve safety',
          'Provide necessary notices and support',
        ],
      },
      {
        heading: '3. Cookies and Advertising',
        paragraphs: [
          'The site may use cookies or similar technology for settings, analytics, advertising, and measurement. Google AdSense and its partners may use cookies to serve and measure ads. You can manage personalized advertising through Google Ads Settings and review Google’s policy for partner sites.',
        ],
      },
      {
        heading: '4. Sharing and Service Providers',
        paragraphs: [
          'We do not sell personal information. Information may be disclosed when required by law, needed to protect a person or property, authorized by the user, or processed by a service provider within the minimum scope necessary to operate the site.',
        ],
      },
      {
        heading: '5. Public Listing Information',
        paragraphs: [
          'A display name, UID, server, card counts, availability status, and note are visible to other visitors looking for a match. Do not enter a real name, social account, address, phone number, or unrelated personal information. Profiles not updated for seven days are not shown as match candidates.',
        ],
      },
      {
        heading: '6. Policy Changes',
        paragraphs: [
          'This policy may be updated when laws, services, or site features change. Material changes will be announced on the site.',
        ],
      },
    ],
    updated: 'Effective September 5, 2026',
  },
  terms: {
    kicker: 'TERMS',
    title: 'Terms of Use',
    description:
      'Rules, prohibited conduct, and disclaimers for using ARCANA LINK.',
    lead: 'These rules help keep exchange listings useful and safer for everyone.',
    sections: [
      {
        heading: '1. Scope',
        paragraphs: [
          'These terms apply to the matching, listings, guides, and other features provided by ARCANA LINK. Using the site means you agree to these terms.',
        ],
      },
      {
        heading: '2. Service Provided',
        paragraphs: [
          'The site uses the recorded counts of all 22 cards and availability status to show candidates with mutually compatible terms. It does not execute card transfers. Users complete exchanges through the official in-game feature.',
        ],
      },
      {
        heading: '3. Prohibited Conduct',
        bullets: [
          'Posting a false UID, incorrect card count, or intentionally misleading availability status',
          'Requesting a password, verification code, money, or anything of monetary value',
          'Fraud, impersonation, harassment, discrimination, or abusive language',
          'Spam, commercial advertising, or unrelated solicitation',
          'Unauthorized access, excessive automation, or interference with site operation',
          'Conduct that violates law, public order, or applicable game rules',
        ],
      },
      {
        heading: '4. Listing Moderation',
        paragraphs: [
          'Content that violates these terms, is materially outdated, or threatens safe operation may be hidden or removed without prior notice.',
        ],
      },
      {
        heading: '5. Disclaimer',
        paragraphs: [
          'The site does not guarantee a successful exchange, the accuracy of user-entered information, or immediate updates after game changes. Users are responsible for resolving disputes arising from their communications and exchanges, except where the operator is legally responsible for intentional misconduct or gross negligence.',
        ],
      },
      {
        heading: '6. Changes or Suspension',
        paragraphs: [
          'Features may be changed, interrupted, or discontinued for maintenance, failures, external-service changes, or other operational reasons.',
        ],
      },
      {
        heading: '7. Changes to These Terms',
        paragraphs: [
          'These terms may be updated when a change is reasonable and necessary. Material changes will be announced on the site.',
        ],
      },
    ],
    updated: 'Effective September 5, 2026',
  },
};

const chinese: Record<PublicPageKey, LocalizedPage> = {
  'genshin-arcana': {
    kicker: '原神月谕圣牌指南',
    title: '原神月谕圣牌交换与招募查找指南',
    description:
      '根据想要的月谕圣牌、可交换的圣牌、服务器和UID，查找条件合适的原神交换伙伴。',
    lead: '从整理持有情况、查找互相匹配的玩家，到与好友在多人游戏中完成月谕圣牌交换的实用指南。',
    tocLabel: '本页内容',
    sections: [
      {
        id: 'what',
        heading: '原神月谕圣牌是什么？',
        paragraphs: [
          '月谕圣牌是由22种卡牌组成的收集内容。收集进度提高后，可能会重复获得已有圣牌，同时仍缺少其他圣牌。持有互补重复圣牌的好友可以交换。',
          'ARCANA LINK不直接转移圣牌，只用于比较双方想要和可提供的内容。实际交换需在多人游戏中使用游戏内的正式功能完成。',
        ],
      },
      {
        id: 'before',
        heading: '寻找交换伙伴前的准备',
        paragraphs: [
          '先在游戏内核对持有情况，将缺少的圣牌与真正可用于交换的重复圣牌分开。同时确认数量，避免将同一张圣牌同时答应给多人。',
        ],
        bullets: [
          '需要的圣牌编号和名称',
          '可交换的圣牌及数量',
          'Asia、America、Europe或TW/HK/MO服务器',
          '用于好友申请的UID',
          '可进入多人游戏的时间',
        ],
      },
      {
        id: 'find',
        heading: '如何查找原神月谕圣牌交换招募',
        paragraphs: [
          '普通按时间排列的帖子容易将旧需求淹没。ARCANA LINK会根据双向匹配排序：对方能提供你需要的圣牌，同时你也能提供对方需要的圣牌。',
        ],
        bullets: [
          '选择尚未拥有的月谕圣牌。',
          '只选择当前确实可交换的重复圣牌。',
          '筛选同一服务器，确保双方可以联机。',
          '复制UID前再次核对双方交换内容。',
        ],
      },
      {
        id: 'steps',
        heading: '如何与好友交换月谕圣牌',
        paragraphs: [
          '找到匹配对象后，通过UID发送好友申请，并确认双方圣牌和会合时间。进入同一多人游戏后，在正式交换界面选择圣牌，确认前核对名称和数量。',
          '圣牌交换不需要密码或验证码。如果对方索要登录信息、金钱或其他账号权限，请立即停止交换。',
        ],
      },
      {
        id: 'faq',
        heading: '原神月谕圣牌交换常见问题',
        subheadings: [
          {
            heading: '可以直接在本网站交换圣牌吗？',
            paragraph:
              '不可以。ARCANA LINK只帮助寻找条件互补的玩家，实际交换请使用游戏内的正式功能。',
          },
          {
            heading: '不同服务器的玩家可以交换吗？',
            paragraph:
              '请选择同一服务器的玩家。不同服务器通常无法进入同一个多人世界。',
          },
          {
            heading: '哪些信息可以分享？',
            paragraph:
              '只分享协调交换所需的UID和交换条件。切勿分享密码、短信或邮件验证码、真实姓名、地址或支付信息。',
          },
        ],
      },
      {
        id: 'editorial',
        heading: '编辑方针',
        paragraphs: [
          '本页由ARCANA LINK独立整理交换流程和安全信息。本站为非官方网站，与游戏开发或发行方无关，不使用第三方标志、画面、音乐、剧情文字或角色素材。',
        ],
      },
    ],
    related: { title: '开始匹配', label: '打开圣牌交换匹配器 →', href: '' },
    updated: '发布：2026年9月5日 · 更新：2026年9月6日',
  },
  guide: {
    kicker: '交换指南',
    title: '圣牌交换指南',
    description:
      '了解如何做好准备、寻找条件匹配的玩家，并安全完成22种收藏圣牌的交换。',
    lead: '从核对重复圣牌，到使用游戏内正式功能完成交换，请按以下顺序操作。',
    tocLabel: '本页内容',
    sections: [
      {
        id: 'prepare',
        heading: '1. 交换前准备',
        paragraphs: [
          '在游戏内确认每张圣牌及数量，将收藏所需的圣牌与可放心交换的重复圣牌分开。',
        ],
        bullets: [
          '想要的圣牌',
          '可交换的圣牌及数量',
          '服务器和UID',
          '可会合的时间',
        ],
      },
      {
        id: 'match',
        heading: '2. 寻找交换伙伴',
        paragraphs: [
          '在匹配器中登记两份清单。优先结果会显示能提供你所需圣牌，且需要你所拥有圣牌的玩家。请务必选择同一服务器。',
        ],
      },
      {
        id: 'ingame',
        heading: '3. 在游戏内完成交换',
        bullets: [
          '通过招募中的UID发送好友申请。',
          '在聊天中确认圣牌和会合时间。',
          '进入同一多人世界。',
          '使用正式交换界面，确认双方圣牌后再提交。',
        ],
      },
      {
        id: 'safe',
        heading: '4. 安全提示',
        paragraphs: [
          'ARCANA LINK不需要你的账号登录信息。请勿分享密码、邮件或短信验证码、登录页面、金钱或支付信息。只使用游戏内的正式交换功能。',
        ],
      },
      {
        id: 'trouble',
        heading: '5. 问题排查',
        subheadings: [
          {
            heading: '找不到对方',
            paragraph: '逐位核对UID，并确认双方选择了同一服务器。',
          },
          {
            heading: '对方已没有约定圣牌',
            paragraph:
              '未经双方同意不要更换为其他圣牌。请更新或关闭招募后重新查找。',
          },
          {
            heading: '交换让你感到不安',
            paragraph: '立即离开联机。你无需继续任何令人不舒服的交换。',
          },
        ],
      },
    ],
    related: { title: '准备查找？', label: '寻找条件匹配的收藏家 →', href: '' },
    updated: '更新：2026年9月6日',
  },
  arcana: {
    kicker: '收集',
    title: '22种月谕圣牌一览',
    description: '安排交换前，查看22种月谕圣牌的简体中文名称和编号。',
    lead: '同时核对罗马数字和简体中文名称，避免选错圣牌。',
    sections: [
      {
        heading: '交换前核对圣牌名称',
        paragraphs: [
          'ARCANA LINK支持全部22种收集圣牌。交换前，请与对方同时确认罗马数字和圣牌名称。',
        ],
      },
      {
        heading: '集齐圣牌的小技巧',
        subheadings: [
          {
            heading: '每次变动后重新核对',
            paragraph:
              '获得或交换圣牌后，及时更新想要和可交换清单，让其他玩家看到准确条件。',
          },
          {
            heading: '不要只限定一个选项',
            paragraph:
              '同时登记多张需要的圣牌和真实持有的重复圣牌，可以增加双向匹配的机会。',
          },
        ],
      },
    ],
    related: {
      title: '开始匹配',
      label: '根据当前持有情况寻找交换伙伴 →',
      href: '',
    },
    updated: '更新：2026年9月6日',
  },
  about: {
    kicker: '关于',
    title: '关于 ARCANA LINK',
    description: '了解ARCANA LINK的用途、编辑方针和独立运营信息。',
    lead: 'ARCANA LINK帮助交换条件互补的收藏家找到对方，不必依赖快速下沉的帖子。',
    sections: [
      {
        heading: '网站用途',
        paragraphs: [
          '收集进度越高，重复圣牌越常见，而最后缺少的圣牌更难找到。本站以双向交换条件而非发布时间排列结果。',
        ],
      },
      {
        heading: '内容与编辑方针',
        paragraphs: [
          '我们用易于理解的语言独立整理圣牌参考信息、交换流程和安全提示，不转载其他网站的文章。确认交换前，请始终以游戏内当前显示为准。',
        ],
      },
      {
        heading: '运营信息',
        details: [
          ['网站名称', 'ARCANA LINK'],
          ['运营者', 'ARCANA LINK编辑团队'],
          ['开始运营', '2026年9月'],
          ['运营目的', '整理22种圣牌交换信息，并说明更安全的交换流程'],
        ],
      },
      {
        heading: '独立运营',
        paragraphs: [
          '本站并非任何游戏、公司、作品或品牌的官方网站，不使用第三方标志、画面、音乐、剧情文字或角色素材。',
        ],
      },
    ],
    updated: '更新：2026年9月6日',
  },
  privacy: {
    kicker: '政策',
    title: '隐私政策',
    description:
      'ARCANA LINK对交换招募信息、Cookie、日志和广告服务的处理方式。',
    lead: 'ARCANA LINK仅在提供和改进服务所需的合理范围内处理信息。',
    sections: [
      {
        heading: '1. 我们处理的信息',
        paragraphs: [
          '交换资料可能包含显示名称、UID、服务器、22种圣牌的持有数量、交换状态和可选备注。设备中会保存用于更新资料的随机识别信息和提醒设置。我们不会索要密码、验证码、真实姓名、家庭地址或交换无需的其他信息。',
          '安全与故障排查日志可能自动记录IP地址、浏览器类型、来源页面和访问时间。',
        ],
      },
      {
        heading: '2. 使用目的',
        bullets: [
          '显示条件匹配的交换对象',
          '改善易用性、速度和匹配质量',
          '防止垃圾信息、滥用和违反条款的行为',
          '确认用户举报并改善安全性',
          '提供必要的通知和支持',
        ],
      },
      {
        heading: '3. Cookie与广告',
        paragraphs: [
          '本站可能使用Cookie或类似技术保存设置、分析使用情况、投放和衡量广告。Google AdSense及其合作伙伴可能使用Cookie投放和衡量广告。用户可通过Google广告设置管理个性化广告，并查看Google合作伙伴网站政策。',
        ],
      },
      {
        heading: '4. 信息共享与服务提供商',
        paragraphs: [
          '我们不会出售个人信息。仅在法律要求、保护人身或财产所需、得到用户同意，或服务提供商为运营网站而在最小必要范围内处理时披露信息。',
        ],
      },
      {
        heading: '5. 公开招募信息',
        paragraphs: [
          '显示名称、UID、服务器、圣牌持有数量、交换状态和备注会向查找匹配的其他访客公开。请勿输入真实姓名、社交账号、地址、电话号码或无关的个人信息。超过7天未更新的资料不会显示为匹配候选。',
        ],
      },
      {
        heading: '6. 政策更新',
        paragraphs: [
          '法律、服务或网站功能变化时，本政策可能更新。重大变更将在网站内公告。',
        ],
      },
    ],
    updated: '生效日期：2026年9月5日',
  },
  terms: {
    kicker: '条款',
    title: '使用条款',
    description: 'ARCANA LINK的使用规则、禁止行为和免责说明。',
    lead: '以下规则用于帮助所有人更有效、更安全地使用交换招募。',
    sections: [
      {
        heading: '1. 适用范围',
        paragraphs: [
          '本条款适用于ARCANA LINK提供的匹配、招募、指南和其他功能。使用本站即表示同意本条款。',
        ],
      },
      {
        heading: '2. 提供的服务',
        paragraphs: [
          '本站根据用户登记的22种圣牌持有数量和交换状态，显示双方条件一致的交换候选，不直接执行圣牌转移。用户需通过游戏内正式功能完成交换。',
        ],
      },
      {
        heading: '3. 禁止行为',
        bullets: [
          '发布虚假UID、错误持有数量或故意误导的交换状态',
          '索要密码、验证码、金钱或具有金钱价值的物品',
          '欺诈、冒充、骚扰、歧视或攻击性语言',
          '垃圾信息、商业广告或与交换无关的拉客',
          '未授权访问、过度自动化或干扰网站运行',
          '违反法律、公序良俗或适用游戏规则的行为',
        ],
      },
      {
        heading: '4. 招募内容管理',
        paragraphs: [
          '违反条款、明显过期或影响安全运营的内容，可能在不事先通知的情况下被隐藏或删除。',
        ],
      },
      {
        heading: '5. 免责说明',
        paragraphs: [
          '本站不保证交换成功、用户输入信息的准确性，或在游戏变更后立即完成更新。用户应负责解决沟通和交换中产生的纠纷，但运营者因故意或重大过失而依法负责的情况除外。',
        ],
      },
      {
        heading: '6. 变更或停止',
        paragraphs: [
          '因维护、故障、外部服务变更或其他运营原因，功能可能被变更、中断或停止。',
        ],
      },
      {
        heading: '7. 条款变更',
        paragraphs: [
          '当变更合理且有必要时，本条款可能更新。重大变更将在网站内公告。',
        ],
      },
    ],
    updated: '生效日期：2026年9月5日',
  },
};

export const localizedPages: Record<
  TranslatedLocale,
  Record<PublicPageKey, LocalizedPage>
> = { en: english, 'zh-cn': chinese };
