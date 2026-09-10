'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fetch live orders from MongoDB
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
        setIsLoaded(true);
      })
      .catch(err => {
        console.error('Failed to load orders:', err);
        setIsLoaded(true);
      });
  }, []);

  const placeOrder = async (items, total, userDetails) => {
    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const newOrderPayload = {
      id: orderId,
      items: items.reduce((acc, item) => acc + item.quantity, 0),
      cartDetails: items,
      total: total,
      userDetails: userDetails
    };
    
    // Optimistic update for frontend
    const tempOrder = { ...newOrderPayload, date: new Date().toISOString(), status: 'Processing' };
    setOrders(prev => [tempOrder, ...prev]);
    
    // Save to MongoDB
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderPayload)
      });
    } catch(e) {
      console.error('Failed to sync order', e);
    }
    
    return orderId;
  };

  const getOrder = (orderId) => {
    return orders.find(o => o.id === orderId) || null;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // Sync to MongoDB
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
    } catch(e) {
      console.error('Failed to update status', e);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrder, updateOrderStatus, isLoaded }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
