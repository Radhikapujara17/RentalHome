import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const cached = localStorage.getItem('rentnest_wishlist_ids');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // Fetch saved properties from MongoDB when user logs in
  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await api.get('/properties/my/saved');
      if (res.data.success) {
        setWishlist(res.data.properties || []);
        const ids = (res.data.properties || []).map((p) => p._id);
        setSavedIds(ids);
        localStorage.setItem('rentnest_wishlist_ids', JSON.stringify(ids));
      }
    } catch (err) {
      console.warn('Could not sync cloud wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, user]);

  const isSaved = (propertyId) => {
    if (!propertyId) return false;
    return savedIds.includes(propertyId.toString());
  };

  const toggleWishlist = async (property) => {
    if (!property || !property._id) return;
    const propId = property._id.toString();
    const currentlySaved = savedIds.includes(propId);

    // Optimistic UI update
    let nextIds;
    if (currentlySaved) {
      nextIds = savedIds.filter((id) => id !== propId);
      setWishlist((prev) => prev.filter((p) => p._id.toString() !== propId));
      toast('Removed from saved wishlist', { icon: '🤍' });
    } else {
      nextIds = [...savedIds, propId];
      setWishlist((prev) => [property, ...prev]);
      toast.success('Saved to your wishlist! View anytime in Dashboard.', { icon: '❤️' });
    }

    setSavedIds(nextIds);
    localStorage.setItem('rentnest_wishlist_ids', JSON.stringify(nextIds));

    // Sync to MongoDB if authenticated
    if (isAuthenticated) {
      try {
        await api.post(`/properties/${propId}/save`);
      } catch (err) {
        console.error('Failed to sync save status with server', err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        savedIds,
        savedCount: savedIds.length,
        isSaved,
        toggleWishlist,
        refreshWishlist: fetchWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
