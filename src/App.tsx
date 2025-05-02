import { useState } from "react";
import { Box, Container } from "@chakra-ui/react";
import { VStack, Divider } from "@chakra-ui/layout";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import SearchResults from "./components/SearchResults";
import LatestReleases from "./components/LatestReleases";
import { searchBooksByTitle, Book } from "./services/bookService";

function App() {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchBooksByTitle(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching books:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreClick = (genre: string) => {
    handleSearch(genre);
  };

  // Sample genres for navigation
  const genres = [
    "Romance",
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Horror",
    "Thriller",
    "Historical Fiction",
    "Contemporary",
    "Young Adult",
    "Children's",
    "Literary Fiction",
    "Dystopian",
    "Paranormal",
    "Urban Fantasy",
    "Cozy Mystery",
    "Space Opera",
    "Time Travel",
    "Coming of Age",
    "Family Drama",
    "Social Justice",
  ];

  // Sample latest releases (including upcoming books)
  const latestReleases: Book[] = [
    {
      id: "1",
      title: "The Midnight Library",
      authors: ["Matt Haig"],
      description: "Between life and death there is a library",
      imageUrl: "https://via.placeholder.com/150",
      amazonUrl: "",
      price: "14.99",
      publishedDate: "2024-03-15",
      categories: ["Fantasy", "Fiction"],
      pageCount: 304,
      language: "en",
      publisher: "Penguin Books",
      averageRating: 4.2,
      ratingsCount: 15000,
    },
    {
      id: "2",
      title: "Project Hail Mary",
      authors: ["Andy Weir"],
      description: "A lone astronaut must save humanity from extinction",
      imageUrl: "https://via.placeholder.com/150",
      amazonUrl: "",
      price: "16.99",
      publishedDate: "2024-04-01",
      categories: ["Science Fiction", "Space"],
      pageCount: 496,
      language: "en",
      publisher: "Random House",
      averageRating: 4.5,
      ratingsCount: 25000,
    },
    {
      id: "3",
      title: "The Future of Us",
      authors: ["Sarah J. Maas"],
      description: "A new epic fantasy series from the bestselling author",
      imageUrl: "https://via.placeholder.com/150",
      amazonUrl: "",
      price: "24.99",
      publishedDate: "2025-01-15",
      categories: ["Fantasy", "Romance"],
      pageCount: 800,
      language: "en",
      publisher: "Bloomsbury",
      averageRating: 0,
      ratingsCount: 0,
    },
    {
      id: "4",
      title: "The Last Chapter",
      authors: ["John Smith"],
      description: "A mystery that will keep you guessing until the very end",
      imageUrl: "https://via.placeholder.com/150",
      amazonUrl: "",
      price: "13.99",
      publishedDate: "2024-05-01",
      categories: ["Mystery", "Thriller"],
      pageCount: 352,
      language: "en",
      publisher: "HarperCollins",
      averageRating: 0,
      ratingsCount: 0,
    },
  ];

  return (
    <Box bg="#FCF1FB" minH="100vh" color="black">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Header onSearch={handleSearch} isLoading={isLoading} />
          <Navigation genres={genres} onGenreClick={handleGenreClick} />
          <Divider borderColor="gray.300" />
          <SearchResults books={searchResults} />
          <LatestReleases books={latestReleases} />
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
