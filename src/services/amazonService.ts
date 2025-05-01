import axios from "axios";
import crypto from "crypto";

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

export const searchBooks = async ({
  keywords,
  searchIndex = "Books",
  itemCount = 10,
}: BookSearchParams) => {
  const payload = {
    Keywords: keywords,
    Resources: [
      "Images.Primary.Medium",
      "ItemInfo.Title",
      "ItemInfo.ByLineInfo",
      "ItemInfo.ContentInfo",
      "ItemInfo.ProductInfo",
      "Offers.Listings.Price",
    ],
    PartnerTag: AMAZON_ASSOCIATE_TAG,
    PartnerType: "Associates",
    Marketplace: "www.amazon.com",
    SearchIndex: searchIndex,
    ItemCount: itemCount,
  };

  const timestamp = new Date().toISOString();
  const canonicalRequest = `POST\n${AMAZON_PATH}\n\ncontent-encoding:amz-1.0\ncontent-type:application/json; charset=utf-8\nhost:${AMAZON_HOST}\nx-amz-date:${timestamp}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n\ncontent-encoding;content-type;host;x-amz-date;x-amz-target\n${crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex")}`;

  const stringToSign = `AWS4-HMAC-SHA256\n${timestamp}\n${timestamp.substring(
    0,
    8
  )}/${AMAZON_REGION}/ProductAdvertisingAPI/aws4_request\n${crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex")}`;

  const signingKey = getSignatureKey(
    AMAZON_SECRET_KEY,
    timestamp.substring(0, 8),
    AMAZON_REGION,
    "ProductAdvertisingAPI"
  );
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  const headers = {
    "Content-Encoding": "amz-1.0",
    "Content-Type": "application/json; charset=utf-8",
    Host: AMAZON_HOST,
    "X-Amz-Date": timestamp,
    "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
    Authorization: `AWS4-HMAC-SHA256 Credential=${AMAZON_ACCESS_KEY}/${timestamp.substring(
      0,
      8
    )}/${AMAZON_REGION}/ProductAdvertisingAPI/aws4_request, SignedHeaders=content-encoding;content-type;host;x-amz-date;x-amz-target, Signature=${signature}`,
  };

  try {
    const response = await axios.post(
      `https://${AMAZON_HOST}${AMAZON_PATH}`,
      payload,
      { headers }
    );
    return response.data.SearchResult.Items.map((item: any) => ({
      id: item.ASIN,
      title: item.ItemInfo.Title.DisplayValue,
      author:
        item.ItemInfo.ByLineInfo?.Authors?.[0]?.DisplayValue ||
        "Unknown Author",
      imageUrl: item.Images.Primary.Medium.URL,
      price:
        item.Offers?.Listings?.[0]?.Price?.DisplayAmount ||
        "Price not available",
      amazonUrl: `https://www.amazon.com/dp/${item.ASIN}/?tag=${AMAZON_ASSOCIATE_TAG}&linkCode=as2&camp=1789&creative=9325`,
    }));
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
  const kDate = crypto
    .createHmac("sha256", "AWS4" + key)
    .update(dateStamp)
    .digest();
  const kRegion = crypto
    .createHmac("sha256", kDate)
    .update(regionName)
    .digest();
  const kService = crypto
    .createHmac("sha256", kRegion)
    .update(serviceName)
    .digest();
  return crypto.createHmac("sha256", kService).update("aws4_request").digest();
}
