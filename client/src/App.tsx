
import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

import Home from "@/pages/home";
import ToolDetail from "@/pages/tool-detail";
import Category from "@/pages/category";
import Leaderboard from "@/pages/leaderboard";
import Trending from "@/pages/trending";
import Popular from "@/pages/popular";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tool/:slug" component={ToolDetail} />
      <Route path="/category/:category" component={Category} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/trending" component={Trending} />
      <Route path="/popular" component={Popular} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // تغيير اسم الموقع في التبويب
    document.title = "نبض";

    // ضبط لغة واتجاه الصفحة كاملة
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* غيّرنا اسم storageKey من taaft-theme إلى nabdh-theme أو أي اسم يعجبك */}
      <ThemeProvider defaultTheme="dark" storageKey="nabdh-theme">
        <TooltipProvider>
          <Toaster />
          {/* نضمن أن كل المحتوى RTL أيضاً داخل الجسم */}
          <div dir="rtl" className="min-h-screen font-sans page-enter">
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;