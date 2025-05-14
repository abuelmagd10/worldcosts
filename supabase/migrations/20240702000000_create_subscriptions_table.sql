-- إنشاء جدول الاشتراكات
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id TEXT NOT NULL,
  customer_id TEXT,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB,
  UNIQUE(user_id, subscription_id)
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subscription_id ON public.user_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);

-- إنشاء وظيفة لتحديث حقل updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء محفز لتحديث حقل updated_at
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- إنشاء سياسات RLS للجدول
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة: يمكن للمستخدمين قراءة اشتراكاتهم فقط
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- سياسة للإدارة: يمكن للمسؤولين إدارة جميع الاشتراكات
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admins can manage all subscriptions"
  ON public.user_subscriptions
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id AND auth.users.is_admin = true
    )
  );

-- إنشاء وظيفة للحصول على اشتراك المستخدم الحالي
CREATE OR REPLACE FUNCTION public.get_current_user_subscription()
RETURNS SETOF public.user_subscriptions
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.user_subscriptions
  WHERE user_id = auth.uid()
  AND status IN ('active', 'trialing')
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- إنشاء وظيفة للتحقق من وجود اشتراك نشط للمستخدم الحالي
CREATE OR REPLACE FUNCTION public.has_active_subscription()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_subscriptions
    WHERE user_id = auth.uid()
    AND status IN ('active', 'trialing')
    AND current_period_end > NOW()
  );
$$;
