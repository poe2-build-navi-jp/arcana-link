import {NextRequest,NextResponse} from 'next/server';
import {saveContact} from '@/lib/arcana-db';
export async function POST(request:NextRequest) {
  const origin=request.headers.get('origin');
  if(origin && origin!==request.nextUrl.origin) return NextResponse.json({error:'origin'},{status:403});
  if(Number(request.headers.get('content-length')||0)>8192) return NextResponse.json({error:'size'},{status:413});
  const text=await request.text();
  if(text.length>8192) return NextResponse.json({error:'size'},{status:413});
  let body;try{body=JSON.parse(text);}catch{return NextResponse.json({error:'json'},{status:400});}
  if(!body || typeof body.token!=='string'||! /^[a-f0-9-]{36}$/.test(body.token) || typeof body.message!=='string'||body.message.trim().length<10||body.message.length>1000||!['correction','bug','abuse','other'].includes(body.category)||body.website) return NextResponse.json({error:'invalid'},{status:400});
  try{
    const result=await saveContact(body.token,body.category,body.message.trim());
    if(result==='limited') return NextResponse.json({error:'rate_limit'},{status:429});
    if(!result) return NextResponse.json({error:'unavailable'},{status:503});
    return NextResponse.json({id:result});
  }catch{return NextResponse.json({error:'unavailable'},{status:503});}
}
