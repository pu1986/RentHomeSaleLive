import React, { useState, useEffect } from 'react'
import { Paper, Typography, TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select, Chip, Box } from '@mui/material'
import { getToken } from '../App'

const bhkTypes = ['1 RK','1 BHK','2 BHK','3 BHK','4 BHK+']
const amenitiesList = ['Lift','Parking','Gym','Swimming Pool','Power Backup','Security','Garden']
const furnishingOptions = ['Unfurnished','Semi-Furnished','Fully Furnished']
const tenantTypes = ['Family','Bachelors','Company']
const facingOptions = ['East','West','North','South','North-East','North-West','South-East','South-West']
const ownershipTypes = ['builder','self'] // match backend enum
const transactionTypes = ['New Booking','Resale']

function makeSlug(units, locality, purpose) {
  const mainUnit = units[0]?.type || ''
  const typeSlug = mainUnit.replace(/\s+/g, '-').toLowerCase()
  const locSlug = locality.trim().replace(/\s+/g, '-').toLowerCase()
  return `${typeSlug}-in-${locSlug}-for-${purpose}`
}

export default function PostProperty(){

  console.log(sessionStorage.getItem("user"));


  const [title,setTitle]=useState('')
  const [purpose,setPurpose]=useState('sale')
  const [category,setCategory]=useState('residential')
  const [city,setCity]=useState('')
  const [locality,setLocality]=useState('')
  const [description,setDescription]=useState('')
  const [units,setUnits]=useState([{type:'1 BHK',area:'',price:'',floor:'',availableFrom:''}])
  const [amenities,setAmenities]=useState([])
  const [images,setImages]=useState([])

  // Common Extra Fields
  const [furnishing,setFurnishing] = useState('Unfurnished')
  const [carParking,setCarParking] = useState(0)
  const [bikeParking,setBikeParking] = useState(0)
  const [propertyAge,setPropertyAge] = useState('')

  // Sale Specific
  const [propertyType,setPropertyType] = useState('')
  const [ownership,setOwnership] = useState('builder')
  const [superBuiltArea,setSuperBuiltArea] = useState('')
  const [builtArea,setBuiltArea] = useState('')
  const [carpetArea,setCarpetArea] = useState('')
  const [rera,setRera] = useState('')
  const [possessionDate,setPossessionDate] = useState('')
  const [facing,setFacing] = useState('')
  const [transactionType,setTransactionType] = useState('New Booking')
  const [loanAvailable,setLoanAvailable] = useState('Yes')
  const [approvedBy,setApprovedBy] = useState('')

  // Rent Specific
  const [preferredTenants,setPreferredTenants] = useState('Family')
  const [securityDeposit,setSecurityDeposit] = useState('')
  const [maintenanceCharges,setMaintenanceCharges] = useState('')

  // Owner Info (New)
  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerMobile, setOwnerMobile] = useState('')

  useEffect(() => {
    // SessionStorage se email & mobile auto-fill
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if(userData.email) setOwnerEmail(userData.email);
    if(userData.mobile) setOwnerMobile(userData.mobile);
  }, []);

  const addUnit = ()=> setUnits([...units,{type:'1 BHK',area:'',price:'',floor:'',availableFrom:''}])
  const removeUnit = i=> setUnits(units.filter((_,idx)=>idx!==i))
  const changeUnit = (i,field,v)=>{ const c=[...units]; c[i][field]=v; setUnits(c) }
  const toggleAmenity = a=> setAmenities(prev => prev.includes(a)?prev.filter(x=>x!==a):[...prev,a])
  const handleFiles = e=> setImages(prev=>[...prev,...Array.from(e.target.files)])

  const submit = async e=>{
    e.preventDefault()
    const token = getToken()
    if (!token) return alert('Please login')

    const slug = makeSlug(units, locality, purpose)
    const fd = new FormData()

    // Common fields
    fd.append('title',title)
    fd.append('description',description)
    fd.append('purpose',purpose)
    fd.append('category',category)
    fd.append('city',city)
    fd.append('locality',locality)
    fd.append('units',JSON.stringify(units))
    fd.append('amenities',JSON.stringify(amenities))
    fd.append('slug', slug)
    fd.append('furnishing',furnishing)
    fd.append('carParking',carParking)
    fd.append('bikeParking',bikeParking)
    fd.append('propertyAge',propertyAge)

    // Owner Info (New)
    fd.append('ownerEmail', ownerEmail)
    fd.append('ownerMobile', ownerMobile)

    // Sale or Rent specific
    if(purpose==='sale'){
      fd.append('propertyType',propertyType)
      fd.append('ownership',ownership)
      fd.append('superBuiltArea',superBuiltArea)
      fd.append('builtArea',builtArea)
      fd.append('carpetArea',carpetArea)
      fd.append('rera',rera)
      fd.append('possessionDate',possessionDate)
      fd.append('facing',facing)
      fd.append('transactionType',transactionType)
      fd.append('loanAvailable',loanAvailable)
      fd.append('approvedBy',approvedBy)
    } else {
      fd.append('preferredTenants',preferredTenants)
      fd.append('securityDeposit',securityDeposit)
      fd.append('maintenanceCharges',maintenanceCharges)
    }

    images.forEach(f=>fd.append('images',f))

    const res = await fetch('http://localhost:5000/api/properties',{
      method:'POST',
      headers:{ Authorization:'Bearer '+token },
      body: fd
    })

    const data = await res.json()
    if(res.ok){
      alert('Property submitted for approval')
      window.location.href=`/properties/${slug}`
    } else {
      alert(data.message || 'Error')
    }
  }

  return (
    <Paper sx={{p:3, maxWidth:900, mx:'auto'}}>
      <Typography variant="h6">Post Property</Typography>
      <Box component="form" onSubmit={submit} sx={{mt:2}}>
        {/* Title & Location */}
        <TextField label="Title" fullWidth value={title} onChange={e=>setTitle(e.target.value)} required />
        <Grid container spacing={2} sx={{mt:1}}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Purpose</InputLabel>
              <Select value={purpose} onChange={e => setPurpose(e.target.value)}>
                <MenuItem value="rent">Rent</MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={category} onChange={e=>setCategory(e.target.value)}>
                <MenuItem value='residential'>Residential</MenuItem>
                <MenuItem value='commercial'>Commercial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}><TextField label="City" fullWidth value={city} onChange={e=>setCity(e.target.value)} required /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Locality" fullWidth value={locality} onChange={e=>setLocality(e.target.value)} required /></Grid>
        </Grid>

        {/* Sale Fields */}
        {purpose==='sale' && (
          <>
            <Typography sx={{mt:2}}>Sale Details</Typography>
            <Grid container spacing={2} sx={{mt:1}}>
              <Grid item xs={12} sm={6}><TextField label="Property Type" fullWidth value={propertyType} onChange={e=>setPropertyType(e.target.value)} /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Ownership</InputLabel>
                  <Select value={ownership} onChange={e=>setOwnership(e.target.value)}>
                    {ownershipTypes.map(o=><MenuItem key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}><TextField label="Super Built Area (sq.ft)" value={superBuiltArea} onChange={e=>setSuperBuiltArea(e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Built Area (sq.ft)" value={builtArea} onChange={e=>setBuiltArea(e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Carpet Area (sq.ft)" value={carpetArea} onChange={e=>setCarpetArea(e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} sm={6}><TextField label="RERA No." value={rera} onChange={e=>setRera(e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} sm={6}><TextField type="date" label="Possession Date" InputLabelProps={{shrink:true}} value={possessionDate} onChange={e=>setPossessionDate(e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Facing</InputLabel>
                  <Select value={facing} onChange={e=>setFacing(e.target.value)}>
                    {facingOptions.map(f=><MenuItem key={f} value={f}>{f}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select value={transactionType} onChange={e=>setTransactionType(e.target.value)}>
                    {transactionTypes.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Loan Available</InputLabel>
                  <Select value={loanAvailable} onChange={e=>setLoanAvailable(e.target.value)}>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}><TextField label="Approved By" value={approvedBy} onChange={e=>setApprovedBy(e.target.value)} fullWidth /></Grid>
            </Grid>
          </>
        )}

        {/* Rent Fields */}
        {purpose==='rent' && (
          <>
            <Typography sx={{mt:2}}>Rent Details</Typography>
            <Grid container spacing={2} sx={{mt:1}}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Tenants</InputLabel>
                  <Select value={preferredTenants} onChange={e=>setPreferredTenants(e.target.value)}>
                    {tenantTypes.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}><TextField label="Security Deposit" value={securityDeposit} onChange={e=>setSecurityDeposit(e.target.value)} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Maintenance Charges" value={maintenanceCharges} onChange={e=>setMaintenanceCharges(e.target.value)} fullWidth /></Grid>
            </Grid>
          </>
        )}

        {/* Units Section */}
        {purpose==='sale' && (
          <>
            <Typography sx={{mt:2}}>Units</Typography>
            {units.map((u,i)=>(
              <Grid container spacing={1} key={i} alignItems="center" sx={{mt:1}}>
                <Grid item xs={12} sm={2}>
                  <TextField select label="Type" value={u.type} onChange={e=>changeUnit(i,'type',e.target.value)} fullWidth>
                    {bhkTypes.map(b=> <MenuItem key={b} value={b}>{b}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={2}><TextField label="Area (sq.ft)" value={u.area} onChange={e=>changeUnit(i,'area',e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={2}><TextField label="Price" value={u.price} onChange={e=>changeUnit(i,'price',e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} sm={2}><TextField label="Floor" value={u.floor} onChange={e=>changeUnit(i,'floor',e.target.value)} fullWidth /></Grid>
                <Grid item xs={11} sm={3}><TextField type="date" label="Available From" InputLabelProps={{shrink:true}} value={u.availableFrom} onChange={e=>changeUnit(i,'availableFrom',e.target.value)} fullWidth /></Grid>
                {units.length>1 && <Grid item xs={1}><Button color="error" onClick={()=>removeUnit(i)}>Remove</Button></Grid>}
              </Grid>
            ))}
            <Button sx={{mt:1}} onClick={addUnit}>Add Unit</Button>
          </>
        )}

        {/* Common Extras */}
        <Typography sx={{mt:2}}>Property Details</Typography>
        <Grid container spacing={2} sx={{mt:1}}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Furnishing</InputLabel>
              <Select value={furnishing} onChange={e=>setFurnishing(e.target.value)}>
                {furnishingOptions.map(f=> <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}><TextField type="number" label="Car Parking" value={carParking} onChange={e=>setCarParking(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField type="number" label="Bike Parking" value={bikeParking} onChange={e=>setBikeParking(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Property Age" value={propertyAge} onChange={e=>setPropertyAge(e.target.value)} fullWidth /></Grid>
        </Grid>

        {/* Amenities */}
        <Typography sx={{mt:2}}>Amenities</Typography>
        <Box sx={{display:'flex',gap:1,flexWrap:'wrap',mt:1}}>
          {amenitiesList.map(a=> 
            <Chip key={a} label={a} clickable color={amenities.includes(a)?'primary':'default'} onClick={()=>toggleAmenity(a)} />
          )}
        </Box>

        {/* Description */}
        <TextField label="Description" multiline rows={3} fullWidth sx={{mt:2}} value={description} onChange={e=>setDescription(e.target.value)} />

        {/* Images */}
        <Button variant="contained" component="label" sx={{mt:2}}>
          Upload Images
          <input hidden multiple type="file" onChange={handleFiles} />
        </Button>
        <Box sx={{display:'flex',gap:1,mt:2,flexWrap:'wrap'}}>
          {images.map((f,i)=> <img key={i} src={URL.createObjectURL(f)} alt='' width={120} style={{borderRadius:6}}/>)}
        </Box>

        <Button variant="contained" type="submit" fullWidth sx={{mt:3}}>Submit Property</Button>
      </Box>
    </Paper>
  )
}
