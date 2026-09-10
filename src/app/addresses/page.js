'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, MapPin, Package, LogOut, Settings, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from '../profile/page.module.css';

export default function AddressesPage() {
  const { user, updateProfile, logout, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) return null;

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
              <Link href="/orders" className={styles.navItem}>
                <Package size={18} /> Order History
              </Link>
              <Link href="/addresses" className={`${styles.navItem} ${styles.active}`}>
                <MapPin size={18} /> Saved Addresses
              </Link>
              <Link href="/settings" className={styles.navItem}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className={styles.pageTitle}>Saved Addresses</h1>
              <Button variant="primary">
                <Plus size={18} style={{ marginRight: '8px' }} /> Add New Address
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr) => (
                  <div key={addr.id} className={styles.addressCard} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className={styles.addressHeader}>
                        <h3>{addr.type}</h3>
                        {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}
                      </div>
                      <p className={styles.addressText} style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{user.name}</p>
                      <p className={styles.addressText}>{addr.address}</p>
                      <p className={styles.addressText}>{addr.city}, {addr.state} {addr.pin}</p>
                      <p className={styles.addressText} style={{ marginTop: '8px' }}>Phone: {user.phone}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '8px' }}><Edit2 size={18}/></button>
                      <button style={{ background: 'transparent', border: 'none', color: '#E91E63', cursor: 'pointer', padding: '8px' }}><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noData}>No addresses saved yet.</p>
              )}
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
