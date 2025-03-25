import { Box, HStack, IconButton, Select, Input, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaImage } from 'react-icons/fa';

/**
 * ToolbarPanel Component
 * 
 * A toolbar component providing text formatting and image upload controls.
 * Features:
 * - Text formatting buttons (bold, italic, underline)
 * - Text alignment controls
 * - Font size selection
 * - Image upload functionality
 * 
 * @param {string} selectedElement - Currently selected slide element
 * @param {Function} onContentChange - Callback for content updates
 * @param {Function} onThemeChange - Callback for theme updates
 */
const ToolbarPanel = ({ selectedElement, onContentChange, onThemeChange }) => {
  // State management for font size and color mode
  const [fontSize, setFontSize] = useState('16');
  const { colorMode } = useColorMode();

  /**
   * Updates font size for the selected element
   * @param {string} value - The new font size value
   */
  const handleFontSizeChange = (value) => {
    setFontSize(value);
    if (selectedElement) {upload-image
      onThemeChange({
        [`${selectedElement}FontSize`]: `${value}px`
      });
    }
  };

  /**
   * Triggers the hidden file input for image upload
   */
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