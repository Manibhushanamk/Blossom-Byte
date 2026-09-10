'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import styles from '../page.module.css';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    phone: user?.phone || '', 
    currentPassword: '', 
    newPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const res = await fetch('/api/users/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: user.email, 
        name: formData.name, 
        phone: formData.phone,
        password: formData.currentPassword,
        newPassword: formData.newPassword
      })
    });
    
    const data = await res.json();
    if (data.success) {
      updateProfile({ name: data.user.name, phone: data.user.phone });
      setMessage({ type: 'success', text: 'Account settings updated successfully!' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } else {
      setMessage({ type: 'error', text: data.error });
    }
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.content}
    >
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Account Settings</h1>
        <p className={styles.pageSubtitle}>Update your personal details and security</p>
      </div>

      <GlassCard animate={false} style={{ padding: '32px', maxWidth: '600px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Personal Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <Input label="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <Input label="Email Address" value={user.email} disabled title="Email cannot be changed" />
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Security (Optional)</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Only fill these fields if you want to change your password.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input type="password" label="Current Password" value={formData.currentPassword} onChange={e => setFormData({...formData, currentPassword: e.target.value})} />
              <Input type="password" label="New Password" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} />
            </div>
          </div>

          {message.text && (
            <div style={{ padding: '12px', background: message.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)', color: message.type === 'error' ? 'red' : 'green', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              {message.text}
            </div>
          )}

          <Button variant="primary" type="submit" disabled={loading} style={{ alignSelf: 'flex-end', marginTop: '8px' }}>
            <Save size={16} style={{ marginRight: '8px' }} />
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </form>
      </GlassCard>
    </motion.div>
  );
}
