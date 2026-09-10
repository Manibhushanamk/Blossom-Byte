'use client';

import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import MagneticButton from '../ui/MagneticButton';
import styles from './HeroTransformation.module.css';

export default function HeroTransformation() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  const floatingGlassVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    show: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0, 
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className={styles.heroSection}>
      {/* Decorative floating petals/glass fragments */}
      <motion.div 
        className={`${styles.glassFragment} ${styles.fragment1}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-20%" }}
        variants={floatingGlassVariants}
      />
      <motion.div 
        className={`${styles.glassFragment} ${styles.fragment2}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-20%" }}
        variants={floatingGlassVariants}
      />
      
      <div className="container relative z-10">
        <motion.div 
          className={styles.heroContent}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
        >
          <motion.h1 variants={itemVariants} className="text-display">
            Fresh Flowers.<br/>
            <span className="text-gradient">Crafted by Nature.</span><br/>
            Delivered with Love.
          </motion.h1>
          
          <motion.p variants={itemVariants} className={`text-body-large ${styles.subtitle}`}>
            Experience the elegance of handcrafted floral arrangements. 
            From seed to bloom, we curate nature's finest.
          </motion.p>
          
          <motion.div variants={itemVariants} className={styles.actions}>
            <MagneticButton variant="primary">Explore Collection</MagneticButton>
            <MagneticButton variant="secondary">Shop Best Sellers</MagneticButton>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className={styles.heroGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
        >
          <GlassCard className={styles.heroCard1}>
            <div className={styles.cardImageHolder}>
              <img src="https://image.pollinations.ai/prompt/luxury%20midnight%20rose%20dark%20moody?width=600&height=800&nologo=true" alt="Midnight Rose" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className={styles.cardInfo}>
              <h3 className="text-h4">Midnight Rose</h3>
              <p className="text-label mt-4">Luxury Bouquets</p>
            </div>
          </GlassCard>
          
          <GlassCard className={styles.heroCard2} delay={0.2}>
            <div className={styles.cardImageHolder}>
              <img src="https://image.pollinations.ai/prompt/luxury%20golden%20lily%20bright?width=600&height=800&nologo=true" alt="Golden Lily" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className={styles.cardInfo}>
              <h3 className="text-h4">Golden Lily</h3>
              <p className="text-label mt-4">Seasonal Picks</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
