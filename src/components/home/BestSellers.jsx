'use client';

import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import MagneticButton from '../ui/MagneticButton';
import styles from './BestSellers.module.css';
import { ShoppingBag } from 'lucide-react';

const products = [
  { id: 1, name: 'Blush Peony', price: '₹8,500', image: 'https://image.pollinations.ai/prompt/luxury%20blush%20peony%20flower%20minimalist?width=600&height=800&nologo=true' },
  { id: 2, name: 'Velvet Orchid', price: '₹12,000', image: 'https://image.pollinations.ai/prompt/luxury%20velvet%20orchid%20flower%20minimalist?width=600&height=800&nologo=true' },
  { id: 3, name: 'Wildflower Mix', price: '₹6,500', image: 'https://image.pollinations.ai/prompt/luxury%20wildflower%20mix%20flower%20minimalist?width=600&height=800&nologo=true' }
];

export default function BestSellers() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="text-h2">Best Sellers</h2>
          <MagneticButton variant="secondary">View All</MagneticButton>
        </div>
        
        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <GlassCard className={styles.productCard} animate={false}>
                <div className={styles.imageHolder} style={{ backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <button className={styles.quickAdd} aria-label="Add to Cart">
                    <ShoppingBag size={20} strokeWidth={1.5} />
                  </button>
                </div>
                <div className={styles.details}>
                  <h3 className="text-h4">{product.name}</h3>
                  <p className={styles.price}>{product.price}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
