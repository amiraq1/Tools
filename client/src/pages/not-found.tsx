import { Link } from "wouter";
import { Home, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-6 flex items-center justify-center">
            <Search className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-3">الصفحة غير موجودة</h2>

          <p className="text-muted-foreground mb-6">
            الصفحة التي تبحث عنها غير متوفرة أو ربما تم نقلها.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="gap-2 w-full sm:w-auto" data-testid="button-go-home">
                <Home className="w-4 h-4" />
                العودة للرئيسية
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2 w-full sm:w-auto"
              data-testid="button-go-back"
            >
              {/* ArrowRight بديل عن ArrowLeft لأن الاتجاه RTL */}
              <ArrowRight className="w-4 h-4" />
              الرجوع للخلف
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}