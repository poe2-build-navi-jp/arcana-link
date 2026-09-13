const verification = 'google-site-verification: googlee07fe73b9f8e1428.html';

export function GET() {
  return new Response(verification, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
