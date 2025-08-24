import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  CardMedia,
  Chip,
  Paper,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import { getUser, getToken } from "../App";

const API = "http://localhost:5000";

export default function PropertyDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [user, setUserState] = useState(null);
  const [enquiryDone, setEnquiryDone] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    // Fetch property detail
    fetch(`${API}/api/properties/slug/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setP(data);
        if (data.images?.length) setMainImage(`${API}/uploads/${data.images[0]}`);
      })
      .catch(console.error);

    // Check if user is logged in and has token
    const u = getUser();
    const token = getToken();
    if (u && token) {
      setUserState(u);

      // ✅ Use p._id once property is loaded
      fetch(`${API}/api/properties/slug/${slug}`)
        .then((res) => res.json())
        .then((propData) => {
          fetch(`${API}/api/properties/check-enquiry`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ propertyId: propData._id, userId: u._id }),
          })
            .then((r) => r.json())
            .then((res) => {
              if (res.alreadyEnquired) {
                setEnquiryDone(true);
                if (res.owner) setOwnerDetails(res.owner);
              }
            })
            .catch(console.error);
        });
    }
  }, [slug]);

  if (!p) return <Typography>Loading...</Typography>;

  const handleEnquiry = (e) => {
    e.preventDefault();
    const msg = e.target.message.value;
    const token = getToken();

    const body = {
      propertyId: p._id,
      userId: user?._id || null,
      userName: user?.name || guestInfo.name,
      userEmail: user?.email || guestInfo.email,
      userMobile: user?.mobile || guestInfo.mobile,
      message: msg,
    };

    fetch(`${API}/api/properties/${user ? "contact-owner" : "contact-owner-guest"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(user && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((res) => {
        setEnquiryDone(true);
        if (user && res.owner) {
          setOwnerDetails(res.owner);
        }
      })
      .catch(console.error);
  };

  return (
    <Grid container spacing={3} sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      {/* Left Section: Property Details */}
      <Grid item xs={12} md={8}>
        {mainImage && (
          <CardMedia
            component="img"
            image={mainImage}
            alt={p.title}
            sx={{ borderRadius: 2, height: 400, objectFit: "cover", mb: 2 }}
          />
        )}
        <Grid container spacing={1}>
          {p.images.map((img, i) => (
            <Grid item xs={3} sm={2} key={i}>
              <CardMedia
                component="img"
                image={`${API}/uploads/${img}`}
                alt={p.title}
                onClick={() => setMainImage(`${API}/uploads/${img}`)}
                sx={{
                  borderRadius: 1,
                  cursor: "pointer",
                  border: mainImage.includes(img) ? "2px solid #1976d2" : "1px solid #ccc",
                  height: 80,
                  objectFit: "cover",
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>{p.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary">{p.locality}, {p.city}</Typography>
        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {p.bhkType && <Chip label={p.bhkType} color="primary" />}
          <Chip label={p.purpose.toUpperCase()} variant="outlined" />
          <Chip label={p.category.charAt(0).toUpperCase() + p.category.slice(1)} variant="outlined" />
        </Box>

        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Property Details</Typography>
          <Table>
            <TableBody>
              <TableRow><TableCell>Super Built Area</TableCell><TableCell>{p.superBuiltArea} sq.ft</TableCell></TableRow>
              <TableRow><TableCell>Built Area</TableCell><TableCell>{p.builtArea} sq.ft</TableCell></TableRow>
              <TableRow><TableCell>Carpet Area</TableCell><TableCell>{p.carpetArea} sq.ft</TableCell></TableRow>
              <TableRow><TableCell>Facing</TableCell><TableCell>{p.facing}</TableCell></TableRow>
              <TableRow><TableCell>RERA ID</TableCell><TableCell>{p.rera}</TableCell></TableRow>
              <TableRow><TableCell>Ownership</TableCell><TableCell>{p.ownership}</TableCell></TableRow>
              <TableRow><TableCell>Possession Date</TableCell><TableCell>{p.possessionDate ? new Date(p.possessionDate).toLocaleDateString() : "NA"}</TableCell></TableRow>
              <TableRow><TableCell>Status</TableCell><TableCell>{p.status}</TableCell></TableRow>
            </TableBody>
          </Table>
        </Paper>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Description</Typography>
          <Typography sx={{ mt: 1 }}>{p.description}</Typography>
        </Box>
      </Grid>

      {/* Right Section: Enquiry Form */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, position: "sticky", top: 20 }}>
          {enquiryDone && ownerDetails ? (
            <>
              <Typography variant="h6">Owner Contact</Typography>
              <Typography>Name: {ownerDetails.name}</Typography>
              <Typography>Email: {ownerDetails.email}</Typography>
              <Typography>Mobile: {ownerDetails.mobile}</Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Contact Owner</Typography>

              {!user && enquiryDone && !ownerDetails && (
                <Typography sx={{ mb: 2, color: "green" }}>Enquiry has been sent.</Typography>
              )}

              <form onSubmit={handleEnquiry}>
                {!user && (
                  <>
                    <TextField
                      label="Name"
                      fullWidth
                      required
                      margin="dense"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    />
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      margin="dense"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    />
                    <TextField
                      label="Mobile"
                      fullWidth
                      required
                      margin="dense"
                      value={guestInfo.mobile}
                      onChange={(e) => setGuestInfo({ ...guestInfo, mobile: e.target.value })}
                    />
                  </>
                )}
                {user && (
                  <>
                    <TextField label="Name" fullWidth value={user.name} disabled margin="dense" />
                    <TextField label="Email" fullWidth value={user.email} disabled margin="dense" />
                    <TextField label="Mobile" fullWidth value={user.mobile} disabled margin="dense" />
                  </>
                )}
                <TextField
                  name="message"
                  label="Message"
                  fullWidth
                  required
                  multiline
                  rows={3}
                  margin="dense"
                />
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                  Send Enquiry
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
