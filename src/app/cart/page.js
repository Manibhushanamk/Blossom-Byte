'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, total, delivery, gst } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.emptyState}>
          <ShoppingBag size={64} strokeWidth={1} className={styles.emptyIcon} />
          <h1 className={styles.title}>Your Cart is Empty</h1>
          <p className={styles.subtitle}>Discover our exquisite collection of luxury florals.</p>
          <Link href="/categories">
            <Button variant="primary" size="lg">Explore Collection</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Shopping Bag</h1>
        
        <div className={styles.layout}>
          <div className={styles.cartItems}>
            <div className={styles.cartHeader}>
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            
            {cartItems.map((item, index) => {
              const discountedPrice = item.product.discount 
                ? item.product.price * (1 - item.product.discount / 100)
                : item.product.price;
              
              return (
                <motion.div 
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.cartItem}
                >
                  <div className={styles.itemInfo}>
                    <img src={item.product.image} alt={item.product.name} className={styles.itemImage} />
                    <div>
                      <Link href={`/products/${item.product.slug}`} className={styles.itemName}>
                        {item.product.name}
                      </Link>
                      <p className={styles.itemPrice}>{formatPrice(discountedPrice)}</p>
                    </div>
                  </div>
                  
                  <div className={styles.quantityControl}>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                  </div>
                  
                  <div className={styles.itemTotal}>
                    <span>{formatPrice(discountedPrice * item.quantity)}</span>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className={styles.removeBtn}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className={styles.orderSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Estimated GST (18%)</span>
              <span>{formatPrice(gst)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>{delivery === 0 ? 'Free' : formatPrice(delivery)}</span>
            </div>
            
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            <Link href="/checkout" style={{ width: '100%' }}>
              <Button variant="primary" size="lg" className={styles.checkoutBtn}>
                Proceed to Checkout <ArrowRight size={18} />
              </Button>
            </Link>
            
            <p className={styles.secureText}>
              Complimentary delivery on orders above ₹1,500. Secure checkout.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
