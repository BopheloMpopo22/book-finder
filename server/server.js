import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/search", async (req, res) => {
  try {
    const { query } = req.query;
    const url = `https://webservices.amazon.com/paapi5/searchitems?${new URLSearchParams(
      {
        Keywords: query,
        PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
        PartnerType: "Associates",
        Marketplace: "www.amazon.com",
        Operation: "SearchItems",
        SearchIndex: "Books",
        Timestamp: new Date().toISOString(),
        AWSAccessKeyId: process.env.AMAZON_ACCESS_KEY,
        AssociateTag: process.env.AMAZON_ASSOCIATE_TAG,
      }
    ).toString()}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to search books" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
