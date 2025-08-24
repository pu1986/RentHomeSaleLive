import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select, Chip } from '@mui/material';
import { getToken } from '../App';

const bhkTypes = ['1 RK','1 BHK','2 BHK','3 BHK','4 BHK+'];
const amenitiesList = ['Lift','Parking','Gym','Swimming Pool','Power Backup','Security','Garden'];
const furnishingOptions = ['Unfurnished','Semi-Furnished','Fully Furnished'];
const tenantTypes = ['Family','Bachelors','Company'];
const facingOptions = ['East','West','North','South','North-East','North-West','South-East','South-West'];
const ownershipTypes = ['Builder','Self'];
const transactionTypes = ['New Booking','Resale'];

export default function UpdateProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [title,setTitle] = useState('');
  const [purpose,setPurpose] = useState('sale');
  const [category,setCategory] = useState('residential');
  const [city,setCity] = useState('');
  const [locality,setLocality] = useState('');
  const [description,setDescription] = useState('');
  const [units,setUnits] = useState([{type:'1 BHK',area:'',price:'',floor:'',availableFrom:''}]);
  const [amenities,setAmenities] = useState([]);
  const [images,setImages] = useState([]);

  // Sale fields
  const [propertyType,setPropertyType] = useState('');
  const [ownership,setOwnership] = useState('Builder');
  const [superBuiltArea,setSuperBuiltArea] = useState('');
  const [builtArea,setBuiltArea] = useState('');
  const [carpetArea,setCarpetArea] = useState('');
  const [rera,setRera] = useState('');
  const [possessionDate,setPossessionDate] = useState('');
  const [facing,setFacing] = useState('');
  const [transactionType,setTransactionType] = useState('New Booking');
  const [loanAvailable,setLoanAvailable] = useState('Yes');
  const [approvedBy,setApprovedBy] = useState('');

  // Rent fields
  const [preferredTenants,setPreferredTenants] = useState('Family');
  const [securityDeposit,setSecurityDeposit] = useState('');
  const [maintenanceCharges,setMaintenanceCharges] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = getToken();
        const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
          headers: { Authorization: 'Bearer ' + token }
        });
        const data = await res.json();
        if(res.ok){
          setTitle(data.title || '');
          setPurpose(data.purpose || 'sale');
          setCategory(data.category || 'residential');
          setCity(data.city || '');
          setLocality(data.locality || '');
          setDescription(data.description || '');
          setUnits(data.units || [{type:'1 BHK',area:'',price:'',floor:'',availableFrom:''}]);
          setAmenities(data.amenities || []);
          setImages([]); // new upload images
          setPropertyType(data.propertyType || '');
          setOwnership(data.ownership || 'Builder');
          setSuperBuiltArea(data.superBuiltArea || '');
          setBuiltArea(data.builtArea || '');
          setCarpetArea(data.carpetArea || '');
          setRera(data.rera || '');
          setPossessionDate(data.possessionDate ? data.possessionDate.slice(0,10) : '');
          setFacing(data.facing || '');
          setTransactionType(data.transactionType || 'New Booking');
          setLoanAvailable(data.loanAvailable || 'Yes');
          setApprovedBy(data.approvedBy || '');
          setPreferredTenants(data.preferredTenants || 'Family');
          setSecurityDeposit(data.securityDeposit || '');
          setMaintenanceCharges(data.maintenanceCharges || '');
        } else {
          alert(data.message || 'Error fetching property');
        }
      } catch(err){
        console.error(err);
        alert('Error fetching property');
      } finally{
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const addUnit = () => setUnits([...units,{type:'1 BHK',area:'',price:'',floor:'',availableFrom:''}]);
  const removeUnit = i => setUnits(units.filter((_,idx)=>idx!==i));
  const changeUnit = (i,field,v) => { const c=[...units]; c[i][field]=v; setUnits(c); };
  const toggleAmenity = a => setAmenities(prev => prev.includes(a)?prev.filter(x=>x!==a):[...prev,a]);
  const handleFiles = e => setImages([...images, ...Array.from(e.target.files)]);

  const submit = async e => {
    e.preventDefault();
    const token = getToken();
    if(!token) return alert('Please login');

    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('purpose', purpose);
    fd.append('category', category);
    fd.append('city', city);
    fd.append('locality', locality);
    fd.append('units', JSON.stringify(units));
    fd.append('amenities', JSON.stringify(amenities));

    if(purpose==='sale'){
      fd.append('propertyType', propertyType);
      fd.append('ownership', ownership);
      fd.append('superBuiltArea', superBuiltArea);
      fd.append('builtArea', builtArea);
      fd.append('carpetArea', carpetArea);
      fd.append('rera', rera);
      fd.append('possessionDate', possessionDate);
      fd.append('facing', facing);
      fd.append('transactionType', transactionType);
      fd.append('loanAvailable', loanAvailable);
      fd.append('approvedBy', approvedBy);
    } else {
      fd.append('preferredTenants', preferredTenants);
      fd.append('securityDeposit', securityDeposit);
      fd.append('maintenanceCharges', maintenanceCharges);
    }

    images.forEach(f=>fd.append('images', f));

    try{
      const res = await fetch(`http://localhost:5000/api/properties/admin/${id}`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + token },
        body: fd
      });
      const data = await res.json();
      if(res.ok){
        alert('Property updated successfully');
        navigate(`/property/${data.property.slug}`);
      } else {
        alert(data.message || 'Error updating property');
      }
    } catch(err){
      console.error(err);
      alert('Error updating property');
    }
  };

  if(loading) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p:3, maxWidth:900, mx:'auto' }}>
      <Typography variant="h6">Update Property</Typography>
      <Box component="form" onSubmit={submit} sx={{ mt: 2 }}>
        <TextField label="Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} required />
        <Grid container spacing={2} sx={{ mt: 1 }}>
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
              <Select value={category} onChange={e => setCategory(e.target.value)}>
                <MenuItem value="residential">Residential</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="City" fullWidth value={city} onChange={e => setCity(e.target.value)} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Locality" fullWidth value={locality} onChange={e => setLocality(e.target.value)} required />
          </Grid>
        </Grid>

        {/* Sale or Rent fields */}
        {purpose === 'sale' && (
          <>
            <Typography sx={{ mt: 2 }}>Sale Specific Details</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}><TextField label="Property Type" fullWidth value={propertyType} onChange={e => setPropertyType(e.target.value)} /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Ownership</InputLabel>
                  <Select value={ownership} onChange={e => setOwnership(e.target.value)}>
                    {ownershipTypes.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}><TextField label="Super Built Area" fullWidth value={superBuiltArea} onChange={e => setSuperBuiltArea(e.target.value)} /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Built Area" fullWidth value={builtArea} onChange={e => setBuiltArea(e.target.value)} /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Carpet Area" fullWidth value={carpetArea} onChange={e => setCarpetArea(e.target.value)} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="RERA No." fullWidth value={rera} onChange={e => setRera(e.target.value)} /></Grid>
              <Grid item xs={12} sm={6}><TextField type="date" label="Possession Date" InputLabelProps={{ shrink: true }} fullWidth value={possessionDate} onChange={e => setPossessionDate(e.target.value)} /></Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Facing</InputLabel>
                  <Select value={facing} onChange={e => setFacing(e.target.value)}>
                    {facingOptions.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}

        {purpose === 'rent' && (
          <>
            <Typography sx={{ mt: 2 }}>Rent Specific Details</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Tenants</InputLabel>
                  <Select value={preferredTenants} onChange={e => setPreferredTenants(e.target.value)}>
                    {tenantTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}><TextField label="Security Deposit" fullWidth value={securityDeposit} onChange={e => setSecurityDeposit(e.target.value)} /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Maintenance Charges" fullWidth value={maintenanceCharges} onChange={e => setMaintenanceCharges(e.target.value)} /></Grid>
            </Grid>
          </>
        )}

        {/* Common fields */}
        <Typography sx={{ mt: 2 }}>Amenities</Typography>
        <Box sx={{ display:'flex', gap:1, flexWrap:'wrap', mt:1 }}>
          {amenitiesList.map(a => (
            <Chip key={a} label={a} clickable color={amenities.includes(a) ? 'primary' : 'default'} onClick={() => toggleAmenity(a)} />
          ))}
        </Box>

        <TextField label="Description" multiline rows={3} fullWidth sx={{ mt: 2 }} value={description} onChange={e => setDescription(e.target.value)} />

        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload Images
          <input hidden multiple type="file" onChange={handleFiles} />
        </Button>

        <Box sx={{ display:'flex', gap:1, mt:2, flexWrap:'wrap' }}>
          {images.map((f,i) => <img key={i} src={URL.createObjectURL(f)} alt='' width={120} style={{ borderRadius:6 }} />)}
        </Box>

        <Button type="submit" variant="contained" fullWidth sx={{ mt:3 }}>Update Property</Button>
      </Box>
    </Paper>
  );
}
