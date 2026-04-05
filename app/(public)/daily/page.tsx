import { Metadata } from "next";
import Link from "next/link";
import { 
  BookOpen, 
  Smile, 
  Bot, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/scroll-reveal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Daily Inspiration - Islamic Quotes, Jokes & AI Tools",
  description: "Daily rotating content featuring Islamic quotes, educational jokes, and featured AI tools.",
};

async function getDailyContent() {
  const supabase = await createSupabaseServerClient();
  
  const today = new Date().toISOString().split("T")[0];
  
  const [
    { data: quotes },
    { data: jokes },
    { data: tools }
  ] = await Promise.all([
    supabase
      .from("daily_islamic_quotes")
      .select("*")
      .gte("created_at", today)
      .order("created_at", { ascending: false }),
    supabase
      .from("daily_educational_jokes")
      .select("*")
      .gte("created_at", today)
      .order("created_at", { ascending: false }),
    supabase
      .from("daily_ai_tools")
      .select("*")
      .gte("created_at", today)
      .order("created_at", { ascending: false }),
  ]);

  return {
    quotes: quotes || [],
    jokes: jokes || [],
    tools: tools || []
  };
}

export default async function DailyContentPage() {
  const { quotes, jokes, tools } = await getDailyContent();
  
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b bg-muted/30 py-16">
        <div className="container-main">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Daily Fresh Content
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Today&apos;s Inspiration</h1>
              <p className="text-lg text-muted-foreground mb-4">
                Islamic quotes, educational jokes, and featured AI tools updated daily.
              </p>
              <p className="text-sm text-muted-foreground">{currentDate}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Islamic Quotes Section */}
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold">Islamic Quote of the Day</h2>
                </div>
              </ScrollReveal>

              <StaggerContainer className="space-y-4">
                {quotes.length === 0 ? (
                  <EmptyState message="Check back later for today's quote" />
                ) : (
                  quotes.map((quote) => (
                    <StaggerItem key={quote.id}>
                      <Card className="overflow-hidden border-emerald-200 dark:border-emerald-800">
                        <CardContent className="p-6">
                          <blockquote className="text-lg font-medium text-foreground mb-4">
                            &ldquo;{quote.quote}&rdquo;
                          </blockquote>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {quote.author && <span className="font-medium">{quote.author}</span>}
                              {quote.source && <span> • {quote.source}</span>}
                            </div>
                            <Badge variant="secondary">{quote.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))
                )}
              </StaggerContainer>
            </div>

            {/* Educational Jokes Section */}
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Smile className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold">Educational Jokes</h2>
                </div>
              </ScrollReveal>

              <StaggerContainer className="space-y-4">
                {jokes.length === 0 ? (
                  <EmptyState message="Check back later for today's jokes" />
                ) : (
                  jokes.map((joke) => (
                    <StaggerItem key={joke.id}>
                      <Card className="overflow-hidden border-blue-200 dark:border-blue-800">
                        <CardContent className="p-6">
                          <p className="font-medium text-foreground mb-3">{joke.setup}</p>
                          <p className="text-muted-foreground italic">{joke.punchline}</p>
                          <Badge variant="secondary" className="mt-3">
                            {joke.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))
                )}
              </StaggerContainer>
            </div>

            {/* AI Tools Section */}
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold">Featured AI Tools</h2>
                </div>
              </ScrollReveal>

              <StaggerContainer className="space-y-4">
                {tools.length === 0 ? (
                  <EmptyState message="Check back later for today's AI tools" />
                ) : (
                  tools.map((tool) => (
                    <StaggerItem key={tool.id}>
                      <Card className="overflow-hidden border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg">{tool.name}</h3>
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
                          <p className="text-sm text-muted-foreground mb-3">
                            {tool.description}
                          </p>
                          {tool.features && tool.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {tool.features.slice(0, 3).map((feature, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant="secondary">{tool.category}</Badge>
                            {tool.pricing && (
                              <span className="text-muted-foreground">{tool.pricing}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))
                )}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container-main">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground mb-6">
                Our system automatically refreshes content every day to keep the database active 
                and provide you with fresh inspiration. Content expires after 24 hours and is 
                replaced with new selections.
              </p>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  Back to Home
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center text-muted-foreground">
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}
