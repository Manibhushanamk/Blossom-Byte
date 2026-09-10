'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './CategoryCard.module.css';

export default function CategoryCard({ category, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
      className={styles.card}
    >
      <Link href={`/category/${category.id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img src={category.image} alt={category.name} className={styles.image} loading="lazy" />
          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <h3 className={styles.title}>{category.name}</h3>
            <span className={styles.exploreBtn}>Explore</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
