# Train the VitaPredict models from raw Kaggle data.
# Usage:
#   pip install pandas scikit-learn xgboost
#   python scripts/train_models.py
#
# Datasets (download from Kaggle and place in ./data/):
#   - diabetes.csv          (Pima Indians Diabetes Database, 768 rows)
#   - heart.csv             (UCI Heart Disease - Cleveland, 303 rows)

import json
import pandas as pd
from pathlib import Path
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix,
)

try:
    from xgboost import XGBClassifier
except ImportError:
    XGBClassifier = None

DATA = Path(__file__).resolve().parent.parent / "data"
OUT = Path(__file__).resolve().parent.parent / "src" / "lib" / "model-metrics.generated.json"


def evaluate(model, X, y, name):
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_validate(model, X, y, cv=cv, scoring=["accuracy", "f1", "precision", "recall", "roc_auc"])
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, stratify=y, test_size=0.2, random_state=42)
    model.fit(X_tr, y_tr)
    y_pred = model.predict(X_te)
    y_prob = model.predict_proba(X_te)[:, 1]
    tn, fp, fn, tp = confusion_matrix(y_te, y_pred).ravel()
    return {
        "name": name,
        "metrics": {
            "accuracy": float(accuracy_score(y_te, y_pred) * 100),
            "precision": float(precision_score(y_te, y_pred)),
            "recall": float(recall_score(y_te, y_pred)),
            "f1": float(f1_score(y_te, y_pred)),
            "rocAuc": float(roc_auc_score(y_te, y_prob)),
            "cvFolds": 5,
            "cvStd": float(scores["test_accuracy"].std()),
        },
        "confusion": {"tp": int(tp), "fp": int(fp), "tn": int(tn), "fn": int(fn)},
        "featureImportance": sorted(
            [{"feature": f, "importance": float(i)} for f, i in zip(X.columns, model.feature_importances_)],
            key=lambda x: -x["importance"],
        ),
    }


def main():
    out = {}

    # ----- Diabetes (Random Forest) -----
    df = pd.read_csv(DATA / "diabetes.csv")
    for col in ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]:
        df[col] = df[col].replace(0, df[col].median())
    X = df.drop(columns=["Outcome"])
    y = df["Outcome"]
    X_scaled = pd.DataFrame(StandardScaler().fit_transform(X), columns=X.columns)
    rf = RandomForestClassifier(n_estimators=300, max_depth=8, min_samples_split=4,
                                class_weight="balanced", random_state=42)
    out["diabetes"] = evaluate(rf, X_scaled, y, "VitaPredict-DM")

    # ----- Heart Disease (XGBoost) -----
    if XGBClassifier is not None:
        df = pd.read_csv(DATA / "heart.csv")
        target = "target" if "target" in df.columns else "num"
        X = pd.get_dummies(df.drop(columns=[target]), drop_first=True)
        y = (df[target] > 0).astype(int)
        xgb = XGBClassifier(n_estimators=250, max_depth=5, learning_rate=0.08,
                            subsample=0.9, eval_metric="logloss", random_state=42)
        out["heart"] = evaluate(xgb, X, y, "VitaPredict-CV")

    OUT.write_text(json.dumps(out, indent=2))
    print(f"✅ Wrote {OUT}")
    for k, v in out.items():
        print(f"  {k}: accuracy={v['metrics']['accuracy']:.2f}%, F1={v['metrics']['f1']:.3f}")


if __name__ == "__main__":
    main()
