import React, { useEffect, useState } from 'react';
import { Coordinates } from '../types/maps';
import { getPlacePhotoUrl, getStreetViewImageUrl } from '../utils/maps';

interface LocationImageProps {
  coordinates: Coordinates;
  googleMapsApiKey: string;
  className?: string;
}

const LocationImage: React.FC<LocationImageProps> = ({ coordinates, googleMapsApiKey, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching image for coordinates:', coordinates);
        // Start with Street View URL as fallback
        const streetViewUrl = getStreetViewImageUrl(coordinates, googleMapsApiKey);
        setImageUrl(streetViewUrl); // Set Street View URL immediately as fallback
        
        // Then try to get a place photo
        try {
          const placeUrl = await getPlacePhotoUrl(coordinates, googleMapsApiKey);
          if (placeUrl) {
            console.log('Got place photo URL:', placeUrl);
            setImageUrl(placeUrl);
          } else {
            console.log('No place photo available, using Street View');
          }
        } catch (placeError) {
          console.warn('Failed to get place photo, using Street View:', placeError);
        }
      } catch (error) {
        console.error('Error fetching location image:', error);
        setError(error instanceof Error ? error.message : 'Failed to load image');
      } finally {
        setLoading(false);
      }
    };

    if (coordinates && googleMapsApiKey) {
      fetchImage();
    } else {
      console.log('Missing required props:', { coordinates, googleMapsApiKey });
    }
  }, [coordinates, googleMapsApiKey]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 animate-pulse flex items-center justify-center`}>
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className={`${className} bg-red-50 text-red-500 flex items-center justify-center text-sm`}>
        {error || 'Failed to load image'}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Location"
      className={`${className} object-cover`}
      onError={(e) => {
        // If the place photo fails, fall back to Street View
        const target = e.target as HTMLImageElement;
        target.src = getStreetViewImageUrl(coordinates, googleMapsApiKey);
      }}
    />
  );
};

export default LocationImage;
