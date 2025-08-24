import nodemailer from 'nodemailer';
import Property from '../models/Property.js';
import Enquiry from '../models/Enquiry.js';
import User from '../models/User.js';

// ✅ Handle images smartly (helper function)
const processImages = (property, body, files) => {
  let finalImages = [...property.images]; 
  const newImages = (files || []).map(f => f.filename);

  if (Array.isArray(body.removeImages)) {
    finalImages = finalImages.filter(img => !body.removeImages.includes(img));
  }

  if (body.replaceImages === "true" || body.replaceImages === true) {
    finalImages = [...newImages];
  } else if (newImages.length > 0) {
    finalImages = [...finalImages, ...newImages];
  }

  return finalImages;
};

// ✅ Public - list of approved properties
export const getApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'approved' })
      .sort({ isPremium: -1, createdAt: -1 }); 
      // 👆 Premium sabse upar, phir latest properties
    res.json(properties);
  } catch (err) {
    console.error("❌ Error fetching approved properties:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Create property - default pending, premium option
export const createProperty = async (req, res) => {
  try {
    const body = req.body;
    const rawUnits = body.units ? JSON.parse(body.units) : [];
    const units = rawUnits.map(u => ({
      type: u.type || "",
      area: u.area || "",
      price: u.price || 0,
      floor: u.floor || "",
      availableFrom: u.availableFrom || ""
    }));

    const amenities = body.amenities ? JSON.parse(body.amenities) : [];
    const images = (req.files || []).map(f => f.filename);

    let slug = body.slug ? body.slug.toLowerCase().replace(/\s+/g, '-') : null;
    if (slug) {
      const existing = await Property.findOne({ slug });
      if (existing) slug = `${slug}-${Date.now()}`;
    }

    const prop = new Property({
      owner: req.user._id,
      title: body.title,
      description: body.description,
      purpose: body.purpose?.toLowerCase(),
      category: body.category?.toLowerCase(),
      bhkType: body.bhkType,
      city: body.city,
      locality: body.locality,
      propertyType: body.propertyType || "",
      ownership: body.ownership || "self",
      superBuiltArea: body.superBuiltArea || "",
      builtArea: body.builtArea || "",
      carpetArea: body.carpetArea || "",
      rera: body.rera || "",
      possessionDate: body.possessionDate || null,
      facing: body.facing || "",
      amenities,
      units,
      images,
      slug,
      status: 'pending',
      isPremium: !!body.isPremium,
      ownerEmail: body.ownerEmail || "",     // ✅ added
      ownerMobile: body.ownerMobile || ""    // ✅ added
    });

    await prop.save();
    res.status(201).json({ message: 'Property created', property: prop });
  } catch (err) {
    console.error("❌ Error creating property:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ User update own property
export const updateMyProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    if (property.owner.toString() !== req.user._id.toString()) 
      return res.status(403).json({ message: "Not authorized" });

    const units = body.units ? JSON.parse(body.units) : property.units;
    const amenities = body.amenities ? JSON.parse(body.amenities) : property.amenities;
    const images = processImages(property, body, req.files);

    Object.assign(property, {
      title: body.title || property.title,
      description: body.description || property.description,
      purpose: body.purpose?.toLowerCase() || property.purpose,
      category: body.category?.toLowerCase() || property.category,
      bhkType: body.bhkType ?? property.bhkType,
      city: body.city || property.city,
      locality: body.locality || property.locality,
      propertyType: body.propertyType ?? property.propertyType,
      ownership: body.ownership ?? property.ownership,
      superBuiltArea: body.superBuiltArea ?? property.superBuiltArea,
      builtArea: body.builtArea ?? property.builtArea,
      carpetArea: body.carpetArea ?? property.carpetArea,
      rera: body.rera ?? property.rera,
      possessionDate: body.possessionDate ?? property.possessionDate,
      facing: body.facing ?? property.facing,
      amenities,
      units,
      images,
      ownerEmail: body.ownerEmail ?? property.ownerEmail,   // ✅ added
      ownerMobile: body.ownerMobile ?? property.ownerMobile  // ✅ added
    });

    await property.save();
    res.json({ message: "Property updated", property });
  } catch (err) {
    console.error("❌ Error updating property:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin update any property
export const adminUpdateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const units = body.units ? JSON.parse(body.units) : property.units;
    const amenities = body.amenities ? JSON.parse(body.amenities) : property.amenities;
    const images = processImages(property, body, req.files);

    Object.assign(property, {
      title: body.title || property.title,
      description: body.description || property.description,
      purpose: body.purpose?.toLowerCase() || property.purpose,
      category: body.category?.toLowerCase() || property.category,
      bhkType: body.bhkType ?? property.bhkType,
      city: body.city || property.city,
      locality: body.locality || property.locality,
      propertyType: body.propertyType ?? property.propertyType,
      ownership: body.ownership ?? property.ownership,
      superBuiltArea: body.superBuiltArea ?? property.superBuiltArea,
      builtArea: body.builtArea ?? property.builtArea,
      carpetArea: body.carpetArea ?? property.carpetArea,
      rera: body.rera ?? property.rera,
      possessionDate: body.possessionDate ?? property.possessionDate,
      facing: body.facing ?? property.facing,
      amenities,
      units,
      images,
      status: body.status ?? property.status,
      isPremium: body.isPremium ?? property.isPremium,
      ownerEmail: body.ownerEmail ?? property.ownerEmail,   // ✅ added
      ownerMobile: body.ownerMobile ?? property.ownerMobile  // ✅ added
    });

    await property.save();
    res.json({ message: "Property updated by admin", property });
  } catch (err) {
    console.error("❌ Admin error updating property:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin - approve one property
export const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.status = 'approved';
    await property.save();
    res.json({ message: "Property approved", property });
  } catch (err) {
    console.error("❌ Error approving property:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin - approve all pending properties
export const approveAllProperties = async (req, res) => {
  try {
    const result = await Property.updateMany(
      { status: 'pending' },
      { $set: { status: 'approved' } }
    );
    res.json({ message: "All pending properties approved", modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("❌ Error approving all properties:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin - get all pending properties
export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    console.error("❌ Error fetching pending properties:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Public - get property by slug (SEO friendly URL)
export const getPropertyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const property = await Property.findOne({ slug });
    if (!property) return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch (err) {
    console.error("❌ Error fetching property by slug:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin - toggle premium status of a property
export const togglePremiumProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.isPremium = !property.isPremium; // toggle
    await property.save();

    res.json({ message: "Property premium status toggled", property });
  } catch (err) {
    console.error("❌ Error toggling premium:", err);
    res.status(500).json({ message: err.message });
  }
};


export const contactOwner = async (req, res) => {
  try {
    const { propertyId, userId, userName, userEmail, userMobile, message } = req.body;

    // already enquired check
    const existing = await Enquiry.findOne({ propertyId, userId });
    if (existing) {
      return res.json({ success: true, alreadyEnquired: true });
    }

    // save enquiry
    const enquiry = new Enquiry({
      propertyId,
      userId,
      userName,
      userEmail,
      userMobile,
      message,
    });
    await enquiry.save();

    // find property + owner
    const property = await Property.findById(propertyId).populate("owner", "name email mobile");
    if (!property) return res.status(404).json({ error: "Property not found" });

    res.json({
      success: true,
      owner: {
        name: property.owner?.name || "Property Owner",
        email: property.ownerEmail || property.owner?.email,
        mobile: property.ownerMobile || property.owner?.mobile,
      },
    });
  } catch (err) {
    console.error("❌ Error in contactOwner:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Check if user already enquired
export const checkEnquiry = async (req, res) => {
  try {
    const { propertyId, userId } = req.body;
    const existing = await Enquiry.findOne({ propertyId, userId });

    if (!existing) {
      return res.json({ alreadyEnquired: false });
    }

    // ✅ agar enquiry hai to property + owner fetch karo
    const property = await Property.findById(propertyId).populate("owner", "name email mobile");
    if (!property) return res.status(404).json({ error: "Property not found" });

    res.json({
      alreadyEnquired: true,
      owner: {
        name: property.owner?.name || "Property Owner",
        email: property.ownerEmail || property.owner?.email,
        mobile: property.ownerMobile || property.owner?.mobile,
      },
    });
  } catch (err) {
    console.error("❌ Error in checkEnquiry:", err);
    res.status(500).json({ message: err.message });
  }
};

export const contactOwnerGuest = async (req, res) => {
  try {
    const { propertyId, userName, userEmail, userMobile, message } = req.body;

    const property = await Property.findById(propertyId).populate('owner', 'name email');

    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ya koi SMTP service
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: `"Guest Enquiry" <${process.env.EMAIL_USER}>`,
      to: property.owner.email,
      subject: `New Enquiry for your property: ${property.title}`,
      html: `
        <p><b>Name:</b> ${userName}</p>
        <p><b>Email:</b> ${userEmail}</p>
        <p><b>Mobile:</b> ${userMobile}</p>
        <p><b>Message:</b> ${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }); // ✅ owner use karo
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your properties" });
  }
};


