import CryptoJS from "crypto-js";

const AMAZON_SECRET_KEY = process.env.REACT_APP_AMAZON_SECRET_KEY || "";
const AMAZON_HOST = "webservices.amazon.com";
const AMAZON_PATH = "/paapi5/searchitems";
const API_URL =
  process.env.REACT_APP_API_URL || "https://book-finder-backend.onrender.com";

interface BookSearchParams {
  keywords: string;
  searchIndex?: string;
  itemCount?: number;
}

export const searchBooks = async ({
  keywords,
  searchIndex = "Books",
  itemCount = 10,
}: BookSearchParams) => {
  try {
    const response = await fetch(
      `${API_URL}/api/search?query=${encodeURIComponent(keywords)}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Amazon API Response:", data);

    if (!data.SearchResult?.Items) {
      console.error("No items found in response:", data);
      return [];
    }

    const items = data.SearchResult.Items.map((item: any) => {
      const amazonUrl = `https://www.amazon.com/dp/${item.ASIN}/?tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}&linkCode=as2&camp=1789&creative=9325`;
      console.log("Generated Amazon URL:", amazonUrl);

      return {
        id: item.ASIN,
        title: item.ItemInfo.Title.DisplayValue,
        author:
          item.ItemInfo.ByLineInfo?.Authors?.[0]?.DisplayValue ||
          "Unknown Author",
        imageUrl: item.Images.Primary.Medium.URL,
        price:
          item.Offers?.Listings?.[0]?.Price?.DisplayAmount ||
          "Price not available",
        amazonUrl,
      };
    });

    return items;
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
) {
  const kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key);
  const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
  const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
  return CryptoJS.HmacSHA256("aws4_request", kService);
}
