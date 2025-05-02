const API_URL =
  process.env.REACT_APP_API_URL || "https://book-finder-backend.onrender.com";

// Fallback data for when the API is not available
const FALLBACK_BOOKS = [
  {
    ASIN: "B09HZ8Y1ZP",
    ItemInfo: {
      Title: { DisplayValue: "The Midnight Library" },
      ByLineInfo: { Authors: [{ DisplayValue: "Matt Haig" }] },
    },
    Images: {
      Primary: {
        Medium: {
          URL: "https://m.media-amazon.com/images/I/81nzxODnaJL._AC_UL320_.jpg",
        },
      },
    },
    Offers: {
      Listings: [
        {
          Price: { DisplayAmount: "$14.99" },
        },
      ],
    },
  },
  {
    ASIN: "B08G9J44ZN",
    ItemInfo: {
      Title: { DisplayValue: "Project Hail Mary" },
      ByLineInfo: { Authors: [{ DisplayValue: "Andy Weir" }] },
    },
    Images: {
      Primary: {
        Medium: {
          URL: "https://m.media-amazon.com/images/I/81nzxODnaJL._AC_UL320_.jpg",
        },
      },
    },
    Offers: {
      Listings: [
        {
          Price: { DisplayAmount: "$16.99" },
        },
      ],
    },
  },
];

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
      console.warn("API request failed, using fallback data");
      return FALLBACK_BOOKS;
    }

    const data = await response.json();
    console.log("Amazon API Response:", data);

    if (!data.SearchResult?.Items) {
      console.warn("No items found in response, using fallback data");
      return FALLBACK_BOOKS;
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
    console.error("Error searching books, using fallback data:", error);
    return FALLBACK_BOOKS;
  }
};
