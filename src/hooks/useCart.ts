import { useState, useEffect, useCallback } from 'react';
import type { CartItem, Product } from '@/types';

const STORAGE_KEY = 'kbc-cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  }, []);

  const addToCart = useCallback(
    (product: Product, size: string) => {
      setItems((prev) => {
        const existing = prev.find(
          (item) => item.id === product.id && item.selectedSize === size
        );
        let next: CartItem[];
        if (existing) {
          next = prev.map((item) =>
            item.id === product.id && item.selectedSize === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          next = [...prev, { ...product, quantity: 1, selectedSize: size }];
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (id: number, size: string) => {
      persist(
        items.filter((item) => !(item.id === id && item.selectedSize === size))
      );
    },
    [items, persist]
  );

  const updateQuantity = useCallback(
    (id: number, size: string, delta: number) => {
      persist(
        items
          .map((item) => {
            if (item.id === id && item.selectedSize === size) {
              const nextQty = item.quantity + delta;
              return nextQty <= 0 ? null : { ...item, quantity: nextQty };
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
      );
    },
    [items, persist]
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return {
    items,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}
