import fs from "fs";
import path from "path";

// ============================================================
// CONFIGURATION - Toggle between mock and real API
// ============================================================
const USE_MOCK_DATA = false; // Set to false to try the real API first

const API_URL = "https://so.mohanadahmed.me/api/research";

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0621-\u064A\u0660-\u0669\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const getResearchesArray = (jsonData) => {
  if (Array.isArray(jsonData)) return jsonData;
  if (!jsonData || typeof jsonData !== "object") return [];

  if (Array.isArray(jsonData.data)) return jsonData.data;
  if (Array.isArray(jsonData.researches)) return jsonData.researches;
  if (jsonData.data && Array.isArray(jsonData.data.researches)) return jsonData.data.researches;

  // Recursively search for any array
  for (const key in jsonData) {
    if (["links", "meta"].includes(key)) continue;
    const val = jsonData[key];
    if (Array.isArray(val)) return val;
    if (val && typeof val === "object") {
      const found = getResearchesArray(val);
      if (found.length > 0) return found;
    }
  }
  return [];
};

const fetchResearchesFromMock = async () => {
  try {
    const filePath = path.join(process.cwd(), "src", "api", "mockData", "researches.json");
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error("Sitemap mock fetch error:", error);
  }
  return [];
};

const fetchResearchesFromAPI = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "mohammedsobhy.vercel.app sitemap generator",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const jsonData = await response.json();
    return getResearchesArray(jsonData);
  } finally {
    clearTimeout(timeout);
  }
};

const fetchResearches = async () => {
  if (USE_MOCK_DATA) {
    return await fetchResearchesFromMock();
  } else {
    try {
      return await fetchResearchesFromAPI();
    } catch (e) {
      console.warn("Real API failed, falling back to mock researches:", e);
      return await fetchResearchesFromMock();
    }
  }
};

export default async function handler(req, res) {
  const today = new Date().toISOString().split("T")[0];
  let researches = [];

  try {
    researches = await fetchResearches();
  } catch (error) {
    console.error("Sitemap researches fetch error:", error);
  }

  // Determine BASE_URL dynamically from headers
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "so.mohanadahmed.me";
  const BASE_URL = `${protocol}://${host}`;

  try {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Page -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Static Pages -->
  <url>
    <loc>${BASE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/researches</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/courses</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/experiences</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/positions</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/achievements</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

    if (Array.isArray(researches)) {
      researches.forEach((research) => {
        const id = research.id;
        const title = research.title;
        if (id && title) {
          const slug = slugify(title);
          sitemap += `  <url>
    <loc>${escapeXml(`${BASE_URL}/researches/${slug}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
        }
      });
    }

    sitemap += `</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap XML generation error:", error);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res
      .status(200)
      .send("Sitemap temporarily unavailable, but endpoint is healthy.");
  }
}
