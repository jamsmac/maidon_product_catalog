import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing product comparison functionality
 * Stores data in localStorage for persistence across sessions
 */
export const useComparison = () => {
  const MAX_COMPARISON_ITEMS = 4; // Limit to 4 products for better UX

  // Initialize from localStorage
  const [comparisonItems, setComparisonItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mydon_comparison');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading comparison from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever comparison changes
  useEffect(() => {
    try {
      localStorage.setItem('mydon_comparison', JSON.stringify(comparisonItems));
    } catch (error) {
      console.error('Error saving comparison to localStorage:', error);
    }
  }, [comparisonItems]);

  // Add item to comparison
  const addToComparison = useCallback((product) => {
    setComparisonItems(prev => {
      // Check if already in comparison
      if (prev.some(item => item.id === product.id)) {
        return prev; // Already in comparison, return unchanged
      }

      // Check if limit reached
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        console.warn(`Cannot add more than ${MAX_COMPARISON_ITEMS} products to comparison`);
        return prev;
      }

      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        specifications: product.specifications || {},
        inStock: product.inStock || false,
        rating: product.rating || 0,
        brand: product.brand || '',
        addedAt: new Date().toISOString()
      }];
    });
  }, []);

  // Remove item from comparison
  const removeFromComparison = useCallback((productId) => {
    setComparisonItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  // Toggle item in comparison (add if not present, remove if present)
  const toggleComparison = useCallback((product) => {
    setComparisonItems(prev => {
      const isInComparison = prev.some(item => item.id === product.id);

      if (isInComparison) {
        // Remove from comparison
        return prev.filter(item => item.id !== product.id);
      } else {
        // Check if limit reached
        if (prev.length >= MAX_COMPARISON_ITEMS) {
          console.warn(`Cannot add more than ${MAX_COMPARISON_ITEMS} products to comparison`);
          return prev;
        }

        // Add to comparison
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          specifications: product.specifications || {},
          inStock: product.inStock || false,
          rating: product.rating || 0,
          brand: product.brand || '',
          addedAt: new Date().toISOString()
        }];
      }
    });
  }, []);

  // Check if product is in comparison
  const isInComparison = useCallback((productId) => {
    return comparisonItems.some(item => item.id === productId);
  }, [comparisonItems]);

  // Clear entire comparison
  const clearComparison = useCallback(() => {
    setComparisonItems([]);
  }, []);

  // Get comparison count
  const comparisonCount = comparisonItems.length;

  // Check if comparison is full (limit reached)
  const isComparisonFull = comparisonCount >= MAX_COMPARISON_ITEMS;

  // Check if can add more items
  const canAddMore = comparisonCount < MAX_COMPARISON_ITEMS;

  // Get all unique specification keys across all products
  const getAllSpecKeys = useCallback(() => {
    const keySet = new Set();
    comparisonItems.forEach(item => {
      if (item.specifications) {
        Object.keys(item.specifications).forEach(key => {
          keySet.add(key);
        });
      }
    });
    return Array.from(keySet);
  }, [comparisonItems]);

  // Get comparison table data
  const getComparisonTableData = useCallback(() => {
    if (comparisonItems.length === 0) return { headers: [], rows: [] };

    const headers = [...comparisonItems.map(item => item.name)];
    const specKeys = getAllSpecKeys();

    // Create rows for each specification
    const rows = specKeys.map(key => {
      const cells = comparisonItems.map(item => {
        const value = item.specifications?.[key];
        return {
          value: value || '-',
          productId: item.id,
          highlight: false // Can be enhanced to highlight differences
        };
      });

      return {
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        cells
      };
    });

    // Add price row
    rows.push({
      key: 'price',
      label: 'Цена',
      cells: comparisonItems.map(item => ({
        value: `${item.price ? item.price.toLocaleString() : 'N/A'} UZS`,
        productId: item.id,
        highlight: false
      }))
    });

    // Add in stock row
    rows.push({
      key: 'inStock',
      label: 'В наличии',
      cells: comparisonItems.map(item => ({
        value: item.inStock ? 'Да' : 'Нет',
        productId: item.id,
        highlight: false
      }))
    });

    // Add brand row
    rows.push({
      key: 'brand',
      label: 'Бренд',
      cells: comparisonItems.map(item => ({
        value: item.brand || '-',
        productId: item.id,
        highlight: false
      }))
    });

    // Add rating row
    rows.push({
      key: 'rating',
      label: 'Рейтинг',
      cells: comparisonItems.map(item => ({
        value: item.rating ? `${item.rating}/5` : '-',
        productId: item.id,
        highlight: false
      }))
    });

    return {
      headers,
      rows,
      products: comparisonItems
    };
  }, [comparisonItems, getAllSpecKeys]);

  // Get comparison items sorted by addition date
  const sortedComparisonItems = [...comparisonItems].sort((a, b) =>
    new Date(a.addedAt) - new Date(b.addedAt)
  );

  // Get comparison items by category
  const getComparisonByCategory = useCallback((category) => {
    return comparisonItems.filter(item => item.category === category);
  }, [comparisonItems]);

  // Import comparison (useful for login sync)
  const importComparison = useCallback((importedComparison) => {
    // Respect the limit when importing
    const limitedComparison = importedComparison.slice(0, MAX_COMPARISON_ITEMS);
    setComparisonItems(limitedComparison);
  }, []);

  // Export comparison (useful for backup)
  const exportComparison = useCallback(() => {
    return comparisonItems;
  }, [comparisonItems]);

  return {
    comparisonItems,
    comparisonCount,
    maxItems: MAX_COMPARISON_ITEMS,
    isComparisonFull,
    canAddMore,
    sortedComparisonItems,
    addToComparison,
    removeFromComparison,
    toggleComparison,
    isInComparison,
    clearComparison,
    getComparisonByCategory,
    getAllSpecKeys,
    getComparisonTableData,
    importComparison,
    exportComparison
  };
};

// HOC to add comparison support to any component
export const withComparison = (Component) => {
  return function ComparisonWrappedComponent(props) {
    const comparison = useComparison();
    return <Component {...props} comparison={comparison} />;
  };
};
