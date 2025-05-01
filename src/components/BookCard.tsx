import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  Link,
  Badge,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { Book } from "../services/bookService";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface BookCardProps {
  book: Book;
  showDescription?: boolean;
  buttonText?: string;
  buttonColorScheme?: string;
}

const BookCard = ({
  book,
  showDescription = true,
  buttonText = "View Details",
  buttonColorScheme = "blue",
}: BookCardProps) => {
  const {
    id,
    title,
    authors,
    description,
    imageUrl,
    amazonUrl,
    price,
    categories,
    publishedDate,
    pageCount,
    language,
    publisher,
    averageRating,
    ratingsCount,
  } = book;

  // Format publication date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Release date unknown";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <Box
      key={id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="white"
      boxShadow="sm"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "md",
      }}
    >
      <Image
        src={imageUrl}
        alt={title}
        fallbackSrc="https://via.placeholder.com/150"
        w="150px"
        h="225px"
        objectFit="cover"
        mx="auto"
        borderRadius="md"
      />
      <VStack mt={4} align="stretch" spacing={2}>
        <Heading size="md" noOfLines={2}>
          {title}
        </Heading>
        <Text color="gray.600">By {authors.join(", ")}</Text>

        <HStack spacing={2} wrap="wrap">
          {categories?.slice(0, 3).map((category) => (
            <Badge key={category} colorScheme="purple">
              {category}
            </Badge>
          ))}
        </HStack>

        <Text fontSize="sm" color="gray.500">
          Published: {formatDate(publishedDate)}
        </Text>

        {pageCount && (
          <Text fontSize="sm" color="gray.500">
            {pageCount} pages • {language?.toUpperCase()}
          </Text>
        )}

        {publisher && (
          <Text fontSize="sm" color="gray.500">
            {publisher}
          </Text>
        )}

        {averageRating && (
          <HStack>
            <Text fontSize="sm" color="gray.500">
              Rating: {averageRating.toFixed(1)} ⭐
            </Text>
            {ratingsCount && (
              <Text fontSize="sm" color="gray.500">
                ({ratingsCount.toLocaleString()} ratings)
              </Text>
            )}
          </HStack>
        )}

        {price && (
          <Text fontWeight="bold" color="green.600">
            ${price}
          </Text>
        )}

        {showDescription && description && (
          <Text noOfLines={3} fontSize="sm">
            {description}
          </Text>
        )}

        {amazonUrl ? (
          <Link
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ textDecoration: "none" }}
          >
            <Button
              colorScheme="orange"
              size="md"
              width="100%"
              rightIcon={<ExternalLinkIcon />}
            >
              Buy on Amazon
            </Button>
          </Link>
        ) : (
          <Button colorScheme={buttonColorScheme} mt={2} w="full">
            {buttonText}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default BookCard;
