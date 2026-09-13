import { NextRequest, NextResponse } from 'next/server';
import { saveReport } from '@/lib/arcana-db';

const reasons = new Set([
  'already_exchanged',
  'incorrect_uid',
  'suspicious_request',
  'other',
]);

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    token?: string;
    targetPublicId?: string;
    reason?: string;
  } | null;
  if (
    !body?.token ||
    body.token.length < 32 ||
    body.token.length > 160 ||
    !body.targetPublicId ||
    !/^[a-f0-9]{20}$/.test(body.targetPublicId) ||
    !body.reason ||
    !reasons.has(body.reason)
  ) {
    return NextResponse.json({ error: 'invalid_report' }, { status: 400 });
  }
  const result = await saveReport({
    token: body.token,
    targetPublicId: body.targetPublicId,
    reason: body.reason,
  });
  if (!result) return NextResponse.json({ mode: 'local' }, { status: 503 });
  return NextResponse.json({ status: 'received' });
}
