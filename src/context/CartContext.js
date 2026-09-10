'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { user } = useAuth();
  const storageKey = `blossom_cart_${user ? user.email : 'guest'}`;

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded, storageKey]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discount 
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  // 18% GST calculation (Standard for luxury goods/services in India)
  const gst = subtotal * 0.18;
  const delivery = subtotal > 1500 ? 0 : 150;
  const total = subtotal + gst + delivery;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      gst,
      delivery,
      total,
      itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
