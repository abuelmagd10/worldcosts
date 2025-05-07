import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function POST(request: Request) {
  try {
    const companyInfo = await request.json();
    
    // التحقق من البيانات المطلوبة
    if (!companyInfo.name) {
      return NextResponse.json(
        { error: 'اسم الشركة مطلوب' },
        { status: 400 }
      );
    }

    // حفظ معلومات الشركة في Supabase
    const { data, error } = await supabase
      .from('company_info')
      .upsert({
        name: companyInfo.name,
        address: companyInfo.address || '',
        phone: companyInfo.phone || '',
        pdf_file_name: companyInfo.pdfFileName || '',
        logo: companyInfo.logo || null,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'فشل في حفظ معلومات الشركة في قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: companyInfo });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}