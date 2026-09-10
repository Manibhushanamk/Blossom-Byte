'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.topSection}
        >
          <div className={styles.brand}>
            <img src="/images/logos/primary_logo.png" alt="Blossom Byte" className={styles.logo} />
            <p className={styles.tagline}>Haute floristry since 2023. Elevating natural beauty through premium digital experiences.</p>
          </div>
          
          <div className={styles.linksGrid}>
            <div className={styles.linkGroup}>
              <h4>Shop</h4>
              <Link href="/category/flowers">Fresh Flowers</Link>
              <Link href="/category/bouquets">Bouquets</Link>
              <Link href="/category/plants">Plants</Link>
              <Link href="/category/seeds">Seeds</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h4>Support</h4>
              <Link href="/faq">FAQ</Link>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/contact">Contact Us</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h4>Legal</h4>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </motion.div>
        
        <div className={styles.bottomSection}>
          <p>&copy; {new Date().getFullYear()} Blossom Byte. All rights reserved.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Twitter">TW</a>
            <a href="#" aria-label="Pinterest">PI</a>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <Link href="/">
            <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px' }}>
              <Home size={16} /> Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
