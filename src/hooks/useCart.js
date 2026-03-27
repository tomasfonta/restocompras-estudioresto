import { useState, useCallback, useMemo } from 'react';

/**
 * Manages all cart state and operations.
 * Keeps App.jsx clean by centralising cart logic here.
 */
export function useCart(itemCategoryMap) {
  const [cartItems, setCartItems] = useState([]);

  const addItem = useCallback((item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { ...item, quantity: 1, comment: '', category: itemCategoryMap[item.id] || '' },
      ];
    });
  }, [itemCategoryMap]);

  const removeItem = useCallback((item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((i) => i.id !== item.id);
      return prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  const updateComment = useCallback((itemId, comment) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, comment } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const getQuantity = useCallback(
    (itemId) => cartItems.find((i) => i.id === itemId)?.quantity || 0,
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  return { cartItems, addItem, removeItem, updateComment, clearCart, getQuantity, totalItems };
}
