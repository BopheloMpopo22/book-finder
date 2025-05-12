import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Link,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { Book } from "../services/bookService";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="md"
      transition="transform 0.2s"
      _hover={{ transform: "scale(1.02)" }}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" h="300px">
        <Image
          src={book.imageUrl}
          alt={book.title}
          objectFit="contain"
          w="100%"
          h="100%"
          bg="gray.100"
          p={2}
        />
        {book.averageRating && (
          <Box
            position="absolute"
            top="2"
            right="2"
            bg="white"
            borderRadius="full"
            p="1"
            display="flex"
            alignItems="center"
          >
            <StarIcon color="yellow.400" mr="1" />
            <Text fontSize="sm" fontWeight="bold">
              {book.averageRating.toFixed(1)}
            </Text>
          </Box>
        )}
      </Box>

      <VStack p={4} spacing={3} align="stretch" flex="1">
        <Text fontSize="xl" fontWeight="bold" noOfLines={2}>
          {book.title}
        </Text>
        <Text color="gray.600" fontSize="md">
          by {book.author}
        </Text>

        {book.categories && book.categories.length > 0 && (
          <HStack wrap="wrap" spacing={1}>
            {book.categories.slice(0, 3).map((category) => (
              <Badge key={category} colorScheme="purple" variant="subtle">
                {category}
              </Badge>
            ))}
          </HStack>
        )}

        <Text fontSize="sm" color="gray.600" noOfLines={3}>
          {book.description}
        </Text>

        <HStack spacing={4} mt="auto" w="100%" justify="space-between">
          <Text fontWeight="bold" color="blue.600">
            {book.price}
          </Text>
          {book.previewLink && (
            <Link
              href={book.previewLink}
              isExternal
              color="blue.500"
              fontSize="sm"
              fontWeight="medium"
            >
              Preview
            </Link>
          )}
        </HStack>

        <HStack spacing={4} fontSize="sm" color="gray.500">
          {book.publishedDate && (
            <Text>{new Date(book.publishedDate).getFullYear()}</Text>
          )}
          {book.pageCount && <Text>{book.pageCount} pages</Text>}
          {book.language && <Text>{book.language.toUpperCase()}</Text>}
        </HStack>

        {book.publisher && (
          <Text fontSize="sm" color="gray.500">
            Published by {book.publisher}
          </Text>
        )}

        <VStack spacing={2} mt="auto">
          {book.previewLink && (
            <Link href={book.previewLink} isExternal>
              <Button
                size="sm"
                colorScheme="blue"
                variant="outline"
                width="100%"
              >
                Preview
              </Button>
            </Link>
          )}
          {book.amazonLink && (
            <Link href={book.amazonLink} isExternal>
              <Button size="sm" colorScheme="orange" width="100%">
                Buy on Amazon
              </Button>
            </Link>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default BookCard;
