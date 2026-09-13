import application from '../dist/server/index.js';

const staticFiles = new Set(['/ads.txt', '/favicon.svg']);

const worker = {
  async fetch(request, env, context) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/_next/static/') || staticFiles.has(pathname)) {
      return env.ASSETS.fetch(request);
    }

    const response = await application.fetch(request, env, context);
    if (!response.headers.get('content-type')?.includes('text/html')) {
      return response;
    }

    const languages = {
      en: 'en',
      'zh-cn': 'zh-CN',
      'zh-tw': 'zh-TW',
      ko: 'ko',
      es: 'es',
      'pt-br': 'pt-BR',
    };
    const language = languages[pathname.split('/')[1]] ?? 'ja';

    return new HTMLRewriter()
      .on('html', {
        element(element) {
          element.setAttribute('lang', language);
        },
      })
      .transform(response);
  },
};

export default worker;
