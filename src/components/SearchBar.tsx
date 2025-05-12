import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { Book } from "../services/bookService";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Common tropes for suggestions
  const COMMON_TROPES = [
    "friends to lovers",
    "enemies to lovers",
    "second chance romance",
    "horror with romance",
    "magic school",
    "chosen one",
    "quest fantasy",
    "whodunit",
    "psychological thriller",
    "time travel",
    "space opera",
    "ghost story",
    "haunted house",
    "teen pregnancy",
    "single parent",
    "arranged marriage",
    "fake relationship",
    "love triangle",
    "forbidden love",
    "slow burn romance",
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 2) {
      const filteredSuggestions = COMMON_TROPES.filter((trope) =>
        trope.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
      onOpen();
    } else {
      setSuggestions([]);
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    onClose();
    onSearch(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box position="relative" w="100%" maxW="600px" mx="auto">
      <InputGroup>
        <Input
          placeholder="Search by title, author, trope, or genre..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          size="lg"
        />
        <InputRightElement>
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            onClick={handleSearch}
            isLoading={false}
            variant="ghost"
          />
        </InputRightElement>
      </InputGroup>
      {isOpen && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          boxShadow="md"
          borderRadius="md"
          mt={1}
          zIndex={1}
        >
          <VStack align="stretch" spacing={0}>
            {suggestions.map((suggestion) => (
              <Text
                key={suggestion}
                p={2}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Text>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
