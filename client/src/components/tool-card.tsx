import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ExternalLink, Bookmark, Share2, ArrowUp, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToolIcon } from "@/components/tool-icon";
import type { AITool } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: AITool;
  variant?: "default" | "compact" | "featured";
}

export function ToolCard({ tool, variant = "default" }: ToolCardProps) {
  const [, navigate] = useLocation();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedTools = JSON.parse(localStorage.getItem("nabdh-saved-tools") || "[]");
    setIsSaved(savedTools.includes(tool.id));
  }, [tool.id]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const savedTools = JSON.parse(localStorage.getItem("nabdh-saved-tools") || "[]");
    if (savedTools.includes(tool.id)) {
      const updated = savedTools.filter((id: string) => id !== tool.id);
      localStorage.setItem("nabdh-saved-tools", JSON.stringify(updated));
      setIsSaved(false);
    } else {
      savedTools.push(tool.id);
      localStorage.setItem("nabdh-saved-tools", JSON.stringify(savedTools));
      setIsSaved(true);
    }
  };

  const handleCardClick = () => {
    navigate(`/tool/${tool.slug}`);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString("ar");
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "Free":
        return "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20";
      case "Freemium":
        return "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20";
      case "Free Trial":
        return "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20";
      default:
        return "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20";
    }
  };

  if (variant === "compact") {
    return (
      <Card
        className="group p-3 hover-elevate cursor-pointer transition-all duration-200"
        data-testid={`card-tool-${tool.id}`}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-3">
          <ToolIcon initials={tool.iconInitials} color={tool.iconColor} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{tool.tagline}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className="group p-4 hover-elevate cursor-pointer transition-all duration-200 min-w-[280px] snap-start"
        data-testid={`card-featured-tool-${tool.id}`}
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-3">
          <ToolIcon initials={tool.iconInitials} color={tool.iconColor} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{tool.name}</h3>
              <Badge variant="secondary" className="text-xs shrink-0">نبض</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{tool.tagline}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="group hover-elevate transition-all duration-200 overflow-visible cursor-pointer"
      data-testid={`card-tool-${tool.id}`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <ToolIcon initials={tool.iconInitials} color={tool.iconColor} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">
                {tool.name}
              </h3>
              {tool.isFeatured && (
                <Badge variant="secondary" className="text-xs">نبض</Badge>
              )}
              {tool.isNew && (
                <Badge className="bg-emerald-500/10 text-emerald-500 text-xs">جديد</Badge>
              )}
              {tool.isTrending && (
                <Badge className="bg-orange-500/10 text-orange-500 text-xs">رائج</Badge>
              )}
            </div>
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-0.5"
              onClick={(e) => e.stopPropagation()}
              data-testid={`link-website-${tool.id}`}
            >
              زيارة الموقع <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
                isSaved && "opacity-100 text-primary"
              )}
              onClick={handleSave}
              data-testid={`button-bookmark-${tool.id}`}
            >
              <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
              data-testid={`button-share-${tool.id}`}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {tool.tagline}
        </p>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {tool.category}
          </Badge>
        </div>
      </div>

      <div className="border-t px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="text-xs">أطلق {formatTimeAgo(tool.releasedAt)}</span>
          <Badge className={cn("text-xs", getPricingColor(tool.pricing))}>
            {tool.pricing}
            {tool.priceDetails && ` ${tool.priceDetails}`}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          {tool.rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{tool.rating.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm font-medium">
            <ArrowUp className="w-4 h-4" />
            <span>{formatNumber(tool.votes)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
