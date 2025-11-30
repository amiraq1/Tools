import { ToolCard } from "@/components/tool-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import type { AITool } from "@shared/schema";

interface ToolsGridProps {
  tools: AITool[];
  isLoading?: boolean;
}

function ToolCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
            <Skeleton className="h-3 w-16 sm:w-24" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 space-y-2">
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 sm:h-4 w-3/4" />
        </div>
        <div className="mt-2 sm:mt-3">
          <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 rounded-full" />
        </div>
      </div>
      <div className="border-t px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
        <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
      </div>
    </Card>
  );
}

export function ToolsGrid({ tools, isLoading }: ToolsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ToolCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-muted-foreground text-base sm:text-lg">لم يتم العثور على أدوات</p>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          حاول تغيير الفلاتر أو استعلام البحث
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
