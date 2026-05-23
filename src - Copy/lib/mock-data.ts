export const kpiData = {
  totalPatients: 24532,
  totalPatientsChange: 4.2,
  highRiskToday: 1248,
  highRiskChange: 12.5,
  avgRiskScore: 68,
  avgRiskChange: -2.1,
  modelAccuracy: 94.7,
  modelAccuracyChange: 0.8,
  activeAlerts: 86,
  activeAlertsChange: 8.4,
};

export const sparkline = (base: number, n = 14) =>
  Array.from({ length: n }, (_, i) => ({
    x: i,
    y: Math.round(base + Math.sin(i / 2) * (base * 0.08) + (Math.random() - 0.5) * base * 0.06),
  }));

export const riskTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    low: Math.round(1400 + Math.sin(i / 3) * 100 + Math.random() * 80),
    medium: Math.round(900 + Math.cos(i / 4) * 120 + Math.random() * 60),
    high: Math.round(280 + Math.sin(i / 5) * 60 + Math.random() * 40),
  };
});

export const diseaseCategories = [
  { name: "Cardiac", low: 420, medium: 280, high: 140 },
  { name: "Diabetes", low: 380, medium: 310, high: 95 },
  { name: "Respiratory", low: 290, medium: 220, high: 180 },
  { name: "Neurological", low: 180, medium: 140, high: 60 },
  { name: "Oncology", low: 120, medium: 160, high: 110 },
  { name: "Infectious", low: 240, medium: 180, high: 70 },
];

export const riskDistribution = [
  { name: "Low Risk", value: 16240, color: "var(--color-chart-6)" },
  { name: "Medium Risk", value: 7044, color: "var(--color-chart-3)" },
  { name: "High Risk", value: 1248, color: "var(--color-chart-4)" },
];

export const wards = [
  "ICU", "Cardiology", "Emergency", "Oncology", "Neurology", "Pediatrics", "General", "Surgery",
];

export const populationRows = Array.from({ length: 48 }, (_, i) => {
  const score = Math.round(20 + Math.random() * 78);
  const level = score > 75 ? "High" : score > 50 ? "Medium" : "Low";
  const cats = ["Cardiac", "Diabetes", "Respiratory", "Neurological", "Oncology", "Infectious"];
  return {
    id: `PT-${String(10000 + i).padStart(5, "0")}`,
    ward: wards[i % wards.length],
    category: cats[i % cats.length],
    score,
    level,
    updated: `${Math.floor(Math.random() * 59) + 1}m ago`,
    trend: Math.random() > 0.5 ? "up" : "down",
    status: ["Stable", "Monitoring", "Critical"][Math.min(2, Math.floor(score / 35))],
  };
});

export const alerts = Array.from({ length: 12 }, (_, i) => {
  const sev = ["critical", "high", "medium"][i % 3] as "critical" | "high" | "medium";
  return {
    id: `ALR-${2000 + i}`,
    severity: sev,
    title: [
      "Sudden risk spike in Cardiology ward",
      "Sepsis probability above threshold",
      "Glucose level anomaly cluster",
      "Oxygen saturation drop detected",
      "Readmission risk surge",
      "ICU capacity nearing limit",
    ][i % 6],
    ward: wards[i % wards.length],
    time: `${Math.floor(Math.random() * 50) + 1}m ago`,
    confidence: Math.round(78 + Math.random() * 20),
    reason: "AI model flagged abnormal vital pattern combined with prior history.",
    status: ["Open", "Acknowledged", "Escalated"][i % 3],
  };
});

export const wardHeatmap = wards.map((w) => ({
  ward: w,
  risk: Math.round(30 + Math.random() * 65),
  occupancy: Math.round(50 + Math.random() * 48),
  beds: Math.round(20 + Math.random() * 60),
}));

export const regions = [
  { name: "North Wing", x: 18, y: 22, risk: 82, patients: 412 },
  { name: "South Wing", x: 70, y: 30, risk: 54, patients: 388 },
  { name: "East Tower", x: 80, y: 65, risk: 71, patients: 295 },
  { name: "West Tower", x: 28, y: 70, risk: 38, patients: 510 },
  { name: "Central ICU", x: 50, y: 48, risk: 91, patients: 124 },
  { name: "Outpatient", x: 42, y: 18, risk: 22, patients: 622 },
  { name: "Emergency Bay", x: 60, y: 80, risk: 76, patients: 188 },
];

export const icuForecast = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i - 6);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    actual: i <= 6 ? Math.round(60 + Math.sin(i / 2) * 8 + Math.random() * 5) : null,
    predicted: Math.round(62 + Math.sin(i / 2) * 10 + i * 1.2),
  };
});

export const resourceUtil = [
  { name: "ICU Beds", used: 82, capacity: 100 },
  { name: "Ventilators", used: 34, capacity: 60 },
  { name: "Staff On-Call", used: 142, capacity: 180 },
  { name: "ER Rooms", used: 18, capacity: 24 },
  { name: "OR Slots", used: 12, capacity: 20 },
];

export const departmentRadar = [
  { dept: "Cardiology", efficiency: 88, utilization: 76, satisfaction: 82 },
  { dept: "Emergency", efficiency: 72, utilization: 94, satisfaction: 68 },
  { dept: "Oncology", efficiency: 84, utilization: 70, satisfaction: 86 },
  { dept: "Neurology", efficiency: 78, utilization: 65, satisfaction: 80 },
  { dept: "Pediatrics", efficiency: 91, utilization: 60, satisfaction: 92 },
  { dept: "Surgery", efficiency: 86, utilization: 82, satisfaction: 78 },
];

export const fairnessByGroup = [
  { group: "18-30", accuracy: 94.2, samples: 4200 },
  { group: "31-45", accuracy: 95.1, samples: 6100 },
  { group: "46-60", accuracy: 93.8, samples: 7800 },
  { group: "61-75", accuracy: 92.4, samples: 5200 },
  { group: "75+", accuracy: 90.6, samples: 1232 },
];

export const fairnessGender = [
  { group: "Female", accuracy: 94.1, recall: 92.8, precision: 93.5 },
  { group: "Male", accuracy: 94.7, recall: 93.2, precision: 94.1 },
  { group: "Other", accuracy: 92.9, recall: 91.5, precision: 92.6 },
];

export const featureImportance = [
  { feature: "Blood Pressure", value: 0.22 },
  { feature: "Glucose Level", value: 0.18 },
  { feature: "Oxygen Saturation", value: 0.15 },
  { feature: "Heart Rate", value: 0.12 },
  { feature: "Previous Admissions", value: 0.11 },
  { feature: "Chronic History", value: 0.09 },
  { feature: "Age Group", value: 0.07 },
  { feature: "Medication Count", value: 0.06 },
];

export const waterfall = [
  { name: "Baseline", value: 30, type: "base" },
  { name: "Blood Pressure", value: 12, type: "pos" },
  { name: "Glucose", value: 8, type: "pos" },
  { name: "O2 Sat", value: 6, type: "pos" },
  { name: "Heart Rate", value: -3, type: "neg" },
  { name: "Activity", value: -4, type: "neg" },
  { name: "Final Risk", value: 49, type: "total" },
];
