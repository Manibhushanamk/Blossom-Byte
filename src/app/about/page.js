'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Home } from 'lucide-react';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.content}
        >
          <h1 className={styles.title}>About Blossom Byte</h1>
          <p className={styles.description}>
            Blossom Byte is a premium luxury floral ecommerce platform dedicated to bringing you the finest, hand-selected flowers and curated collections from around the world. We blend nature, technology, and luxury shopping into one seamless cinematic journey.
          </p>
          <p className={styles.description}>
            Our mission is to elevate the gifting experience and bring timeless elegance to every moment.
          </p>

          <div className={styles.adminSection}>
            <h3 className={styles.adminTitle}>Staff Portal</h3>
            <p className={styles.adminDesc}>For authorized administrators only.</p>
            <Link href="/login">
              <Button variant="secondary">Admin Login</Button>
            </Link>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
            <Link href="/">
              <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Home size={18} /> Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
