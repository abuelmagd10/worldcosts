import { NextResponse } from "next/server"

export async function GET() {
  return new NextResponse("google-site-verification: googlef73da8a61c68dbf7.html", {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
