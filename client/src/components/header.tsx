import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchModal } from "@/components/search-modal";
import type { AITool } from "@shared/schema";
import { cn } from "@/lib/utils";

interface HeaderProps {
  tools: AITool[];
}

const mainCategories = [
  { name: "الحياة الشخصية", href: "/category/personal" },
  { name: "العمل", href: "/category/work" },
  { name: "الإبداع", href: "/category/creativity" },
];

const navLinks = [
  { name: "الأحدث", href: "/" },
  { name: "الأدوات الشائعة", href: "/popular" },
  { name: "الأدوات الرائجة", href: "/trending" },
  { name: "قائمة المتصدرين", href: "/leaderboard" },
];

export function Header({ tools }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-14 items-center gap-4">
            {/* الشعار / اسم الموقع - متوهج */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="logo-glow w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-4.5 h-4.5 text-white"
                >
                  <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                  <path d="M12 7v5l3.536 3.536" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-blue-400 transition-all duration-300">نبض</span>
            </Link>

            {/* التصنيفات الرئيسية (ديسكتوب) */}
            <div className="hidden md:flex items-center gap-1">
              {mainCategories.map((cat) => (
                <Link key={cat.name} href={cat.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      location.startsWith(cat.href) && "bg-muted",
                    )}
                    data-testid={`link-category-${cat.href.split("/").pop()}`}
                  >
                    {cat.name}
                  </Button>
                </Link>
              ))}
            </div>

            {/* زر البحث الرئيسي */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex-1 max-w-md flex items-center gap-3 px-3 h-9 bg-muted rounded-md text-muted-foreground text-sm hover:bg-muted/80 transition-colors"
              data-testid="button-open-search"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">ابحث عن أدوات الذكاء الاصطناعي…</span>
              <span className="sm:hidden">بحث…</span>
              <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* روابط التصفح العلوية (ديسكتوب) */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(location === link.href && "bg-muted")}
                    data-testid={`link-nav-${link.href === "/" ? "new" : link.href.slice(1)}`}
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>

            {/* يمين الهيدر (الإشعارات، الثيم، الإعدادات، الدخول) */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <ThemeToggle />
              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  data-testid="button-settings"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex"
                data-testid="button-login"
              >
                تسجيل الدخول
              </Button>
              <Button
                size="sm"
                className="hidden md:flex"
                data-testid="button-signup"
              >
                إنشاء حساب
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* قائمة الموبايل */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium tracking-wider px-2">
                  التصنيفات
                </p>
                {mainCategories.map((cat) => (
                  <Link key={cat.name} href={cat.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      data-testid={`mobile-link-category-${cat.href
                        .split("/")
                        .pop()}`}
                    >
                      {cat.name}
                    </Button>
                  </Link>
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium tracking-wider px-2">
                  التصفح
                </p>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      data-testid={`mobile-link-nav-${link.href === "/" ? "new" : link.href.slice(1)}`}
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t space-y-2">
                <Link href="/settings" className="block">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    data-testid="mobile-button-settings"
                  >
                    <Settings className="w-4 h-4" />
                    الإعدادات
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    data-testid="mobile-button-login"
                  >
                    تسجيل الدخول
                  </Button>
                  <Button
                    className="flex-1"
                    data-testid="mobile-button-signup"
                  >
                    إنشاء حساب
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* مودال البحث */}
      <SearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        tools={tools}
      />
    </>
  );
}