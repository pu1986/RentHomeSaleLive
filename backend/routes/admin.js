import express from 'express';
import Property from '../models/Property.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all pending properties (Admin only)
router.get('/pending', protect, admin, async (req, res) => {
  try {
    const properties = await Property.find({ approved: false });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve property (Admin only)
router.put('/approve/:id', protect, admin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.approved = true;
    await property.save();

    res.json({ message: 'Property approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
