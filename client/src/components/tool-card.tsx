import { memo, useCallback, useState } from "react";
import { useLocation } from "wouter";
import { ExternalLink, Bookmark, Share2, ArrowUp, Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToolIcon } from "@/components/tool-icon";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { AITool } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: AITool;
  variant?: "default" | "compact" | "featured";
}

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

function ToolCardComponent({ tool, variant = "default" }: ToolCardProps) {
  const [, navigate] = useLocation();
  const { isToolSaved, saveTool, unsaveTool, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const isSaved = isToolSaved(tool.id);

  const handleSave = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "سجل دخولك لحفظ الأدوات المفضلة",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/login")}
            data-testid="button-toast-login"
          >
            تسجيل الدخول
          </Button>
        ),
      });
      return;
    }
    
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveTool(tool.id);
        toast({
          description: "تم إزالة الأداة من المحفوظات",
        });
      } else {
        await saveTool(tool.id);
        toast({
          description: "تم حفظ الأداة بنجاح",
        });
      }
    } catch {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الأداة",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [tool.id, isSaved, saveTool, unsaveTool, isSaving, toast, isAuthenticated, navigate]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/tool/${tool.slug}`);
  }, [navigate, tool.slug]);

  if (variant === "compact") {
    return (
      <Card
        className="group p-2.5 sm:p-3 hover-elevate cursor-pointer transition-all duration-200 active:scale-[0.98]"
        data-testid={`card-tool-${tool.id}`}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <ToolIcon initials={tool.iconInitials} color={tool.iconColor} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xs sm:text-sm truncate">{tool.name}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{tool.tagline}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className="group p-3 sm:p-4 hover-elevate cursor-pointer transition-all duration-200 min-w-[240px] sm:min-w-[280px] snap-start active:scale-[0.98]"
        data-testid={`card-featured-tool-${tool.id}`}
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          <ToolIcon initials={tool.iconInitials} color={tool.iconColor} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base truncate">{tool.name}</h3>
              <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">مميز</Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5 sm:mt-1">{tool.tagline}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="group hover-elevate transition-all duration-200 overflow-visible cursor-pointer active:scale-[0.99]"
      data-testid={`card-tool-${tool.id}`}
      onClick={handleCardClick}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <ToolIcon initials={tool.iconInitials} color={tool.iconColor} size="lg" className="w-12 h-12 sm:w-14 sm:h-14" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base hover:text-primary transition-colors cursor-pointer">
                {tool.name}
              </h3>
              {tool.isFeatured && (
                <Badge variant="secondary" className="text-[10px] sm:text-xs">مميز</Badge>
              )}
              {tool.isNew && (
                <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px] sm:text-xs">جديد</Badge>
              )}
              {tool.isTrending && (
                <Badge className="bg-orange-500/10 text-orange-500 text-[10px] sm:text-xs">رائج</Badge>
              )}
            </div>
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-0.5"
              onClick={(e) => {
                e.stopPropagation();
              }}
              data-testid={`link-website-${tool.id}`}
            >
              زيارة الموقع <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </a>
          </div>
          <div className="flex gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 sm:h-8 sm:w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
                isSaved && "text-primary"
              )}
              onClick={handleSave}
              disabled={isSaving}
              data-testid={`button-bookmark-${tool.id}`}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Bookmark className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isSaved && "fill-current")} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              data-testid={`button-share-${tool.id}`}
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 line-clamp-2">
          {tool.tagline}
        </p>

        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 flex-wrap">
          <Badge variant="outline" className="text-[10px] sm:text-xs">
            {tool.category}
          </Badge>
        </div>
      </div>

      <div className="border-t px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
          <span className="text-[10px] sm:text-xs">أطلق {formatTimeAgo(tool.releasedAt)}</span>
          <Badge className={cn("text-[10px] sm:text-xs", getPricingColor(tool.pricing))}>
            {tool.pricing}
            {tool.priceDetails && ` ${tool.priceDetails}`}
          </Badge>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {tool.rating > 0 && (
            <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{tool.rating.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium">
            <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{formatNumber(tool.votes)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export const ToolCard = memo(ToolCardComponent);
