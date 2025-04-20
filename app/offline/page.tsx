import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OfflinePage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            أنت غير متصل بالإنترنت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">يبدو أنك غير متصل بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.</p>
          <p>يمكنك الوصول إلى الميزات التي تم تخزينها مؤقتًا، ولكن بعض الوظائف مثل تحديث أسعار الصرف قد لا تعمل.</p>
        </CardContent>
      </Card>
    </div>
  )
}
