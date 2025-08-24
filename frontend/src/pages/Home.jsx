import React, { useEffect, useState } from 'react'
import { Typography, Box } from '@mui/material'
import Listings from './Listings'

export default function Home(){
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Find homes for Rent & Sale</Typography>
      <Listings defaultFetch />
    </Box>
  )
}
