import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = (searchParams.get("from") || "INR").toUpperCase();
    const to = (searchParams.get("to") || "USD").toUpperCase();
    const amount = parseFloat(searchParams.get("amount") || "1");

    // Using open.er-api.com as alternative
    const url = `https://open.er-api.com/v6/latest/${from}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch exchange rates");

    const data = await res.json();
    
    if (!data.rates || !data.rates[to]) {
      throw new Error(`Exchange rate not available for ${to}`);
    }

    const rate = data.rates[to];
    const result = amount * rate;

    return NextResponse.json({
      from,
      to,
      amount,
      rate,
      result,
      timestamp: data.time_last_update_utc || new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("API Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}