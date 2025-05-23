export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ParsedMapData {
  coordinates: Coordinates;
  placeName?: string;
}
