'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './FeaturedCollections.module.css';
import GlassCard from '../ui/GlassCard';

export default function FeaturedCollections() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className="container">
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-h2">Curated With Purpose</h2>
          <p className="text-body mt-4">Discover our most loved arrangements, handcrafted for every moment.</p>
        </motion.div>

        <div className={styles.collectionsGrid}>
          <motion.div style={{ y: y1 }} className={styles.column}>
            <GlassCard className={styles.largeCard}>
               <img src="https://image.pollinations.ai/prompt/luxury%20minimalist%20white%20orchid%20editorial%20photography%20minimalist%20background?width=800&height=1000&nologo=true" alt="The Minimalist" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
               <div className={styles.content}>
                 <h3 className="text-h3">The Minimalist</h3>
                 <p className="text-body-small mt-2">Elegant simplicity.</p>
               </div>
            </GlassCard>
          </motion.div>
          
          <motion.div style={{ y: y2 }} className={`${styles.column} ${styles.offsetColumn}`}>
            <GlassCard className={styles.smallCard}>
               <img src="https://image.pollinations.ai/prompt/luxury%20spring%20awakening%20bouquet%20editorial%20photography?width=600&height=800&nologo=true" alt="Spring Awakening" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
               <div className={styles.content}>
                 <h3 className="text-h4">Spring Awakening</h3>
               </div>
            </GlassCard>
            <GlassCard className={styles.smallCard}>
               <img src="https://image.pollinations.ai/prompt/luxury%20golden%20hour%20sunflower%20arrangement%20editorial%20photography?width=600&height=800&nologo=true" alt="Golden Hour" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
               <div className={styles.content}>
                 <h3 className="text-h4">Golden Hour</h3>
               </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
