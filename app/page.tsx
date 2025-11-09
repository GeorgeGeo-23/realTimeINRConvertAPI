// app/page.tsx
"use client";

import { useState } from "react";

interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  rate: number;
  result: number;
  timestamp: string;
}

export default function HomePage() {
  const [amount, setAmount] = useState<number>(100);
  const [toCurrency, setToCurrency] = useState<"USD" | "EUR">("USD");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/convert?from=INR&to=${toCurrency}&amount=${amount}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", fontWeight: 600 }}>INR Currency Converter</h1>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Amount (INR):{" "}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ padding: "0.4rem", width: "100px", marginRight: "10px" }}
          />
        </label>

        <label>
          Convert to:{" "}
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as "USD" | "EUR")}
            style={{ padding: "0.4rem" }}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>

        <button
          onClick={handleConvert}
          disabled={loading}
          style={{
            marginLeft: "10px",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            background: "#0070f3",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            width: "320px",
            textAlign: "center",
          }}
        >
          <p>
            {result.amount} {result.from} ={" "}
            <strong>
              {result.result !== undefined
                ? `${result.result.toFixed(4)} ${result.to}`
                : "—"}
            </strong>
          </p>
          <p>
            1 {result.from} = {result.rate.toFixed(4)} {result.to}
          </p>
          <p>Rate date: {result.timestamp}</p>
        </div>
      )}
    </main>
  );
}