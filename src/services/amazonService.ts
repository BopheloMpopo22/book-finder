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
    console.log(
      "Making API request to:",
      `${API_URL}/api/search?query=${encodeURIComponent(keywords)}`
    );
    const response = await fetch(
      `${API_URL}/api/search?query=${encodeURIComponent(keywords)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
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
