import { NextResponse } from "next/server"

// Simple API endpoint to check if the server is reachable
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: Date.now() })
}

// HEAD method for lightweight connection checks
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  })
}
