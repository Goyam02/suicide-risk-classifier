const API_URL = "http://localhost:8000";

export async function analyzeText(text) {
  const response = await fetch(`${API_URL}/analyze/detailed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  
  if (!response.ok) {
    throw new Error("Analysis failed");
  }
  
  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}