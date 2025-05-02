import { Box, Button, Wrap, WrapItem } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";

interface NavigationProps {
  genres: string[];
  onGenreClick: (genre: string) => void;
}

const Navigation = ({ genres, onGenreClick }: NavigationProps) => {
  const buttonBg = useColorModeValue("gray.100", "gray.700");
  const buttonHoverBg = useColorModeValue("gray.200", "gray.600");

  const handleGenreClick = (genre: string) => {
    onGenreClick(genre);
  };

  return (
    <Box py={4}>
      <Wrap spacing={2} justify="center">
        {genres.map((genre) => (
          <WrapItem key={genre}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleGenreClick(genre)}
              bg={buttonBg}
              _hover={{ bg: buttonHoverBg }}
              borderRadius="full"
              px={4}
              py={2}
            >
              {genre}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default Navigation;
