import {
  Box,
  Heading,
  SimpleGrid,
  Select,
  HStack,
  Button,
  Center,
} from "@chakra-ui/react";
import { Book } from "../services/bookService";
import BookCard from "./BookCard";

interface LatestReleasesProps {
  books: Book[];
  genres: string[];
  onGenreChange: (genre: string) => void;
  selectedGenre: string;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

const LatestReleases = ({
  books,
  genres,
  onGenreChange,
  selectedGenre,
  onLoadMore,
  isLoading,
  hasMore,
}: LatestReleasesProps) => {
  if (books.length === 0) return null;

  return (
    <Box>
      <HStack spacing={4} mb={6} align="center">
        <Heading size="lg">Latest Releases</Heading>
        <Select
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
          maxW="200px"
          placeholder="All Genres"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Select>
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </SimpleGrid>
      {hasMore && (
        <Center mt={8}>
          <Button
            onClick={onLoadMore}
            isLoading={isLoading}
            loadingText="Loading..."
            colorScheme="blue"
            size="lg"
            px={8}
          >
            Load More
          </Button>
        </Center>
      )}
    </Box>
  );
};

export default LatestReleases;
