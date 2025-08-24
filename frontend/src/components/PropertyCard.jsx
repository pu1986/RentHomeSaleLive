import React from 'react';
import { Card, CardContent, Typography, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
  // console.log('Units:', property.units);
//console.log('Valid Units:', validUnits);
  // Safe units parsing
//console.log('property.units:', property.units);
  
  // const validUnits = property.units?.filter(u => u?.price !== undefined && u?.type) || [];


  // // Agar units available hain, pehla unit ko display karo
  // let unitDisplay = 'Price N/A';
  // if (validUnits.length) {
  //   // Lowest price unit select karne ke liye
  //   const lowestUnit = validUnits.reduce((prev, curr) => {
  //     return Number(curr.price) < Number(prev.price) ? curr : prev;
  //   }, validUnits[0]);

  //   unitDisplay = `${lowestUnit.type} - ₹${Number(lowestUnit.price).toLocaleString()}`;
  // }

  const validUnits = property.units?.filter(u => u?.price > 0) || [];

let unitDisplay = 'Price N/A';
if (validUnits.length) {
  const lowestUnit = validUnits.reduce((prev, curr) => 
    Number(curr.price) < Number(prev.price) ? curr : prev
  , validUnits[0]);

  unitDisplay = `${lowestUnit.type || 'Unit'} - ₹${Number(lowestUnit.price).toLocaleString()}`;
}


// console.log(unitDisplay);

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={property.images?.[0] ? `http://localhost:5000/uploads/${property.images[0]}` : '/noimage.jpg'}
        alt={property.title}
      />
      <CardContent>
        <Typography variant="h6">{property.title}</Typography>
        <Typography variant="body2">
          {property.bhkType ? `${property.bhkType} • ` : ''}{property.category}
        </Typography>
        <Typography variant="body2">{property.city}, {property.locality}</Typography>
        <Typography variant="body1" color="primary" fontWeight={600}>
          {unitDisplay}
        </Typography>
        <Button
          component={Link}
          to={`/property/${property.slug}`}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 1 }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}
