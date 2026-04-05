"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  RefreshCw, 
  BookOpen, 
  Smile, 
  Bot, 
  CheckCircle, 
  AlertCircle,
  Clock,
  ExternalLink,
  Trash2,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  refreshDailyContent, 
  forceCleanup, 
  getDailyContentStatus,
  pingDatabase 
} from "@/lib/cms/actions/daily-content-actions";
import { IslamicQuote, EducationalJoke, AITool, KeepAliveLog } from "@/types/daily-content";

export function DailyContentWidget() {
  const [isLoading, setIsLoading] = useState(false);
  const [quotes, setQuotes] = useState<IslamicQuote[]>([]);
  const [jokes, setJokes] = useState<EducationalJoke[]>([]);
  const [tools, setTools] = useState<AITool[]>([]);
  const [logs, setLogs] = useState<KeepAliveLog[]>([]);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    const result = await getDailyContentStatus();
    if (result.success && result.data) {
      setQuotes(result.data.quotes);
      setJokes(result.data.jokes);
      setTools(result.data.tools);
      setLogs(result.data.recentLogs);
      
      // Get last refresh time from logs
      const refreshLog = result.data.recentLogs.find(l => l.action_type === "daily_refresh");
      if (refreshLog) {
        setLastRefresh(refreshLog.created_at);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await refreshDailyContent();
      
      if (result.success) {
        setMessage({ type: "success", text: result.message });
        await fetchData();
      } else {
        setMessage({ type: "error", text: result.error || "Failed to refresh" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      const result = await forceCleanup();
      setMessage({ 
        type: result.success ? "success" : "error", 
        text: result.message 
      });
      if (result.success) await fetchData();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePing = async () => {
    setIsLoading(true);
    try {
      const result = await pingDatabase();
      setMessage({ 
        type: result.success ? "success" : "error", 
        text: result.message 
      });
      if (result.success) await fetchData();
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = quotes.length + jokes.length + tools.length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Keep-Alive System
            </CardTitle>
            <CardDescription>
              Daily rotating content to keep database active
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {lastRefresh && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last: {new Date(lastRefresh).toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-3 p-3 rounded-lg text-sm flex items-center gap-2 ${
                message.type === "success" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger value="quotes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary gap-2">
              <BookOpen className="h-4 w-4" />
              Islamic Quotes
              <Badge variant="secondary" className="ml-1">{quotes.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="jokes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary gap-2">
              <Smile className="h-4 w-4" />
              Jokes
              <Badge variant="secondary" className="ml-1">{jokes.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="tools" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary gap-2">
              <Bot className="h-4 w-4" />
              AI Tools
              <Badge variant="secondary" className="ml-1">{tools.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary gap-2">
              <Clock className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="p-4 m-0">
            <div className="space-y-3">
              {quotes.length === 0 ? (
                <EmptyState message="No quotes for today. Click refresh to add." />
              ) : (
                quotes.map((quote, index) => (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <p className="text-lg font-medium text-foreground mb-2">
                      &ldquo;{quote.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {quote.author} {quote.source && `• ${quote.source}`}
                      </span>
                      <Badge variant="outline">{quote.category}</Badge>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="jokes" className="p-4 m-0">
            <div className="space-y-3">
              {jokes.length === 0 ? (
                <EmptyState message="No jokes for today. Click refresh to add." />
              ) : (
                jokes.map((joke, index) => (
                  <motion.div
                    key={joke.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-foreground mb-2">{joke.setup}</p>
                    <p className="text-muted-foreground italic">{joke.punchline}</p>
                    <Badge variant="outline" className="mt-2">{joke.category}</Badge>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="p-4 m-0">
            <div className="space-y-3">
              {tools.length === 0 ? (
                <EmptyState message="No AI tools for today. Click refresh to add." />
              ) : (
                tools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{tool.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                        {tool.features && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tool.features.slice(0, 3).map((feature, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {tool.website_url && (
                        <a
                          href={tool.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Badge variant="outline">{tool.category}</Badge>
                      {tool.pricing && <span>• {tool.pricing}</span>}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="p-4 m-0">
            <div className="space-y-2">
              {logs.length === 0 ? (
                <EmptyState message="No recent activity logs." />
              ) : (
                logs.map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg border text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        log.action_type === "daily_refresh" 
                          ? "bg-green-500" 
                          : log.action_type === "cleanup_complete"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`} />
                      <span className="capitalize font-medium">{log.action_type.replace(/_/g, " ")}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-muted/30 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            Total active items: <strong>{totalItems}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePing}
              disabled={isLoading}
            >
              <Zap className="h-4 w-4 mr-1" />
              Ping DB
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCleanup}
              disabled={isLoading}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Cleanup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>{message}</p>
    </div>
  );
}
