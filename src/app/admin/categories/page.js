'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Grid, Trash2, Edit2 } from 'lucide-react';
import styles from '../page.module.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        if (data.isOffline) {
          const stored = localStorage.getItem('blossom_offline_categories');
          if (stored) {
             setCategories(JSON.parse(stored));
          } else {
             setCategories(data.categories);
             localStorage.setItem('blossom_offline_categories', JSON.stringify(data.categories));
          }
        } else {
          setCategories(data.categories);
        }
      }
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const payload = editingId ? { _id: editingId, ...formData } : formData;

    const res = await fetch('/api/categories', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    
    if (data.success) {
      if (data.isOffline) {
        const newCat = { ...payload, slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
        if (!editingId) newCat._id = 'offline-' + Date.now();
        
        setCategories(prev => {
          const updated = editingId 
            ? prev.map(c => c._id === editingId ? { ...c, ...newCat } : c)
            : [newCat, ...prev];
          localStorage.setItem('blossom_offline_categories', JSON.stringify(updated));
          return updated;
        });
      } else {
        fetchCategories();
      }
      setFormData({ name: '', description: '', image: '' });
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
       if (data.isOffline) {
         setCategories(prev => {
           const updated = prev.filter(c => c._id !== id);
           localStorage.setItem('blossom_offline_categories', JSON.stringify(updated));
           return updated;
         });
       } else {
         fetchCategories();
       }
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({ name: cat.name, description: cat.description || '', image: cat.image || '' });
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSubtitle}>Manage your store's collections</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Editor Panel */}
        <GlassCard animate={false} style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Category Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <Input label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <Input label="Image URL (Optional)" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {editingId && (
                <Button variant="secondary" onClick={() => { setEditingId(null); setFormData({name:'', description:'', image:''}); }} type="button" style={{ flex: 1 }}>
                  Cancel
                </Button>
              )}
              <Button variant="primary" type="submit" style={{ flex: 1 }}>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* List Panel */}
        <GlassCard animate={false} style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Existing Categories</h3>
          {loading ? <p>Loading...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map(cat => (
                <div key={cat._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grid size={20} />
                      </div>
                    )}
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{cat.name}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>/{cat.slug}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(cat)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: '8px' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(cat._id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: '8px' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <p style={{ color: 'var(--color-text-secondary)' }}>No categories found.</p>}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
