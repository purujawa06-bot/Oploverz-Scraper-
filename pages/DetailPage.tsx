import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { animeService, extractPath } from '../services/api';
import { AnimeDetail, Episode } from '../types';
import { Play, Calendar, Info, Film, Layers, Heart, Check } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export const DetailPage: React.FC = () => {
  const [data, setData] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const url = searchParams.get('url');

      if (url) {
        try {
          const result = await animeService.getDetail(url);
          setData(result);
          document.title = `${result.title} - NimeStream`;
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
      setLoading(false);
    };

    fetchDetail();
    
    // Cleanup title on unmount
    return () => {
      document.title = 'NimeStream - Watch Anime Online Free';
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!data) return <div className="text-center p-10 text-xl text-slate-400">Anime not found or error loading data.</div>;

  const currentUrl = new URLSearchParams(location.search).get('url') || '';
  const isSaved = isInWatchlist(currentUrl);

  const handleWatchlistToggle = () => {
    if (isSaved) {
      removeFromWatchlist(currentUrl);
    } else {
      addToWatchlist({
        title: data.title,
        image: data.poster,
        poster: data.poster,
        link: currentUrl,
        originalLink: currentUrl
      });
    }
  };

  return (
    <div className="pb-16">
      {/* Hero Header */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-slate-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-sm opacity-30" 
          style={{ backgroundImage: `url(${data.poster})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8 flex flex-col md:flex-row items-end gap-8">
            {/* Poster Card */}
            <div className="hidden md:block w-48 lg:w-56 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl border-4 border-slate-800 -mb-16 z-10 bg-slate-800">
                <img src={data.poster} alt={data.title} className="w-full h-auto object-cover" />
            </div>
            
            <div className="flex-1 mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                  {data.title}
                </h1>
                <h2 className="text-lg text-slate-300 italic mb-4">{data.japanese_title}</h2>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {data.information?.genres?.map((g, i) => (
                      <span key={i} className="bg-indigo-600/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                        {g}
                      </span>
                    ))}
                    <span className="bg-slate-700/80 text-slate-200 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                      {data.information?.status}
                    </span>
                    <span className="bg-slate-700/80 text-slate-200 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                      {data.information?.studio}
                    </span>
                  </div>
                </div>

                 {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={handleWatchlistToggle}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${
                      isSaved 
                        ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20' 
                        : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {isSaved ? <Check size={18} /> : <Heart size={18} className={isSaved ? "fill-current" : ""} />}
                    {isSaved ? 'In Watchlist' : 'Add to Watchlist'}
                  </button>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Mobile Poster (visible only on small screens) */}
          <div className="md:hidden flex justify-center mb-6">
             <img src={data.poster} alt={data.title} className="w-48 rounded-lg shadow-xl" />
          </div>

          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="text-indigo-500" size={20} /> Synopsis
            </h3>
            <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              {data.description || "No description available."}
            </p>
          </section>

          <section>
             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="text-indigo-500" size={20} /> Episodes
            </h3>
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-2 max-h-[600px] overflow-y-auto">
              {!data.episodes || data.episodes.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No episodes available yet.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.episodes?.map((ep, idx) => (
                    <Link 
                      key={idx} 
                      to={`/stream?url=${encodeURIComponent(extractPath(ep.originalLink || ep.link))}`}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-transparent transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Play size={16} className="ml-1" />
                        </div>
                        <div>
                           <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {ep.quality || `Episode ${data.episodes!.length - idx}`}
                           </div>
                           <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <Calendar size={12} /> {ep.release_date}
                           </div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold bg-slate-900 text-slate-400 px-2 py-1 rounded group-hover:bg-indigo-900 group-hover:text-indigo-200">
                        Watch
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Film className="text-indigo-500" size={18} /> Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Type</span>
                <span className="text-slate-200">TV Series</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Studio</span>
                <span className="text-slate-200">{data.information?.studio}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Status</span>
                <span className="text-slate-200">{data.information?.status}</span>
              </div>
               <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Episodes</span>
                <span className="text-slate-200">{data.episodes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};