'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Settings, Save } from 'lucide-react';
import styles from '../page.module.css'; // Reuse dashboard styles

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    websiteName: '',
    currency: '',
    deliveryFee: 0,
    freeDeliveryThreshold: 0,
    gstRate: 0,
    contactEmail: '',
    contactPhone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Error saving settings: ' + data.error);
      }
    } catch (err) {
      setMessage('Network error occurred.');
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleClearAdmin = () => {
    if (confirm('Are you sure you want to delete the Admin session from this browser? You will be logged out.')) {
      localStorage.removeItem('blossom_user');
      localStorage.removeItem('blossom_token');
      window.location.href = '/login';
    }
  };

  const handleDisconnectDB = async () => {
    if (confirm('Are you sure you want to disconnect the database? The app will revert to Offline Mode.')) {
      const res = await fetch('/api/setup/reset', { method: 'POST' });
      if (res.ok) {
        alert('Database disconnected successfully.');
        window.location.reload();
      } else {
        alert('Failed to disconnect database.');
      }
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading settings...</div>;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>System Settings</h1>
          <p className={styles.pageSubtitle}>Manage global application configurations.</p>
        </div>
      </header>

      <GlassCard animate={false} style={{ maxWidth: '800px', padding: '32px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} /> General Branding
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input label="Website Name" value={settings.websiteName} onChange={(e) => handleChange('websiteName', e.target.value)} />
              <Input label="Currency (e.g. INR, USD)" value={settings.currency} onChange={(e) => handleChange('currency', e.target.value)} />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '16px' }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input label="Support Email" type="email" value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} />
              <Input label="Support Phone" value={settings.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '16px' }}>Ecommerce Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <Input label="Flat Delivery Fee" type="number" value={settings.deliveryFee} onChange={(e) => handleChange('deliveryFee', Number(e.target.value))} />
              <Input label="Free Delivery Threshold" type="number" value={settings.freeDeliveryThreshold} onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))} />
              <Input label="GST Rate (Decimal, e.g. 0.18)" type="number" step="0.01" value={settings.gstRate} onChange={(e) => handleChange('gstRate', Number(e.target.value))} />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>Danger Zone</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,0,0,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,0,0,0.1)' }}>
              <div>
                <h4 style={{ marginBottom: '8px' }}>Delete Admin Session</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Wipes the current admin account from local storage.</p>
                <Button type="button" variant="secondary" onClick={handleClearAdmin} style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>Clear Admin Cache</Button>
              </div>
              <div>
                <h4 style={{ marginBottom: '8px' }}>Disconnect Database</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Wipes the MongoDB config and reverts to Offline Mode.</p>
                <Button type="button" variant="secondary" onClick={handleDisconnectDB} style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>Delete Database Connection</Button>
              </div>
            </div>
          </div>

          {message && (
            <div style={{ padding: '12px', background: message.includes('Error') ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)', color: message.includes('Error') ? 'red' : 'green', borderRadius: '8px' }}>
              {message}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button type="submit" variant="primary" disabled={saving}>
              <Save size={16} style={{ marginRight: '8px' }} />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
