import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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