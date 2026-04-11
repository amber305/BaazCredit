import express from 'express';
import { createPrediction, getUserPredictions, getAnalytics } from '../controllers/predictionController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/predict', protect, createPrediction);
router.get('/my-predictions', protect, getUserPredictions);
router.get('/analytics', protect, admin, getAnalytics);

export default router;
