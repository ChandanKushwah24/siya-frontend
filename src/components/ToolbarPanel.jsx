import { Box, HStack, IconButton, Select, Input, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaImage } from 'react-icons/fa';

const ToolbarPanel = ({ selectedElement, onContentChange, onThemeChange }) => {
  const [fontSize, setFontSize] = useState('16');
  const { colorMode } = useColorMode();

  const handleFontSizeChange = (value) => {
    setFontSize(value);
    if (selectedElement) {
      onThemeChange({
        [`${selectedElement}FontSize`]: `${value}px`
      });
    }
  };

  const handleImageUpload = () => {
    document.getElementById('image-upload').click();
  };

  return (
    <Box
      bg={colorMode === 'dark' ? 'gray.700' : 'white'}
      p={2}
      borderRadius="md"
      mb={4}
      boxShadow="sm"
    >
      <HStack spacing={2}>
        <IconButton
          icon={<FaBold />}
          aria-label="Bold"
          size="sm"
          variant="ghost"
        />
        <IconButton
          icon={<FaItalic />}
          aria-label="Italic"
          size="sm"
          variant="ghost"
        />
        <IconButton
          icon={<FaUnderline />}
          aria-label="Underline"
          size="sm"
          variant="ghost"
        />
        <IconButton
          icon={<FaAlignLeft />}
          aria-label="Align Left"
          size="sm"
          variant="ghost"
        />
        <IconButton
          icon={<FaAlignCenter />}
          aria-label="Align Center"
          size="sm"
          variant="ghost"
        />
        <IconButton
          icon={<FaAlignRight />}
          aria-label="Align Right"
          size="sm"
          variant="ghost"
        />
        <Select
          size="sm"
          w="100px"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
        >
          {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </Select>
        <IconButton
          icon={<FaImage />}
          aria-label="Upload Image"
          size="sm"
          variant="ghost"
          onClick={handleImageUpload}
        />
      </HStack>
    </Box>
  );
};

export default ToolbarPanel;