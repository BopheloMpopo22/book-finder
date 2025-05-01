import CryptoJS from "crypto-js";

const AMAZON_ACCESS_KEY = process.env.REACT_APP_AMAZON_ACCESS_KEY || "";
const AMAZON_SECRET_KEY = process.env.REACT_APP_AMAZON_SECRET_KEY || "";
const AMAZON_ASSOCIATE_TAG = process.env.REACT_APP_AMAZON_ASSOCIATE_TAG || "";
const AMAZON_REGION = "us-east-1";
const AMAZON_HOST = "webservices.amazon.com";
const AMAZON_PATH = "/paapi5/searchitems";

interface BookSearchParams {
  keywords: string;
  searchIndex?: string;
  itemCount?: number;
}

const generateAmazonSignature = (queryParams: string): string => {
  const stringToSign = `GET\n${AMAZON_HOST}\n${AMAZON_PATH}\n${queryParams}`;
  const hmac = CryptoJS.HmacSHA256(stringToSign, AMAZON_SECRET_KEY);
  return CryptoJS.enc.Base64.stringify(hmac);
};

export const searchBooks = async ({
  keywords,
  searchIndex = "Books",
  itemCount = 10,
}: BookSearchParams) => {
  const timestamp = new Date().toISOString();
  const params = new URLSearchParams({
    Keywords: keywords,
    PartnerTag: AMAZON_ASSOCIATE_TAG,
    PartnerType: "Associates",
    Marketplace: "www.amazon.com",
    Operation: "SearchItems",
    SearchIndex: searchIndex,
    Timestamp: timestamp,
    AWSAccessKeyId: AMAZON_ACCESS_KEY,
    AssociateTag: AMAZON_ASSOCIATE_TAG,
  });

  const signature = generateAmazonSignature(params.toString());
  params.append("Signature", signature);

  const url = `https://${AMAZON_HOST}${AMAZON_PATH}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Amazon API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Amazon API Response:", data); // Debug log

    if (!data.SearchResult?.Items) {
      console.error("No items found in response:", data);
      return [];
    }

    const items = data.SearchResult.Items.map((item: any) => {
      const amazonUrl = `https://www.amazon.com/dp/${item.ASIN}/?tag=${AMAZON_ASSOCIATE_TAG}&linkCode=as2&camp=1789&creative=9325`;
      console.log("Generated Amazon URL:", amazonUrl); // Debug log

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
  } catch (error: any) {
    console.error("Error searching books:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
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
