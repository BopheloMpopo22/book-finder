import { SimpleGrid, Box, Text, Spinner, Center } from "@chakra-ui/react";
import BookCard from "./BookCard";
import { Book } from "../services/bookService";

interface BookGridProps {
  books: Book[];
  isLoading: boolean;
  error: string | null;
}

const BookGrid = ({ books, isLoading, error }: BookGridProps) => {
  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={10}>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  if (books.length === 0) {
    return (
      <Center py={10}>
        <Text color="gray.500">
          No books found. Try a different search term.
        </Text>
      </Center>
    );
  }

  return (
    <Box px={4} py={8}>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        spacing={8}
        w="100%"
        maxW="container.xl"
        mx="auto"
      >
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default BookGrid;
