import { ApiResponse, HomeResult, AnimeDetail, SearchResultItem, StreamResult } from '../types';

const BASE_URL = 'https://nexta-api.vercel.app/api/anime/oploverz';

// Helper to extract the relative path from the originalLink or link
export const extractPath = (url: string): string => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch (e) {
    // If it's already a relative path
    if (url.startsWith('/')) return url;
    return url;
  }
};

export const animeService = {
  getHome: async (): Promise<HomeResult> => {
    const res = await fetch(`${BASE_URL}/home`);
    const data: ApiResponse<HomeResult> = await res.json();
    return data.result;
  },

  getDetail: async (path: string): Promise<AnimeDetail> => {
    // path should be like /series/spy-x-family-s3
    const encodedPath = encodeURIComponent(path);
    const res = await fetch(`${BASE_URL}/detail?url=${encodedPath}`);
    const data: ApiResponse<AnimeDetail> = await res.json();
    return data.result;
  },

  getStream: async (path: string): Promise<StreamResult> => {
    const encodedPath = encodeURIComponent(path);
    const res = await fetch(`${BASE_URL}/stream?url=${encodedPath}`);
    const data: ApiResponse<StreamResult> = await res.json();
    return data.result;
  },

  search: async (query: string): Promise<SearchResultItem[]> => {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    const data: ApiResponse<SearchResultItem[]> = await res.json();
    return data.result || [];
  }
};