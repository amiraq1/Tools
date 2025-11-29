import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowRight, Filter } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToolsGrid } from "@/components/tools-grid";
import { PricingFilters } from "@/components/category-filters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AITool, ToolsResponse } from "@shared/schema";

const categoryDescriptions: Record<string, string> = {
  personal: "أدوات ذكاء اصطناعي لتحسين حياتك الشخصية وصحتك وروتينك اليومي.",
  work: "حلول ذكاء اصطناعي احترافية للأعمال، الإنتاجية، وكفاءة بيئة العمل.",
  creativity: "أطلق إبداعك مع أدوات إبداعية مدعومة بالذكاء الاصطناعي.",
  writing: "مساعدو كتابة بالذكاء الاصطناعي لإنشاء المحتوى وتحريره وتحسينه.",
  images: "توليد وتحرير وتحسين الصور باستخدام الذكاء الاصطناعي.",
  videos: "أدوات لإنشاء وتحرير وتحسين الفيديو بالذكاء الاصطناعي.",
  audio: "تحويل ومعالجة الصوت: تفريغ، توليد، وتحرير بالذكاء الاصطناعي.",
  code: "مساعدو برمجة وتوليد شيفرة وأدوات تطوير بالذكاء الاصطناعي.",
  data: "تحليل البيانات، تصورها، واستخلاص الرؤى باستخدام الذكاء الاصطناعي.",
  marketing: "أدوات تسويق بالذكاء الاصطناعي للحملات، التحليلات، والنمو.",
  sales: "أدوات مبيعات مدعومة بالذكاء الاصطناعي لتوليد وترقية العملاء المحتملين.",
  "customer-support": "شات بوتس وحلول دعم عملاء بالذكاء الاصطناعي.",
  education: "أدوات تعليمية وتعلمية مدعومة بالذكاء الاصطناعي.",
  research: "مساعدو بحث وأدوات أكاديمية بالذكاء الاصطناعي.",
  productivity: "ارفع إنتاجيتك من خلال الأتمتة والتحسين بالذكاء الاصطناعي.",
  "social-media": "أدوات لإدارة وتحليل وإنشاء محتوى وسائل التواصل الاجتماعي بالذكاء الاصطناعي.",
  design: "أدوات تصميم للرسوميات وواجهات المستخدم والمحتوى البصري بالذكاء الاصطناعي.",
  finance: "حلول ذكاء اصطناعي للتحليل والإدارة المالية.",
  legal: "أدوات للبحث القانوني وتحليل المستندات بالذكاء الاصطناعي.",
  healthcare: "أدوات للرعاية الصحية والتشخيص ودعم القرار الطبي بالذكاء الاصطناعي.",
};

const categoryTitles: Record<string, string> = {
  personal: "الحياة الشخصية",
  work: "العمل",
  creativity: "الإبداع",
  writing: "الكتابة",
  images: "الصور",
  videos: "الفيديو",
  audio: "الصوت",
  code: "البرمجة",
  data: "البيانات",
  marketing: "التسويق",
  sales: "المبيعات",
  "customer-support": "دعم العملاء",
  education: "التعليم",
  research: "البحث",
  productivity: "الإنتاجية",
  "social-media": "وسائل التواصل الاجتماعي",
  design: "التصميم",
  finance: "التمويل",
  legal: "القانون",
  healthcare: "الرعاية الصحية",
};

type SortTab = "new" | "popular" | "top-rated";

function buildToolsUrl(
  category?: string,
  pricing?: string,
  sort?: string,
): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (pricing) params.set("pricing", pricing);
  if (sort) params.set("sort", sort);
  const queryString = params.toString();
  return queryString ? `/api/tools?${queryString}` : "/api/tools";
}

export default function Category() {
  const { category } = useParams<{ category: string }>();
  const [selectedPricing, setSelectedPricing] = useState<string | undefined>();
  const [sortTab, setSortTab] = useState<SortTab>("new");

  const slugKey = (category ?? "").toLowerCase();

  // الاسم المعروض للفئة بالعربي مع fallback للاسم الإنجليزي إن لزم
  const categoryNameEnglish = category
    ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
    : "";

  const categoryTitle = categoryTitles[slugKey] ?? categoryNameEnglish;

  const toolsUrl = buildToolsUrl(categoryNameEnglish, selectedPricing, sortTab);

  const { data: toolsData, isLoading } = useQuery<ToolsResponse>({
    queryKey: [toolsUrl],
    enabled: !!category,
  });

  const { data: allToolsData } = useQuery<ToolsResponse>({
    queryKey: ["/api/tools"],
  });

  const tools = toolsData?.tools || [];
  const allTools = allToolsData?.tools || [];
  const description = categoryDescriptions[slugKey] || "";

  const total = toolsData?.total || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header tools={allTools} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6"
              data-testid="button-back"
            >
              <ArrowRight className="w-4 h-4" />
              الرجوع لكل الأدوات
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {categoryTitle}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl">
                {description}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {total} أداة في هذه الفئة
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <Tabs
              value={sortTab}
              onValueChange={(v) => setSortTab(v as SortTab)}
            >
              <TabsList>
                <TabsTrigger value="new" data-testid="tab-new">
                  الأحدث
                </TabsTrigger>
                <TabsTrigger value="popular" data-testid="tab-popular">
                  الأكثر شهرة
                </TabsTrigger>
                <TabsTrigger value="top-rated" data-testid="tab-top-rated">
                  الأعلى تقييمًا
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <PricingFilters
                selectedPricing={selectedPricing}
                onPricingChange={setSelectedPricing}
              />
            </div>
          </div>

          <ToolsGrid tools={tools} isLoading={isLoading} />

          {tools.length > 0 && toolsData && toolsData.total > tools.length && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="lg"
                data-testid="button-load-more"
              >
                تحميل المزيد من الأدوات
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}