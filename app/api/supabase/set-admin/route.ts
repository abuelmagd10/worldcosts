import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    // Get request body
    const { email, isAdmin } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user by email
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers({
      filter: {
        email: email
      }
    })

    if (userError) {
      console.error("Error finding user:", userError)
      return NextResponse.json(
        { error: "Failed to find user", details: userError.message },
        { status: 500 }
      )
    }

    if (!users || users.users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const user = users.users[0]

    // Update user's is_admin field
    const { error: updateError } = await supabaseAdmin.from('auth.users')
      .update({ is_admin: isAdmin === true })
      .eq('id', user.id)

    if (updateError) {
      console.error("Error updating user:", updateError)
      
      // Try alternative method if the first one fails
      try {
        // Use raw SQL to update the user
        const { error: sqlError } = await supabaseAdmin.rpc('set_user_admin_status', {
          user_id: user.id,
          admin_status: isAdmin === true
        })
        
        if (sqlError) {
          throw sqlError
        }
      } catch (sqlError: any) {
        return NextResponse.json(
          { error: "Failed to update user", details: sqlError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      message: `User ${isAdmin ? 'is now an admin' : 'is no longer an admin'}`,
      success: true
    })
  } catch (error: any) {
    console.error("Error setting admin status:", error)
    return NextResponse.json(
      { error: "Failed to set admin status", details: error.message },
      { status: 500 }
    )
  }
}
