import { Box, Button, Flex, Wrap, WrapItem } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";

interface NavigationProps {
  genres: string[];
  onGenreClick: (genre: string) => void;
}

const Navigation = ({ genres, onGenreClick }: NavigationProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box>
      <Wrap spacing={4} justify="flex-start">
        {genres.map((genre) => (
          <WrapItem key={genre}>
            <Button
              onClick={() => onGenreClick(genre)}
              bg={bgColor}
              _hover={{ bg: hoverBgColor }}
              size="md"
              variant="outline"
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
