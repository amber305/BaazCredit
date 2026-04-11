from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
import shap

app = FastAPI(title="BaazCredit ML API")

# Load Models
MODEL_PATH = 'model/xgboost_model.pkl'
FEATURES_PATH = 'model/feature_names.pkl'

if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
    model = joblib.load(MODEL_PATH)
    feature_names = joblib.load(FEATURES_PATH)
    # Initialize JS visualization code for SHAP if needed, but here we just return values
    explainer = shap.TreeExplainer(model)
else:
    model = None
    feature_names = None
    explainer = None


class RiskInput(BaseModel):
    age: int
    income: float
    loan_amount: float
    employment_length: int
    dependents: int
    existing_loans: int
    transaction_frequency: int
    spending_pattern: float
    repayment_behavior: float
    mobile_usage: float
    utility_payments: int
    social_activity: int
    digital_payments: int

@app.get("/")
def read_root():
    return {"message": "Welcome to BaazCredit ML API", "model_loaded": model is not None}

@app.post("/predict_risk")
def predict_risk(data: RiskInput):
    if not model:
        raise HTTPException(status_code=500, detail="Model uninitialized. Please train model first.")
        
    # Create derived features
    debt_to_income = (data.existing_loans * 5000 + data.loan_amount) / (data.income + 1)
    digital_stability_index = (data.digital_payments + data.utility_payments * 10) / (data.transaction_frequency + 1)
    
    # Create dataframe for prediction
    input_dict = data.dict()
    input_dict['debt_to_income'] = debt_to_income
    input_dict['digital_stability_index'] = digital_stability_index
    
    df = pd.DataFrame([input_dict])
    
    # Ensure columns match training
    df = df[feature_names]
    
    # Inference
    prediction = int(model.predict(df)[0])
    probability = float(model.predict_proba(df)[0][1])
    
    # Calculate Credit Score (Range 300 - 850)
    # Lower probability of default = higher credit score
    # probability 0 -> 850
    # probability 1 -> 300
    credit_score = int(850 - (probability * (850 - 300)))
    
    # Calculate SHAP values for explainability
    shap_vals = explainer.shap_values(df)
    
    # Get top 3 driving factors
    feature_importances = dict(zip(feature_names, shap_vals[0]))
    sorted_features = sorted(feature_importances.items(), key=lambda x: abs(x[1]), reverse=True)
    top_factors = [{"feature": k, "impact": float(v)} for k, v in sorted_features[:5]]

    return {
        "prediction_class": prediction, # 0 = Low Risk, 1 = High Risk
        "risk_label": "High Risk" if prediction == 1 else "Low Risk",
        "default_probability": probability,
        "credit_score": credit_score,
        "top_factors": top_factors
    }
