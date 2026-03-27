import { useState, useEffect, useMemo } from 'react';
import { getMenu } from '../services/restaurantService.js';

/**
 * Fetches the menu for a restaurant and manages category selection.
 * Returns categories, the active category, its items, and a pre-built
 * itemId → categoryName lookup used by useCart.
 */
export function useMenu(restaurantId) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    getMenu(restaurantId)
      .then((data) => {
        if (cancelled) return;
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].category);
      })
      .catch(() => {
        if (cancelled) return;
        setError('No se pudo cargar el menú. Intentá de nuevo.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [restaurantId]);

  // O(n) map built once per menu load — avoids rebuilding on every render
  const itemCategoryMap = useMemo(() => {
    return categories.reduce((map, cat) => {
      cat.items.forEach((item) => { map[item.id] = cat.category; });
      return map;
    }, {});
  }, [categories]);

  const activeItems = useMemo(
    () => categories.find((c) => c.category === activeCategory)?.items || [],
    [categories, activeCategory]
  );

  const categoryNames = useMemo(
    () => categories.map((c) => c.category),
    [categories]
  );

  return {
    categories,
    categoryNames,
    activeCategory,
    setActiveCategory,
    activeItems,
    itemCategoryMap,
    loading,
    error,
  };
}
