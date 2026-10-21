import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [shortlist, setShortlist] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (property) => {
    const exists = shortlist.some((p) => p._id === property._id);
    if (exists) {
      setShortlist(shortlist.filter((p) => p._id !== property._id));
      toast('Removed from comparison', { icon: '🗑️' });
    } else {
      if (shortlist.length >= 3) {
        toast.error('You can compare a maximum of 3 properties at a time');
        return;
      }
      setShortlist([...shortlist, property]);
      toast.success(`Added to compare (${shortlist.length + 1}/3)`);
    }
  };

  const removeFromCompare = (propertyId) => {
    setShortlist(shortlist.filter((p) => p._id !== propertyId));
  };

  const clearCompare = () => {
    setShortlist([]);
  };

  const isCompared = (propertyId) => {
    return shortlist.some((p) => p._id === propertyId);
  };

  return (
    <CompareContext.Provider
      value={{
        shortlist,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
        isCompareModalOpen,
        setIsCompareModalOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
