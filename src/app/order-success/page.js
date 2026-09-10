'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Package, ArrowRight, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useOrders } from '@/context/OrderContext';
import styles from './page.module.css';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');
  const orderNumber = urlId || `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
  const { getOrder } = useOrders();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={styles.card}
        >
          <div className={styles.iconWrapper}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Check size={40} className={styles.icon} />
            </motion.div>
          </div>
          
          <h1 className={styles.title}>Order Confirmed</h1>
          <p className={styles.subtitle}>
            Thank you for your purchase. Your luxury floral arrangement is being prepared with the utmost care.
          </p>
          
          <div className={styles.orderDetails}>
            <div className={styles.detailRow}>
              <span>Order Number</span>
              <strong>{orderNumber}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Date</span>
              <strong>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Payment Method</span>
              <strong>Secure Checkout</strong>
            </div>
          </div>

          <div className={styles.tracking}>
            <Package size={20} className={styles.trackingIcon} />
            <p>You will receive an email confirmation with tracking details once your order ships.</p>
          </div>

          <div className={styles.actions}>
            <Button 
              variant="secondary" 
              className={styles.fullWidth} 
              onClick={() => {
                const orderData = getOrder(orderNumber);
                let doc = `Invoice for ${orderNumber}\n\n`;
                if (orderData) {
                  doc += `Date: ${new Date(orderData.date || Date.now()).toLocaleDateString()}\n`;
                  if (orderData.userDetails) {
                    doc += `Billed To: ${orderData.userDetails.firstName} ${orderData.userDetails.lastName}\n`;
                    doc += `Address: ${orderData.userDetails.address}, ${orderData.userDetails.city}\n\n`;
                  }
                  doc += `Items:\n`;
                  orderData.cartDetails?.forEach(item => {
                    doc += `- ${item.quantity}x ${item.product.name} (₹${item.product.price})\n`;
                  });
                  doc += `\nTotal: ₹${orderData.total}.00\nStatus: Paid\n\nThank you for choosing Blossom Byte!`;
                } else {
                  doc = `Invoice for ${orderNumber}\n\nTotal: ₹${Math.floor(Math.random() * 5000) + 1000}.00\nStatus: Paid\n\nThank you for choosing Blossom Byte!`;
                }
                const blob = new Blob([doc], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Invoice-${orderNumber}.txt`;
                a.click();
              }}
            >
              <Download size={16} /> Download Invoice
            </Button>
            <Link href="/orders" style={{ flex: 1 }}>
              <Button variant="secondary" className={styles.fullWidth}>View Orders</Button>
            </Link>
            <Link href="/categories" style={{ flex: 1 }}>
              <Button variant="primary" className={styles.fullWidth}>
                Shop More <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
