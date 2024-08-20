const { Router } = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const rateLimit = require("express-rate-limit");

const fetchMeta = "/fetch-metadata";
const router = new Router();

const limiter = rateLimit({
  windowMs: 1000,
  max: 5,
  message: "Too many requests from this IP, please try again later.",
});

router.use(fetchMeta, limiter);

router.post(fetchMeta, async (req, res) => {
  try {
    const urlsObject = req.body.urls;

    if (
      !urlsObject ||
      typeof urlsObject !== "object" ||
      Object.keys(urlsObject).length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Invalid request: no URLs provided." });
    }

    const urls = Object.values(urlsObject);

    if (!Array.isArray(urls) || urls.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid request: URLs array is empty." });
    }

    const metaPromise = urls.map(async (url) => {
      try {
        const response = await axios.get(url);
        const html = response.data;
        const cheerIo = cheerio.load(html);

        const title =
          cheerIo('meta[property="og:title"]').attr("content") ||
          cheerIo("title").text();
        const description =
          cheerIo('meta[property="og:description"]').attr("content") ||
          cheerIo('meta[name="description"]').attr("content");
        const image =
          cheerIo('meta[property="og:image"]').attr("content") ||
          cheerIo("img").first().attr("src");

        return {
          url,
          title,
          description,
          image,
        };
      } catch (error) {
        return {
          url,
          error: `Failed to fetch metadata for ${url}: ${error.message}`,
        };
      }
    });

    const metaResults = await Promise.all(metaPromise);
    return res.json(metaResults);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;
