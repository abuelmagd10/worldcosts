import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

// إنشاء عميل Supabase باستخدام مفتاح الخدمة
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// التحقق من متغيرات البيئة المطلوبة
const checkEnvVars = () => {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  return requiredVars.filter(varName => !process.env[varName])
}

// اختبار الاتصال بـ Supabase
const testConnection = async () => {
  const results = {
    envVars: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    tests: {
      rpc: { success: false, error: null, data: null },
      auth: { success: false, error: null, data: null },
      tables: { success: false, error: null, data: null }
    }
  }
  
  // اختبار RPC
  try {
    console.log("Testing RPC connection...")
    const { data, error } = await supabaseAdmin.rpc('get_service_role')
    
    if (error) {
      results.tests.rpc.error = error.message
    } else {
      results.tests.rpc.success = true
      results.tests.rpc.data = data
    }
  } catch (error: any) {
    results.tests.rpc.error = error.message || "Unknown error"
  }
  
  // اختبار Auth
  try {
    console.log("Testing Auth connection...")
    const { data, error } = await supabaseAdmin.auth.getUser()
    
    if (error) {
      results.tests.auth.error = error.message
    } else {
      results.tests.auth.success = true
      results.tests.auth.data = "Auth connection successful"
    }
  } catch (error: any) {
    results.tests.auth.error = error.message || "Unknown error"
  }
  
  // اختبار الجداول
  try {
    console.log("Testing tables connection...")
    const { data, error } = await supabaseAdmin.from('_rpc').select('*').limit(1)
    
    if (error) {
      results.tests.tables.error = error.message
    } else {
      results.tests.tables.success = true
      results.tests.tables.data = "Tables connection successful"
    }
  } catch (error: any) {
    results.tests.tables.error = error.message || "Unknown error"
  }
  
  return results
}

// وظيفة GET الرئيسية
export async function GET(request: Request) {
  try {
    // التحقق من متغيرات البيئة
    const missingVars = checkEnvVars()
    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          details: `Required environment variables are missing: ${missingVars.join(', ')}`
        },
        { status: 500 }
      )
    }
    
    // اختبار الاتصال
    const results = await testConnection()
    
    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Error testing Supabase connection:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
