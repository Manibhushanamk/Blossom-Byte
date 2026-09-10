'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Package, Users, Activity } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { orders } = useOrders();
  const { allUsers } = useAuth();

  const totalRevenue = orders ? orders.reduce((sum, order) => sum + order.total, 0) : 0;
  const activeOrders = orders ? orders.filter(o => o.status !== 'Delivered').length : 0;
  const totalCustomers = allUsers ? allUsers.length : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const stats = [
    { id: 1, name: 'Total Revenue', value: formatPrice(totalRevenue), change: 'Live', type: 'increase', icon: IndianRupee },
    { id: 2, name: 'Active Orders', value: activeOrders.toString(), change: 'Live', type: 'increase', icon: Package },
    { id: 3, name: 'Total Customers', value: totalCustomers.toString(), change: 'Live', type: 'increase', icon: Users },
    { id: 4, name: 'Conversion Rate', value: '3.8%', change: '+18.2%', type: 'increase', icon: Activity },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Overview</h1>
          <p className={styles.pageSubtitle}>Welcome back. Here is what's happening with Blossom Byte today.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.datePicker}>Aug 15 - Aug 21</div>
          <button className={styles.exportBtn}>Export Report</button>
        </div>
      </header>

      <motion.div 
        className={styles.statsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.id} variants={itemVariants}>
              <GlassCard className={styles.statCard} animate={false}>
                <div className={styles.statHeader}>
                  <div className={styles.iconWrapper}>
                    <Icon size={18} />
                  </div>
                  <div className={`${styles.badge} ${stat.type === 'increase' ? styles.badgeSuccess : styles.badgeDanger}`}>
                    {stat.type === 'increase' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={styles.statBody}>
                  <h3 className={styles.statValue}>{stat.value}</h3>
                  <p className={styles.statName}>{stat.name}</p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      <div className={styles.mainGrid}>
        <motion.div 
          className={styles.chartSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard className={styles.chartCard} animate={false}>
            <div className={styles.cardHeader}>
              <h2 className={styles.sectionTitle}>Revenue Overview</h2>
              <select className={styles.select}>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className={styles.chartPlaceholder}>
              {/* Premium Chart Placeholder */}
              <svg className={styles.svgLine} viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M0 30 Q 15 10, 30 25 T 60 15 T 100 5 L 100 40 L 0 40 Z" fill="url(#gradient)" opacity="0.1" />
                <path d="M0 30 Q 15 10, 30 25 T 60 15 T 100 5" fill="none" stroke="var(--color-foreground)" strokeWidth="0.5" />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-foreground)" />
                    <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div 
          className={styles.ordersSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard className={styles.ordersCard} animate={false}>
            <div className={styles.cardHeader}>
              <h2 className={styles.sectionTitle}>Recent Orders</h2>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className={styles.orderId}>#104{i}</td>
                      <td>Eleanor F.</td>
                      <td>
                        <span className={`${styles.statusBadge} ${i % 2 === 0 ? styles.statusProcessing : styles.statusDelivered}`}>
                          {i % 2 === 0 ? 'Processing' : 'Delivered'}
                        </span>
                      </td>
                      <td className={styles.orderAmount}>₹{1200 + i * 150}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
