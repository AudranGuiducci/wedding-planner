import React from 'react';
import Table from './Table';
import type { Venue } from './Table';
import { config } from '../config';

interface VenueTableProps {
  data: Venue[];
}

export const VenueTable: React.FC<VenueTableProps> = ({ data }) => {
  const { googleMapsApiKey } = config;

  return (
    <Table 
      headers={["Name", "Date", "Maps", "Status", "Prix"]}
      data={data}
      googleMapsApiKey={googleMapsApiKey}
    />
  );
};

export default VenueTable;
