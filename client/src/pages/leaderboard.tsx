import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Trophy, ArrowUp, Star, Eye, Medal } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToolIcon } from "@/components/tool-icon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { AITool, ToolsResponse } from "@shared/schema";
import { cn } from "@/lib/utils";

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
}

interface LeaderboardItemProps {
  tool: AITool;
  rank: number;
  metric: "votes" | "rating" | "views";
}

function LeaderboardItem({ tool, rank, metric }: LeaderboardItemProps) {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-amber-400";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getMetricValue = () => {
    switch (metric) {
      case "votes":
        return (
          <div className="flex items-center gap-1.5 font-semibold">
            <ArrowUp className="w-4 h-4" />
            {formatNumber(tool.votes)}
          </div>
        );
      case "rating":
        return (
          <div className="flex items-center gap-1.5 font-semibold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {tool.rating.toFixed(1)}
          </div>
        );
      case "views":
        return (
          <div className="flex items-center gap-1.5 font-semibold">
            <Eye className="w-4 h-4" />
            {formatNumber(tool.views)}
          </div>
        );
    }
  };

  return (
    <Link href={`/tool/${tool.slug}`}>
      <Card
        className="p-4 hover-elevate cursor-pointer transition-all"
        data-testid={`leaderboard-item-${tool.id}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            {rank <= 3 ? (
              <Medal className={cn("w-6 h-6", getMedalColor(rank))} />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                #{rank}
              </span>
            )}
          </div>
          <ToolIcon
            initials={tool.iconInitials}
            color={tool.iconColor}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold">{tool.name}</h3>
              {tool.isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  مميز
                </Badge>
              )}
              {tool.isTrending && (
                <Badge className="bg-orange-500/10 text-orange-500 text-xs">
                  رائج
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {tool.tagline}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {tool.category}
          </Badge>
          {getMetricValue()}
        </div>
      </Card>
    </Link>
  );
}

export default function Leaderboard() {
  const { data: toolsData, isLoading } = useQuery<ToolsResponse>({
    queryKey: ["/api/tools"],
  });

  const tools = toolsData?.tools || [];

  const sortedByVotes = [...tools].sort((a, b) => b.votes - a.votes);
  const sortedByRating = [...tools].sort((a, b) => b.rating - a.rating);
  const sortedByViews = [...tools].sort((a, b) => b.views - a.views);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header tools={tools} />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">قائمة المتصدرين</h1>
              <p className="text-muted-foreground">
                أفضل أدوات الذكاء الاصطناعي بحسب تفاعل مجتمع نبض
              </p>
            </div>
          </div>

          <Tabs defaultValue="votes" className="space-y-6">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger
                value="votes"
                className="gap-2"
                data-testid="tab-votes"
              >
                <ArrowUp className="w-4 h-4" />
                الأكثر تصويتًا
              </TabsTrigger>
              <TabsTrigger
                value="rating"
                className="gap-2"
                data-testid="tab-rating"
              >
                <Star className="w-4 h-4" />
                الأعلى تقييمًا
              </TabsTrigger>
              <TabsTrigger
                value="views"
                className="gap-2"
                data-testid="tab-views"
              >
                <Eye className="w-4 h-4" />
                الأكثر مشاهدة
              </TabsTrigger>
            </TabsList>

            {isLoading ? (
              <LeaderboardSkeleton />
            ) : (
              <>
                <TabsContent value="votes" className="space-y-3 mt-6">
                  {sortedByVotes.slice(0, 20).map((tool, index) => (
                    <LeaderboardItem
                      key={tool.id}
                      tool={tool}
                      rank={index + 1}
                      metric="votes"
                    />
                  ))}
                </TabsContent>

                <TabsContent value="rating" className="space-y-3 mt-6">
                  {sortedByRating.slice(0, 20).map((tool, index) => (
                    <LeaderboardItem
                      key={tool.id}
                      tool={tool}
                      rank={index + 1}
                      metric="rating"
                    />
                  ))}
                </TabsContent>

                <TabsContent value="views" className="space-y-3 mt-6">
                  {sortedByViews.slice(0, 20).map((tool, index) => (
                    <LeaderboardItem
                      key={tool.id}
                      tool={tool}
                      rank={index + 1}
                      metric="views"
                    />
                  ))}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}