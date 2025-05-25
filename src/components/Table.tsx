import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { parseGoogleMapsUrl } from '../utils/maps';
import type { Coordinates } from '../types/maps';
import LocationImage from './LocationImage';
import { config } from '../config';

export interface Venue {
  id: string;
  region: string;
  name: string;
  price: string;
  comment: string;
  map: string;
  created_at: string;
  [key: string]: string | undefined;
}

interface TableProps {
  headers: string[];
  data: Venue[];
  initialSortColumn?: string;
  googleMapsApiKey?: string;
  renderActions?: (venue: Venue, onDelete?: (id: string) => void) => React.ReactNode;
  onDelete?: (id: string) => void;
}

// Header to field name mapping based on position
const getFieldFromHeader = (header: string, headers: string[]): keyof Venue => {
  // Get the index of the header
  const index = headers.indexOf(header);
  
  // Map position to field name
  switch (index) {
    case 0: return 'region';    // Region
    case 1: return 'name';      // Name
    case 2: return 'price';     // Price
    case 3: return 'comment';   // Comment
    case 4:                     // Maps
    case 5:                     // Preview
    case 6: return 'map';       // Image (all use map field)
    default: return 'name';     // Fallback to name
  }
};

const formatPrice = (price: string | number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(price));
};

const MapLink = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6-3l5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17m-6-3l6 3V7" />
      </svg>
      View Map
    </a>
  );
};

const MapPreview = ({ coordinates, name }: { coordinates: Coordinates; name: string }) => {
  return (
    <div className="w-[300px] h-[200px]">
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>
            {name || 'Location'}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

const Table: React.FC<TableProps> = ({ 
  headers: originalHeaders, 
  data, 
  initialSortColumn, 
  renderActions,
  onDelete 
}) => {
  const [sortColumn, setSortColumn] = useState<keyof Venue | null>(initialSortColumn as keyof Venue || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    const field = getFieldFromHeader(column, originalHeaders);
    if (sortColumn === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(field);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

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

  const renderCell = (header: string, value: string | undefined, row: Venue) => {
    const headerIndex = originalHeaders.indexOf(header);
    const mapValue = row.map;

    // Actions column (last column)
    if (header === 'Actions' && renderActions) {
      return renderActions(row, onDelete);
    }

    // Price column (index 2)
    if (headerIndex === 2) {
      return formatPrice(value as string);
    }

    // Image column (index 6)
    if (headerIndex === 6) {
      if (!mapValue || typeof mapValue !== 'string') {
        return null;
      }
      
      let coordinates: Coordinates | null = null;
      if (mapValue.includes('google.com/maps') || mapValue.includes('goo.gl/maps')) {
        coordinates = parseGoogleMapsUrl(mapValue);
      } else if (mapValue.includes(',')) {
        try {
          coordinates = {
            lat: parseFloat(mapValue.split(',')[0]),
            lng: parseFloat(mapValue.split(',')[1])
          };
        } catch (e) {
          coordinates = null;
        }
      }

      if (!coordinates || !config.googleMapsApiKey) {
        return null;
      }

      return (
        <LocationImage
          coordinates={coordinates}
          googleMapsApiKey={config.googleMapsApiKey}
          className="w-[200px] h-[100px] rounded-lg"
        />
      );
    }

    // Maps column (index 4)
    if (headerIndex === 4) {
      if (!mapValue || typeof mapValue !== 'string') {
        return <span className="text-red-500">Invalid location data</span>;
      }
      return <MapLink url={mapValue} />;
    }

    // Preview column (index 5)
    if (headerIndex === 5) {
      if (!mapValue || typeof mapValue !== 'string') {
        return <span className="text-red-500">Invalid location data</span>;
      }
      
      let coordinates: Coordinates | null = null;
      if (mapValue.includes('google.com/maps') || mapValue.includes('goo.gl/maps')) {
        coordinates = parseGoogleMapsUrl(mapValue);
      } else if (mapValue.includes(',')) {
        try {
          coordinates = {
            lat: parseFloat(mapValue.split(',')[0]),
            lng: parseFloat(mapValue.split(',')[1])
          };
        } catch (e) {
          coordinates = null;
        }
      }

      if (!coordinates) {
        return <span className="text-red-500">Invalid map data</span>;
      }

      return <MapPreview coordinates={coordinates} name={row.name} />;
    }

    return value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            {originalHeaders.map((header) => (
              <th
                key={header}
                onClick={() => handleSort(header)}
                className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                {header}
                {sortColumn === getFieldFromHeader(header, originalHeaders) && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getSortedData().map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              {originalHeaders.map((header) => {
                const field = getFieldFromHeader(header, originalHeaders);
                const value = field ? row[field] : null;

                return (
                  <td key={header} className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                    {renderCell(header, value as string | undefined, row)}
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
