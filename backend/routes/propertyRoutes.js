import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createProperty,
  getApprovedProperties,
  getPendingProperties,
  approveProperty,
  getPropertyBySlug,
  togglePremiumProperty,
  updateMyProperty,        // ✅ user update
  adminUpdateProperty,     // ✅ admin update
  contactOwner,            // ✅ login enquiry
  contactOwnerGuest,       // ✅ guest enquiry
  checkEnquiry,             // ✅ new controller
  getMyProperties 
} from '../controllers/propertyController.js';

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

/* ------------------ ADMIN ROUTES ------------------ */

// ✅ Admin - force update any property
router.put('/admin/:id', protect, admin, upload.array('images', 12), adminUpdateProperty);

// ✅ Admin - get pending properties
router.get('/admin/pending', protect, admin, getPendingProperties);

// ✅ Admin - approve one property
router.patch('/:id/approve', protect, admin, approveProperty);

// ✅ Admin - toggle premium for a property
router.patch('/:id/premium', protect, admin, togglePremiumProperty);

/* ------------------ USER ROUTES ------------------ */

// ✅ Create property (multiple images) - default status pending
router.post('/', protect, upload.array('images', 12), createProperty);

// ✅ Update property (user himself)
router.put('/:id', protect, upload.array('images', 12), updateMyProperty);

/* ------------------ ENQUIRY ROUTES ------------------ */

// ✅ Guest enquiry (sirf "success" msg milega, contact details nahi)
router.post('/contact-owner-guest', contactOwnerGuest);

// ✅ Login enquiry (success + owner details)
router.post('/contact-owner', protect, contactOwner);

// ✅ Check if user already enquired for this property
router.post('/check-enquiry', protect, checkEnquiry);

/* ------------------ PUBLIC ROUTES ------------------ */

// ✅ Public - list of approved properties
router.get('/', getApprovedProperties);

// ✅ Public - get property by slug (SEO URL)
router.get('/slug/:slug', getPropertyBySlug);

router.get("/my-properties", protect, getMyProperties);

//router.post("/users/change-password", protect, changePassword);

export default router;
