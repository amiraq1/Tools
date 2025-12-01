import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Flame, ArrowRight, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { ToolsGrid } from "@/components/tools-grid";
import { CategoryFilters, PricingFilters } from "@/components/category-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  FeaturedToolsResponse,
  ToolsResponse,
} from "@shared/schema";

type SortTab = "new" | "popular" | "trending";

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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedPricing, setSelectedPricing] = useState<string | undefined>();
  const [sortTab, setSortTab] = useState<SortTab>("new");

  const { data: featuredData, isLoading: featuredLoading } =
    useQuery<FeaturedToolsResponse>({
      queryKey: ["/api/tools/featured"],
    });

  const toolsUrl = buildToolsUrl(selectedCategory, selectedPricing, sortTab);

  const { data: toolsData, isLoading: toolsLoading } =
    useQuery<ToolsResponse>({
      queryKey: [toolsUrl],
    });

  const allTools = useMemo(() => {
    return toolsData?.tools || [];
  }, [toolsData]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header tools={allTools} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Link href="/trending">
              <Badge
                variant="outline"
                className="cursor-pointer hover-elevate gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 shrink-0 text-xs sm:text-sm"
              >
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" />
                إطلاق GPT-5 الآن
              </Badge>
            </Link>
          </div>

          {!featuredLoading && featuredData && (
            <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
              {featuredData.featured.length > 0 && (
                <FeaturedCarousel
                  title="أدوات مميزة"
                  tools={featuredData.featured}
                />
              )}
              {featuredData.trending.length > 0 && (
                <FeaturedCarousel
                  title="الأدوات الرائجة الآن"
                  tools={featuredData.trending}
                />
              )}
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                أحدث الأدوات
              </h2>
              <Link href="/trending">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-0.5 sm:gap-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                  data-testid="link-view-all"
                >
                  عرض الكل
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </Link>
            </div>

            <Tabs
              value={sortTab}
              onValueChange={(v) => setSortTab(v as SortTab)}
              className="mb-3 sm:mb-4"
            >
              <TabsList className="h-8 sm:h-9">
                <TabsTrigger value="new" className="text-xs sm:text-sm px-2 sm:px-3" data-testid="tab-new">
                  الأحدث
                </TabsTrigger>
                <TabsTrigger value="popular" className="text-xs sm:text-sm px-2 sm:px-3" data-testid="tab-popular">
                  الأكثر شهرة
                </TabsTrigger>
                <TabsTrigger value="trending" className="text-xs sm:text-sm px-2 sm:px-3" data-testid="tab-trending">
                  الرائجة
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <CategoryFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  نوع التسعير:
                </span>
                <PricingFilters
                  selectedPricing={selectedPricing}
                  onPricingChange={setSelectedPricing}
                />
              </div>
            </div>

            <ToolsGrid tools={allTools} isLoading={toolsLoading} />

            {allTools.length > 0 && (
              <div className="mt-6 sm:mt-8 text-center">
                <Button
                  variant="outline"
                  size="default"
                  className="text-sm sm:text-base"
                  data-testid="button-load-more"
                >
                  تحميل المزيد من الأدوات
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
