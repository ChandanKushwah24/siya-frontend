import { Box, VStack, Text, Input, Select, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';

/**
 * ThemeSidebar Component
 * 
 * A sidebar panel for customizing slide appearance including colors and fonts.
 * Provides controls for:
 * - Background color selection
 * - Text color selection
 * - Font family selection
 * 
 * @param {Object} theme - Current theme settings
 * @param {Function} onThemeChange - Callback for theme updates
 */
const ThemeSidebar = ({ theme, onThemeChange }) => {
  // Hooks for managing color mode and selected color state
  const { colorMode } = useColorMode();
  const [selectedColor, setSelectedColor] = useState(theme.backgroundColor);

  // Available font options for the slide
  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Roboto',
    'Open Sans'
  ];

  /**
   * Handles color changes for background and text
   * @param {string} type - The type of color to change (backgroundColor or textColor)
   * @param {string} value - The new color value in hex format
   */
  const handleColorChange = (type, value) => {
    onThemeChange({
      [type]: value
    });
    if (type === 'backgroundColor') {
      setSelectedColor(value);
    }
  };

  return (
    <Box
      w="300px"
      h="100%"
      bg={colorMode === 'dark' ? 'gray.700' : 'white'}
      p={4}
      borderLeft="1px"
      borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Theme Settings</Text>
        
        <Box>
          <Text mb={2}>Background Color</Text>
          <Input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
          />
        </Box>

        <Box>
          <Text mb={2}>Text Color</Text>
          <Input
            type="color"
            value={theme.textColor}
            onChange={(e) => handleColorChange('textColor', e.target.value)}
          />
        </Box>

        <Box>
          <Text mb={2}>Font Family</Text>
          <Select
            value={theme.fontFamily}
            onChange={(e) => handleColorChange('fontFamily', e.target.value)}
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </Select>
        </Box>
      </VStack>
    </Box>
  );
};

export default ThemeSidebar;