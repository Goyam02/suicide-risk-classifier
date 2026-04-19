import React, { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import { analyzeText as callAnalyze } from "./api";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRiskColor = (level) => {
    const colors = {
      MINIMAL: "#86efac",
      LOW: "#86efac",
      MID: "#fde68a",
      HIGH: "#fca5a5",
      STRONG: "#f87171",
    };
    return colors[level] || "#fde68a";
  };

  const getRiskLabel = (level) => {
    const labels = {
      MINIMAL: "Minimal Risk",
      LOW: "Low Risk",
      MID: "Medium Risk",
      HIGH: "High Risk",
      STRONG: "Critical Risk",
    };
    return labels[level] || "Medium Risk";
  };

const pieData = result
  ? [
      { name: "No Risk", value: result.risk_distribution?.no_risk || 25 },
      { name: "Risk", value: result.risk_distribution?.risk || 50 },
      { name: "Critical", value: result.risk_distribution?.critical || 25 },
    ]
  : [
      { name: "Low", value: 25 },
      { name: "Medium", value: 50 },
      { name: "High", value: 25 },
    ];

const barData = result
  ? [
      { name: "Mood", value: result.emotional?.mood || 40 },
      { name: "Stress", value: result.emotional?.stress || 70 },
      { name: "Energy", value: result.emotional?.energy || 30 },
    ]
  : [
      { name: "Mood", value: 40 },
      { name: "Stress", value: 70 },
      { name: "Energy", value: 30 },
    ];

  const COLORS = ["#86efac", "#fde68a", "#fca5a5"];

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await callAnalyze(text);
      setResult(response);
    } catch (err) {
      setError("Unable to connect to analysis service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content">

        {/* Header */}
        <div className="header">
          <h1>MindCheck</h1>
          <p>A quiet space to reflect, without judgment</p>

        </div>

        {/* Input */}
        {!result && (
          <div className="card">
            <p className="prompt">
              Take your time. Write whatever you’re feeling.
            </p>

            <textarea
              className="textarea"
              rows="5"
              placeholder="What's on your mind today?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button className="button" onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
            {error && <p className="error">{error}</p>}
          </div>
        )}

        {/* Analysis */}
        {result && (
          <div className="analysis">

            <div className="badge medium" style={{ background: getRiskColor(result.risk_level), color: result.risk_level === "MINIMAL" || result.risk_level === "LOW" ? "#166534" : result.risk_level === "MID" ? "#92400e" : "#991b1b" }}>
              {getRiskLabel(result.risk_level)}
            </div>

            <div className="analysis-grid">

  {/* PIE CHART */}
  <div className="chart-card">
    <h4>Risk Distribution</h4>
    <PieChart width={200} height={200}>
      <Pie 
        data={pieData} 
        dataKey="value" 
        outerRadius={70}
        label={({ name, value }) => `${name}: ${Math.round(value)}%`}
        labelLine={false}
      >
        {pieData.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
    </PieChart>
    <div className="pie-labels">
      {pieData.map((entry, index) => (
        <div key={index} className="pie-label">
          <span className="pie-dot" style={{ background: COLORS[index] }}></span>
          {entry.name}: {Math.round(entry.value)}%
        </div>
      ))}
    </div>
  </div>

  {/* BAR CHART */}
  <div className="chart-card">
    <h4>Emotional Indicators</h4>
    <BarChart width={220} height={150} data={barData}>
      <XAxis dataKey="name" tick={{fontSize: 11}} />
      <YAxis hide />
      <Bar dataKey="value" fill="#7c7cf5" radius={[6,6,0,0]} />
    </BarChart>
    <div className="bar-labels">
      <span>Mood: Based on sentiment compound score</span>
      <span>Stress: Negative sentiment + risk level</span>
      <span>Energy: Positive sentiment</span>
    </div>
  </div>

  {/* PROGRESS */}
  <div className="chart-card">
    <h4>Confidence</h4>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${result.confidence * 100}%` }}></div>
    </div>
    <p>{Math.round(result.confidence * 100)}% confidence</p>
  </div>

</div>

            <div className="summary">
              <h3>Assessment</h3>
              <p>{result.action_required}</p>
            </div>

            <div className="indicators">
              <h3>Recommended Action</h3>
              <ul>
                <li>{result.risk_description}</li>
              </ul>
            </div>

            <button className="back" onClick={() => setResult(null)}>
              ← Back
            </button>

          </div>
        )}

        {/* Footer */}
        <p className="footer">
          This tool is not a medical diagnosis. If you're in immediate danger,
          please contact a local helpline.
        </p>

      </div>
    </div>
  );
}