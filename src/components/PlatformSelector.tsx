import { HStack, Button, Text } from "@chakra-ui/react";

interface PlatformSelectorProps {
  currentPlatform: string;
  onPlatformChange: (platform: string) => void;
  isLoading: boolean;
}

const PlatformSelector = ({
  currentPlatform,
  onPlatformChange,
  isLoading,
}: PlatformSelectorProps) => {
  const platforms = [
    { id: "all", label: "All Platforms" },
    { id: "google", label: "Google Books" },
    { id: "libraryThing", label: "LibraryThing" },
    { id: "openLibrary", label: "Open Library" },
  ];

  return (
    <HStack spacing={4} mb={6} align="center">
      <Text fontWeight="medium">Platform:</Text>
      {platforms.map((platform) => (
        <Button
          key={platform.id}
          size="sm"
          colorScheme={currentPlatform === platform.id ? "blue" : "gray"}
          variant={currentPlatform === platform.id ? "solid" : "outline"}
          onClick={() => onPlatformChange(platform.id)}
          isLoading={isLoading && currentPlatform === platform.id}
          loadingText={platform.label}
        >
          {platform.label}
        </Button>
      ))}
    </HStack>
  );
};

export default PlatformSelector;
