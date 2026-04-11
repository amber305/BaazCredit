import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Gauge } from 'lucide-react';

const Predict = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        age: 30,
        income: 50000,
        loan_amount: 15000,
        employment_length: 5,
        dependents: 0,
        existing_loans: 1,
        transaction_frequency: 30,
        spending_pattern: 0.5,
        repayment_behavior: 0.8,
        mobile_usage: 5.0,
        utility_payments: 1,
        social_activity: 10,
        digital_payments: 20
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/predictions/predict', formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error processing prediction');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, name, type="number", step="1") => (
        <div>
            <label className="label-text">{label}</label>
            <input 
                type={type}
                name={name}
                step={step}
                value={formData[name]}
                onChange={handleChange}
                className="input-field"
                required
            />
        </div>
    );

    return (
        <div className="min-h-screen p-6 md:p-12 relative">
            <div className="max-w-5xl mx-auto z-10 relative">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/20 text-primary rounded-xl">
                        <Gauge size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Risk Assessment Entry</h1>
                        <p className="text-textMuted">Fill in the candidate's data to generate an AI credit score.</p>
                    </div>
                </div>

                {error && <div className="bg-danger/20 text-danger p-4 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="glass-panel p-8">
                    
                    <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">Base Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {renderInput("Age", "age")}
                        {renderInput("Annual Income ($)", "income")}
                        {renderInput("Loan Amount ($)", "loan_amount")}
                        {renderInput("Employment (Years)", "employment_length")}
                        {renderInput("Dependents", "dependents")}
                        {renderInput("Existing Loans", "existing_loans")}
                    </div>

                    <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">Behavioral Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {renderInput("Txns / Month", "transaction_frequency")}
                        {renderInput("Spending Ratio (0-1)", "spending_pattern", "number", "0.1")}
                        {renderInput("Repayment Score (0-1)", "repayment_behavior", "number", "0.1")}
                    </div>

                    <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">Alternative Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {renderInput("Mobile Usage (hrs/day)", "mobile_usage", "number", "0.1")}
                        <div>
                            <label className="label-text">Utility Payments On Time?</label>
                            <select 
                                name="utility_payments" 
                                value={formData.utility_payments} 
                                onChange={handleChange} 
                                className="input-field"
                            >
                                <option value={1}>Yes</option>
                                <option value={0}>No</option>
                            </select>
                        </div>
                        {renderInput("Social Interactions / Month", "social_activity")}
                        {renderInput("Digital Payments / Month", "digital_payments")}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={loading} className="btn-primary min-w-[200px] flex justify-center items-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : 'Generate Score'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Predict;
