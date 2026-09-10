'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import styles from './page.module.css';

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formData, setFormData] = useState({});
  const { products, deleteProduct, updateProduct, addProduct } = useProducts();

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price, stock: product.stock, image: product.image });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await updateProduct(editingProduct.id, formData);
    setEditingProduct(null);
  };

  const handleAddClick = () => {
    setFormData({ name: '', price: '', stock: '', image: '', category: CATEGORIES[0].id });
    setIsAddingProduct(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    await addProduct({ 
       ...formData, 
       price: Number(formData.price), 
       stock: Number(formData.stock),
       sku: 'NEW-' + Math.floor(Math.random() * 10000),
       description: 'New product',
       features: [],
       isFeatured: false 
    });
    setIsAddingProduct(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Products Inventory</h1>
          <p className={styles.pageSubtitle}>Manage your floral collections, stock, and pricing.</p>
        </div>
        <Button variant="primary" onClick={handleAddClick}>
          <Plus size={18} /> Add New Product
        </Button>
      </header>

      <GlassCard className={styles.filtersCard} animate={false}>
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by name or SKU..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterWrapper}>
            <Filter size={18} className={styles.filterIcon} />
            <select 
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      <GlassCard className={styles.tableCard} animate={false}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className={styles.productCell}>
                    <img src={product.image} alt={product.name} className={styles.thumbnail} loading="lazy" />
                    <span className={styles.productName}>{product.name}</span>
                  </td>
                  <td className={styles.skuCell}>{product.sku}</td>
                  <td>
                    <span className={styles.categoryBadge}>
                      {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td className={styles.priceCell}>{formatPrice(product.price)}</td>
                  <td>
                    <span className={`${styles.stockBadge} ${product.stock < 10 ? styles.stockLow : styles.stockGood}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.editBtn} aria-label="Edit" onClick={() => handleEditClick(product)}>
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className={styles.deleteBtn} 
                        aria-label="Delete"
                        onClick={() => {
                          if(confirm(`Are you sure you want to delete ${product.name}?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className={styles.emptyState}>
              <p>No products found matching your filters.</p>
            </div>
          )}
        </div>
      </GlassCard>

      {editingProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <GlassCard style={{ padding: '32px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '24px' }}>Edit {editingProduct.name}</h2>
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Stock Amount</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Image URL</label>
                <input required type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Button variant="secondary" onClick={() => setEditingProduct(null)} type="button" style={{ flex: 1 }}>Cancel</Button>
                <Button variant="primary" type="submit" style={{ flex: 1 }}>Save Changes</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {isAddingProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <GlassCard style={{ padding: '32px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '24px' }}>Add New Product</h2>
            <form onSubmit={handleSaveAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Stock Amount</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Image URL</label>
                <input required type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Button variant="secondary" onClick={() => setIsAddingProduct(false)} type="button" style={{ flex: 1 }}>Cancel</Button>
                <Button variant="primary" type="submit" style={{ flex: 1 }}>Create Product</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
