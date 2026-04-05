export interface IslamicQuote {
  id: string;
  quote: string;
  author: string | null;
  source: string | null;
  category: string;
  created_at: string;
  expires_at: string;
}

export interface EducationalJoke {
  id: string;
  setup: string;
  punchline: string;
  category: string;
  created_at: string;
  expires_at: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  website_url: string | null;
  category: string;
  pricing: string | null;
  features: string[] | null;
  image_url: string | null;
  created_at: string;
  expires_at: string;
}

export interface KeepAliveLog {
  id: string;
  action_type: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface DatabaseActivity {
  table_name: string;
  record_count: number;
  last_activity: string | null;
}

export type DailyContentType = 'islamic_quote' | 'educational_joke' | 'ai_tool';

export interface DailyContentRefreshResult {
  success: boolean;
  message: string;
  data?: {
    quotesAdded: number;
    jokesAdded: number;
    toolsAdded: number;
    cleanupStatus: string;
  };
  error?: string;
}
