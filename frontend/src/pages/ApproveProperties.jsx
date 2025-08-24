import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { getToken } from '../App';

export default function ApproveProperties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/properties/pending', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(res => res.json())
      .then(data => setProperties(data));
  }, []);

  const approveProperty = async (id) => {
    await fetch(`http://localhost:5000/api/properties/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    setProperties(props => props.filter(p => p._id !== id));
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h6">Pending Properties</Typography>
      <List>
        {properties.map(p => (
          <ListItem
            key={p._id}
            secondaryAction={
              <Button variant="contained" onClick={() => approveProperty(p._id)}>
                Approve
              </Button>
            }
          >
            <ListItemText primary={p.title} secondary={p.location} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
