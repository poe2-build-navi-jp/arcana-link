const verification = 'google-site-verification: googlebaa56ffa7c50bcfb.html';

export function GET() {
  return new Response(verification, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
