import axios from 'axios';
import Prediction from '../models/Prediction.js';

export const createPrediction = async (req, res) => {
    try {
        const inputData = req.body;
        
        // Ensure all required fields are present (you can add robust validation here)
        const requiredFields = [
            'age', 'income', 'loan_amount', 'employment_length', 'dependents',
            'existing_loans', 'transaction_frequency', 'spending_pattern',
            'repayment_behavior', 'mobile_usage', 'utility_payments',
            'social_activity', 'digital_payments'
        ];

        for (const field of requiredFields) {
            if (inputData[field] === undefined) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        // Call the ML Service
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
        const response = await axios.post(`${mlServiceUrl}/predict_risk`, inputData);
        
        const mlResult = response.data;

        // Save prediction to DB
        const predictionRecord = await Prediction.create({
            user: req.user._id,
            inputs: inputData,
            result: mlResult
        });

        res.status(201).json(predictionRecord);

    } catch (error) {
        console.error("Prediction Error:", error.message);
        res.status(500).json({ 
            message: 'Failed to process prediction', 
            details: error.response?.data || error.message 
        });
    }
};

export const getUserPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        // Only admins can access this route (handled by middleware)
        const totalPredictions = await Prediction.countDocuments({});
        const highRisk = await Prediction.countDocuments({ "result.prediction_class": 1 });
        const lowRisk = await Prediction.countDocuments({ "result.prediction_class": 0 });
        
        // Most recent predictions
        const recentActivity = await Prediction.find({}).sort({ createdAt: -1 }).limit(10).populate('user', 'name email');

        res.json({
            totalPredictions,
            highRisk,
            lowRisk,
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
};
