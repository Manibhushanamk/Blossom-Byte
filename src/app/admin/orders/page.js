'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { useOrders } from '@/context/OrderContext';
import { Search } from 'lucide-react';
import styles from '../products/page.module.css';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = (orders || []).filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <h1 className={styles.pageTitle}>Orders Management</h1>
          <p className={styles.pageSubtitle}>Process and track customer orders.</p>
        </div>
      </header>

      <GlassCard className={styles.filtersCard} animate={false}>
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className={styles.tableCard} animate={false}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className={styles.skuCell}>{order.id}</td>
                  <td>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>{order.items} Items</td>
                  <td className={styles.priceCell}>{formatPrice(order.total)}</td>
                  <td>
                    <span className={`${styles.stockBadge} ${order.status === 'Delivered' ? styles.stockGood : (order.status === 'Processing' ? styles.stockLow : '')}`} style={order.status === 'Shipped' ? {background: 'rgba(212,175,55,0.1)', color: '#d4af37'} : {}}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-surface-glass-white)', fontFamily: 'var(--font-primary)' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className={styles.emptyState}>
              <p>No orders found.</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
