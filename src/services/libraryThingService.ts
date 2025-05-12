import { Book } from "./bookService";

const LIBRARY_THING_API = "https://www.librarything.com/api";

interface LibraryThingBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  cover_url: string;
  rating: number;
  rating_count: number;
  similar_books: Array<{
    id: string;
    title: string;
    author: string;
  }>;
  tags: string[];
  description: string;
  published_date: string;
}

export const searchLibraryThingBooks = async (
  query: string
): Promise<Book[]> => {
  try {
    const response = await fetch(
      `${LIBRARY_THING_API}/search?q=${encodeURIComponent(query)}&format=json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from LibraryThing API");
    }

    const data = await response.json();
    const libraryThingBooks: LibraryThingBook[] = data.books || [];

    // Transform LibraryThing books to our Book format
    return libraryThingBooks.map((book: LibraryThingBook) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      imageUrl: book.cover_url || "https://via.placeholder.com/150",
      price: "Price not available",
      publishedDate: book.published_date,
      categories: book.tags,
      isbn: book.isbn,
      averageRating: book.rating,
      ratingsCount: book.rating_count,
      amazonLink: book.isbn
        ? `https://www.amazon.com/s?k=${book.isbn}&tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}`
        : `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}&tag=${
            process.env.REACT_APP_AMAZON_ASSOCIATE_TAG
          }`,
    }));
  } catch (error) {
    console.error("Error searching LibraryThing:", error);
    return [];
  }
};

export const getSimilarBooks = async (bookId: string): Promise<Book[]> => {
  try {
    const response = await fetch(
      `${LIBRARY_THING_API}/book/${bookId}/similar?format=json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch similar books from LibraryThing API");
    }

    const data = await response.json();
    const similarBooks: LibraryThingBook[] = data.similar_books || [];

    return similarBooks.map((book: LibraryThingBook) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      imageUrl: book.cover_url || "https://via.placeholder.com/150",
      price: "Price not available",
      publishedDate: book.published_date,
      categories: book.tags,
      isbn: book.isbn,
      averageRating: book.rating,
      ratingsCount: book.rating_count,
      amazonLink: book.isbn
        ? `https://www.amazon.com/s?k=${book.isbn}&tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}`
        : `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}&tag=${
            process.env.REACT_APP_AMAZON_ASSOCIATE_TAG
          }`,
    }));
  } catch (error) {
    console.error("Error fetching similar books:", error);
    return [];
  }
};

export const getBookDetails = async (bookId: string): Promise<Book | null> => {
  try {
    const response = await fetch(
      `${LIBRARY_THING_API}/book/${bookId}?format=json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch book details from LibraryThing API");
    }

    const data = await response.json();
    const book: LibraryThingBook = data.book;

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      imageUrl: book.cover_url || "https://via.placeholder.com/150",
      price: "Price not available",
      publishedDate: book.published_date,
      categories: book.tags,
      isbn: book.isbn,
      averageRating: book.rating,
      ratingsCount: book.rating_count,
      amazonLink: book.isbn
        ? `https://www.amazon.com/s?k=${book.isbn}&tag=${process.env.REACT_APP_AMAZON_ASSOCIATE_TAG}`
        : `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}&tag=${
            process.env.REACT_APP_AMAZON_ASSOCIATE_TAG
          }`,
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
};
