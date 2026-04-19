import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import "./App.css";

export default function Dashboard() {

  const ageData = [
    { age: "15-20", value: 20 },
    { age: "21-25", value: 35 },
    { age: "26-30", value: 25 },
    { age: "30+", value: 20 },
  ];

  const genderData = [
    { name: "Male", value: 55 },
    { name: "Female", value: 40 },
    { name: "Other", value: 5 },
  ];

  const reasonData = [
    { name: "Depression", value: 40 },
    { name: "Family", value: 25 },
    { name: "Work", value: 20 },
    { name: "Relationships", value: 15 },
  ];

  const sentimentData = [
    { name: "Positive", value: 30 },
    { name: "Neutral", value: 40 },
    { name: "Negative", value: 30 },
  ];

  const COLORS = ["#86efac", "#fde68a", "#fca5a5", "#93c5fd"];

  return (
    <div className="container">
      <div className="content">

        {/* HEADER */}
        <div className="dashboard-header">
          <Link to="/" className="back-btn">← Back</Link>

          <div className="title-group">
            <h1>Dataset Insights</h1>
            <p>Understanding patterns from extracted data</p>
          </div>
        </div>

        {/* GRID */}
        <div className="analysis-grid">

          {/* AGE */}
          <div className="chart-card">
            <h4>Age Distribution</h4>
            <BarChart width={250} height={180} data={ageData}>
              <XAxis dataKey="age" />
              <YAxis hide />
              <Bar dataKey="value" fill="#7c7cf5" radius={[6,6,0,0]} />
            </BarChart>
          </div>

          {/* GENDER */}
          <div className="chart-card">
            <h4>Gender</h4>
            <PieChart width={200} height={180}>
              <Pie data={genderData} dataKey="value" outerRadius={70}>
                {genderData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </div>

          {/* REASONS */}
          <div className="chart-card">
            <h4>Reasons</h4>
            <BarChart width={250} height={180} data={reasonData}>
              <XAxis dataKey="name" />
              <YAxis hide />
              <Bar dataKey="value" fill="#f59e0b" radius={[6,6,0,0]} />
            </BarChart>
          </div>

          {/* SENTIMENT */}
          <div className="chart-card">
            <h4>Sentiment</h4>
            <PieChart width={200} height={180}>
              <Pie data={sentimentData} dataKey="value" outerRadius={70}>
                {sentimentData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </div>

        </div>

      </div>
    </div>
  );
}