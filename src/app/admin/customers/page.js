'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Users, Mail, Phone, Shield, Calendar, Trash2 } from 'lucide-react';
import styles from '../page.module.css';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCustomers(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to permanently delete the account for ${name}?`)) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCustomers(prev => prev.filter(c => c._id !== id));
      }
    } catch(e) {}
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Customers</h1>
          <p className={styles.pageSubtitle}>View all registered users and their details</p>
        </div>
      </header>

      <GlassCard animate={false} style={{ padding: '24px' }}>
        {loading ? <p>Loading customers...</p> : (
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {customers.map(user => (
              <div key={user._id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>{user.name}</h4>
                      <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', marginTop: '4px', display: 'inline-block' }}>
                        {user.tier || 'Silver'} Member
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {user.isAdmin && (
                      <Shield size={16} style={{ color: 'var(--color-primary)' }} title="Administrator" />
                    )}
                    <button onClick={() => handleDelete(user._id, user.name)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete User">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {user.email}</div>
                  {user.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {user.phone}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
            {customers.length === 0 && <p style={{ color: 'var(--color-text-secondary)' }}>No customers found.</p>}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
