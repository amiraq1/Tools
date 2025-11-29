import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Lightbulb, Award } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "مهمتنا",
    description: "نسعى لتمكين المستخدمين العرب من اكتشاف أفضل أدوات الذكاء الاصطناعي وتوظيفها في حياتهم اليومية وأعمالهم.",
  },
  {
    icon: Users,
    title: "مجتمعنا",
    description: "نبني مجتمعاً نشطاً من المهتمين بالتقنية والذكاء الاصطناعي لتبادل الخبرات والتجارب.",
  },
  {
    icon: Lightbulb,
    title: "رؤيتنا",
    description: "أن نكون المرجع الأول والأشمل لأدوات الذكاء الاصطناعي في العالم العربي.",
  },
  {
    icon: Award,
    title: "قيمنا",
    description: "الشفافية، الجودة، والتحديث المستمر لضمان تقديم أفضل المحتوى لمستخدمينا.",
  },
];

const stats = [
  { value: "500+", label: "أداة ذكاء اصطناعي" },
  { value: "50+", label: "تصنيف مختلف" },
  { value: "100K+", label: "مستخدم نشط" },
  { value: "24/7", label: "تحديث مستمر" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header tools={[]} />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">عن نبض</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نبض هو دليلك الشامل لاكتشاف أفضل أدوات الذكاء الاصطناعي المتوفرة. 
              نساعدك في العثور على الأدوات المناسبة لتعزيز إنتاجيتك وإبداعك.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 sm:mb-16">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">قصتنا</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  بدأت فكرة نبض من إدراكنا للحاجة الماسة لمنصة عربية شاملة تجمع أدوات الذكاء 
                  الاصطناعي في مكان واحد. مع التطور السريع في هذا المجال، أصبح من الصعب على 
                  المستخدم العربي مواكبة كل الأدوات الجديدة واختيار الأنسب منها.
                </p>
                <p>
                  نعمل بشكل مستمر على تحديث قاعدة بياناتنا وإضافة أحدث الأدوات، مع تقديم 
                  مراجعات وتصنيفات تساعد المستخدمين في اتخاذ قرارات مدروسة. هدفنا هو أن 
                  نكون رفيقك الموثوق في رحلة اكتشاف عالم الذكاء الاصطناعي.
                </p>
                <p>
                  نؤمن بأن التقنية يجب أن تكون متاحة للجميع، ولذلك نحرص على تقديم محتوى 
                  باللغة العربية بجودة عالية تضاهي المحتوى العالمي.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
