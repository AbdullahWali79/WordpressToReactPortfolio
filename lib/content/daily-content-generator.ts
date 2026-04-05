// Daily Content Generator Service
// Provides fresh Islamic quotes, educational jokes, and AI tools daily

import { IslamicQuote, EducationalJoke, AITool } from "@/types/daily-content";

// Curated Islamic Quotes Collection
const islamicQuotesCollection: Omit<IslamicQuote, 'id' | 'created_at' | 'expires_at'>[] = [
  {
    quote: "Indeed, with hardship comes ease.",
    author: "Allah (SWT)",
    source: "Quran 94:5",
    category: "patience"
  },
  {
    quote: "The best among you are those who have the best manners and character.",
    author: "Prophet Muhammad (PBUH)",
    source: "Bukhari",
    category: "character"
  },
  {
    quote: "And He found you lost and guided [you].",
    author: "Allah (SWT)",
    source: "Quran 93:7",
    category: "guidance"
  },
  {
    quote: "Speak good or remain silent.",
    author: "Prophet Muhammad (PBUH)",
    source: "Bukhari",
    category: "speech"
  },
  {
    quote: "Verily, in the remembrance of Allah do hearts find rest.",
    author: "Allah (SWT)",
    source: "Quran 13:28",
    category: "dhikr"
  },
  {
    quote: "None of you truly believes until he loves for his brother what he loves for himself.",
    author: "Prophet Muhammad (PBUH)",
    source: "Bukhari",
    category: "brotherhood"
  },
  {
    quote: "And whoever fears Allah - He will make for him a way out.",
    author: "Allah (SWT)",
    source: "Quran 65:2",
    category: "trust"
  },
  {
    quote: "The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.",
    author: "Prophet Muhammad (PBUH)",
    source: "Bukhari",
    category: "self-control"
  },
  {
    quote: "Allah does not burden a soul beyond that it can bear.",
    author: "Allah (SWT)",
    source: "Quran 2:286",
    category: "patience"
  },
  {
    quote: "Seek knowledge from the cradle to the grave.",
    author: "Prophet Muhammad (PBUH)",
    source: "Hadith",
    category: "knowledge"
  },
  {
    quote: "And be patient. Indeed, Allah is with those who are patient.",
    author: "Allah (SWT)",
    source: "Quran 8:46",
    category: "patience"
  },
  {
    quote: "A Muslim is the one from whose tongue and hands the Muslims are safe.",
    author: "Prophet Muhammad (PBUH)",
    source: "Bukhari",
    category: "character"
  },
  {
    quote: "So remember Me; I will remember you.",
    author: "Allah (SWT)",
    source: "Quran 2:152",
    category: "dhikr"
  },
  {
    quote: "The most beloved deeds to Allah are those done regularly, even if they are small.",
    author: "Prophet Muhammad (PBUH)",
    source: "Bukhari",
    category: "consistency"
  },
  {
    quote: "And your Lord is going to give you, and you will be satisfied.",
    author: "Allah (SWT)",
    source: "Quran 93:5",
    category: "hope"
  }
];

// Educational Jokes Collection (Science, Math, Programming)
const educationalJokesCollection: Omit<EducationalJoke, 'id' | 'created_at' | 'expires_at'>[] = [
  {
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs!",
    category: "programming"
  },
  {
    setup: "Why was the math book sad?",
    punchline: "Because it had too many problems!",
    category: "math"
  },
  {
    setup: "What do you call an atom that loses an electron?",
    punchline: "Positive! It has a positive attitude now.",
    category: "chemistry"
  },
  {
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything!",
    category: "chemistry"
  },
  {
    setup: "What did the zero say to the eight?",
    punchline: "Nice belt!",
    category: "math"
  },
  {
    setup: "Why did the programmer quit his job?",
    punchline: "Because he didn't get arrays (a raise)!",
    category: "programming"
  },
  {
    setup: "What do you call a bear with no teeth?",
    punchline: "A gummy bear!",
    category: "biology"
  },
  {
    setup: "Why is the ocean always blue?",
    punchline: "Because the shore never waves back!",
    category: "geography"
  },
  {
    setup: "What do computers eat for a snack?",
    punchline: "Microchips!",
    category: "programming"
  },
  {
    setup: "Why did the physics teacher break up with the biology teacher?",
    punchline: "There was no chemistry!",
    category: "chemistry"
  },
  {
    setup: "How do you organize a space party?",
    punchline: "You planet!",
    category: "astronomy"
  },
  {
    setup: "What did one wall say to the other wall?",
    punchline: "I'll meet you at the corner!",
    category: "math"
  },
  {
    setup: "Why are iPhone chargers not called Apple Juice?",
    punchline: "Because Apple already has a juice - iOS updates drain battery like juice!",
    category: "programming"
  },
  {
    setup: "What kind of shoes do ninjas wear?",
    punchline: "Sneakers!",
    category: "general"
  },
  {
    setup: "Why did the student eat his homework?",
    punchline: "Because the teacher said it was a piece of cake!",
    category: "general"
  },
  {
    setup: "What did the HTML say to the CSS?",
    punchline: "I like your style!",
    category: "programming"
  },
  {
    setup: "Why do Java developers wear glasses?",
    punchline: "Because they don't C#!",
    category: "programming"
  },
  {
    setup: "What's a computer's favorite snack?",
    punchline: "Cookies - but only if they haven't been cleared!",
    category: "programming"
  },
  {
    setup: "Why did the function stop calling the other function?",
    punchline: "Because it had too many arguments!",
    category: "programming"
  },
  {
    setup: "What do you call a fake noodle?",
    punchline: "An impasta!",
    category: "general"
  }
];

// AI Tools Collection
const aiToolsCollection: Omit<AITool, 'id' | 'created_at' | 'expires_at'>[] = [
  {
    name: "ChatGPT",
    description: "OpenAI's conversational AI model capable of understanding and generating human-like text for various tasks.",
    website_url: "https://chat.openai.com",
    category: "chatbot",
    pricing: "Free / $20 monthly",
    features: ["Natural language understanding", "Code generation", "Creative writing", "Problem solving"],
    image_url: null
  },
  {
    name: "Midjourney",
    description: "AI-powered image generation tool that creates stunning artwork from text descriptions.",
    website_url: "https://midjourney.com",
    category: "image-generation",
    pricing: "Starting $10/month",
    features: ["High-quality image generation", "Artistic styles", "Discord integration", "Commercial use"],
    image_url: null
  },
  {
    name: "GitHub Copilot",
    description: "AI pair programmer that helps you write code faster with intelligent suggestions.",
    website_url: "https://github.com/features/copilot",
    category: "coding",
    pricing: "$10/month or $100/year",
    features: ["Code completion", "Function generation", "Multiple language support", "IDE integration"],
    image_url: null
  },
  {
    name: "Claude",
    description: "Anthropic's AI assistant known for its helpful, harmless, and honest responses.",
    website_url: "https://claude.ai",
    category: "chatbot",
    pricing: "Free / Pro $20",
    features: ["Long context window", "Document analysis", "Coding assistance", "Research help"],
    image_url: null
  },
  {
    name: "Runway ML",
    description: "Creative suite with AI tools for video editing, image generation, and more.",
    website_url: "https://runwayml.com",
    category: "video",
    pricing: "Free / $12 monthly",
    features: ["Video generation", "Image editing", "Motion tracking", "Green screen"],
    image_url: null
  },
  {
    name: "Notion AI",
    description: "AI writing assistant integrated directly into Notion for note-taking and documentation.",
    website_url: "https://notion.so",
    category: "productivity",
    pricing: "$10/month add-on",
    features: ["Writing assistance", "Summarization", "Translation", "Brainstorming"],
    image_url: null
  },
  {
    name: "Stable Diffusion",
    description: "Open-source image generation model that can be run locally or via various platforms.",
    website_url: "https://stability.ai",
    category: "image-generation",
    pricing: "Free (open source)",
    features: ["Local deployment", "Custom models", "Image editing", "API access"],
    image_url: null
  },
  {
    name: "Jasper",
    description: "AI writing assistant focused on marketing copy and business content.",
    website_url: "https://jasper.ai",
    category: "writing",
    pricing: "$49/month",
    features: ["Marketing copy", "Blog posts", "SEO optimization", "Brand voice"],
    image_url: null
  },
  {
    name: "DALL-E 3",
    description: "OpenAI's latest image generation model integrated into ChatGPT.",
    website_url: "https://openai.com/dall-e-3",
    category: "image-generation",
    pricing: "Via ChatGPT Plus",
    features: ["Text understanding", "High resolution", "ChatGPT integration", "Safe generation"],
    image_url: null
  },
  {
    name: "Perplexity AI",
    description: "AI-powered search engine that provides cited answers to complex questions.",
    website_url: "https://perplexity.ai",
    category: "search",
    pricing: "Free / Pro $20",
    features: ["Real-time search", "Cited sources", "Follow-up questions", "Multiple modes"],
    image_url: null
  },
  {
    name: "ElevenLabs",
    description: "AI voice synthesis platform for creating realistic text-to-speech.",
    website_url: "https://elevenlabs.io",
    category: "voice",
    pricing: "Free / $5 monthly",
    features: ["Voice cloning", "Multiple languages", "Emotion control", "API access"],
    image_url: null
  },
  {
    name: "Codeium",
    description: "Free AI coding assistant with autocomplete and chat features.",
    website_url: "https://codeium.com",
    category: "coding",
    pricing: "Free / Pro $12",
    features: ["Autocomplete", "Chat interface", "IDE extensions", "Fast suggestions"],
    image_url: null
  },
  {
    name: "Gamma",
    description: "AI-powered presentation and document creation tool.",
    website_url: "https://gamma.app",
    category: "productivity",
    pricing: "Free / Plus $10",
    features: ["AI presentations", "Document generation", "Website creation", "Templates"],
    image_url: null
  },
  {
    name: "Lexica",
    description: "Stable Diffusion search engine and art gallery with generation capabilities.",
    website_url: "https://lexica.art",
    category: "image-generation",
    pricing: "Free / Premium",
    features: ["Image search", "Generation", "Prompt ideas", "Gallery"],
    image_url: null
  },
  {
    name: "Descript",
    description: "AI-powered audio and video editing platform with transcription.",
    website_url: "https://descript.com",
    category: "video",
    pricing: "Free / $12 monthly",
    features: ["Transcription", "Overdub", "Screen recording", "Video editing"],
    image_url: null
  }
];

// Utility functions
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function getDailySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Get content based on day (consistent for same day)
export function getTodaysIslamicQuotes(count: number = 1): Omit<IslamicQuote, 'id' | 'created_at' | 'expires_at'>[] {
  const seed = getDailySeed();
  const shuffled = [...islamicQuotesCollection].sort((a, b) => {
    return seededRandom(seed + a.quote.length) - seededRandom(seed + b.quote.length);
  });
  return shuffled.slice(0, count);
}

export function getTodaysJokes(count: number = 1): Omit<EducationalJoke, 'id' | 'created_at' | 'expires_at'>[] {
  const seed = getDailySeed();
  const shuffled = [...educationalJokesCollection].sort((a, b) => {
    return seededRandom(seed + a.setup.length) - seededRandom(seed + b.setup.length);
  });
  return shuffled.slice(0, count);
}

export function getTodaysAITools(count: number = 1): Omit<AITool, 'id' | 'created_at' | 'expires_at'>[] {
  const seed = getDailySeed();
  const shuffled = [...aiToolsCollection].sort((a, b) => {
    return seededRandom(seed + a.name.length) - seededRandom(seed + b.name.length);
  });
  return shuffled.slice(0, count);
}

// Get all content for database seeding
export function getAllContent() {
  return {
    quotes: getTodaysIslamicQuotes(3),
    jokes: getTodaysJokes(3),
    tools: getTodaysAITools(3)
  };
}

// Scraper simulation (in real implementation, this would fetch from APIs)
export async function fetchLatestAITools(): Promise<Partial<AITool>[]> {
  // In production, this would scrape from:
  // - Product Hunt
  // - Futurepedia
  // - There's An AI For That
  // For now, return random selection
  return getTodaysAITools(2);
}
