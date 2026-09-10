'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, MapPin, Package, LogOut, Settings, Home } from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [user, isLoaded, router]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.content}
    >
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Personal Details</h1>
        <p className={styles.pageSubtitle}>Manage your personal information and preferences.</p>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <h3 className={styles.detailLabel}>Full Name</h3>
          <p className={styles.detailValue}>{user.name}</p>
        </div>
        
        <div className={styles.detailCard}>
          <h3 className={styles.detailLabel}>Email Address</h3>
          <p className={styles.detailValue}>{user.email}</p>
        </div>

        <div className={styles.detailCard}>
          <h3 className={styles.detailLabel}>Phone Number</h3>
          <p className={styles.detailValue}>{user.phone || 'Not provided'}</p>
        </div>

        <div className={styles.detailCard}>
          <h3 className={styles.detailLabel}>Membership Tier</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={styles.detailValue}>{user.tier}</span>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', background: 'rgba(233, 30, 99, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
              Active
            </span>
          </div>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Recent Activity</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>
              <User size={16} />
            </div>
            <div>
              <p className={styles.activityTitle}>Account Created</p>
              <p className={styles.activityTime}>Just now</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
