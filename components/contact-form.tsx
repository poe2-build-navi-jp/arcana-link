'use client';
import {useState} from 'react';
export function ContactForm() {
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  return <form className="form contact-form" onSubmit={async event=>{
    event.preventDefault();const form=event.currentTarget;const data=new FormData(form);
    setBusy(true);setMessage('');
    try {
      let token=sessionStorage.getItem('arcana-contact-token');
      if (!token) {token=crypto.randomUUID();sessionStorage.setItem('arcana-contact-token',token);}
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,category:data.get('category'),message:data.get('message'),website:data.get('website')})});
      if(!response.ok) {setMessage(response.status===429 ? '短時間に複数回送信されています。時間を置いてお試しください。' : '送信できませんでした。入力内容を残していますので、時間を置いて再度お試しください。');return;}
      const result=await response.json() as {id:string};setMessage('受け付けました。受付番号：'+result.id+'。個別返信は行っていません。');form.reset();
    } catch {setMessage('通信に失敗しました。時間を置いて再度お試しください。');} finally {setBusy(false);}
  }}><label htmlFor="contact-category">種類</label><select id="contact-category" name="category" required><option value="correction">掲載内容の訂正</option><option value="bug">動作・表示の不具合</option><option value="abuse">迷惑行為・安全上の問題</option><option value="other">その他のお問い合わせ</option></select><label htmlFor="contact-message">内容（10〜1,000文字）</label><textarea id="contact-message" name="message" rows={7} minLength={10} maxLength={1000} required placeholder="対象ページのURL、起きたこと、再現手順などを記入してください。"/><div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p>氏名・メールアドレス・UID・パスワード・認証コードは書かないでください。アカウントや返信先の入力は不要です。</p><label className="contact-consent"><input type="checkbox" required/> <span><a href="/privacy">プライバシーポリシー</a>を確認し、運営者が対応のために送信内容を保存することに同意します。</span></label><button className="submit" type="submit" disabled={busy}>{busy?'送信中…':'内容を送信する'}</button><p role="status" aria-live="polite">{message}</p></form>;
}
