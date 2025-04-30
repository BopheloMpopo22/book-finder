import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import BookCard from "./BookCard";
import { Book } from "../services/bookService";

interface SearchResultsProps {
  books: Book[];
}

const SearchResults = ({ books }: SearchResultsProps) => {
  if (books.length === 0) return null;

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Search Results
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            buttonText="Buy on Amazon"
            buttonColorScheme="yellow"
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default SearchResults;
