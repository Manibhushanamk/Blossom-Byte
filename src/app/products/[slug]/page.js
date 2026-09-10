'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Heart, ShoppingBag, Truck, ShieldCheck, Leaf } from 'lucide-react';
import styles from './page.module.css';
import { motion } from 'framer-motion';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productSlug = params.slug;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { products } = useProducts();

  const product = products.find(p => p.slug === productSlug);

  if (!product) {
    return <div className={styles.notFound}>Product not found</div>;
  }

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
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.imageGallery}
          >
            <div className={styles.mainImageWrapper}>
              <img src={product.image} alt={product.name} className={styles.mainImage} />
              <div className={styles.badges}>
                {product.discount > 0 && <Badge variant="primary">-{product.discount}%</Badge>}
                {product.bestSeller && <Badge variant="accent">Best Seller</Badge>}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={styles.productInfo}
          >
            <div className={styles.breadcrumbs}>
              <span>Home</span> / <span>Shop</span> / <span className={styles.currentCrumb}>{product.name}</span>
            </div>

            <h1 className={styles.title}>{product.name}</h1>
            
            <div className={styles.priceRow}>
              {discountedPrice ? (
                <>
                  <span className={styles.price}>{formatPrice(discountedPrice)}</span>
                  <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className={styles.price}>{formatPrice(product.price)}</span>
              )}
            </div>

            <p className={styles.description}>{product.longDesc}</p>

            <div className={styles.addToCartSection}>
              <div className={styles.quantity}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                className={styles.cartBtn}
                onClick={() => {
                  addToCart(product, quantity);
                  router.push('/cart');
                }}
              >
                <ShoppingBag size={20} /> Add to Cart
              </Button>
              <button className={styles.wishlistBtn} aria-label="Add to wishlist">
                <Heart size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <Truck size={20} />
                <span>{product.deliveryTime}</span>
              </div>
              <div className={styles.feature}>
                <Leaf size={20} />
                <span>{product.flowerMeaning}</span>
              </div>
              <div className={styles.feature}>
                <ShieldCheck size={20} />
                <span>Premium Quality Guaranteed</span>
              </div>
            </div>

            <div className={styles.accordion}>
              <div className={styles.accordionItem}>
                <h4 className={styles.accordionTitle}>Care Instructions</h4>
                <p className={styles.accordionContent}>{product.careInstructions}</p>
              </div>
              <div className={styles.accordionItem}>
                <h4 className={styles.accordionTitle}>Product Details</h4>
                <ul className={styles.accordionList}>
                  <li><strong>SKU:</strong> {product.sku}</li>
                  <li><strong>Category:</strong> {product.category.replace('-', ' ')}</li>
                  <li><strong>Availability:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</li>
                </ul>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
