-- إنشاء جدول user_subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  subscription_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, subscription_id)
);

-- إنشاء جدول subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  subscription_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, subscription_id)
);

-- تمكين RLS على جدول user_subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للقراءة على جدول user_subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view their own subscriptions" 
  ON user_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- إنشاء سياسة للإدارة على جدول user_subscriptions
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON user_subscriptions;
CREATE POLICY "Service role can manage subscriptions" 
  ON user_subscriptions 
  USING (true)
  WITH CHECK (true);

-- تمكين RLS على جدول subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للقراءة على جدول subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
CREATE POLICY "Users can view their own subscriptions" 
  ON subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- إنشاء سياسة للإدارة على جدول subscriptions
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage subscriptions" 
  ON subscriptions 
  USING (true)
  WITH CHECK (true);

-- إنشاء بيانات اختبارية للمستخدم المحدد
-- استبدل USER_ID بمعرف المستخدم الخاص بك
INSERT INTO user_subscriptions (
  user_id,
  subscription_id,
  customer_id,
  plan_id,
  plan_name,
  billing_cycle,
  status,
  current_period_start,
  current_period_end,
  cancel_at_period_end,
  metadata
)
VALUES (
  'USER_ID',
  'test_subscription_id',
  'test_customer_id',
  'pro',
  'خطة برو',
  'monthly',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  FALSE,
  '{"test": true}'
)
ON CONFLICT (user_id, subscription_id) DO NOTHING;
