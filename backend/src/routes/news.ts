import { Router } from "express";

const router = Router();

interface CacheEntry {
  items: any[];
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

function parseGoogleNewsRSS(xml: string) {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 9) {
    const itemContent = match[1];
    const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/);

    if (titleMatch && linkMatch) {
      const rawTitle = titleMatch[1];
      // Clean up CDATA if present and decode HTML entities
      const cleanTitle = rawTitle.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      // Google News RSS titles usually end with " - Source Name", we split it to look cleaner
      const parts = cleanTitle.split(" - ");
      const source = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1") : "Google News";
      let title = cleanTitle;
      if (parts.length > 1) {
        title = parts.slice(0, -1).join(" - ");
      }

      items.push({
        title,
        link: linkMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"),
        pubDate: pubDateMatch ? pubDateMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1") : "",
        source
      });
    }
  }
  return items;
}

router.get("/", async (req, res): Promise<any> => {
  try {
    const queryParam = req.query.q ? String(req.query.q).trim() : "";
    const queryKey = queryParam.toLowerCase() || "__default__";

    const now = Date.now();
    const cached = cache[queryKey];
    if (cached && cached.items.length > 0 && now - cached.timestamp < CACHE_DURATION) {
      return res.status(200).json(cached.items);
    }

    console.log(`Fetching fresh global news for subject query: "${queryParam || "default"}"...`);
    // Query for topics matching our lab research domain or fallback
    const searchQuery = queryParam || "artificial intelligence OR computer vision OR biometrics security";
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-IN&gl=IN&ceid=IN:en`;

    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Google News RSS responded with status: ${response.status}`);
    }

    const xmlText = await response.text();
    const items = parseGoogleNewsRSS(xmlText);

    if (items.length > 0) {
      cache[queryKey] = {
        items,
        timestamp: now
      };
    }

    return res.status(200).json(items.length > 0 ? items : (cached ? cached.items : []));
  } catch (error: any) {
    console.error("Error fetching RSS news:", error.message);
    const queryParam = req.query.q ? String(req.query.q).trim() : "";
    const queryKey = queryParam.toLowerCase() || "__default__";
    const cached = cache[queryKey];
    // Return cache as fallback if fetch fails
    if (cached && cached.items.length > 0) {
      return res.status(200).json(cached.items);
    }
    return res.status(500).json({ message: "Failed to fetch news feed", error: error.message });
  }
});

export default router;
