import mongoose from 'mongoose';

const predictionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    inputs: {
        age: { type: Number, required: true },
        income: { type: Number, required: true },
        loan_amount: { type: Number, required: true },
        employment_length: { type: Number, required: true },
        dependents: { type: Number, required: true },
        existing_loans: { type: Number, required: true },
        transaction_frequency: { type: Number, required: true },
        spending_pattern: { type: Number, required: true },
        repayment_behavior: { type: Number, required: true },
        mobile_usage: { type: Number, required: true },
        utility_payments: { type: Number, required: true },
        social_activity: { type: Number, required: true },
        digital_payments: { type: Number, required: true }
    },
    result: {
        prediction_class: { type: Number, required: true },
        risk_label: { type: String, required: true },
        default_probability: { type: Number, required: true },
        credit_score: { type: Number, required: true },
        top_factors: [
            {
                feature: { type: String },
                impact: { type: Number }
            }
        ]
    }
}, {
    timestamps: true
});

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
