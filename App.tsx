import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { StreamPage } from './pages/StreamPage';
import { SearchPage } from './pages/SearchPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { WatchlistProvider } from './context/WatchlistContext';

const App: React.FC = () => {
  return (
    <WatchlistProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="detail" element={<DetailPage />} />
            <Route path="stream" element={<StreamPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </WatchlistProvider>
  );
};

export default App;