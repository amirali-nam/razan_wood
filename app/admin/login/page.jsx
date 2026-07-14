'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [locked, setLocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setBusy(false);
    if (r.ok) {
      router.push('/admin');
    } else {
      const j = await r.json().catch(() => ({}));
      setLocked(r.status === 429);
      setErr(j.error || 'نام کاربری یا رمز اشتباه است');
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={submit} className="login-card">
        <img src="/logo.png" alt="لوگوی رزان" style={{ height: 96, width: 'auto', margin: '0 auto' }} />
        <h1>پنل مدیریت رزان</h1>
        <p>برای ورود، نام کاربری و رمز را وارد کنید.</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="نام کاربری"
          autoComplete="username"
          autoFocus
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          autoComplete="current-password"
          required
        />
        {err && <div className={locked ? 'login-locked' : 'login-err'}>{err}</div>}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'در حال ورود…' : 'ورود'}
        </button>
      </form>
    </div>
  );
}
