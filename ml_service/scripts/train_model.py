import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.preprocessing import StandardScaler
import joblib
import os

def load_data(filepath='data/credit_data.csv'):
    df = pd.read_csv(filepath)
    X = df.drop('default_risk', axis=1)
    y = df['default_risk']
    return X, y

def train_and_evaluate(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Scale data for Logistic Regression
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    metrics = {}
    
    # 1. Logistic Regression
    lr = LogisticRegression(max_iter=1000)
    lr.fit(X_train_scaled, y_train)
    y_pred_lr = lr.predict(X_test_scaled)
    y_prob_lr = lr.predict_proba(X_test_scaled)[:, 1]
    
    metrics['Logistic Regression'] = evaluate_model(y_test, y_pred_lr, y_prob_lr)
    
    # 2. Random Forest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    y_prob_rf = rf.predict_proba(X_test)[:, 1]
    
    metrics['Random Forest'] = evaluate_model(y_test, y_pred_rf, y_prob_rf)
    
    # 3. XGBoost
    xgb_model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    xgb_model.fit(X_train, y_train)
    y_pred_xgb = xgb_model.predict(X_test)
    y_prob_xgb = xgb_model.predict_proba(X_test)[:, 1]
    
    metrics['XGBoost'] = evaluate_model(y_test, y_pred_xgb, y_prob_xgb)
    
    # Save best model (XGBoost) and scaler
    os.makedirs('model', exist_ok=True)
    joblib.dump(xgb_model, 'model/xgboost_model.pkl')
    # Save feature names to ensure proper format on inference
    joblib.dump(list(X.columns), 'model/feature_names.pkl')
    
    print("\nModel Training Complete! Metrics:")
    for model_name, res in metrics.items():
        print(f"--- {model_name} ---")
        for k, v in res.items():
            print(f"{k}: {v:.4f}")
            
def evaluate_model(y_true, y_pred, y_prob):
    return {
        'Accuracy': accuracy_score(y_true, y_pred),
        'Precision': precision_score(y_true, y_pred),
        'Recall': recall_score(y_true, y_pred),
        'F1 Score': f1_score(y_true, y_pred),
        'ROC-AUC': roc_auc_score(y_true, y_prob)
    }

if __name__ == "__main__":
    if not os.path.exists('data/credit_data.csv'):
        print("Data not found. Please run generate_data.py first.")
    else:
        print("Loading data and training models...")
        X, y = load_data()
        train_and_evaluate(X, y)
        print("Primary model saved at model/xgboost_model.pkl")
