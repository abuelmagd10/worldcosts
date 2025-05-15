import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { PADDLE_API_KEY, SUCCESS_URL, CANCEL_URL } from "@/lib/paddle/config"

// تعريف نوع البيانات المرسلة في الطلب
interface RequestBody {
  priceId: string
  planId: string
  planName: string
  billingCycle: "monthly" | "yearly"
}

export async function POST(request: NextRequest) {
  try {
    // التحقق من صحة الطلب
    if (!request.body) {
      return NextResponse.json(
        { error: "No request body provided" },
        { status: 400 }
      )
    }

    // قراءة بيانات الطلب
    const body: RequestBody = await request.json()
    const { priceId, planId, planName, billingCycle } = body

    // التحقق من وجود معرف السعر
    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      )
    }

    // إنشاء عميل Supabase للتحقق من المستخدم
    const cookieStore = cookies()

    // طباعة جميع ملفات تعريف الارتباط للتشخيص
    console.log("All cookies:", cookieStore.getAll().map(c => c.name))

    // التحقق من وجود ملفات تعريف الارتباط الخاصة بـ Supabase
    const supabaseCookies = cookieStore.getAll().filter(c =>
      c.name.includes('supabase') ||
      c.name.includes('sb-') ||
      c.name.includes('access_token') ||
      c.name.includes('refresh_token')
    )
    console.log("Supabase cookies:", supabaseCookies.map(c => c.name))

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name)
            console.log(`Getting cookie: ${name}, exists: ${!!cookie}`)
            return cookie?.value
          },
          set(name: string, value: string, options: any) {
            console.log(`Setting cookie: ${name}`)
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            console.log(`Removing cookie: ${name}`)
            cookieStore.set({ name, value: "", ...options })
          },
        },
      }
    )

    // التحقق من المستخدم الحالي
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    console.log("User authentication result:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: userError?.message
    })

    // محاولة استخدام مفتاح الخدمة إذا لم يكن هناك مستخدم مصادق عليه
    let userEmail: string
    let userId: string

    if (userError || !user) {
      console.log("No authenticated user found, trying to create checkout without authentication")

      // استخدام معلمات الطلب مباشرة للاختبار فقط
      userEmail = "guest@worldcosts.com" // يمكن تغييره إلى عنوان بريد إلكتروني افتراضي
      userId = "guest-user-id"

      // في الإنتاج، يجب التحقق من المستخدم
      console.log("Proceeding with guest checkout for testing purposes")
    } else {
      console.log("Authenticated user found:", user.email)
      userEmail = user.email || ""
      userId = user.id

      if (!userEmail) {
        return NextResponse.json(
          { error: "User email not found" },
          { status: 400 }
        )
      }
    }

    // إنشاء طلب إلى Paddle API
    const apiKey = PADDLE_API_KEY

    if (!apiKey) {
      console.error("Paddle API key is missing")
      return NextResponse.json(
        { error: "Payment service configuration error" },
        { status: 500 }
      )
    }

    console.log("Using Paddle API key:", apiKey.substring(0, 10) + "...")

    // بناء عنوان URL للنجاح والإلغاء
    const origin = request.headers.get("origin") || "http://localhost:3000"
    const successUrl = `${origin}/admin/subscription/success?plan_name=${encodeURIComponent(planName)}&billing_cycle=${billingCycle}`
    const cancelUrl = `${origin}/admin/subscription/cancel`

    try {
      // استخدام Paddle API لإنشاء جلسة دفع

      // طباعة معلومات الطلب للتصحيح
      console.log("Creating checkout with:", {
        priceId,
        userEmail,
        successUrl,
        cancelUrl,
        userId,
        planId,
        billingCycle
      })

      // طباعة معلومات إضافية للتشخيص
      console.log("Price ID received:", priceId);
      console.log("API Key being used:", apiKey);

      // إعداد بيانات الطلب لـ Paddle API
      // استخدام واجهة برمجة التطبيقات الصحيحة لـ Paddle Billing v2
      // تحديث عنوان API حسب توثيق Paddle الحالي

      // أولاً، إنشاء العميل إذا لم يكن موجودًا
      console.log("Creating customer if not exists...");

      // إنشاء العميل
      const createCustomerUrl = 'https://api.paddle.com/customers';
      let customerId;

      try {
        // التحقق مما إذا كان العميل موجودًا بالفعل
        const checkCustomerUrl = `https://api.paddle.com/customers?email=${encodeURIComponent(userEmail)}`;
        const checkCustomerResponse = await fetch(checkCustomerUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        });

        const checkCustomerData = await checkCustomerResponse.json();
        console.log("Check customer response:", checkCustomerData);

        if (checkCustomerData.data && checkCustomerData.data.length > 0) {
          // العميل موجود بالفعل
          customerId = checkCustomerData.data[0].id;
          console.log("Customer already exists with ID:", customerId);
        } else {
          // إنشاء عميل جديد
          const createCustomerResponse = await fetch(createCustomerUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              email: userEmail,
              name: userEmail.split('@')[0]
            })
          });

          const createCustomerData = await createCustomerResponse.json();
          console.log("Create customer response:", createCustomerData);

          if (createCustomerData.error) {
            throw new Error(`Error creating customer: ${createCustomerData.error.message}`);
          }

          customerId = createCustomerData.data.id;
          console.log("Created new customer with ID:", customerId);
        }
      } catch (customerError) {
        console.error("Error creating/checking customer:", customerError);
        throw customerError;
      }

      // ثانيًا، إنشاء عنوان للعميل
      console.log("Creating address for customer...");

      let addressId;
      try {
        const createAddressUrl = 'https://api.paddle.com/addresses';
        const createAddressResponse = await fetch(createAddressUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            customer_id: customerId,
            country_code: 'EG', // يمكن تغييره حسب بلد المستخدم
            postal_code: '00000' // يمكن تغييره حسب الرمز البريدي للمستخدم
          })
        });

        const createAddressData = await createAddressResponse.json();
        console.log("Create address response:", createAddressData);

        if (createAddressData.error) {
          throw new Error(`Error creating address: ${createAddressData.error.message}`);
        }

        addressId = createAddressData.data.id;
        console.log("Created address with ID:", addressId);
      } catch (addressError) {
        console.error("Error creating address:", addressError);
        throw addressError;
      }

      // ثالثًا، إنشاء معاملة
      console.log("Creating transaction...");

      const createTransactionUrl = 'https://api.paddle.com/transactions';

      // إعداد بيانات الطلب بتنسيق JSON
      const requestData = {
        items: [
          {
            price_id: priceId,
            quantity: 1
          }
        ],
        customer_id: customerId,
        address_id: addressId,
        custom_data: {
          userId: userId,
          planId: planId,
          planName: planName,
          billingCycle: billingCycle
        }
      }

      console.log("Request data prepared for Paddle API");

      // للتشخيص، نطبع بعض القيم من البيانات
      console.log("Vendor ID:", '01jv7k0rhqaajrsgcbc8fnkade');
      console.log("Price ID:", priceId);
      console.log("Customer Email:", userEmail);
      console.log("Success URL:", successUrl);
      console.log("Cancel URL:", cancelUrl);

      // إرسال الطلب إلى Paddle API لإنشاء معاملة
      let transactionResponse
      try {
        console.log("Sending transaction request to Paddle API...");
        console.log("Transaction request data:", JSON.stringify(requestData, null, 2));

        // استخدام JSON بدلاً من FormData
        transactionResponse = await fetch(createTransactionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(requestData)
        })

        console.log("Paddle API transaction response status:", transactionResponse.status);
      } catch (fetchError: any) {
        console.error("Network error calling Paddle API for transaction:", fetchError);
        console.error("Fetch error details:", fetchError);
        return NextResponse.json(
          { error: "Network error connecting to payment provider", details: fetchError.message },
          { status: 500 }
        )
      }

      // التحقق من استجابة Paddle للمعاملة
      let transactionData;

      try {
        // محاولة قراءة الاستجابة كـ JSON
        const transactionResponseText = await transactionResponse.text();
        console.log("Paddle API transaction response text:", transactionResponseText);

        try {
          // محاولة تحليل النص كـ JSON
          transactionData = JSON.parse(transactionResponseText);
          console.log("Paddle API transaction response parsed:", transactionData);
        } catch (parseError) {
          console.error("Error parsing Paddle API transaction response:", parseError);
          console.error("Transaction response text:", transactionResponseText);
          return NextResponse.json(
            { error: "Invalid response from payment provider", responseText: transactionResponseText },
            { status: 500 }
          );
        }

        // التحقق من نجاح الاستجابة حسب تنسيق Paddle Billing v2
        if (transactionData.error) {
          console.error("Paddle API transaction error:", transactionData.error);
          return NextResponse.json(
            { error: transactionData.error.message || "Error creating transaction" },
            { status: 400 }
          );
        }

        // التحقق من وجود معرف المعاملة في الاستجابة
        if (transactionData.data && transactionData.data.id) {
          const transactionId = transactionData.data.id;
          console.log("Paddle transaction ID:", transactionId);

          // إنشاء رابط الدفع باستخدام معرف المعاملة
          // استخدام رابط الدفع الافتراضي
          const checkoutUrl = `https://checkout.paddle.com/checkout/${transactionId}`;
          console.log("Paddle checkout URL:", checkoutUrl);

          return NextResponse.json({
            checkoutUrl: checkoutUrl,
            transactionId: transactionId
          });
        } else {
          console.error("Paddle API response missing transaction ID:", transactionData);
          return NextResponse.json(
            { error: "Invalid response from payment provider", response: transactionData },
            { status: 500 }
          );
        }
      } catch (responseError: any) {
        console.error("Error reading Paddle API response:", responseError)
        return NextResponse.json(
          { error: "Error processing payment provider response", details: responseError.message },
          { status: 500 }
        )
      }
    } catch (error: any) {
      console.error("Error calling Paddle API:", error)
      return NextResponse.json(
        { error: error.message || "Error creating checkout session" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
