import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Bookmark, LogIn, Heart } from "lucide-react";
import type { AITool } from "@shared/schema";

interface SavedToolsResponse {
  tools: AITool[];
}

export default function SavedTools() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading, savedToolIds } = useAuth();

  useEffect(() => {
    document.title = "الأدوات المحفوظة - نبض";
  }, []);

  const { data, isLoading } = useQuery<SavedToolsResponse>({
    queryKey: ["/api/saved-tools"],
    enabled: isAuthenticated,
  });

  const tools = data?.tools || [];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header tools={[]} />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header tools={[]} />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">سجّل الدخول</h1>
                <p className="text-muted-foreground">
                  يجب تسجيل الدخول لعرض الأدوات المحفوظة
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate("/login")} data-testid="button-login">
                  تسجيل الدخول
                </Button>
                <Button variant="outline" onClick={() => navigate("/signup")} data-testid="button-signup">
                  إنشاء حساب جديد
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header tools={tools} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">الأدوات المحفوظة</h1>
            <p className="text-muted-foreground">
              {tools.length > 0 
                ? `لديك ${tools.length} أداة محفوظة`
                : "لم تقم بحفظ أي أدوات بعد"
              }
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">لا توجد أدوات محفوظة</h2>
                <p className="text-muted-foreground">
                  ابدأ باستكشاف الأدوات واحفظ ما يعجبك
                </p>
              </div>
              <Button onClick={() => navigate("/")} data-testid="button-explore">
                استكشف الأدوات
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
