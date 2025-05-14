import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    // Get current configuration
    const { data: configData, error: configError } = await supabaseAdmin
      .from('auth.config')
      .select('config')
      .limit(1)
      .single()

    if (configError) {
      console.error("Error getting config:", configError)
      
      // Try direct SQL query
      const { data: sqlData, error: sqlError } = await supabaseAdmin.rpc('get_auth_config')
      
      if (sqlError) {
        return NextResponse.json(
          { error: "Failed to get auth config", details: sqlError.message },
          { status: 500 }
        )
      }
      
      if (!sqlData) {
        return NextResponse.json(
          { error: "Auth config not found" },
          { status: 404 }
        )
      }
      
      // Update SMTP settings directly using SQL
      const { error: updateError } = await supabaseAdmin.rpc('update_smtp_settings_direct', {
        sender_email: 'info@worldcosts.com',
        sender_name: 'World Costs',
        host: 'smtpout.secureserver.net',
        port: 465,
        username: 'info@worldcosts.com',
        password: 'Max@101010',
        min_interval_seconds: 60
      })
      
      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update SMTP settings", details: updateError.message },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        message: "SMTP settings updated successfully using direct SQL",
        success: true
      })
    }

    // Get current config
    const config = configData.config

    // Update SMTP settings
    const updatedConfig = {
      ...config,
      mailer: {
        ...config.mailer,
        enabled: true,
        smtp: {
          sender_email: 'info@worldcosts.com',
          sender_name: 'World Costs',
          host: 'smtpout.secureserver.net',
          port: 465,
          username: 'info@worldcosts.com',
          password: 'Max@101010',
          auth_method: 'LOGIN',
          secure: true,
          min_interval_seconds: 60
        }
      }
    }

    // Update config in database
    const { error: updateError } = await supabaseAdmin
      .from('auth.config')
      .update({ config: updatedConfig })
      .eq('id', configData.id)

    if (updateError) {
      console.error("Error updating config:", updateError)
      return NextResponse.json(
        { error: "Failed to update SMTP settings", details: updateError.message },
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
