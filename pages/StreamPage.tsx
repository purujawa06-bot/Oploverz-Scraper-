import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { animeService, extractPath } from '../services/api';
import { StreamResult, StreamLink } from '../types';
import { Download, ChevronLeft, ChevronRight, MonitorPlay } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';

export const StreamPage: React.FC = () => {
  const [data, setData] = useState<StreamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStream, setActiveStream] = useState<StreamLink | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStream = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const url = searchParams.get('url');

      if (url) {
        try {
          const result = await animeService.getStream(url);
          setData(result);
          document.title = `Nonton ${result.title || 'Anime'} - NimeStream`;
          // Set default stream (usually higher quality or first available)
          if (result.stream_links && result.stream_links.length > 0) {
            // Try to find 720p or 1080p as default, else first
            const preferred = result.stream_links.find(l => l.source.includes('720')) || result.stream_links[0];
            setActiveStream(preferred);
          }
        } catch (error) {
          console.error("Error fetching stream:", error);
        }
      }
      setLoading(false);
    };

    fetchStream();

    return () => {
      document.title = 'NimeStream - Nonton Anime Online Gratis';
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 space-y-4">
           <Skeleton className="h-6 w-32" />
           <Skeleton className="h-10 w-3/4" />
           <Skeleton className="h-4 w-48" />
        </div>
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative mb-8">
           <Skeleton className="w-full h-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-24 w-full rounded-lg" />
              <div className="flex justify-between">
                 <Skeleton className="h-12 w-32 rounded-lg" />
                 <Skeleton className="h-12 w-32 rounded-lg" />
              </div>
           </div>
           <div>
              <Skeleton className="h-48 w-full rounded-xl" />
           </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-center p-20 text-white">Stream tidak tersedia.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Navigation and Title */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white mb-4 flex items-center gap-1 text-sm">
          <ChevronLeft size={16} /> Kembali ke Detail
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
          {data.title || `Episode ${data.episode_info?.episode_number}`}
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-400">
           <span>Episode {data.episode_info?.episode_number}</span>
           <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
           <span>{data.episode_info?.released_at ? new Date(data.episode_info.released_at).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>

      {/* Video Player */}
      <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative mb-8">
        {activeStream ? (
           <iframe
             src={activeStream.url}
             title="Video Player"
             className="w-full h-full border-0"
             allowFullScreen
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
             <MonitorPlay size={48} className="mb-4 opacity-50" />
             <p>Tidak ada sumber stream yang dipilih</p>
          </div>
        )}
      </div>

      {/* Stream Sources & Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-6">
          {/* Stream Selectors */}
           <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
             <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-wider">Kualitas Stream</h3>
             <div className="flex flex-wrap gap-2">
                {data.stream_links?.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStream(link)}
                    className={`px-4 py-2 rounded font-medium text-sm transition-all ${
                      activeStream?.url === link.url
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {link.source.replace('Streaming', '').trim() || `Server ${idx + 1}`}
                  </button>
                ))}
                {(!data.stream_links || data.stream_links.length === 0) && (
                  <div className="text-slate-500 text-sm">Tidak ada link stream tersedia.</div>
                )}
             </div>
           </div>

           {/* Next/Prev Navigation */}
           <div className="flex justify-between items-center">
             {data.navigation?.prev ? (
                <Link 
                   to={`/stream?url=${encodeURIComponent(extractPath(data.navigation.prev.originalLink || data.navigation.prev.link))}`}
                   className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
                >
                  <ChevronLeft size={18} /> Episode Sebelumnya
                </Link>
             ) : (
               <div /> // Spacer
             )}
             
             {data.navigation?.next && (
                <Link 
                   to={`/stream?url=${encodeURIComponent(extractPath(data.navigation.next.originalLink || data.navigation.next.link))}`}
                   className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium shadow-lg shadow-indigo-600/20 transition-colors"
                >
                  Episode Selanjutnya <ChevronRight size={18} />
                </Link>
             )}
           </div>
        </div>

        {/* Download Links */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Download className="text-indigo-500" size={20} /> Unduhan
             </h3>
             <div className="space-y-4">
                {data.download_links?.mp4?.map((quality, idx) => (
                  <div key={idx} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                     <div className="text-sm font-semibold text-slate-300 mb-2">{quality.quality} (MP4)</div>
                     <div className="flex flex-wrap gap-2">
                        {quality.links?.map((link, lIdx) => (
                          <a 
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white px-3 py-1.5 rounded transition-colors"
                          >
                            {link.host}
                          </a>
                        ))}
                     </div>
                  </div>
                ))}
                 {data.download_links?.mkv?.map((quality, idx) => (
                  <div key={`mkv-${idx}`} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                     <div className="text-sm font-semibold text-slate-300 mb-2">{quality.quality} (MKV)</div>
                     <div className="flex flex-wrap gap-2">
                        {quality.links?.map((link, lIdx) => (
                          <a 
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white px-3 py-1.5 rounded transition-colors"
                          >
                            {link.host}
                          </a>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};