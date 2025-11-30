export interface AnimeBase {
  title: string;
  image?: string;
  poster?: string;
  originalLink: string;
  link: string;
}

export interface CarouselItem extends AnimeBase {
  description: string;
}

export interface TrendingItem extends AnimeBase {
  episode_info?: string;
}

export interface LatestReleaseItem extends AnimeBase {
  episode: string;
  time_ago: string;
}

export interface SearchResultItem extends AnimeBase {
  japanese_title?: string;
  description?: string;
  score?: number;
  status?: string;
  type?: string;
  episodes_count?: number;
  genres?: string[];
}

export interface HomeResult {
  carousel: CarouselItem[];
  trending: TrendingItem[];
  latest_releases: LatestReleaseItem[];
  new_additions: TrendingItem[];
}

export interface Episode {
  quality: string;
  release_date: string;
  originalLink: string;
  link: string;
}

export interface AnimeDetail {
  title: string;
  japanese_title: string;
  description: string;
  poster: string;
  information: {
    studio: string;
    status: string;
    genres: string[];
  };
  episodes: Episode[];
  breadcrumb: string[];
}

export interface StreamLink {
  source: string;
  url: string;
}

export interface DownloadLinkInfo {
  host: string;
  url: string;
}

export interface DownloadQuality {
  quality: string;
  links: DownloadLinkInfo[];
}

export interface DownloadLinks {
  mp4: DownloadQuality[];
  mkv?: DownloadQuality[];
}

export interface StreamResult {
  title: string;
  download_links: DownloadLinks;
  stream_links: StreamLink[];
  episode_info: {
    id: number;
    episode_number: string;
    released_at: string;
    subbed: string;
  };
  navigation: {
    next?: {
      link: string;
      originalLink: string;
    };
    prev?: {
      link: string;
      originalLink: string;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  author: string;
  result: T;
}
