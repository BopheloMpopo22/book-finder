// API Keys should be stored in environment variables
// import { searchAmazonBooks } from "./amazonService";
import { searchBooks } from "./amazonService";
import { searchOpenLibraryBooks } from "./openLibraryService";
import {
  searchLibraryThingBooks,
  getSimilarBooks,
} from "./libraryThingService";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  price: string;
  previewLink?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
  publisher?: string;
  averageRating?: number;
  ratingsCount?: number;
  isbn?: string;
  amazonLink?: string;
}

// Common book tropes and their search terms
const BOOK_TROPES = {
  romance: [
    "friends to lovers",
    "enemies to lovers",
    "second chance romance",
    "fake relationship",
    "love triangle",
    "forbidden love",
    "slow burn romance",
    "insta love",
    "arranged marriage",
    "opposites attract",
    "office romance",
    "college romance",
    "small town romance",
    "royal romance",
    "billionaire romance",
    "single parent romance",
    "secret baby",
    "marriage of convenience",
    "amnesia romance",
    "childhood friends to lovers",
    "brother's best friend",
    "best friend's sibling",
    "fake dating",
    "forced proximity",
    "grumpy sunshine",
    "age gap romance",
    "forbidden love",
    "love at first sight",
    "soulmates",
    "fated mates",
  ],
  fantasy: [
    "magic school",
    "chosen one",
    "quest fantasy",
    "epic fantasy",
    "urban fantasy",
    "dark fantasy",
    "high fantasy",
    "sword and sorcery",
    "mythology retelling",
    "fairy tale retelling",
    "dragon fantasy",
    "magical creatures",
    "portal fantasy",
    "time travel fantasy",
    "alternate world",
    "magic system",
    "wizard school",
    "magical academy",
    "supernatural powers",
    "magical realism",
  ],
  mystery: [
    "whodunit",
    "police procedural",
    "cozy mystery",
    "psychological thriller",
    "crime thriller",
    "detective story",
    "murder mystery",
    "suspense thriller",
    "legal thriller",
    "spy thriller",
    "cold case",
    "amateur detective",
    "private investigator",
    "forensic mystery",
    "historical mystery",
    "locked room mystery",
    "serial killer",
    "missing person",
    "heist",
    "conspiracy",
  ],
  horror: [
    "psychological horror",
    "supernatural horror",
    "ghost story",
    "haunted house",
    "zombie apocalypse",
    "vampire horror",
    "werewolf horror",
    "cosmic horror",
    "body horror",
    "slasher horror",
    "possession",
    "demonic horror",
    "folk horror",
    "gothic horror",
    "paranormal horror",
    "survival horror",
    "isolation horror",
    "psychological thriller",
    "creepy small town",
    "ancient evil",
  ],
  scifi: [
    "space opera",
    "dystopian",
    "post apocalyptic",
    "time travel",
    "alternate history",
    "first contact",
    "cyberpunk",
    "steampunk",
    "military scifi",
    "hard scifi",
    "space exploration",
    "alien invasion",
    "artificial intelligence",
    "genetic engineering",
    "virtual reality",
    "parallel worlds",
    "time loop",
    "space colony",
    "future society",
    "robot uprising",
  ],
};

// Common settings for books
const BOOK_SETTINGS = [
  "college",
  "university",
  "high school",
  "boarding school",
  "small town",
  "big city",
  "farm",
  "ranch",
  "beach",
  "island",
  "desert",
  "jungle",
  "mountain",
  "forest",
  "castle",
  "mansion",
  "hotel",
  "hospital",
  "prison",
  "space station",
  "spaceship",
  "future city",
  "medieval kingdom",
  "ancient civilization",
  "alternate universe",
  "parallel world",
  "underwater",
  "underground",
  "deserted island",
  "haunted house",
];

// Popular authors for similar books search
const POPULAR_AUTHORS = [
  "J.K. Rowling",
  "Stephen King",
  "George R.R. Martin",
  "J.R.R. Tolkien",
  "Agatha Christie",
  "Jane Austen",
  "Charles Dickens",
  "Ernest Hemingway",
  "F. Scott Fitzgerald",
  "Mark Twain",
  "William Shakespeare",
  "Emily Brontë",
  "Charlotte Brontë",
  "Virginia Woolf",
  "Oscar Wilde",
  "H.P. Lovecraft",
  "Edgar Allan Poe",
  "Arthur Conan Doyle",
  "Jules Verne",
  "H.G. Wells",
];

// Enhanced query processing function
const processSearchQuery = (query: string): string => {
  const normalizedQuery = query.toLowerCase().trim();

  // Handle "similar to" queries
  if (normalizedQuery.includes("similar to")) {
    const [_, bookTitle] = normalizedQuery.split("similar to");
    // First try to find the book to get its details
    return `intitle:"${bookTitle.trim()}"`;
  }

  // Handle "with" queries (e.g., "romance with plot twist")
  if (normalizedQuery.includes(" with ")) {
    const [mainTerm, additionalTerm] = normalizedQuery.split(" with ");
    return `${mainTerm.trim()} ${additionalTerm.trim()}`;
  }

  // Handle "set in" queries
  if (normalizedQuery.includes(" set in ")) {
    const [_, setting] = normalizedQuery.split(" set in ");
    if (BOOK_SETTINGS.includes(setting.trim())) {
      return `subject:${setting.trim()}`;
    }
  }

  // Handle author queries
  const matchingAuthor = POPULAR_AUTHORS.find((author) =>
    normalizedQuery.includes(author.toLowerCase())
  );
  if (matchingAuthor) {
    return `inauthor:"${matchingAuthor}"`;
  }

  // Handle genre + trope combinations
  for (const [genre, tropes] of Object.entries(BOOK_TROPES)) {
    if (tropes.some((trope) => normalizedQuery.includes(trope))) {
      return `${genre} ${normalizedQuery}`;
    }
  }

  // Default case: return the original query with common book-related terms
  return `${normalizedQuery} book novel`;
};

// Define search types and their corresponding API priorities
const SEARCH_TYPES = {
  ROMANCE_TROPES: [
    "forbidden love",
    "enemies to lovers",
    "friends to lovers",
    "second chance",
    "fake relationship",
    "arranged marriage",
    "love triangle",
    "slow burn",
    "insta love",
    "opposites attract",
  ],
  CLASSIC_LITERATURE: [
    "classic",
    "literature",
    "public domain",
    "19th century",
    "20th century",
    "victorian",
    "gothic",
    "romantic era",
  ],
  NEW_RELEASES: [
    "new release",
    "latest",
    "recent",
    "2024",
    "2025",
    "this year",
    "new book",
  ],
};

// Determine the most relevant API for a given search query
const getRelevantAPI = (
  query: string
): "libraryThing" | "googleBooks" | "openLibrary" => {
  const normalizedQuery = query.toLowerCase();

  // Check for romance tropes
  if (
    SEARCH_TYPES.ROMANCE_TROPES.some((trope) => normalizedQuery.includes(trope))
  ) {
    return "libraryThing";
  }

  // Check for classic literature
  if (
    SEARCH_TYPES.CLASSIC_LITERATURE.some((term) =>
      normalizedQuery.includes(term)
    )
  ) {
    return "openLibrary";
  }

  // Check for new releases
  if (
    SEARCH_TYPES.NEW_RELEASES.some((term) => normalizedQuery.includes(term))
  ) {
    return "googleBooks";
  }

  // Default to Google Books for general searches
  return "googleBooks";
};

export const searchBooksByTrope = async (
  trope: string,
  page = 0
): Promise<Book[]> => {
  const processedQuery = processSearchQuery(trope);
  const itemsPerPage = 15; // Start with 15 results from primary API
  const relevantAPI = getRelevantAPI(processedQuery);

  console.log("Processed Search Query:", processedQuery);
  console.log("Using primary API:", relevantAPI);

  // If the query was a "similar to" search, handle it differently
  if (trope.toLowerCase().includes("similar to")) {
    const [_, bookTitle] = trope.toLowerCase().split("similar to");

    // First try to find the original book from Google Books (usually faster)
    const googleResults = await searchBooks({
      keywords: `intitle:"${bookTitle.trim()}"`,
      itemCount: 1,
      startIndex: 0,
    });

    const originalBook = googleResults[0];

    if (originalBook) {
      // Get similar books from LibraryThing (better for recommendations)
      const libraryThingSimilar = await getSimilarBooks(originalBook.id);

      // Also search both APIs for similar books based on categories
      const similarQuery = `${originalBook.categories?.join(" ")} ${
        originalBook.author
      }`;
      const [similarGoogleResults, similarOpenLibraryResults] =
        await Promise.all([
          searchBooks({
            keywords: similarQuery,
            itemCount: itemsPerPage,
            startIndex: page * itemsPerPage,
          }),
          searchOpenLibraryBooks(similarQuery),
        ]);

      // Combine all results, prioritizing LibraryThing recommendations
      const combinedResults = [
        ...libraryThingSimilar,
        ...similarGoogleResults,
        ...similarOpenLibraryResults,
      ];

      // Deduplicate and sort by publication date
      const uniqueResults = Array.from(
        new Map(combinedResults.map((book) => [book.id, book])).values()
      );
      return uniqueResults.sort((a: Book, b: Book) => {
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        return dateB - dateA;
      });
    }
  }

  // Get initial results from the most relevant API
  let primaryResults: Book[] = [];
  switch (relevantAPI) {
    case "libraryThing":
      primaryResults = await searchLibraryThingBooks(processedQuery);
      break;
    case "googleBooks":
      primaryResults = await searchBooks({
        keywords: processedQuery,
        itemCount: itemsPerPage,
        startIndex: page * itemsPerPage,
      });
      break;
    case "openLibrary":
      primaryResults = await searchOpenLibraryBooks(processedQuery);
      break;
  }

  // If we have enough results from the primary API, return them
  if (primaryResults.length >= itemsPerPage) {
    return primaryResults.sort((a: Book, b: Book) => {
      const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
      const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
      return dateB - dateA;
    });
  }

  // If we need more results, fetch from the other APIs
  const [secondaryResults, tertiaryResults] = await Promise.all([
    relevantAPI === "googleBooks"
      ? searchLibraryThingBooks(processedQuery)
      : relevantAPI === "libraryThing"
      ? searchBooks({
          keywords: processedQuery,
          itemCount: itemsPerPage,
          startIndex: page * itemsPerPage,
        })
      : searchOpenLibraryBooks(processedQuery),
    relevantAPI === "openLibrary"
      ? searchBooks({
          keywords: processedQuery,
          itemCount: itemsPerPage,
          startIndex: page * itemsPerPage,
        })
      : searchOpenLibraryBooks(processedQuery),
  ]);

  // Combine and deduplicate results
  const combinedResults = [
    ...primaryResults,
    ...secondaryResults,
    ...tertiaryResults,
  ];
  const uniqueResults = Array.from(
    new Map(combinedResults.map((book) => [book.id, book])).values()
  );

  // Sort by publication date (newest first)
  return uniqueResults.sort((a: Book, b: Book) => {
    const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
    const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
    return dateB - dateA;
  });
};

export const getBooksByGenre = async (genre: string): Promise<Book[]> => {
  const normalizedGenre = genre.toLowerCase();
  let searchQuery = genre;

  // Add common keywords for better results
  if (normalizedGenre === "romance") {
    searchQuery = "romance novel love relationship";
  } else if (normalizedGenre === "fantasy") {
    searchQuery = "fantasy novel magic adventure";
  } else if (normalizedGenre === "mystery") {
    searchQuery = "mystery novel crime detective";
  } else if (normalizedGenre === "horror") {
    searchQuery = "horror novel scary thriller";
  } else if (normalizedGenre === "scifi") {
    searchQuery = "science fiction novel future technology";
  }

  const results = await searchBooks({ keywords: searchQuery });
  // Add Amazon affiliate links
  return results.map((book: Book) => {
    const amazonLink = book.isbn
      ? `https://www.amazon.com/s?k=${book.isbn}&tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}`
      : `https://www.amazon.com/s?k=${encodeURIComponent(
          book.title + " " + book.author
        )}&tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}`;
    return {
      ...book,
      amazonLink,
    };
  });
};

export const getLatestReleases = async (): Promise<Book[]> => {
  const currentYear = new Date().getFullYear();
  const [googleResults, openLibraryResults] = await Promise.all([
    searchBooks({
      keywords: `published:${currentYear}`,
      itemCount: 40,
    }),
    searchOpenLibraryBooks(`publish_year:${currentYear}`),
  ]);

  // Combine and deduplicate results
  const combinedResults = [...googleResults, ...openLibraryResults];
  const uniqueResults = Array.from(
    new Map(combinedResults.map((book) => [book.id, book])).values()
  );

  // Sort by publication date (newest first)
  return uniqueResults.sort((a: Book, b: Book) => {
    const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
    const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
    return dateB - dateA;
  });
};

export const searchBooksByPlatform = async (
  query: string,
  platform: string,
  page = 0
): Promise<Book[]> => {
  const processedQuery = processSearchQuery(query);
  const itemsPerPage = 20;

  console.log(`Searching ${platform} for:`, processedQuery);

  switch (platform) {
    case "google":
      return searchBooks({
        keywords: processedQuery,
        itemCount: itemsPerPage,
        startIndex: page * itemsPerPage,
      });
    case "libraryThing":
      return searchLibraryThingBooks(processedQuery);
    case "openLibrary":
      return searchOpenLibraryBooks(processedQuery);
    case "all":
    default:
      // For "all" platform, we'll use our existing searchBooksByTrope function
      return searchBooksByTrope(processedQuery, page);
  }
};
