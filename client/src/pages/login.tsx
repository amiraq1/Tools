import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      navigate("/");
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600/20 via-background to-blue-600/20 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="logo-glow w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-6 h-6 text-white"
              >
                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                <path d="M12 7v5l3.536 3.536" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>ادخل بريدك الإلكتروني وكلمة السر</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pr-10"
                  data-testid="input-username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة السر</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                  data-testid="input-password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-600 dark:text-red-400 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-submit-login"
            >
              {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">ليس لديك حساب؟ </span>
            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline font-medium"
              data-testid="link-signup"
            >
              إنشاء حساب
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
