import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import BookCard from "./BookCard";
import { Book } from "../services/bookService";

interface LatestReleasesProps {
  books: Book[];
}

const LatestReleases = ({ books }: LatestReleasesProps) => {
  return (
    <Box>
      <Heading size="lg" mb={6}>
        Latest Book Releases
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} showDescription={false} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default LatestReleases;
