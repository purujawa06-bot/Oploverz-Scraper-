import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { animeService } from '../services/api';
import { SearchResultItem } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { Skeleton } from '../components/Skeleton';

export const SearchPage: React.FC = () => {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await animeService.search(query);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Hasil Pencarian untuk <span className="text-indigo-500">"{query}"</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {results.map((anime, idx) => (
            <AnimeCard
              key={idx}
              title={anime.title}
              image={anime.poster || ''}
              link={anime.originalLink || anime.link}
              subtitle={anime.status || (anime.score ? `Skor: ${anime.score}` : '')}
              overlayText={anime.type}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-slate-400">Tidak ada hasil ditemukan.</p>
        </div>
      )}
    </div>
  );
};