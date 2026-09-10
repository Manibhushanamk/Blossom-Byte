'use client';

import { motion } from 'framer-motion';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <motion.div
        className={styles.flower}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <svg viewBox="0 0 100 100" className={styles.svg}>
          <motion.path 
            d="M50 50 C20 10, 80 10, 50 50 C90 20, 90 80, 50 50 C80 90, 20 90, 50 50 C10 80, 10 20, 50 50" 
            fill="none" 
            stroke="var(--color-primary)" 
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <circle cx="50" cy="50" r="4" fill="var(--color-accent)" />
        </svg>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className={styles.text}
      >
        Blooming...
      </motion.p>
    </div>
  );
}
