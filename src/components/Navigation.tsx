import { Box, Button, Wrap, WrapItem } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";

interface NavigationProps {
  onCategorySelect: (category: string) => void;
}

const Navigation = ({ onCategorySelect }: NavigationProps) => {
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Business",
  ];

  const buttonBg = useColorModeValue("gray.100", "gray.700");
  const buttonHoverBg = useColorModeValue("gray.200", "gray.600");

  return (
    <Box py={4}>
      <Wrap spacing={2} justify="center">
        {categories.map((category) => (
          <WrapItem key={category}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCategorySelect(category)}
              bg={buttonBg}
              _hover={{ bg: buttonHoverBg }}
            >
              {category}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default Navigation;
