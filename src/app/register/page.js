'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from '../login/page.module.css'; // Reusing login styles

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, phone);
      router.push('/profile');
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
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Join Blossom Byte for an exclusive floral experience.</p>
          </div>

          {error && <div style={{ color: 'var(--color-primary)', background: 'rgba(233, 30, 99, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input 
              label="Full Name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              minLength={3}
            />
            <Input 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Input 
              label="Phone Number" 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              placeholder="+91 99999 99999"
              pattern="^\+?[1-9]\d{1,14}$"
              title="Please enter a valid phone number"
            />
            <Input 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={8}
            />
            <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '-12px', marginBottom: '16px' }}>
              Password must be at least 8 characters long.
            </p>

            <Button variant="primary" size="lg" className={styles.submitBtn} type="submit">
              Register <ArrowRight size={18} />
            </Button>
          </form>

          <div className={styles.footer}>
            <p>Already have an account? <Link href="/login">Sign In</Link></p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
