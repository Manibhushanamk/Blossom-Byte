'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, MapPin, Package, LogOut, Settings, Home, Shield } from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';

export default function ProfileLayout({ children }) {
  const { user, logout, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
              <Link href="/" className={styles.navItem}>
                <Home size={18} /> Storefront
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" className={styles.navItem}>
                  <Shield size={18} /> Admin Dashboard
                </Link>
              )}
              <Link href="/profile" className={`${styles.navItem} ${pathname === '/profile' ? styles.active : ''}`}>
                <User size={18} /> Personal Details
              </Link>
              <Link href="/orders" className={styles.navItem}>
                <Package size={18} /> Order History
              </Link>
              <Link href="/profile/addresses" className={`${styles.navItem} ${pathname === '/profile/addresses' ? styles.active : ''}`}>
                <MapPin size={18} /> Saved Addresses
              </Link>
              <Link href="/profile/settings" className={`${styles.navItem} ${pathname === '/profile/settings' ? styles.active : ''}`}>
                <Settings size={18} /> Account Settings
              </Link>
              <button onClick={() => { logout(); router.push('/'); }} className={styles.logoutBtn}>
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </aside>

          {children}

        </div>
      </div>
    </main>
  );
}
