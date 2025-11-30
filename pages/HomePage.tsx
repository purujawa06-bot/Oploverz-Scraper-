import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { animeService, extractPath } from '../services/api';
import { HomeResult } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { Play, Flame, Clock, PlusCircle } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';

export const HomePage: React.FC = () => {
  const [data, setData] = useState<HomeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await animeService.getHome();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!data?.carousel?.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.carousel.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data?.carousel]);

  if (loading) {
    return (
      <div className="space-y-12 pb-10">
        {/* Carousel Skeleton */}
        <div className="relative h-[400px] md:h-[500px] w-full bg-slate-900">
           <Skeleton className="w-full h-full" />
           <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 container mx-auto space-y-4">
             <Skeleton className="h-10 w-2/3 md:w-1/2" />
             <Skeleton className="h-4 w-full md:w-1/3" />
             <Skeleton className="h-4 w-5/6 md:w-1/4" />
             <Skeleton className="h-12 w-32 rounded-full mt-4" />
           </div>
        </div>

        <div className="container mx-auto px-4 space-y-12">
          {/* Sections Skeleton */}
          {[1, 2, 3].map((section) => (
            <div key={section}>
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="space-y-2">
                     <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                     <Skeleton className="h-4 w-3/4" />
                     <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-center p-10">Gagal memuat konten.</div>;

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Carousel */}
      {data.carousel && data.carousel.length > 0 && (
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden bg-slate-900 group">
          {data.carousel.map((item, index) => {
            const path = extractPath(item.originalLink || item.link);
            const isEpisode = path.toLowerCase().includes('episode');
            const linkTo = isEpisode 
              ? `/stream?url=${encodeURIComponent(path)}` 
              : `/detail?url=${encodeURIComponent(path)}`;

            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={item.image || item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 container mx-auto">
                  <div className="max-w-3xl space-y-4 animate-fade-in-up">
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                      {item.title}
                    </h1>
                    <p className="text-slate-300 text-sm md:text-lg line-clamp-3 md:line-clamp-2 max-w-2xl drop-shadow-md">
                      {item.description}
                    </p>
                    <Link
                      to={linkTo}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105 shadow-lg shadow-indigo-600/30 mt-4"
                    >
                      <Play className="fill-white" size={20} /> Tonton Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-6 right-6 z-30 flex space-x-2">
            {data.carousel.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-500 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="container mx-auto px-4 space-y-12">
        
        {/* Latest Releases */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="text-indigo-500" /> Rilis Terbaru
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {data.latest_releases?.map((anime, idx) => (
              <AnimeCard
                key={idx}
                title={anime.title}
                image={anime.image || anime.poster || ''}
                link={anime.originalLink || anime.link}
                subtitle={anime.episode}
                overlayText={anime.time_ago.replace(anime.title, '').replace(anime.episode, '').trim()}
              />
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Flame className="text-orange-500" /> Sedang Tren
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {data.trending?.map((anime, idx) => (
              <AnimeCard
                key={idx}
                title={anime.title.split("Ceritanya")[0]} 
                image={anime.image || anime.poster || ''}
                link={anime.originalLink || anime.link}
                subtitle={anime.episode_info || 'Trending'}
              />
            ))}
          </div>
        </section>

        {/* New Additions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <PlusCircle className="text-green-500" /> Tambahan Baru
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {data.new_additions?.map((anime, idx) => (
              <AnimeCard
                key={idx}
                title={anime.title}
                image={anime.image || anime.poster || ''}
                link={anime.originalLink || anime.link}
                subtitle={anime.episode_info}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};