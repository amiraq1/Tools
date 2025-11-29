import { Link } from "wouter";
import { Sparkles, Mail, Twitter, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  product: [
    { name: "تصفح الأدوات", href: "/" },
    { name: "التصنيفات", href: "/categories" },
    { name: "الأدوات الرائجة", href: "/trending" },
    { name: "قائمة المتصدرين", href: "/leaderboard" },
    { name: "إضافة أداة", href: "/submit" },
  ],
  company: [
    { name: "عن نبض", href: "/about" },
    { name: "المدونة", href: "/blog" },
    { name: "الفرص الوظيفية", href: "/careers" },
    { name: "تواصل معنا", href: "/contact" },
  ],
  resources: [
    { name: "النشرة البريدية", href: "/newsletter" },
    { name: "واجهة برمجة التطبيقات API", href: "/api" },
    { name: "الإعلانات", href: "/advertise" },
    { name: "برنامج الشراكة", href: "/affiliate" },
  ],
  legal: [
    { name: "سياسة الخصوصية", href: "/privacy" },
    { name: "شروط الاستخدام", href: "/terms" },
    { name: "سياسة الكوكيز", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* نبذة عن نبض */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">نبض</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              نبض هو دليلك لأفضل أدوات الذكاء الاصطناعي. نختار ونصنّف أحدث
              الأدوات لمساعدتك في العثور على ما يناسب احتياجاتك في العمل
              والحياة والإبداع.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="link-twitter">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="link-github">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="link-linkedin">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* الروابط: المنتج */}
          <div>
            <h3 className="font-semibold mb-3">المنتج</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الروابط: الشركة */}
          <div>
            <h3 className="font-semibold mb-3">الشركة</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الروابط: الموارد */}
          <div>
            <h3 className="font-semibold mb-3">الموارد</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الروابط: قانوني */}
          <div>
            <h3 className="font-semibold mb-3">قانوني</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* النشرة البريدية + الحقوق */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                اشترك في النشرة البريدية
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="w-48"
                data-testid="input-newsletter-email"
              />
              <Button size="sm" data-testid="button-subscribe">
                اشتراك
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center sm:text-start">
            © {new Date().getFullYear()} نبض - دليل أدوات الذكاء الاصطناعي. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}