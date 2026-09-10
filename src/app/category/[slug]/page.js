'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ui/ProductCard';
import styles from './page.module.css';
import { motion } from 'framer-motion';

export default function CategoryProductsPage() {
  const params = useParams();
  const categorySlug = params.slug;
  const { products } = useProducts();
  const [sortOption, setSortOption] = useState('Recommended');

  const category = CATEGORIES.find(c => c.id === categorySlug);
  const categoryProducts = products.filter(p => p.category === categorySlug);

  if (!category) {
    return (
      <main className={styles.main}>
        <div className={styles.notFound}>
          <h2>Category not found.</h2>
          <Link href="/" style={{ marginTop: '16px', display: 'inline-block', padding: '12px 24px', background: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
            Return to Storefront
          </Link>
        </div>
      </main>
    );
  }

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortOption) {
      case 'Price: Low to High': return a.price - b.price;
      case 'Price: High to Low': return b.price - a.price;
      case 'Newest Arrivals': return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      default: return 0;
    }
  });

  return (
    <main className={styles.main}>
      <section className={styles.hero} style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,242,0.9), rgba(255,255,242,0.7)), url(${category.image})` }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.heroContent}
        >
          <h1 className={styles.title}>{category.name}</h1>
          <p className={styles.subtitle}>Discover our exquisite collection of {category.name.toLowerCase()}, hand-selected for ultimate luxury.</p>
        </motion.div>
      </section>

      <section className={styles.shopSection}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Sort by:</span>
            <select className={styles.select} value={sortOption} onChange={e => setSortOption(e.target.value)}>
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
          <p className={styles.resultsCount}>{categoryProducts.length} Products</p>
        </div>

        <div className={styles.grid}>
          {categoryProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '64px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', margin: '40px 0' }}>
               <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>No products found</h2>
               <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>We are currently updating our {category.name.toLowerCase()} collection. Please check back later.</p>
               <Link href="/" style={{ padding: '12px 24px', background: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                 Return to Storefront
               </Link>
            </div>
          ) : (
            sortedProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                delay={(index % 4) * 0.1}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
