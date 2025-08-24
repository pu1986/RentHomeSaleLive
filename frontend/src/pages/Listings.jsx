import React, { useEffect, useState } from 'react'
import { Grid, TextField, Button, MenuItem, FormControl, InputLabel, Select, Box } from '@mui/material'
import PropertyCard from '../components/PropertyCard'

export default function Listings({ defaultFetch }) {
  const [list, setList] = useState([])
  const [city, setCity] = useState('')
  const [locality, setLocality] = useState('')
  const [purpose, setPurpose] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchList = async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (city) q.set('city', city)
      if (locality) q.set('locality', locality)
      if (purpose) q.set('purpose', purpose)
      const res = await fetch('http://localhost:5000/api/properties?' + q.toString())
      const data = await res.json()
      //console.log(data);
      setList(data)
    } catch (err) {
      //console.error(err)
    } finally { setLoading(false) }
  }

  useEffect(()=>{ if (defaultFetch) fetchList() },[defaultFetch])

  return (
    <>
      <Box sx={{ display:'flex', gap:2, mb:3, flexWrap:'wrap' }}>
        <TextField label="City" value={city} onChange={e=>setCity(e.target.value)} />
        <TextField label="Locality" value={locality} onChange={e=>setLocality(e.target.value)} />
        <FormControl sx={{ minWidth:140 }}>
          <InputLabel>Purpose</InputLabel>
          <Select value={purpose} label="Purpose" onChange={e=>setPurpose(e.target.value)}>
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='Rent'>Rent</MenuItem>
            <MenuItem value='Sale'>Sale</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={fetchList}>Search</Button>
      </Box>

      <Grid container spacing={3}>
        {list.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <PropertyCard property={p} />
          </Grid>
        ))}
      </Grid>
      {loading && <div>Loading...</div>}
    </>
  )
}
