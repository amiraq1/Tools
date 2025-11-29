import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Users } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToolsGrid } from "@/components/tools-grid";
import { CategoryFilters, PricingFilters } from "@/components/category-filters";
import type { AITool, ToolsResponse } from "@shared/schema";

function buildToolsUrl(category?: string, pricing?: string, sort?: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (pricing) params.set("pricing", pricing);
  if (sort) params.set("sort", sort);
  const queryString = params.toString();
  return queryString ? `/api/tools?${queryString}` : "/api/tools";
}

export default function Popular() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedPricing, setSelectedPricing] = useState<string | undefined>();

  const toolsUrl = buildToolsUrl(selectedCategory, selectedPricing, "popular");

  const { data: toolsData, isLoading } = useQuery<ToolsResponse>({
    queryKey: [toolsUrl],
  });

  const tools = [...(toolsData?.tools || [])].sort((a, b) => b.votes - a.votes);
  const allTools = toolsData?.tools || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header tools={allTools} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">الأدوات الشائعة</h1>
              <p className="text-muted-foreground">
                أكثر أدوات الذكاء الاصطناعي حصولًا على التصويت من مجتمع نبض
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <CategoryFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm text-muted-foreground">نوع التسعير:</span>
              <PricingFilters
                selectedPricing={selectedPricing}
                onPricingChange={setSelectedPricing}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Users className="w-4 h-4" />
            <span>{tools.length} أداة شائعة</span>
          </div>

          <ToolsGrid tools={tools} isLoading={isLoading} />
        </div>
      </main>

      <Footer />
    </div>
  );
}