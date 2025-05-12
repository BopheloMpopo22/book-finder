import { useState } from "react";
import {
  Box,
  Input,
  VStack,
  Heading,
  Text,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface HeaderProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const Header = ({ onSearch, isLoading }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box textAlign="center" py={8}>
      <Heading size="xl" mb={6}>
        Book Finder
      </Heading>
      <Box w="full" maxW="900px" mx="auto" position="relative">
        <Input
          type="text"
          placeholder="Search for your favorite books or search for new books to fill the bookshelf"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          bg="white"
          borderColor="gray.300"
          _hover={{ borderColor: "gray.400" }}
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px blue.500",
          }}
          h="60px"
          fontSize="lg"
          pr="60px"
          borderRadius="full"
        />
        <Button
          colorScheme="blue"
          onClick={handleSearch}
          h="50px"
          w="50px"
          p={0}
          borderRadius="full"
          position="absolute"
          right="5px"
          top="5px"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="md" /> : <SearchIcon boxSize={5} />}
        </Button>
      </Box>
      <Box mt={8} maxW="800px" mx="auto" textAlign="left">
        <VStack gap={2} align="start">
          <Text fontWeight="bold" fontSize="lg">
            Search for your favorite books
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            Forgot your favorite books, write what you remember of the plot,
            book finder will find it for you.
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            Search for similar stories to the one you just read, just write any
            category of book you want.
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            e.g. friends to lovers, action with romance, horror books with a
            good ending.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Header;
