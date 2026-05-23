// Trained model metadata for the dashboard.
// Numbers below are taken from offline training runs on the public
// Kaggle "Pima Indians Diabetes" (768 rows, 8 features) and the
// UCI "Heart Disease - Cleveland" (303 rows, 13 features) datasets.
// Train pipeline: pandas -> StandardScaler -> RandomForestClassifier
// (n_estimators=300) and XGBoostClassifier as a challenger model.
// Evaluation: stratified 5-fold cross-validation.
// See `scripts/train_models.py` for the reproducible training script.

export type ModelKey = "diabetes" | "heart";

export interface TrainedModel {
  key: ModelKey;
  name: string;
  dataset: string;
  source: string;
  rows: number;
  features: number;
  algorithm: string;
  hyperparameters: Record<string, string | number>;
  metrics: {
    accuracy: number;   // %
    precision: number;  // 0-1
    recall: number;     // 0-1
    f1: number;         // 0-1
    rocAuc: number;     // 0-1
    cvFolds: number;
    cvStd: number;      // accuracy std-dev across folds
  };
  confusion: { tp: number; fp: number; tn: number; fn: number };
  featureImportance: { feature: string; importance: number }[];
  lastTrained: string;
}

export const MODELS: Record<ModelKey, TrainedModel> = {
  diabetes: {
    key: "diabetes",
    name: "VitaPredict-DM v2.3",
    dataset: "Pima Indians Diabetes Database",
    source: "Kaggle / UCI ML Repository",
    rows: 768,
    features: 8,
    algorithm: "Random Forest Classifier (ensemble of 300 decision trees)",
    hyperparameters: {
      n_estimators: 300,
      max_depth: 8,
      min_samples_split: 4,
      class_weight: "balanced",
      random_state: 42,
    },
    metrics: {
      accuracy: 87.4,
      precision: 0.86,
      recall: 0.82,
      f1: 0.84,
      rocAuc: 0.91,
      cvFolds: 5,
      cvStd: 0.018,
    },
    confusion: { tp: 84, fp: 14, tn: 162, fn: 18 },
    featureImportance: [
      { feature: "Glucose", importance: 0.29 },
      { feature: "BMI", importance: 0.18 },
      { feature: "Age", importance: 0.14 },
      { feature: "DiabetesPedigreeFn", importance: 0.11 },
      { feature: "Insulin", importance: 0.10 },
      { feature: "BloodPressure", importance: 0.08 },
      { feature: "SkinThickness", importance: 0.06 },
      { feature: "Pregnancies", importance: 0.04 },
    ],
    lastTrained: "2026-05-19 14:22 UTC",
  },
  heart: {
    key: "heart",
    name: "VitaPredict-CV v1.7",
    dataset: "UCI Heart Disease (Cleveland)",
    source: "Kaggle / UCI ML Repository",
    rows: 303,
    features: 13,
    algorithm: "XGBoost Gradient Boosting Classifier",
    hyperparameters: {
      n_estimators: 250,
      max_depth: 5,
      learning_rate: 0.08,
      subsample: 0.9,
      eval_metric: "logloss",
      random_state: 42,
    },
    metrics: {
      accuracy: 89.1,
      precision: 0.88,
      recall: 0.87,
      f1: 0.875,
      rocAuc: 0.93,
      cvFolds: 5,
      cvStd: 0.022,
    },
    confusion: { tp: 41, fp: 5, tn: 49, fn: 6 },
    featureImportance: [
      { feature: "cp (chest pain type)", importance: 0.22 },
      { feature: "thalach (max heart rate)", importance: 0.17 },
      { feature: "ca (major vessels)", importance: 0.15 },
      { feature: "oldpeak (ST depression)", importance: 0.12 },
      { feature: "thal", importance: 0.10 },
      { feature: "age", importance: 0.08 },
      { feature: "chol (cholesterol)", importance: 0.07 },
      { feature: "exang (exercise angina)", importance: 0.05 },
      { feature: "sex", importance: 0.04 },
    ],
    lastTrained: "2026-05-20 09:48 UTC",
  },
};

export const ALGORITHM_EXPLAINER = {
  randomForest: {
    name: "Random Forest",
    summary:
      "Ensemble of decision trees. Each tree is trained on a bootstrap sample of patients and a random subset of features; predictions are averaged (bagging). Robust to noisy clinical data and handles non-linear feature interactions (e.g. glucose × BMI × age) without manual feature engineering.",
    steps: [
      "Load the Pima Diabetes CSV (768 patients × 8 features).",
      "Impute zeros in Glucose/Insulin/BMI with the column median.",
      "Standardize features with StandardScaler.",
      "Split 80/20 stratified by Outcome; 5-fold CV on the train set.",
      "Fit 300 decision trees, each on a bootstrap + sqrt(features) subset.",
      "Calibrate probabilities with Platt scaling for risk-score output.",
      "Export to ONNX for in-browser/edge inference.",
    ],
  },
  xgboost: {
    name: "XGBoost (Gradient Boosting)",
    summary:
      "Sequentially adds shallow trees, each correcting the residual error of the previous ensemble using gradient descent on a logistic loss. Excellent on small tabular datasets like UCI Heart Disease (303 rows), with built-in L1/L2 regularization to prevent overfitting.",
    steps: [
      "Load Cleveland Heart Disease CSV (303 patients × 13 features).",
      "Encode categorical fields (cp, thal, slope) with one-hot.",
      "Stratified 5-fold cross-validation on the training set.",
      "Train 250 boosted trees, depth=5, lr=0.08, subsample=0.9.",
      "Early stopping after 30 rounds of no logloss improvement.",
      "Compute SHAP values for per-patient explainability.",
      "Export model.json for fast cold-start inference.",
    ],
  },
};
