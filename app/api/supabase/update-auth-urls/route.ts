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

    // Get current auth config
    const { data: configData, error: configError } = await supabaseAdmin
      .from('auth.config')
      .select('config')
      .limit(1)
      .single()

    if (configError) {
      console.error("Error getting config:", configError)
      return NextResponse.json(
        { error: "Failed to get auth config", details: configError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Current auth config",
      config: configData.config
    })
  } catch (error: any) {
    console.error("Error getting auth config:", error)
    return NextResponse.json(
      { error: "Failed to get auth config", details: error.message },
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

    // Update auth redirect URLs
    const { data, error } = await supabaseAdmin.rpc('update_auth_redirect_urls')

    if (error) {
      console.error("Error updating auth redirect URLs:", error)
      return NextResponse.json(
        { error: "Failed to update auth redirect URLs", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Auth redirect URLs updated successfully",
      success: true
    })
  } catch (error: any) {
    console.error("Error updating auth redirect URLs:", error)
    return NextResponse.json(
      { error: "Failed to update auth redirect URLs", details: error.message },
      { status: 500 }
    )
  }
}
