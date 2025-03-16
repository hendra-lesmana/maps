'use client';

import { OpenStreetMapProvider, SearchProvider, SearchResult } from './providers';

export class SearchService {
  private provider: SearchProvider;

  constructor(provider: SearchProvider = new OpenStreetMapProvider()) {
    this.provider = provider;
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }
    return this.provider.search(query);
  }
}

export type { SearchResult } from './providers';
export { OpenStreetMapProvider } from './providers';