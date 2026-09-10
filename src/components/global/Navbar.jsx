'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [hidden, setHidden] = useState(true);
  const { scrollY } = useScroll();
  const { cartItems } = useCart();

  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show navbar after scrolling 800px (past the initial seed sequence)
    if (latest > 800) {
      setHidden(false);
    } else {
      setHidden(true);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 }
      }}
      initial="hidden"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={styles.navbar}
    >
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <img src="/images/logos/primary_logo.png" alt="Blossom Byte Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} className={styles.logoIcon} />
            <span className={styles.logoText}>Blossom Byte</span>
          </Link>
        </div>

        <nav className={styles.navLinks}>
          <Link href="/category/fresh-flowers" className={styles.navLink}>Flowers</Link>
          <Link href="/category/bouquets" className={styles.navLink}>Bouquets</Link>
          <Link href="/category/plants" className={styles.navLink}>Plants</Link>
          <Link href="/category/seeds" className={styles.navLink}>Seeds</Link>
          <Link href="/category/decor" className={styles.navLink}>Decor</Link>
          <Link href="/track-order" className={styles.navLink}>Track Order</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/categories" className={styles.actionBtn} aria-label="Search"><Search size={20} strokeWidth={1.5} /></Link>
          <Link href="/wishlist" className={styles.actionBtn} aria-label="Wishlist"><Heart size={20} strokeWidth={1.5} /></Link>
          <Link href="/cart" className={styles.actionBtn} aria-label="Cart" style={{ position: 'relative' }}>
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--color-primary)', color: 'var(--color-background)', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/profile" className={styles.actionBtn} aria-label="Profile"><User size={20} strokeWidth={1.5} /></Link>
        </div>
      </div>
    </motion.header>
  );
}
