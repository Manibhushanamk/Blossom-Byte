'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { motion } from 'framer-motion';
import { User, MapPin, Package, LogOut, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import styles from '../profile/page.module.css';

export default function OrdersPage() {
  const { user, logout, isLoaded } = useAuth();
  const { orders, isLoaded: ordersLoaded } = useOrders();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) return null;

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
        <div className={styles.layout}>
          
          <aside className={styles.sidebar}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={styles.profileCard}
            >
              <div className={styles.avatar}>{user.name.charAt(0)}</div>
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userEmail}>{user.email}</p>
              <div className={styles.tierBadge}>{user.tier}</div>
            </motion.div>

            <nav className={styles.nav}>
              <Link href="/profile" className={styles.navItem}>
                <User size={18} /> Personal Details
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" className={styles.navItem}>
                  <Shield size={18} /> Admin Dashboard
                </Link>
              )}
              <Link href="/orders" className={`${styles.navItem} ${styles.active}`}>
                <Package size={18} /> Order History
              </Link>
              <Link href="/profile/addresses" className={styles.navItem}>
                <MapPin size={18} /> Saved Addresses
              </Link>
              <Link href="/profile/settings" className={styles.navItem}>
                <Settings size={18} /> Account Settings
              </Link>
              <button onClick={() => { logout(); router.push('/'); }} className={styles.logoutBtn}>
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </aside>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.content}
          >
            <h1 className={styles.pageTitle}>Order History</h1>
            
            <div className={styles.ordersList}>
              {orders.filter(o => o.userDetails?.email === user?.email).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                  You haven't placed any orders yet.
                </div>
              ) : (
                orders
                  .filter(o => o.userDetails?.email === user?.email)
                  .map(order => (
                  <div key={order.id} className={styles.orderCard} style={{ background: 'var(--color-surface-glass-white)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '18px', fontWeight: '500' }}>{order.id}</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '4px' }}>Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div>
                        {order.status === 'Delivered' && <Badge variant="secondary">Delivered</Badge>}
                        {order.status === 'Shipped' && <Badge variant="accent">Shipped</Badge>}
                        {order.status === 'Processing' && <Badge variant="primary">Processing</Badge>}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        {order.items} {order.items === 1 ? 'Item' : 'Items'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-primary)', fontSize: '20px', fontWeight: '500' }}>
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
