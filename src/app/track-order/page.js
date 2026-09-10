'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '@/context/OrderContext';
import { Search, Package, Truck, CheckCircle, PackageOpen, Home } from 'lucide-react';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const { getOrder, isLoaded } = useOrders();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setSearched(true);
    const order = getOrder(orderId.trim().toUpperCase());
    setTrackedOrder(order);
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.header}
        >
          <h1 className={styles.title}>Track Your Order</h1>
          <p className={styles.subtitle}>Enter your order ID below to see its current status and estimated delivery time.</p>

          <form onSubmit={handleTrack} className={styles.searchForm}>
            <div className={styles.inputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input 
                type="text" 
                placeholder="e.g. ORD-12345" 
                className={styles.searchInput}
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <Button variant="primary" type="submit" disabled={!isLoaded}>Track Order</Button>
          </form>
        </motion.div>

        {searched && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.resultContainer}
          >
            {trackedOrder ? (
              <div className={styles.trackingCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <h2 className={styles.orderNumber}>{trackedOrder.id}</h2>
                    <p className={styles.orderDate}>Placed on {new Date(trackedOrder.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className={styles.orderTotal}>
                    {formatPrice(trackedOrder.total)}
                  </div>
                </div>

                <div className={styles.timeline}>
                  <div className={`${styles.timelineStep} ${getStatusStep(trackedOrder.status) >= 1 ? styles.active : ''}`}>
                    <div className={styles.stepIcon}><Package size={20} /></div>
                    <div className={styles.stepText}>Processing</div>
                  </div>
                  <div className={`${styles.timelineLine} ${getStatusStep(trackedOrder.status) >= 2 ? styles.active : ''}`}></div>
                  <div className={`${styles.timelineStep} ${getStatusStep(trackedOrder.status) >= 2 ? styles.active : ''}`}>
                    <div className={styles.stepIcon}><Truck size={20} /></div>
                    <div className={styles.stepText}>Shipped</div>
                  </div>
                  <div className={`${styles.timelineLine} ${getStatusStep(trackedOrder.status) >= 3 ? styles.active : ''}`}></div>
                  <div className={`${styles.timelineStep} ${getStatusStep(trackedOrder.status) >= 3 ? styles.active : ''}`}>
                    <div className={styles.stepIcon}><CheckCircle size={20} /></div>
                    <div className={styles.stepText}>Delivered</div>
                  </div>
                </div>

                <div className={styles.itemsList}>
                  <h3 className={styles.itemsTitle}>Items in this order</h3>
                  {trackedOrder.cartDetails?.map((item) => (
                    <div key={item.product.id} className={styles.itemRow}>
                      <img src={item.product.image} alt={item.product.name} className={styles.itemImage} />
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{item.product.name}</div>
                        <div className={styles.itemQty}>Qty: {item.quantity}</div>
                      </div>
                      <div className={styles.itemPrice}>{formatPrice(item.product.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.notFound}>
                <PackageOpen size={48} className={styles.notFoundIcon} />
                <h2>Order Not Found</h2>
                <p>We couldn't find an order with ID <strong>{orderId}</strong>. Please check your order ID and try again.</p>
              </div>
            )}
          </motion.div>
        )}

        <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', width: '100%', paddingBottom: '40px' }}>
          <Link href="/">
            <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Home size={18} /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
