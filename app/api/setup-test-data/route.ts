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

// إنشاء بيانات اختبارية للاشتراكات
const createTestSubscriptionData = async (userId: string) => {
  try {
    console.log(`Creating test subscription data for user ${userId}...`)
    
    // التحقق من وجود جدول user_subscriptions
    const { error: checkUserSubscriptionsError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
    
    // إذا كان الجدول موجودًا، نقوم بإنشاء بيانات اختبارية
    if (!checkUserSubscriptionsError) {
      console.log('user_subscriptions table exists, creating test data...')
      
      // إنشاء بيانات اختبارية
      const { error: insertError } = await supabaseAdmin
        .from('user_subscriptions')
        .upsert([
          {
            user_id: userId,
            subscription_id: 'test_subscription_id',
            customer_id: 'test_customer_id',
            plan_id: 'pro',
            plan_name: 'خطة برو',
            billing_cycle: 'monthly',
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancel_at_period_end: false,
            metadata: { test: true }
          }
        ])
      
      if (insertError) {
        console.error('Error inserting test data into user_subscriptions:', insertError)
        throw insertError
      } else {
        console.log('Test data inserted into user_subscriptions successfully')
      }
    } else {
      console.log('user_subscriptions table does not exist, trying subscriptions table...')
      
      // التحقق من وجود جدول subscriptions
      const { error: checkSubscriptionsError } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
      
      // إذا كان الجدول موجودًا، نقوم بإنشاء بيانات اختبارية
      if (!checkSubscriptionsError) {
        console.log('subscriptions table exists, creating test data...')
        
        // إنشاء بيانات اختبارية
        const { error: insertError } = await supabaseAdmin
          .from('subscriptions')
          .upsert([
            {
              user_id: userId,
              subscription_id: 'test_subscription_id',
              customer_id: 'test_customer_id',
              plan_id: 'pro',
              plan_name: 'خطة برو',
              billing_cycle: 'monthly',
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              cancel_at_period_end: false,
              metadata: { test: true }
            }
          ])
        
        if (insertError) {
          console.error('Error inserting test data into subscriptions:', insertError)
          throw insertError
        } else {
          console.log('Test data inserted into subscriptions successfully')
        }
      } else {
        console.error('Neither user_subscriptions nor subscriptions table exists')
        throw new Error('Neither user_subscriptions nor subscriptions table exists')
      }
    }
  } catch (error) {
    console.error('Error creating test subscription data:', error)
    throw error
  }
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
    
    // الحصول على معرف المستخدم من معلمات الاستعلام
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }
    
    // إنشاء بيانات اختبارية للاشتراكات
    await createTestSubscriptionData(userId)
    
    return NextResponse.json({
      success: true,
      message: "Test subscription data created successfully",
      userId
    })
  } catch (error: any) {
    console.error("Error creating test data:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
