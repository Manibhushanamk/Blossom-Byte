'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { MapPin, Trash2, Plus, Home, Briefcase } from 'lucide-react';
import styles from '../page.module.css';

export default function AddressesPage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ type: 'Home', address: '', city: '', state: '', pin: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/users/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, address: formData })
    });
    const data = await res.json();
    if (data.success) {
      updateProfile({ addresses: data.addresses });
      setFormData({ type: 'Home', address: '', city: '', state: '', pin: '' });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    const res = await fetch(`/api/users/addresses?email=${encodeURIComponent(user.email)}&id=${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.success) {
      updateProfile({ addresses: data.addresses });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.content}
    >
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Saved Addresses</h1>
        <p className={styles.pageSubtitle}>Manage your delivery locations</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <GlassCard animate={false} style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Add New Address</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="radio" name="type" checked={formData.type === 'Home'} onChange={() => setFormData({...formData, type: 'Home'})} />
                <Home size={16} /> Home
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="radio" name="type" checked={formData.type === 'Work'} onChange={() => setFormData({...formData, type: 'Work'})} />
                <Briefcase size={16} /> Work
              </label>
            </div>
            
            <Input label="Street Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input label="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              <Input label="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
            </div>
            
            <Input label="PIN / ZIP Code" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} required />

            <Button variant="primary" type="submit" disabled={loading} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
              <Plus size={16} style={{ marginRight: '8px' }} />
              {loading ? 'Saving...' : 'Save Address'}
            </Button>
          </form>
        </GlassCard>

        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {user?.addresses?.map(addr => (
            <div key={addr._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-primary)' }}>
                {addr.type === 'Work' ? <Briefcase size={18} /> : <Home size={18} />}
                <span style={{ fontWeight: '600' }}>{addr.type} Address</span>
              </div>
              <p style={{ margin: '0 0 4px', lineHeight: '1.5' }}>{addr.address}</p>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                {addr.city}, {addr.state} {addr.pin}
              </p>
              
              <button 
                onClick={() => handleDelete(addr._id)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,0,0,0.1)', border: 'none', color: 'red', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {(!user?.addresses || user.addresses.length === 0) && (
            <p style={{ color: 'var(--color-text-secondary)' }}>You haven't saved any addresses yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
