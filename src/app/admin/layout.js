'use client';
import { useState, useEffect } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Grid, Database, Home } from 'lucide-react';
import styles from './layout.module.css';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    fetch('/api/setup/check')
      .then(res => res.json())
      .then(data => setDbConfigured(data.isConfigured))
      .catch(() => setDbConfigured(false));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push('/login');
      } else if (!user.isAdmin) {
        router.push('/');
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user || !user.isAdmin) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const navItems = [
    { name: 'Storefront', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Database', path: '/admin/database', icon: <Database size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Grid size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];


  return (
    <div className={styles.adminContainer}>
      {!dbConfigured && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: 'rgba(255, 0, 0, 0.9)', color: 'white', padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Database is offline. The storefront is running on local mock data. 
          <Link href="/setup" style={{ color: 'white', textDecoration: 'underline', fontWeight: 'bold' }}>Connect MongoDB in Setup Wizard</Link>
        </div>
      )}
      
      {/* Glass Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={styles.sidebar}
      >
        <div className={styles.logoContainer}>
          <img src="/images/logos/primary_logo.png" alt="Blossom Byte Admin" className={styles.logo} />
          <span className={styles.logoText}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`) && item.path !== '/admin';
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
                {isActive && (
                  <motion.div layoutId="activeNav" className={styles.activeIndicator} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className={styles.bottomNav}>
          <Link href="/" className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Exit Admin</span>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>A</div>
            <span>Admin User</span>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}
