'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import Badge from './Badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, delay = 0 }) {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inCart = cartItems ? cartItems.some(item => item.product.id === product.id) : false;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const discountedPrice = product.discount 
    ? product.price - (product.price * (product.discount / 100))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
      className={styles.card}
    >
      <Link href={`/products/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img src={product.image} alt={product.name} className={styles.image} loading="lazy" />
          
          <div className={styles.badges}>
            {product.discount > 0 && <Badge variant="primary">-{product.discount}%</Badge>}
            {product.bestSeller && <Badge variant="accent">Best Seller</Badge>}
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.actionBtn} 
              aria-label="Add to wishlist" 
              onClick={(e) => { 
                e.preventDefault(); 
                toggleWishlist(product);
              }}
              style={isInWishlist && isInWishlist(product.id) ? { color: '#E91E63', background: 'rgba(233, 30, 99, 0.1)' } : {}}
            >
              <Heart size={18} strokeWidth={1.5} fill={isInWishlist && isInWishlist(product.id) ? '#E91E63' : 'none'} />
            </button>
            <button 
              className={styles.actionBtn} 
              aria-label="Add to cart" 
              onClick={(e) => { 
                e.preventDefault(); 
                if (!inCart) addToCart(product, 1);
              }}
              style={inCart ? { color: '#333333', background: 'rgba(0, 0, 0, 0.05)' } : {}}
            >
              <ShoppingBag size={18} strokeWidth={1.5} fill={inCart ? '#333333' : 'none'} />
            </button>
          </div>
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/products/${product.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>
        <p className={styles.desc}>{product.shortDesc}</p>
        
        <div className={styles.priceContainer}>
          {discountedPrice ? (
            <>
              <span className={styles.price}>{formatPrice(discountedPrice)}</span>
              <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className={styles.price}>{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
