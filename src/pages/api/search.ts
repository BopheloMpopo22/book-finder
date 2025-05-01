import { NextApiRequest, NextApiResponse } from "next";
import CryptoJS from "crypto-js";

const AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY || "";
const AMAZON_SECRET_KEY = process.env.AMAZON_SECRET_KEY || "";
const AMAZON_ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || "";
const AMAZON_HOST = "webservices.amazon.com";
const AMAZON_PATH = "/paapi5/searchitems";

const generateAmazonSignature = (queryParams: string): string => {
  const stringToSign = `GET\n${AMAZON_HOST}\n${AMAZON_PATH}\n${queryParams}`;
  const hmac = CryptoJS.HmacSHA256(stringToSign, AMAZON_SECRET_KEY);
  return CryptoJS.enc.Base64.stringify(hmac);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const timestamp = new Date().toISOString();
  const params = new URLSearchParams({
    Keywords: query as string,
    PartnerTag: AMAZON_ASSOCIATE_TAG,
    PartnerType: "Associates",
    Marketplace: "www.amazon.com",
    Operation: "SearchItems",
    SearchIndex: "Books",
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
    res.status(200).json(data);
  } catch (error) {
    console.error("Error searching Amazon books:", error);
    res.status(500).json({ error: "Failed to search books" });
  }
}
