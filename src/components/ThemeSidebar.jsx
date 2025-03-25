import { Box, VStack, Text, Input, Select, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';

const ThemeSidebar = ({ theme, onThemeChange }) => {
  const { colorMode } = useColorMode();
  const [selectedColor, setSelectedColor] = useState(theme.backgroundColor);

  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Roboto',
    'Open Sans'
  ];

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