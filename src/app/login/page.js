'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.authCard}
        >
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: '14px', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className={styles.header}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Enter your details to access your luxury account.</p>
          </div>

          {error && <div style={{ color: 'var(--color-primary)', background: 'rgba(233, 30, 99, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input 
              label="Email Address or ID" 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <div className={styles.passwordGroup}>
              <Input 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <Link href="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
            </div>

            <Button variant="primary" size="lg" className={styles.submitBtn} type="submit">
              Sign In <ArrowRight size={18} />
            </Button>
          </form>

          <div className={styles.footer}>
            <p>Don't have an account? <Link href="/register">Create Account</Link></p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
