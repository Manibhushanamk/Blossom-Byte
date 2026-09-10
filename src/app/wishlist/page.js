'use client';

import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ui/ProductCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from '../cart/page.module.css';

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.emptyState}>
          <Heart size={64} strokeWidth={1} className={styles.emptyIcon} />
          <h1 className={styles.title}>Your Wishlist is Empty</h1>
          <p className={styles.subtitle}>Save your favorite items here.</p>
          <Link href="/categories">
            <Button variant="primary" size="lg">Explore Collection</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Your Wishlist</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {wishlistItems.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </main>
  );
}
