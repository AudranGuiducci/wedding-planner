import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import { parseGoogleMapsUrl } from '../utils/maps';
import type { Coordinates, ParsedMapData } from '../types/maps';
import LocationImage from './LocationImage';

export interface TableData {
  [key: string]: string | number | undefined;
}

interface TableProps {
  headers: string[];
  data: TableData[];
  googleMapsApiKey?: string;
  initialSortColumn?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const formatPrice = (price: string | number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(price));
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = () => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle()}`}>
      {status}
    </span>
  );
};

const MapLink = ({ url }: { url: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
    Voir sur Maps
  </a>
);

const MiniMap = ({ coordinates, placeName }: { coordinates: Coordinates; placeName?: string }) => {
  React.useEffect(() => {
    // Fix Leaflet's icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="h-[150px] w-[200px] rounded-lg overflow-hidden relative">
        <MapContainer
          key={`${coordinates.lat}-${coordinates.lng}`}
          center={[coordinates.lat, coordinates.lng]}
          zoom={15}
          style={{ height: '150px', width: '200px' }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              {placeName || 'Location'}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

const Table: React.FC<TableProps> = ({ headers: originalHeaders, data, googleMapsApiKey, initialSortColumn }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(initialSortColumn || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn.toLowerCase()];
      const bValue = b[sortColumn.toLowerCase()];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  };

  // Add 'Image' column after 'Maps' if it exists and 'Image' isn't already present
  const headers = React.useMemo(() => {
    if (!originalHeaders.includes('Image') && originalHeaders.includes('Maps')) {
      const mapsIndex = originalHeaders.indexOf('Maps');
      return [
        ...originalHeaders.slice(0, mapsIndex + 1),
        'Image',
        ...originalHeaders.slice(mapsIndex + 1)
      ];
    }
    return originalHeaders;
  }, [originalHeaders]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th
                key={index}
                onClick={() => handleSort(header)}
                className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  {header}
                  {sortColumn === header && (
                    <span className="ml-2">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {getSortedData().map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-200">
              {headers.map((header, colIndex) => {
                const value = row[header.toLowerCase()];
                return (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border-b border-r border-gray-200"
                  >
                    {header.toLowerCase() === 'status' ? (
                      <StatusBadge status={String(value || '')} />
                    ) : header.toLowerCase() === 'date' ? (
                      formatDate(String(value || ''))
                    ) : header.toLowerCase() === 'prix' ? (
                      formatPrice(value || 0)
                    ) : header.toLowerCase() === 'image' ? (
                      (() => {
                        const mapsValue = row['maps'];
                        if (!mapsValue || typeof mapsValue !== 'string') {
                          console.log('No valid maps value:', mapsValue);
                          return null;
                        }
                        
                        let coordinates: Coordinates | null = null;
                        
                        if (mapsValue.includes('google.com/maps') || mapsValue.includes('goo.gl/maps')) {
                          coordinates = parseGoogleMapsUrl(mapsValue);
                          console.log('Parsed Google Maps URL:', coordinates);
                        } else if (mapsValue.includes(',')) {
                          try {
                            coordinates = {
                              lat: parseFloat(mapsValue.split(',')[0]),
                              lng: parseFloat(mapsValue.split(',')[1])
                            };
                            console.log('Parsed coordinates:', coordinates);
                          } catch (e) {
                            console.error('Error parsing coordinates:', e);
                            coordinates = null;
                          }
                        }

                        if (!coordinates) {
                          console.log('No valid coordinates found');
                          return null;
                        }

                        if (!googleMapsApiKey) {
                          console.log('No Google Maps API key provided');
                          return null;
                        }

                        return (
                          <LocationImage
                            coordinates={coordinates}
                            googleMapsApiKey={googleMapsApiKey}
                            className="w-[200px] h-[100px] rounded-lg"
                          />
                        );
                      })()
                    ) : header.toLowerCase() === 'maps' ? (
                      (() => {
                        if (typeof value !== 'string') return <span className="text-red-500">Invalid location data</span>;
                        
                        let parsedData: ParsedMapData | null = null;
                        
                        // Try parsing as Google Maps URL first
                        if (value.includes('google.com/maps') || value.includes('goo.gl/maps')) {
                          const coords = parseGoogleMapsUrl(value);
                          if (coords) {
                            parsedData = { coordinates: coords };
                          }
                        }
                        
                        // If not a valid Google Maps URL, try parsing as direct coordinates
                        if (!parsedData && value.includes(',')) {
                          try {
                            parsedData = {
                              coordinates: {
                                lat: parseFloat(value.split(',')[0]),
                                lng: parseFloat(value.split(',')[1])
                              }
                            };
                          } catch (e) {
                            parsedData = null;
                          }
                        }

                        if (!parsedData?.coordinates) {
                          // Try one more time with direct coordinates if URL parsing failed
                          if (value.includes(',')) {
                            try {
                              const [lat, lng] = value.split(',').map(coord => parseFloat(coord.trim()));
                              if (!isNaN(lat) && !isNaN(lng) && 
                                  lat >= -90 && lat <= 90 && 
                                  lng >= -180 && lng <= 180) {
                                parsedData = {
                                  coordinates: { lat, lng }
                                };
                              }
                            } catch (e) {
                              console.error('Error parsing direct coordinates:', e);
                            }
                          }

                          if (!parsedData?.coordinates) {
                            return (
                              <div className="flex flex-col gap-2">
                                <span className="text-yellow-600">Location preview not available</span>
                                <MapLink url={value} />
                              </div>
                            );
                          }
                        }

                        return (
                          <div className="flex flex-col gap-2">
                            <MiniMap coordinates={parsedData.coordinates} placeName={parsedData.placeName} />
                            <MapLink url={value} />
                          </div>
                        );
                      })()
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
