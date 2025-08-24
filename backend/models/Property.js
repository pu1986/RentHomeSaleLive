import mongoose from 'mongoose';

// Unit schema
const unitSchema = new mongoose.Schema(
  {
    type: { type: String, default: "Unit" },   // 1BHK / 2BHK / etc
    area: { type: String, default: "" },       // area in sq.ft
    price: { type: Number, default: 0 },       // default 0
    floor: { type: String, default: "" },
    availableFrom: { type: Date }              // stored as Date, optional
  },
  { _id: false }
);

// Simple slugify function
function slugify(str) {
  return (str || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')      // spaces → dash
    .replace(/[^a-z0-9-]/g, '')   // remove special chars
    .replace(/-+/g, '-')          // collapse multiple dashes
    .replace(/^-|-$/g, '');       // trim starting/ending dash
}

// Main property schema
const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    purpose: { type: String, enum: ['rent', 'sale'], required: true },
    category: { type: String, required: true },
    bhkType: { type: String, default: "" },
    city: { type: String, required: true },
    locality: { type: String, required: true },

    // ✅ Sale-specific fields
    propertyType: { type: String, default: "" },   // Flat, Villa, Plot, etc.
    ownership: { type: String, enum: ['builder', 'self', 'other'], default: "self" },
    superBuiltArea: { type: String, default: "" },
    builtArea: { type: String, default: "" },
    carpetArea: { type: String, default: "" },
    rera: { type: String, default: "" },
    possessionDate: { type: Date },
    facing: { type: String, default: "" },

    // ✅ Contact details
    ownerEmail: { type: String, default: "" },
    ownerMobile: { type: String, default: "" },

    amenities: { type: [String], default: [] },
    units: { type: [unitSchema], default: [] },
    images: { type: [String], default: [] },

    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    isPremium: { type: Boolean, default: false },
    slug: { type: String, unique: true, index: true }
  },
  { timestamps: true }
);

// Generate unique slug
propertySchema.statics.makeUniqueSlug = async function (base) {
  let candidate = base;
  let counter = 2;
  while (await this.exists({ slug: candidate })) {
    candidate = `${base}-${counter++}`;
  }
  return candidate;
};

// Pre-save hook to set slug
propertySchema.pre('save', async function (next) {
  if (
    !this.isModified('title') &&
    !this.isModified('city') &&
    !this.isModified('locality') &&
    !this.isModified('bhkType') &&
    !this.isModified('purpose') &&
    this.slug
  ) {
    return next();
  }

  const parts = [];
  if (this.bhkType) parts.push(this.bhkType);
  if (this.category) parts.push(this.category);
  if (this.locality) parts.push(this.locality);
  if (this.city) parts.push(this.city);
  if (this.purpose) parts.push(`for-${this.purpose}`);
  if (!parts.length && this.title) parts.push(this.title);

  const base = slugify(parts.join(' ')) || slugify(this.title) || 'property';
  this.slug = await this.constructor.makeUniqueSlug(base);

  next();
});

export default mongoose.model('Property', propertySchema);
