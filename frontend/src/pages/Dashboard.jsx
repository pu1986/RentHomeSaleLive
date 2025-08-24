import React from 'react';
import { Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../App'; // yeh localStorage se user data le raha hoga

export default function Dashboard() {
  const nav = useNavigate();
  const user = getUser(); // isAdmin check ke liye

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5">Welcome, {user?.name}</Typography>
      
      {/* Post Property sab ke liye */}
      <Button
        variant="contained"
        sx={{ mt: 2, mr: 2 }}
        onClick={() => nav('/post-property')}
      >
        Post Property
      </Button>

      {/* Approve Properties sirf admin ke liye */}
      {user?.isAdmin && (
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => nav('/approve-properties')}
        >
          Approve Properties
        </Button>
      )}
    </Paper>
  );
}
