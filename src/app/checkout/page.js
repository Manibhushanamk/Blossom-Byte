'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './page.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, total, subtotal, gst, delivery, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: (user?.name && user.name.split(' ')[1]) || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0]?.address || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    pin: user?.addresses?.[0]?.pin || '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalTotal = total - discountAmount;
    const orderId = await placeOrder(cartItems, finalTotal, formData);
    
    setIsSuccess(true);
    clearCart();
    setIsProcessing(false);
    router.push(`/order-success?id=${orderId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME10') {
      setDiscountAmount(subtotal * 0.10);
    } else {
      setDiscountAmount(0);
      alert('Invalid coupon code');
    }
  };

  const finalTotal = total - discountAmount;

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      router.push('/cart');
    }
  }, [cartItems, router, isSuccess]);

  if (cartItems.length === 0 && !isSuccess) {
    return null;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Secure Checkout</h1>
        
        <form onSubmit={handleSubmit} className={styles.layout}>
          <div className={styles.checkoutForm}>
            
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Contact Information</h2>
              <div className={styles.grid}>
                <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Shipping Address</h2>
              <Input label="Street Address" name="address" value={formData.address} onChange={handleChange} required className={styles.fullWidth} />
              <div className={styles.grid}>
                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
                <Input label="PIN Code" name="pin" value={formData.pin} onChange={handleChange} required />
                <Input label="Country" defaultValue="India" disabled />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Payment Method</h2>
              <div className={styles.paymentMethods}>
                <label className={styles.paymentMethod}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className={styles.methodContent}>
                    <CreditCard size={20} />
                    <span>Credit / Debit Card</span>
                  </div>
                </label>
                <label className={styles.paymentMethod}>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className={styles.methodContent}>
                    <span className={styles.upiIcon}>UPI</span>
                    <span>UPI / QR</span>
                  </div>
                </label>
                <label className={styles.paymentMethod}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className={styles.methodContent}>
                    <span style={{fontWeight: 'bold', fontSize: '18px'}}>₹</span>
                    <span>Cash on Delivery</span>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className={styles.cardDetails}>
                  <Input label="Card Number" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" maxLength="19" required />
                  <div className={styles.grid}>
                    <Input label="Expiry (MM/YY)" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="MM/YY" maxLength="5" required />
                    <Input label="CVV" name="cvv" value={formData.cvv} onChange={handleChange} type="password" maxLength="3" required />
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className={styles.orderSummary}>
            <h2 className={styles.summaryTitle}>In Your Bag</h2>
            
            <div className={styles.itemList}>
              {cartItems.map((item) => (
                <div key={item.product.id} className={styles.summaryItem}>
                  <div className={styles.itemImageWrapper}>
                    <img src={item.product.image} alt={item.product.name} />
                    <span className={styles.itemBadge}>{item.quantity}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.product.name}</span>
                    <span className={styles.itemPrice}>{formatPrice(item.product.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>GST (18%)</span>
                <span>{formatPrice(gst)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span>{delivery === 0 ? 'Free' : formatPrice(delivery)}</span>
              </div>
              {discountAmount > 0 && (
                <div className={styles.summaryRow} style={{ color: 'var(--color-secondary)' }}>
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              
              <div className={styles.couponSection} style={{ display: 'flex', gap: '8px', marginTop: '16px', marginBottom: '8px' }}>
                <Input placeholder="Coupon Code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <Button variant="secondary" type="button" onClick={applyCoupon}>Apply</Button>
              </div>

              <div className={styles.totalRow}>
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              type="submit" 
              className={styles.submitBtn}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Pay ${formatPrice(finalTotal)}`}
            </Button>

            <div className={styles.securityNote}>
              <CheckCircle2 size={16} />
              <span>Payments are secure and encrypted.</span>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
