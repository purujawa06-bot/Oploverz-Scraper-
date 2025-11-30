import React, { createContext, useContext, useEffect, useState } from 'react';
import { AnimeBase } from '../types';

interface WatchlistItem extends AnimeBase {
  addedAt: number;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (anime: AnimeBase) => void;
  removeFromWatchlist: (link: string) => void;
  isInWatchlist: (link: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('nimestream_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load watchlist", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nimestream_watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error("Failed to save watchlist", error);
    }
  }, [watchlist]);

  const addToWatchlist = (anime: AnimeBase) => {
    setWatchlist((prev) => {
      if (prev.some(item => item.link === anime.link || item.originalLink === anime.originalLink)) {
        return prev;
      }
      return [{ ...anime, addedAt: Date.now() }, ...prev];
    });
  };

  const removeFromWatchlist = (link: string) => {
    setWatchlist((prev) => prev.filter(item => item.link !== link && item.originalLink !== link));
  };

  const isInWatchlist = (link: string) => {
    return watchlist.some(item => item.link === link || item.originalLink === link);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};