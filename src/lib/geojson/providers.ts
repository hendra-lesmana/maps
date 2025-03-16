export interface GeoJSONProvider {
  getGeoJSON(id: string): Promise<GeoJSON.Feature | null>;
}

export class OpenStreetMapGeoJSONProvider implements GeoJSONProvider {
  private baseUrl = 'https://nominatim.openstreetmap.org/details';

  async getGeoJSON(id: string): Promise<GeoJSON.Feature | null> {
    const params = new URLSearchParams({
      place_id: id,
      format: 'json',
      polygon_geojson: '1'
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) {
        throw new Error('GeoJSON request failed');
      }

      const data = await response.json();
      if (!data.geometry) {
        return null;
      }

      return {
        type: 'Feature',
        geometry: data.geometry,
        properties: {
          name: data.name,
          type: data.type,
          osm_type: data.osm_type
        }
      };
    } catch (error) {
      console.error('GeoJSON fetch error:', error);
      return null;
    }
  }
}