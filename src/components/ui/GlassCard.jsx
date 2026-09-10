'use client';

import { motion } from 'framer-motion';
import styles from './GlassCard.module.css';

export default function GlassCard({ children, className, delay = 0, animate = true }) {
  const CardWrapper = animate ? motion.div : 'div';
  
  const animationProps = animate ? {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }
  } : {};

  return (
    <CardWrapper 
      className={`${styles.card} ${className || ''}`}
      {...animationProps}
    >
      {children}
    </CardWrapper>
  );
}
