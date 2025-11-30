import React, { useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { Search, Menu, X, PlayCircle, Heart } from 'lucide-react';
import { PromoPopup } from './PromoPopup';

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <PromoPopup />
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-indigo-500 hover:text-indigo-400 transition-colors">
              <PlayCircle size={32} />
              <span className="text-xl font-bold tracking-tight text-white">Nime<span className="text-indigo-500">Stream</span></span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Desktop Nav Actions */}
            <div className="hidden md:flex items-center gap-4">
               <Link to="/watchlist" className="flex items-center gap-2 text-slate-300 hover:text-rose-500 transition-colors">
                 <Heart size={20} />
                 <span className="text-sm font-medium">Watchlist</span>
               </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
                  <Search size={18} />
                </button>
              </div>
            </form>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="block py-2 text-slate-300 hover:text-indigo-400" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/watchlist" className="flex items-center gap-2 py-2 text-slate-300 hover:text-rose-500" onClick={() => setIsMenuOpen(false)}>
                <Heart size={18} /> Watchlist
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 text-slate-400">
            <PlayCircle size={24} />
            <span className="font-semibold text-white">NimeStream</span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} NimeStream. All rights reserved. <br/>
            Data provided by NextA API.
          </p>
        </div>
      </footer>
    </div>
  );
};