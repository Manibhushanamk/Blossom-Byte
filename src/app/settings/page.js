'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, MapPin, Package, LogOut, Settings, Save } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from '../profile/page.module.css';

export default function SettingsPage() {
  const { user, updateProfile, logout, isLoaded } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    alert('Settings saved successfully!');
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
              <Link href="/orders" className={styles.navItem}>
                <Package size={18} /> Order History
              </Link>
              <Link href="/addresses" className={styles.navItem}>
                <MapPin size={18} /> Saved Addresses
              </Link>
              <Link href="/settings" className={`${styles.navItem} ${styles.active}`}>
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
            <h1 className={styles.pageTitle}>Account Settings</h1>
            
            <form onSubmit={handleSave} className={styles.infoCard} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="Email Address" name="email" value={formData.email} onChange={handleChange} required type="email" />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-primary)' }}>Change Password</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" placeholder="••••••••" />
                </div>
              </div>
              
              <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start' }}>
                <Save size={18} style={{ marginRight: '8px' }} /> Save Changes
              </Button>
            </form>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
