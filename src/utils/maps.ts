import { Coordinates } from '../types/maps';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface PlacePhoto {
  getUrl: () => string;
}

interface PlaceResult {
  photos?: PlacePhoto[];
}

declare var google: {
  maps: {
    Map: new (element: HTMLElement, options?: any) => any;
    places: {
      PlacesService: new (mapOrElement: any) => {
        nearbySearch: (
          request: {
            location: { lat: number; lng: number };
            radius: number;
          },
          callback: (
            results: PlaceResult[] | null,
            status: string
          ) => void
        ) => void;
      };
      PlacesServiceStatus: {
        OK: string;
        ZERO_RESULTS: string;
        INVALID_REQUEST: string;
        OVER_QUERY_LIMIT: string;
        REQUEST_DENIED: string;
        ERROR: string;
      };
    };
  };
};

export const getStreetViewImageUrl = (coordinates: Coordinates, apiKey: string): string => {
  const { lat, lng } = coordinates;
  return `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${lat},${lng}&key=${apiKey}`;
};

export const getPlacePhotoUrl = async (coordinates: Coordinates, apiKey: string): Promise<string | null> => {
  try {
    // Create a map div element that will be used by the Places service
    const mapDiv = document.createElement('div');
    mapDiv.style.display = 'none';
    document.body.appendChild(mapDiv);

    // Load the Places library if not already loaded
    if (!window.google?.maps?.places) {
      await new Promise<void>((resolve, reject) => {
        if (document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
          // If script is already loading, wait for it
          const checkGoogle = () => {
            if (window.google?.maps?.places) {
              resolve();
            } else {
              setTimeout(checkGoogle, 100);
            }
          };
          checkGoogle();
        } else {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.onload = () => {
            if (window.google?.maps?.places) {
              resolve();
            } else {
              reject(new Error('Google Maps Places library failed to initialize'));
            }
          };
          script.onerror = () => reject(new Error('Failed to load Google Maps Places library'));
          document.head.appendChild(script);
        }
      });
    }

    // Wait a bit to ensure Google Maps is fully initialized
    await new Promise(resolve => setTimeout(resolve, 100));

    // Initialize the map (required for Places service)
    const map = new google.maps.Map(mapDiv);
    const service = new google.maps.places.PlacesService(map);
    
    if (!service) {
      throw new Error('Failed to create Places service');
    }

    const result = await new Promise<PlaceResult>((resolve, reject) => {
      service.nearbySearch({
        location: coordinates,
        radius: 100
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          resolve(results[0]);
        } else {
          reject(new Error(`Place not found: ${status}`));
        }
      });
    });

    // Clean up the map div
    document.body.removeChild(mapDiv);

    if (result && result.photos && result.photos.length > 0) {
      return result.photos[0].getUrl();
    }

    console.log('No place photos found, falling back to Street View');
    return getStreetViewImageUrl(coordinates, apiKey);
  } catch (error) {
    console.error('Error fetching place photo:', error);
    // Clean up and fall back to Street View
    const mapDiv = document.querySelector('div[style*="display: none"]');
    if (mapDiv) {
      document.body.removeChild(mapDiv);
    }
    return getStreetViewImageUrl(coordinates, apiKey);
  }
};

// Existing parseGoogleMapsUrl function moved from Table.tsx
export const parseGoogleMapsUrl = (url: string): Coordinates | null => {
  try {
    // Handle short URLs (e.g., https://goo.gl/maps/xxx)
    if (url.includes('goo.gl/maps/')) {
      return null; // Short URLs need to be expanded first
    }

    // Try to extract place coordinates from the URL
    const placeRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)(?:,\d+\.?\d*z)?/;
    const placeMatch = url.match(placeRegex);
    if (placeMatch) {
      const lat = parseFloat(placeMatch[1]);
      const lng = parseFloat(placeMatch[2]);
      if (!isNaN(lat) && !isNaN(lng) && 
          lat >= -90 && lat <= 90 && 
          lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }

    // Handle other formats
    const regex = {
      // Format: ll=48.8584,2.2945 (older format)
      ll: /ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
      
      // Format: q=48.8584,2.2945 (search format)
      query: /q=(-?\d+\.\d+),(-?\d+\.\d+)/,
      
      // Format: ?q=48.8584,2.2945 (place format)
      placeQuery: /\?q=(-?\d+\.\d+),(-?\d+\.\d+)/,
      
      // Format: !3d48.8584!4d2.2945 (embed format)
      embed: /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
      
      // Format: data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d48.8584!4d2.2945
      data: /!8m2!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/
    };

    // Try all regex patterns
    for (const [_, pattern] of Object.entries(regex)) {
      const match = url.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        
        // Validate coordinates are within reasonable bounds
        if (!isNaN(lat) && !isNaN(lng) && 
            lat >= -90 && lat <= 90 && 
            lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }
    }

    // If no coordinates found yet, try direct coordinate format
    if (url.match(/^-?\d+\.\d+,-?\d+\.\d+$/)) {
      const [lat, lng] = url.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng) && 
          lat >= -90 && lat <= 90 && 
          lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing Google Maps URL:', error);
    return null;
  }
};
