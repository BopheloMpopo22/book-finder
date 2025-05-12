import { Book } from "./bookService";

const OPEN_LIBRARY_API = "https://openlibrary.org";

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  isbn?: string[];
}

export const searchOpenLibraryBooks = async (
  query: string
): Promise<Book[]> => {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&limit=20`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Open Library API");
    }

    const data = await response.json();
    const openLibraryBooks: OpenLibraryBook[] = data.docs || [];

    // Transform Open Library books to our Book format
    return openLibraryBooks.map((book: OpenLibraryBook) => ({
      id: book.key,
      title: book.title,
      author: book.author_name?.[0] || "Unknown Author",
      description: "", // Open Library doesn't provide descriptions in search results
      imageUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/150",
      price: "Price not available",
      publishedDate: book.first_publish_year?.toString(),
      categories: book.subject || [],
      isbn: book.isbn?.[0],
      amazonLink: book.isbn?.[0]
        ? `https://www.amazon.com/s?k=${book.isbn[0]}&tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}`
        : `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}&tag=${
            process.env.REACT_APP_AMAZON_ASSOCIATE_TAG
          }`,
    }));
  } catch (error) {
    console.error("Error searching Open Library:", error);
    return [];
  }
};

export const getBookDetails = async (bookId: string): Promise<Book | null> => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_API}${bookId}.json`);

    if (!response.ok) {
      throw new Error("Failed to fetch book details from Open Library API");
    }

    const data = await response.json();

    return {
      id: bookId,
      title: data.title,
      author: data.authors?.[0]?.name || "Unknown Author",
      description: data.description || "",
      imageUrl: data.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`
        : "https://via.placeholder.com/150",
      price: "Price not available",
      publishedDate: data.publish_date,
      categories: data.subjects || [],
      isbn: data.isbn_13?.[0] || data.isbn_10?.[0],
      amazonLink: data.isbn_13?.[0]
        ? `https://www.amazon.com/s?k=${data.isbn_13[0]}&tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}`
        : `https://www.amazon.com/s?k=${encodeURIComponent(data.title)}&tag=${
            process.env.REACT_APP_AMAZON_ASSOCIATE_TAG
          }`,
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
};
