"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { 
  getAllContent, 
  getTodaysIslamicQuotes, 
  getTodaysJokes, 
  getTodaysAITools 
} from "@/lib/content/daily-content-generator";
import { DailyContentRefreshResult } from "@/types/daily-content";

/**
 * Refresh all daily content
 * 1. Cleans up expired content
 * 2. Inserts new daily content
 * 3. Logs the activity
 */
export async function refreshDailyContent(): Promise<DailyContentRefreshResult> {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Step 1: Cleanup expired content
    const { error: cleanupError } = await supabase.rpc("cleanup_expired_daily_content");
    
    if (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }

    // Step 2: Check if today's content already exists
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check existing quotes
    const { data: existingQuotes } = await supabase
      .from("daily_islamic_quotes")
      .select("id")
      .gte("created_at", today)
      .limit(1);
    
    // Check existing jokes
    const { data: existingJokes } = await supabase
      .from("daily_educational_jokes")
      .select("id")
      .gte("created_at", today)
      .limit(1);
    
    // Check existing tools
    const { data: existingTools } = await supabase
      .from("daily_ai_tools")
      .select("id")
      .gte("created_at", today)
      .limit(1);

    let quotesAdded = 0;
    let jokesAdded = 0;
    let toolsAdded = 0;

    // Step 3: Insert new Islamic Quotes if not exists
    if (!existingQuotes || existingQuotes.length === 0) {
      const quotes = getTodaysIslamicQuotes(3).map(q => ({
        ...q,
        expires_at: tomorrow.toISOString()
      }));
      
      const { error: quotesError } = await supabase
        .from("daily_islamic_quotes")
        .insert(quotes);
      
      if (quotesError) {
        console.error("Quotes insert error:", quotesError);
      } else {
        quotesAdded = quotes.length;
      }
    }

    // Step 4: Insert new Jokes if not exists
    if (!existingJokes || existingJokes.length === 0) {
      const jokes = getTodaysJokes(3).map(j => ({
        ...j,
        expires_at: tomorrow.toISOString()
      }));
      
      const { error: jokesError } = await supabase
        .from("daily_educational_jokes")
        .insert(jokes);
      
      if (jokesError) {
        console.error("Jokes insert error:", jokesError);
      } else {
        jokesAdded = jokes.length;
      }
    }

    // Step 5: Insert new AI Tools if not exists
    if (!existingTools || existingTools.length === 0) {
      const tools = getTodaysAITools(3).map(t => ({
        ...t,
        expires_at: tomorrow.toISOString()
      }));
      
      const { error: toolsError } = await supabase
        .from("daily_ai_tools")
        .insert(tools);
      
      if (toolsError) {
        console.error("Tools insert error:", toolsError);
      } else {
        toolsAdded = tools.length;
      }
    }

    // Step 6: Log the activity
    await supabase.from("keep_alive_logs").insert({
      action_type: "daily_refresh",
      details: {
        quotes_added: quotesAdded,
        jokes_added: jokesAdded,
        tools_added: toolsAdded,
        refreshed_at: new Date().toISOString()
      }
    });

    revalidatePath("/cms-internal/dashboard");

    return {
      success: true,
      message: "Daily content refreshed successfully",
      data: {
        quotesAdded,
        jokesAdded,
        toolsAdded,
        cleanupStatus: cleanupError ? "failed" : "success"
      }
    };

  } catch (error) {
    console.error("Refresh error:", error);
    return {
      success: false,
      message: "Failed to refresh daily content",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Force cleanup all expired content
 */
export async function forceCleanup(): Promise<DailyContentRefreshResult> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.rpc("cleanup_expired_daily_content");
    
    if (error) {
      throw error;
    }

    revalidatePath("/cms-internal/dashboard");

    return {
      success: true,
      message: "Cleanup completed successfully"
    };

  } catch (error) {
    console.error("Cleanup error:", error);
    return {
      success: false,
      message: "Failed to cleanup",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Get current daily content status
 */
export async function getDailyContentStatus() {
  try {
    const supabase = await createSupabaseServerClient();
    
    const today = new Date().toISOString().split("T")[0];
    
    const [
      { data: quotes },
      { data: jokes },
      { data: tools },
      { data: logs }
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
      supabase
        .from("keep_alive_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)
    ]);

    return {
      success: true,
      data: {
        quotes: quotes || [],
        jokes: jokes || [],
        tools: tools || [],
        recentLogs: logs || []
      }
    };

  } catch (error) {
    console.error("Status error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Manual ping to keep database active
 * Can be called from a cron job or scheduled function
 */
export async function pingDatabase(): Promise<DailyContentRefreshResult> {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Simple query to keep connection alive
    const { data, error } = await supabase
      .from("keep_alive_logs")
      .insert({
        action_type: "ping",
        details: {
          timestamp: new Date().toISOString(),
          source: "scheduled_job"
        }
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "Database pinged successfully",
      data: {
        quotesAdded: 0,
        jokesAdded: 0,
        toolsAdded: 0,
        cleanupStatus: "ping_only"
      }
    };

  } catch (error) {
    console.error("Ping error:", error);
    return {
      success: false,
      message: "Failed to ping database",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
