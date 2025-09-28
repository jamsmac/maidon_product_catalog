import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing wishlist functionality
 * Stores data in localStorage for persistence across sessions
 */
export const useWishlist = () => {
  // Initialize from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('mydon_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('mydon_wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  // Add item to wishlist
  const addToWishlist = useCallback((product) => {
    setWishlist(prev => {
      // Check if already in wishlist
      if (prev.some(item => item.id === product.id)) {
        return prev; // Already in wishlist, return unchanged
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        addedAt: new Date().toISOString()
      }];
    });
  }, []);

  // Remove item from wishlist
  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  }, []);

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(item => item.id === product.id);

      if (isInWishlist) {
        // Remove from wishlist
        return prev.filter(item => item.id !== product.id);
      } else {
        // Add to wishlist
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          addedAt: new Date().toISOString()
        }];
      }
    });
  }, []);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  // Get wishlist count
  const wishlistCount = wishlist.length;

  // Get total value of wishlist
  const wishlistTotal = wishlist.reduce((total, item) => total + (item.price || 0), 0);

  // Get products sorted by addition date (newest first)
  const sortedWishlist = [...wishlist].sort((a, b) =>
    new Date(b.addedAt) - new Date(a.addedAt)
  );

  // Get wishlist by category
  const getWishlistByCategory = useCallback((category) => {
    return wishlist.filter(item => item.category === category);
  }, [wishlist]);

  // Import wishlist (useful for login sync)
  const importWishlist = useCallback((importedWishlist) => {
    setWishlist(importedWishlist);
  }, []);

  // Export wishlist (useful for backup)
  const exportWishlist = useCallback(() => {
    return wishlist;
  }, [wishlist]);

  return {
    wishlist,
    wishlistCount,
    wishlistTotal,
    sortedWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistByCategory,
    importWishlist,
    exportWishlist
  };
};

// HOC to add wishlist support to any component
export const withWishlist = (Component) => {
  return function WishlistWrappedComponent(props) {
    const wishlist = useWishlist();
    return <Component {...props} wishlist={wishlist} />;
  };
};
