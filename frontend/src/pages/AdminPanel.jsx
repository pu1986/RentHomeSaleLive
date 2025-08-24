import React, { useEffect, useState } from 'react'
import { Paper, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material'
import { getToken } from '../App'

export default function AdminPanel(){
  const [list,setList]=useState([]); const token = getToken()
  useEffect(()=>{ if (!token) return; fetch('http://localhost:5000/api/properties/admin/pending',{ headers:{ Authorization:'Bearer '+token } }).then(r=>r.json()).then(setList).catch(console.error) },[token])
  const approve = async id=>{ const res = await fetch(`http://localhost:5000/api/properties/${id}/approve`,{ method:'PATCH', headers:{ Authorization:'Bearer '+token } }); if (res.ok) setList(list.filter(x=>x._id!==id)) }
  return (
    <Paper sx={{p:2}}>
      <Typography variant="h6">Pending Properties</Typography>
      <Grid container spacing={2} sx={{mt:1}}>
        {list.map(p=>(
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Card>
              <CardMedia component='img' height='160' image={p.images && p.images[0] ? ('http://localhost:5000/uploads/'+p.images[0]) : 'https://source.unsplash.com/collection/483251/800x600'} />
              <CardContent>
                <Typography variant='subtitle1'>{p.title}</Typography>
                <Typography variant='body2'>{p.locality}, {p.city}</Typography>
              </CardContent>
              <CardActions><Button onClick={()=>approve(p._id)}>Approve</Button></CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}
