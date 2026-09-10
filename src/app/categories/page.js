'use client';

import { CATEGORIES } from '@/lib/data';
import CategoryCard from '@/components/ui/CategoryCard';
import styles from './page.module.css';
import { motion } from 'framer-motion';

export default function CategoriesPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.heroContent}
        >
          <h1 className={styles.title}>Curated Collections</h1>
          <p className={styles.subtitle}>Explore our exquisitely sourced floral categories designed for the most discerning aesthetic.</p>
        </motion.div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.grid}>
          {CATEGORIES.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
