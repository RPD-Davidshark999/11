
export interface ApiRoute {
  name: string;
  url: string;
  id: string;
}

export interface WatchHistoryItem {
  id: string;
  url: string;
  timestamp: number;
  title?: string;
}

export interface MovieInsight {
  title: string;
  summary: string;
  genre: string[];
  rating: string;
  year: string;
}
