import {
  Box,
  SimpleGrid,
  Text,
  Button,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { Book } from "../services/bookService";
import BookCard from "./BookCard";
import PlatformSelector from "./PlatformSelector";

interface SearchResultsProps {
  books: Book[];
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  currentPlatform: string;
  onPlatformChange: (platform: string) => void;
}

const SearchResults = ({
  books,
  onLoadMore,
  isLoading,
  hasMore,
  currentPlatform,
  onPlatformChange,
}: SearchResultsProps) => {
  return (
    <Box>
      <PlatformSelector
        currentPlatform={currentPlatform}
        onPlatformChange={onPlatformChange}
        isLoading={isLoading}
      />

      {books.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" color="gray.500">
            No books found. Try a different search term or platform.
          </Text>
        </Box>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
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
        </>
      )}
    </Box>
  );
};

export default SearchResults;
