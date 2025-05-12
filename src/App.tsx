import { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Divider,
  Heading,
  Text,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Book,
  searchBooksByTrope,
  searchBooksByPlatform,
} from "./services/bookService";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import SearchResults from "./components/SearchResults";
import LatestReleases from "./components/LatestReleases";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [latestReleases, setLatestReleases] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentPlatform, setCurrentPlatform] = useState("all");
  const [currentQuery, setCurrentQuery] = useState("");
  const [latestReleasesPage, setLatestReleasesPage] = useState(1);
  const [hasMoreLatestReleases, setHasMoreLatestReleases] = useState(true);
  const [isLoadingLatestReleases, setIsLoadingLatestReleases] = useState(false);

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

  useEffect(() => {
    const fetchLatestReleases = async () => {
      try {
        setIsLoadingLatestReleases(true);
        const currentYear = new Date().getFullYear();
        const query = selectedGenre
          ? `${selectedGenre} published:${currentYear}`
          : `published:${currentYear}`;
        const results = await searchBooksByTrope(query);
        setLatestReleases(results.slice(0, 10)); // Get top 10 latest releases
        setHasMoreLatestReleases(results.length > 10);
        setLatestReleasesPage(1);
      } catch (error) {
        console.error("Error fetching latest releases:", error);
      } finally {
        setIsLoadingLatestReleases(false);
      }
    };

    fetchLatestReleases();
  }, [selectedGenre]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);
    setCurrentPage(1);

    try {
      const results =
        currentPlatform === "all"
          ? await searchBooksByTrope(query, 0)
          : await searchBooksByPlatform(query, currentPlatform, 0);
      setBooks(results);
      setHasMore(results.length === 10); // Assuming 10 items per page
    } catch (err) {
      setError("Failed to fetch books. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      try {
        const results =
          currentPlatform === "all"
            ? await searchBooksByTrope(currentQuery, currentPage)
            : await searchBooksByPlatform(
                currentQuery,
                currentPlatform,
                currentPage
              );
        setBooks((prevBooks) => [...prevBooks, ...results]);
        setCurrentPage((prevPage) => prevPage + 1);
        setHasMore(results.length === 10); // Assuming 10 items per page
      } catch (err) {
        setError("Failed to load more books. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLoadMoreLatestReleases = async () => {
    if (!isLoadingLatestReleases && hasMoreLatestReleases) {
      setIsLoadingLatestReleases(true);
      try {
        const currentYear = new Date().getFullYear();
        const query = selectedGenre
          ? `${selectedGenre} published:${currentYear}`
          : `published:${currentYear}`;
        const results = await searchBooksByTrope(query, latestReleasesPage);
        const newBooks = results.slice(0, 10);
        setLatestReleases((prev) => [...prev, ...newBooks]);
        setLatestReleasesPage((prev) => prev + 1);
        setHasMoreLatestReleases(newBooks.length === 10);
      } catch (error) {
        console.error("Error loading more latest releases:", error);
      } finally {
        setIsLoadingLatestReleases(false);
      }
    }
  };

  const handleGenreClick = (genre: string) => {
    setCurrentPage(1);
    handleSearch(genre);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handlePlatformChange = (platform: string) => {
    setCurrentPlatform(platform);
    setCurrentPage(1);
    handleSearch(currentQuery);
  };

  return (
    <Box
      bg="#FCF1FB"
      minH="100vh"
      color="black"
      border="4px solid"
      borderColor="orange.400"
      borderRadius="lg"
    >
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Flex direction="column" align="flex-start" mb={6}>
            <HStack spacing={2} mb={4}>
              <ViewIcon w={8} h={8} color="orange.500" />
              <Heading
                as="h1"
                size="xl"
                color="orange.500"
                fontFamily="'Comic Sans MS', cursive"
              >
                BookFinder
              </Heading>
              <SearchIcon w={6} h={6} color="orange.500" />
            </HStack>
            <Text fontSize="lg" color="gray.600" maxW="800px" lineHeight="1.6">
              Your literary compass in the vast world of books! Search by
              anything your heart desires: tropes, settings, authors, or even
              plot twists. Found a book you love? Discover similar reads
              instantly. Whether you're hunting for enemies-to-lovers romance or
              a cozy mystery in a small town, BookFinder turns your reading
              wishes into reality. 🚀
            </Text>
          </Flex>
          <SearchBar onSearch={handleSearch} />
          {error && (
            <Box color="red.500" textAlign="center">
              {error}
            </Box>
          )}
          <Navigation genres={genres} onGenreClick={handleGenreClick} />
          <Divider borderColor="orange.200" />
          <SearchResults
            books={books}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            hasMore={hasMore}
            currentPlatform={currentPlatform}
            onPlatformChange={handlePlatformChange}
          />
          <LatestReleases
            books={latestReleases}
            genres={genres}
            onGenreChange={handleGenreChange}
            selectedGenre={selectedGenre}
            onLoadMore={handleLoadMoreLatestReleases}
            isLoading={isLoadingLatestReleases}
            hasMore={hasMoreLatestReleases}
          />
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
