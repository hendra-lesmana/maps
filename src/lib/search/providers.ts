export interface SearchResult {
  id: string;
  name: string;
  displayName: string;
  location: {
    lat: number;
    lon: number;
  };
  boundingBox?: {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
  };
  type: string;
  address?: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export interface SearchProvider {
  search(query: string): Promise<SearchResult[]>;
}

export class OpenStreetMapProvider implements SearchProvider {
  private baseUrl = 'https://nominatim.openstreetmap.org/search';

  async search(query: string): Promise<SearchResult[]> {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5',
      countrycodes: 'id',  // Limit to Indonesia
      // Viewbox coordinates covering Indonesia (roughly)
      viewbox: '95.0,6.0,141.0,-11.0',  // West,North,East,South
      bounded: '1',  // Strictly stay within viewbox
      // Filter to only cities and places
      featuretype: 'city,place'
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) {
        throw new Error('Search request failed');
      }

      interface OpenStreetMapResponse {
        place_id: number;
        display_name: string;
        lat: string;
        lon: string;
        boundingbox?: string[];
        type: string;
        address?: {
          road?: string;
          city?: string;
          state?: string;
          country?: string;
          postcode?: string;
        };
      }

      const data = await response.json() as OpenStreetMapResponse[];
      return data.map((item) => ({
        id: item.place_id.toString(),
        name: item.display_name.split(',')[0],
        displayName: item.display_name,
        location: {
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        },
        boundingBox: item.boundingbox ? {
          minLat: parseFloat(item.boundingbox[0]),
          maxLat: parseFloat(item.boundingbox[1]),
          minLon: parseFloat(item.boundingbox[2]),
          maxLon: parseFloat(item.boundingbox[3])
        } : undefined,
        type: item.type,
        address: item.address
      }));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
}