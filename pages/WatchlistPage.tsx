import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { AnimeCard } from '../components/AnimeCard';
import { Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WatchlistPage: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-rose-500 fill-rose-500" size={32} />
        <h1 className="text-3xl font-bold text-white">Daftar Tontonan Anda</h1>
        <span className="bg-slate-800 text-slate-300 text-sm px-3 py-1 rounded-full font-mono">
          {watchlist.length}
        </span>
      </div>

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {watchlist.map((anime, idx) => (
            <div key={idx} className="relative group">
              <AnimeCard
                title={anime.title}
                image={anime.image || anime.poster || ''}
                link={anime.originalLink || anime.link}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromWatchlist(anime.originalLink || anime.link);
                }}
                className="absolute top-2 right-2 bg-rose-600/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-20"
                title="Hapus dari Favorit"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
          <Heart className="text-slate-700 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-slate-300 mb-2">Daftar tontonan Anda kosong</h2>
          <p className="text-slate-500 mb-6 max-w-md">
            Mulai tambahkan anime yang ingin Anda tonton dengan mengklik ikon hati pada kartu anime.
          </p>
          <Link 
            to="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Jelajahi Anime
          </Link>
        </div>
      )}
    </div>
  );
};