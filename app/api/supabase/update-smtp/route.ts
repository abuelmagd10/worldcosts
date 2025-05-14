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

export async function POST(request: Request) {
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

    // Get request body or use default values
    let smtpSettings;
    try {
      smtpSettings = await request.json();
    } catch (e) {
      // If no body is provided, use default values
      smtpSettings = {};
    }

    // Update SMTP settings with English numerals
    const { data, error } = await supabaseAdmin.rpc('update_smtp_settings', {
      sender_email: smtpSettings.sender_email || 'info@worldcosts.com',
      sender_name: smtpSettings.sender_name || 'World Costs',
      host: smtpSettings.host || 'smtpout.secureserver.net',
      port: smtpSettings.port || 465, // Using English numerals (confirmed)
      username: smtpSettings.username || 'info@worldcosts.com', // Confirmed
      password: smtpSettings.password || process.env.SMTP_PASSWORD || 'Max@101010', // Use provided password or env var
      min_interval_seconds: smtpSettings.min_interval_seconds || 60 // Using English numerals
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
