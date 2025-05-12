// import { HmacSHA256, enc } from "crypto-js";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

interface BookSearchParams {
  keywords: string;
  searchIndex?: string;
  itemCount?: number;
  startIndex?: number;
}

interface AmazonSearchParams {
  keywords: string;
  searchIndex?: string;
  itemCount?: number;
  startIndex?: number;
}

interface AmazonBook {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  price: string;
  amazonLink: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
  publisher?: string;
  averageRating?: number;
  ratingsCount?: number;
}

// Fallback data for when the API is not available
const FALLBACK_BOOKS = [
  {
    id: "B09HZ8Y1ZP",
    volumeInfo: {
      title: "The Midnight Library",
      authors: ["Matt Haig"],
      description: "Between life and death there is a library",
      imageLinks: {
        thumbnail:
          "https://m.media-amazon.com/images/I/81nzxODnaJL._AC_UL320_.jpg",
      },
      previewLink:
        "https://books.google.com/books?id=B09HZ8Y1ZP&printsec=frontcover",
      publishedDate: "2020-08-13",
      pageCount: 304,
      categories: ["Fiction", "Fantasy"],
      language: "en",
      publisher: "Canongate Books",
      averageRating: 4.2,
      ratingsCount: 15000,
    },
    saleInfo: {
      listPrice: {
        amount: 14.99,
        currencyCode: "USD",
      },
    },
  },
  {
    id: "B08G9J44ZN",
    volumeInfo: {
      title: "Project Hail Mary",
      authors: ["Andy Weir"],
      description: "A lone astronaut must save humanity from extinction",
      imageLinks: {
        thumbnail:
          "https://m.media-amazon.com/images/I/81nzxODnaJL._AC_UL320_.jpg",
      },
      previewLink:
        "https://books.google.com/books?id=B08G9J44ZN&printsec=frontcover",
      publishedDate: "2021-05-04",
      pageCount: 496,
      categories: ["Science Fiction", "Space"],
      language: "en",
      publisher: "Random House",
      averageRating: 4.5,
      ratingsCount: 25000,
    },
    saleInfo: {
      listPrice: {
        amount: 16.99,
        currencyCode: "USD",
      },
    },
  },
];

// Cache for search results
const searchCache = new Map<string, any>();

export const searchBooks = async ({
  keywords,
  searchIndex = "Books",
  itemCount = 20, // Reduced from 40 to 20
  startIndex = 0,
}: BookSearchParams) => {
  try {
    const cacheKey = `${keywords}-${startIndex}-${itemCount}`;

    // Check cache first
    if (searchCache.has(cacheKey)) {
      return searchCache.get(cacheKey);
    }

    // Optimize search query
    const optimizedQuery = keywords
      .toLowerCase()
      .replace(/\s+/g, " ") // Remove extra spaces
      .trim();

    console.log("Making API request to Google Books API");
    const googleResponse = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(
        optimizedQuery
      )}&maxResults=${itemCount}&startIndex=${startIndex}&key=${
        process.env.REACT_APP_GOOGLE_BOOKS_API_KEY
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!googleResponse.ok) {
      console.warn("Google Books API request failed, using fallback data");
      return FALLBACK_BOOKS;
    }

    const googleData = await googleResponse.json();

    if (!googleData.items || googleData.items.length === 0) {
      console.warn(
        "No items found in Google Books response, using fallback data"
      );
      return FALLBACK_BOOKS;
    }

    const processedResults = googleData.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || "Unknown Author",
      description: item.volumeInfo.description || "",
      imageUrl:
        item.volumeInfo.imageLinks?.thumbnail ||
        "https://via.placeholder.com/150",
      previewLink: item.volumeInfo.previewLink,
      price: item.saleInfo?.listPrice
        ? `$${item.saleInfo.listPrice.amount}`
        : "Price not available",
      publishedDate: item.volumeInfo.publishedDate,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories || [],
      language: item.volumeInfo.language,
      publisher: item.volumeInfo.publisher,
      averageRating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount,
      isbn: item.volumeInfo.industryIdentifiers?.find(
        (id: any) => id.type === "ISBN_13" || id.type === "ISBN_10"
      )?.identifier,
      amazonLink: item.volumeInfo.industryIdentifiers?.find(
        (id: any) => id.type === "ISBN_13" || id.type === "ISBN_10"
      )?.identifier
        ? `https://www.amazon.com/s?k=${
            item.volumeInfo.industryIdentifiers.find(
              (id: any) => id.type === "ISBN_13" || id.type === "ISBN_10"
            ).identifier
          }&tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}`
        : `https://www.amazon.com/s?k=${encodeURIComponent(
            item.volumeInfo.title
          )}&tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}`,
      subtitle: item.volumeInfo.subtitle,
      industryIdentifiers: item.volumeInfo.industryIdentifiers,
      maturityRating: item.volumeInfo.maturityRating,
      printType: item.volumeInfo.printType,
      contentVersion: item.volumeInfo.contentVersion,
      panelizationSummary: item.volumeInfo.panelizationSummary,
      readingModes: item.volumeInfo.readingModes,
      canonicalVolumeLink: item.volumeInfo.canonicalVolumeLink,
      infoLink: item.volumeInfo.infoLink,
      searchInfo: item.searchInfo?.textSnippet,
    }));

    // Cache the results
    searchCache.set(cacheKey, processedResults);

    // Clear old cache entries after 5 minutes
    setTimeout(() => {
      searchCache.delete(cacheKey);
    }, 5 * 60 * 1000);

    return processedResults;
  } catch (error) {
    console.error("Error searching books, using fallback data:", error);
    return FALLBACK_BOOKS;
  }
};

// Commented out: AmazonBook, AmazonSearchParams, searchAmazonBooks, generateAmazonSignature, and all Amazon API logic below.
// Only Google Books API and fallback remain active.
// export const searchAmazonBooks = async ({
//   keywords,
//   searchIndex = "Books",
//   itemCount = 40,
//   startIndex = 0,
// }: AmazonSearchParams): Promise<AmazonBook[]> => {
//   // Amazon API disabled for now
//   return [];
// };
