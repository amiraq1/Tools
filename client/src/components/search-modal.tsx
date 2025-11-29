import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolIcon } from "@/components/tool-icon";
import type { AITool } from "@shared/schema";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tools: AITool[];
}

export function SearchModal({ open, onOpenChange, tools }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const recentSearches = ["ChatGPT", "توليد الصور", "مساعد البرمجة", "أدوات الكتابة"];
  const trendingSearches = ["فيديو ذكي", "استنساخ الصوت", "محلل PDF", "الأتمتة"];

  const filteredTools = query.length > 0
    ? tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query.toLowerCase()) ||
          tool.tagline.toLowerCase().includes(query.toLowerCase()) ||
          tool.category.toLowerCase().includes(query.toLowerCase()) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : [];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredTools.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filteredTools[selectedIndex]) {
        e.preventDefault();
        setLocation(`/tool/${filteredTools[selectedIndex].slug}`);
        onOpenChange(false);
        setQuery("");
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    },
    [filteredTools, selectedIndex, setLocation, onOpenChange]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
    }
  }, [open]);

  const handleToolClick = (slug: string) => {
    setLocation(`/tool/${slug}`);
    onOpenChange(false);
    setQuery("");
  };

  const handleSearchSubmit = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="ابحث عن أدوات الذكاء الاصطناعي..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 px-0 text-base"
            data-testid="input-search"
          />
          <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
            ESC
          </kbd>
          <button
            onClick={() => onOpenChange(false)}
            className="sm:hidden p-1 hover:bg-muted rounded"
            data-testid="button-close-search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-4 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Clock className="w-4 h-4" />
                  <span>البحوث الأخيرة</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <Badge
                      key={term}
                      variant="secondary"
                      className="cursor-pointer hover-elevate"
                      onClick={() => handleSearchSubmit(term)}
                      data-testid={`badge-recent-${term}`}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <TrendingUp className="w-4 h-4" />
                  <span>البحوث الرائجة</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="cursor-pointer hover-elevate"
                      onClick={() => handleSearchSubmit(term)}
                      data-testid={`badge-trending-${term}`}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="py-2">
              {filteredTools.map((tool, index) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.slug)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  data-testid={`search-result-${tool.id}`}
                >
                  <ToolIcon initials={tool.iconInitials} color={tool.iconColor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tool.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {tool.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{tool.tagline}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>لم يتم العثور على نتائج "{query}"</p>
              <p className="text-sm mt-1">حاول البحث عن شيء آخر</p>
            </div>
          )}
        </div>

        <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↓</kbd>
              <span>التنقل</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd>
              <span>تحديد</span>
            </span>
          </div>
          <span>{filteredTools.length} نتيجة</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
