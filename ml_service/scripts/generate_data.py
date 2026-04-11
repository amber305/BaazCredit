import pandas as pd
import numpy as np
import os

def generate_synthetic_data(num_records=10000):
    np.random.seed(42)
    
    # Base Features
    age = np.random.randint(18, 70, size=num_records)
    income = np.random.normal(50000, 20000, size=num_records)
    income = np.clip(income, 10000, 200000)
    loan_amount = np.random.normal(15000, 8000, size=num_records)
    loan_amount = np.clip(loan_amount, 1000, 100000)
    employment_length = np.random.randint(0, 40, size=num_records)
    dependents = np.random.randint(0, 6, size=num_records)
    existing_loans = np.random.randint(0, 5, size=num_records)
    
    # Behavioral Features
    transaction_frequency = np.random.randint(5, 100, size=num_records)  # transactions per month
    spending_pattern = np.random.uniform(0.1, 0.9, size=num_records)     # ratio of income spent
    repayment_behavior = np.random.uniform(0, 1, size=num_records)       # higher is better
    
    # Alternative Data
    mobile_usage = np.random.uniform(1, 12, size=num_records)            # hours per day
    utility_payments = np.random.choice([0, 1], size=num_records, p=[0.2, 0.8]) # 1 = on time
    social_activity = np.random.randint(0, 50, size=num_records)         # posts/interactions per month
    digital_payments = np.random.randint(0, 50, size=num_records)        # digital transactions per month
    
    # Derived Features for Risk Scoring
    debt_to_income = (existing_loans * 5000 + loan_amount) / (income + 1)
    digital_stability_index = (digital_payments + utility_payments * 10) / (transaction_frequency + 1)
    
    df = pd.DataFrame({
        'age': age,
        'income': income,
        'loan_amount': loan_amount,
        'employment_length': employment_length,
        'dependents': dependents,
        'existing_loans': existing_loans,
        'transaction_frequency': transaction_frequency,
        'spending_pattern': spending_pattern,
        'repayment_behavior': repayment_behavior,
        'mobile_usage': mobile_usage,
        'utility_payments': utility_payments,
        'social_activity': social_activity,
        'digital_payments': digital_payments,
        'debt_to_income': debt_to_income,
        'digital_stability_index': digital_stability_index
    })
    
    # Target Variable logic (0 = low risk, 1 = high risk)
    # Give higher weight to some negative indicators
    risk_score = (
        (df['debt_to_income'] > 0.4).astype(int) * 3 +
        (df['repayment_behavior'] < 0.4).astype(int) * 2 +
        (df['spending_pattern'] > 0.7).astype(int) * 1 +
        (df['utility_payments'] == 0).astype(int) * 1
    )
    
    df['default_risk'] = (risk_score >= 3).astype(int)
    
    return df

if __name__ == "__main__":
    print("Generating synthetic data...")
    df = generate_synthetic_data(10000)
    
    # Make sure data folder exists
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/credit_data.csv', index=False)
    
    print(f"Dataset generated with shape: {df.shape}")
    print(df['default_risk'].value_counts())
