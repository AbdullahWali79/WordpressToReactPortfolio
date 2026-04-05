import { NextResponse } from "next/server";
import { refreshDailyContent, pingDatabase } from "@/lib/cms/actions/daily-content-actions";

/**
 * CRON API Route for Daily Keep-Alive
 * 
 * This endpoint can be called by:
 * 1. Vercel Cron Jobs
 * 2. GitHub Actions
 * 3. External schedulers
 * 4. Manual trigger
 * 
 * Query params:
 * - key: Secret key for authorization (set in env)
 * - action: 'refresh' | 'ping' (default: 'refresh')
 */

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const action = searchParams.get("action") || "refresh";
    
    // Verify secret key (optional but recommended)
    const secretKey = process.env.CRON_SECRET_KEY;
    if (secretKey && key !== secretKey) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Perform action
    let result;
    if (action === "ping") {
      result = await pingDatabase();
    } else {
      result = await refreshDailyContent();
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

/**
 * Also support POST for flexibility
 */
export async function POST(request: Request) {
  return GET(request);
}
