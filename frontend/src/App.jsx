import React, { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const pieData = [
  { name: "Low", value: 25 },
  { name: "Medium", value: 50 },
  { name: "High", value: 25 },
];

const barData = [
  { name: "Mood", value: 40 },
  { name: "Stress", value: 70 },
  { name: "Energy", value: 30 },
];

const COLORS = ["#86efac", "#fde68a", "#fca5a5"];

  const analyzeText = () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult("");

    setTimeout(() => {
      setResult(
        "It seems like you might be going through a difficult time. You're not alone."
      );
      setLoading(false);
    }, 1200);
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

            <button className="button" onClick={analyzeText}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        )}

        {/* Analysis */}
        {result && (
          <div className="analysis">

            <div className="badge medium">Medium Risk</div>

            <div className="analysis-grid">

  {/* PIE CHART */}
  <div className="chart-card">
    <h4>Risk Distribution</h4>
    <PieChart width={180} height={180}>
      <Pie data={pieData} dataKey="value" outerRadius={70}>
        {pieData.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
    </PieChart>
  </div>

  {/* BAR CHART */}
  <div className="chart-card">
    <h4>Emotional Indicators</h4>
    <BarChart width={220} height={150} data={barData}>
      <XAxis dataKey="name" />
      <YAxis hide />
      <Bar dataKey="value" fill="#7c7cf5" radius={[6,6,0,0]} />
    </BarChart>
  </div>

  {/* PROGRESS */}
  <div className="chart-card">
    <h4>Confidence</h4>
    <div className="progress-bar">
      <div className="progress-fill"></div>
    </div>
    <p>72% confidence</p>
  </div>

</div>

            <div className="summary">
              <h3>Summary</h3>
              <p>{result}</p>
            </div>

            <div className="indicators">
              <h3>Key Indicators</h3>
              <ul>
                <li>Low mood</li>
                <li>Fatigue</li>
                <li>Social withdrawal</li>
              </ul>
            </div>

            <button className="back" onClick={() => setResult("")}>
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