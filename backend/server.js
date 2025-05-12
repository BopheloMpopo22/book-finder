const express = require("express");
const cors = require("cors");
const paapi = require("amazon-paapi");
require("dotenv").config();

// Debug environment variables
console.log("Current working directory:", process.cwd());
console.log("Environment variables:", {
  PORT: process.env.PORT,
  AMAZON_REGION: process.env.AMAZON_REGION,
  AMAZON_ACCESS_KEY_ID: process.env.AMAZON_ACCESS_KEY_ID
    ? "Present"
    : "Missing",
  AMAZON_SECRET_KEY: process.env.AMAZON_SECRET_KEY ? "Present" : "Missing",
  AMAZON_ASSOCIATE_TAG: process.env.AMAZON_ASSOCIATE_TAG
    ? "Present"
    : "Missing",
});

const app = express();
const port = process.env.PORT || 5001;

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Add environment variable check
const requiredEnvVars = [
  "AMAZON_ACCESS_KEY_ID",
  "AMAZON_SECRET_KEY",
  "AMAZON_ASSOCIATE_TAG",
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars);
  console.error("Please check your .env file in:", process.cwd());
  process.exit(1);
}

// Basic test endpoint
app.get("/", (req, res) => {
  console.log("Root endpoint hit!");
  res.json({ message: "Server is working!" });
});

// Simple test endpoint
app.get("/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ message: "Test endpoint is working!" });
});

// Echo endpoint
app.get("/echo", (req, res) => {
  console.log("Echo endpoint hit!");
  res.json({
    message: "Echo endpoint is working!",
    query: req.query,
    headers: req.headers,
  });
});

// Proxy endpoint for Amazon API
app.get("/api/search", async (req, res) => {
  try {
    const { keywords, searchIndex = "Books", itemCount = 10 } = req.query;

    const commonParameters = {
      AccessKey: process.env.AMAZON_ACCESS_KEY_ID,
      SecretKey: process.env.AMAZON_SECRET_KEY,
      PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com",
    };

    const requestParameters = {
      Keywords: keywords,
      SearchIndex: searchIndex,
      ItemCount: Number(itemCount),
      Resources: [
        "ItemInfo.Title",
        "ItemInfo.Authors",
        "ItemInfo.ProductInfo",
        "ItemInfo.ContentInfo",
        "Images.Primary.Large",
        "Offers.Listings.Price",
      ],
    };

    const data = await paapi.SearchItems(commonParameters, requestParameters);
    res.json(data);
  } catch (error) {
    console.error("Amazon PAAPI error:", error);
    res.status(500).json({
      error: "Failed to fetch from Amazon API",
      details: error.message,
    });
  }
});

// Add error handling for server startup
app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Try these URLs in your browser:");
  console.log(`http://localhost:${port}/`);
  console.log(`http://localhost:${port}/test`);
  console.log(`http://localhost:${port}/echo`);
});
