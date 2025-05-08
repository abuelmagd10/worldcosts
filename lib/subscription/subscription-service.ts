import { createClient } from "@/lib/supabase-client"
import Stripe from "stripe"
import { STRIPE_SECRET_KEY } from "@/lib/stripe/config"

// إنشاء كائن Stripe باستخدام المفتاح السري
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

// واجهة لبيانات الاشتراك
export interface Subscription {
  planId: string
  billingCycle: string
  status: string
  currentPeriodEnd: Date
  isActive: boolean
}

// خدمة إدارة الاشتراكات
export class SubscriptionService {
  // الحصول على اشتراك المستخدم الحالي
  static async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const supabase = createClient()
      
      // استخدام الوظيفة المخصصة للحصول على اشتراك المستخدم
      const { data, error } = await supabase
        .rpc('get_user_subscription', { user_id_param: userId })
        .single()
      
      if (error || !data) {
        console.error("Error fetching user subscription:", error)
        return null
      }
      
      return {
        planId: data.plan_id,
        billingCycle: data.billing_cycle,
        status: data.status,
        currentPeriodEnd: new Date(data.current_period_end),
        isActive: data.is_active,
      }
    } catch (error) {
      console.error("Error in getUserSubscription:", error)
      return null
    }
  }
  
  // التحقق مما إذا كان المستخدم لديه اشتراك نشط
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId)
      return subscription !== null && subscription.isActive
    } catch (error) {
      console.error("Error in hasActiveSubscription:", error)
      return false
    }
  }
  
  // إلغاء اشتراك المستخدم
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const supabase = createClient()
      
      // الحصول على معرف اشتراك Stripe
      const { data, error } = await supabase
        .from('subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error || !data) {
        console.error("Error fetching subscription for cancellation:", error)
        return false
      }
      
      // إلغاء الاشتراك في Stripe
      await stripe.subscriptions.update(data.stripe_subscription_id, {
        cancel_at_period_end: true,
      })
      
      // تحديث حالة الاشتراك في قاعدة البيانات
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ cancel_at_period_end: true })
        .eq('stripe_subscription_id', data.stripe_subscription_id)
      
      if (updateError) {
        console.error("Error updating subscription status:", updateError)
        return false
      }
      
      return true
    } catch (error) {
      console.error("Error in cancelSubscription:", error)
      return false
    }
  }
  
  // تحديث بيانات الاشتراك من Stripe
  static async syncSubscriptionFromStripe(subscriptionId: string): Promise<boolean> {
    try {
      // الحصول على بيانات الاشتراك من Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      
      const supabase = createClient()
      
      // تحديث بيانات الاشتراك في قاعدة البيانات
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId)
      
      if (error) {
        console.error("Error syncing subscription data:", error)
        return false
      }
      
      return true
    } catch (error) {
      console.error("Error in syncSubscriptionFromStripe:", error)
      return false
    }
  }
}
