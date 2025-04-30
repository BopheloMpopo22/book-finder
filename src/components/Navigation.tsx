import {
  Box,
  HStack,
  Button,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";

interface NavigationProps {
  genres: string[];
  onGenreClick?: (genre: string) => void;
}

const Navigation = ({ genres, onGenreClick }: NavigationProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      overflowX="auto"
      whiteSpace="nowrap"
      py={4}
      px={6}
      bg={bgColor}
      borderRadius="md"
      boxShadow="sm"
    >
      <Heading size="md" mb={4} color="gray.700">
        Browse by Genre
      </Heading>
      <HStack spacing={3} wrap="wrap" justify="flex-start">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant="outline"
            size="md"
            onClick={() => onGenreClick?.(genre)}
            _hover={{ bg: hoverBgColor }}
            minW="120px"
            h="40px"
            fontSize="sm"
            fontWeight="medium"
          >
            {genre}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default Navigation;
