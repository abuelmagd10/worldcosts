import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL is not defined" },
        { status: 500 }
      )
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: "SUPABASE_SERVICE_ROLE_KEY is not defined",
          message: "Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables"
        },
        { status: 500 }
      )
    }

    // Get current SMTP settings
    const { data, error } = await supabaseAdmin.rpc('get_smtp_settings')

    if (error) {
      console.error("Error getting SMTP settings:", error)
      return NextResponse.json(
        { error: "Failed to get SMTP settings", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Current SMTP settings",
      settings: data
    })
  } catch (error: any) {
    console.error("Error getting SMTP settings:", error)
    return NextResponse.json(
      { error: "Failed to get SMTP settings", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL is not defined" },
        { status: 500 }
      )
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: "SUPABASE_SERVICE_ROLE_KEY is not defined",
          message: "Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables"
        },
        { status: 500 }
      )
    }

    // Update SMTP settings with English numerals
    const { data, error } = await supabaseAdmin.rpc('update_smtp_settings', {
      sender_email: 'info@worldcosts.com',
      sender_name: 'World Costs',
      host: 'smtpout.secureserver.net',
      port: 465, // Using English numerals
      username: 'info@worldcosts.com',
      password: process.env.SMTP_PASSWORD || undefined,
      min_interval_seconds: 60 // Using English numerals
    })

    if (error) {
      console.error("Error updating SMTP settings:", error)
      return NextResponse.json(
        { error: "Failed to update SMTP settings", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "SMTP settings updated successfully",
      success: true
    })
  } catch (error: any) {
    console.error("Error updating SMTP settings:", error)
    return NextResponse.json(
      { error: "Failed to update SMTP settings", details: error.message },
      { status: 500 }
    )
  }
}
