'use client';

import { useState } from 'react';
import { X, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from './AuthContext';
import { getDictionary } from '@/lib/i18n';

export default function AuthModal({ onClose, locale = 'en' }) {
  const t = getDictionary(locale);
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const labels = locale === 'mk' ? {
    signIn: 'Најави Се',
    signUp: 'Регистрирај Се',
    email: 'Е-пошта',
    password: 'Лозинка',
    noAccount: 'Немаш профил?',
    hasAccount: 'Веќе имаш профил?',
    signingIn: 'Се најавува...',
    signingUp: 'Се регистрира...',
    checkEmail: 'Провери ја е-поштата за потврда!',
    loginTitle: 'Најави Се',
    registerTitle: 'Регистрирај Се',
  } : {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signingIn: 'Signing in...',
    signingUp: 'Signing up...',
    checkEmail: 'Check your email for confirmation!',
    loginTitle: 'Sign In',
    registerTitle: 'Create Account',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password);
        setSuccess(labels.checkEmail);
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        <div className="modal-handle"><div className="modal-handle-bar" /></div>

        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'signin' ? labels.loginTitle : labels.registerTitle}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label={t.cancel}>
            <X size={16} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '10px 14px', marginBottom: '16px',
              background: 'var(--danger-soft)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)', color: '#f87171',
              fontSize: '13px', lineHeight: 1.4,
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '10px 14px', marginBottom: '16px',
              background: 'var(--accent-green-soft)', border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)', color: 'var(--accent-green)',
              fontSize: '13px', lineHeight: 1.4,
            }}>
              {success}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Mail size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {labels.email}
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {labels.password}
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {mode === 'signin' ? <LogIn size={16} /> : <UserPlus size={16} />}
            {loading
              ? (mode === 'signin' ? labels.signingIn : labels.signingUp)
              : (mode === 'signin' ? labels.signIn : labels.signUp)
            }
          </button>

          <div style={{
            textAlign: 'center', marginTop: '16px',
            fontSize: '13px', color: 'var(--text-secondary)',
          }}>
            {mode === 'signin' ? labels.noAccount : labels.hasAccount}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
              style={{
                color: 'var(--accent-green)', fontWeight: 600,
                textDecoration: 'underline', textUnderlineOffset: '2px',
              }}
            >
              {mode === 'signin' ? labels.signUp : labels.signIn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
