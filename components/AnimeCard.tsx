import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import { extractPath } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';

interface AnimeCardProps {
  title: string;
  image: string;
  link: string;
  subtitle?: string; // Can be episode number, status, etc.
  overlayText?: string; // Top left overlay (e.g. Rating)
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ title, image, link, subtitle, overlayText }) => {
  const path = extractPath(link);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  // Check if the path contains 'episode' to decide whether to go to stream or detail page
  const isEpisode = path.toLowerCase().includes('episode');
  const to = isEpisode 
    ? `/stream?url=${encodeURIComponent(path)}` 
    : `/detail?url=${encodeURIComponent(path)}`;

  const isSaved = isInWatchlist(link);

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeFromWatchlist(link);
    } else {
      addToWatchlist({
        title,
        image,
        link,
        originalLink: link
      });
    }
  };

  return (
    <Link to={to} className="group relative block bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={image || 'https://picsum.photos/300/450?blur=2'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
          <div className="bg-indigo-600 rounded-full p-4 shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
            <Play className="fill-white text-white ml-1" size={24} />
          </div>
        </div>

        {/* Watchlist Toggle Button */}
        <button 
          onClick={handleToggleWatchlist}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <Heart 
            size={16} 
            className={`transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white hover:text-rose-400'}`} 
          />
        </button>

        {overlayText && (
          <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            {overlayText}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm md:text-base text-slate-100 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
};